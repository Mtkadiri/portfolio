#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "esp_task_wdt.h"

struct PredResult {
    uint8_t  state_id;
    uint16_t rul;
    float    confidence;
    bool     valid;
};

// ═══════════════════════════════════════════════════════
// PINS
// ═══════════════════════════════════════════════════════
#define DHTPIN   27
#define DHTTYPE  DHT11
DHT dht(DHTPIN, DHTTYPE);

#define SCK_PIN   18
#define MISO_PIN  19
#define MOSI_PIN  23
#define NSS_PIN    5
#define RST_PIN   14
#define DIO0_PIN   2
#define DIO1_PIN   4

// ── LMIC pin map ───────────────────────────────────────
const lmic_pinmap lmic_pins = {
    .nss  = NSS_PIN,
    .rxtx = LMIC_UNUSED_PIN,
    .rst  = RST_PIN,
    .dio  = {DIO0_PIN, DIO1_PIN, LMIC_UNUSED_PIN}
};

// ── WiFi / Serveur ─────────────────────────────────────
const char* ssid       = "YOUR_WIFI_SSID";
const char* password   = "YOUR_WIFI_PASSWORD";
const char* serverName = "http://YOUR_LOCAL_SERVER:5000/predict";

// ── ABP keys ───────────────────────────────────────────
static const u4_t DEVADDR = 0x00000000; // À personnaliser

static const u1_t NWKSKEY[16] = {0}; // Remplacer par votre clé personnelle (16 octets)

static const u1_t APPSKEY[16] = {0}; // Remplacer par votre clé personnelle (16 octets)

void os_getArtEui(u1_t* buf) {}
void os_getDevEui(u1_t* buf) {}
void os_getDevKey(u1_t* buf) {}

// ═══════════════════════════════════════════════════════
// DONNÉES
// ═══════════════════════════════════════════════════════
#define SEQ_LEN 10
#define N_FEAT   5

QueueHandle_t    predQueue;
// 🔑 CE MUTEX EST LA CLÉ : protège SPI pendant TX LoRa
extern SemaphoreHandle_t spiMutex;

float manualVib     = 1.0f;
float manualRPM     = 1350.0f;
float manualRuntime = 500.0f;
float sequence[SEQ_LEN][N_FEAT];

// ═══════════════════════════════════════════════════════
// LMIC
// ═══════════════════════════════════════════════════════
static osjob_t sendjob;

void do_send(osjob_t* j) {
    if (LMIC.opmode & OP_TXRXPEND) {
        Serial.println("[LMIC] TXRXPEND, retry 5s");
        os_setTimedCallback(&sendjob,
            os_getTime() + sec2osticks(5), do_send);
        return;
    }

    PredResult pred;
    if (xQueueReceive(predQueue, &pred, 0) == pdTRUE) {
        uint8_t buf[3];
        if (pred.valid) {
            buf[0] = pred.state_id;
            buf[1] = (pred.rul >> 8) & 0xFF;
            buf[2] =  pred.rul       & 0xFF;
        } else {
            buf[0] = 0xFF; buf[1] = 0x00; buf[2] = 0x00;
        }

        Serial.printf("[LMIC] TX: %02X %02X %02X\n",
            buf[0], buf[1], buf[2]);

        Serial.printf("[DEBUG] seqnoUp=%d DEVADDR=%08X\n", 
              LMIC.seqnoUp, LMIC.devaddr);
        // Journalisation des clés désactivée par sécurité.

        LMIC_setTxData2(4, buf, 3, 0);

    } else {
        os_setTimedCallback(&sendjob,
            os_getTime() + sec2osticks(1), do_send);
    }
}

void onEvent(ev_t ev) {
    switch (ev) {
        case EV_TXCOMPLETE:
            Serial.println("[LMIC] ✓ TX complet");
            if (LMIC.txrxFlags & TXRX_ACK)
                Serial.println("[LMIC] ACK reçu");
            os_setTimedCallback(&sendjob,
                os_getTime() + sec2osticks(30), do_send);
            break;

        #ifdef EV_TXSTART
            case EV_TXSTART:
                Serial.println("[LMIC] TX start");
                break;
        #endif

        default:
            Serial.printf("[LMIC] Event %u\n", (unsigned)ev);
            break;
    }
}

// ═══════════════════════════════════════════════════════
// TÂCHE HTTP — Core 1
// ═══════════════════════════════════════════════════════
String buildJSON() {
    String json = "{\"sequence\":[";
    for (int i = 0; i < SEQ_LEN; i++) {
        json += "[";
        for (int j = 0; j < N_FEAT; j++) {
            json += String(sequence[i][j], 4);
            if (j < N_FEAT-1) json += ",";
        }
        json += "]";
        if (i < SEQ_LEN-1) json += ",";
    }
    return json + "]}";
}

bool generateData() {
    float h = dht.readHumidity();
    if (isnan(h)) { Serial.println("[HTTP] DHT11 erreur"); return false; }

    for (int i = 0; i < SEQ_LEN-1; i++)
        for (int j = 0; j < N_FEAT; j++)
            sequence[i][j] = sequence[i+1][j];

    sequence[SEQ_LEN-1][0] = 50.0f;
    sequence[SEQ_LEN-1][1] = h;
    sequence[SEQ_LEN-1][2] = manualVib;
    sequence[SEQ_LEN-1][3] = manualRPM;
    sequence[SEQ_LEN-1][4] = manualRuntime;

    Serial.printf("[HTTP] T=50.0 H=%.1f Vib=%.2f RPM=%.1f Run=%.1f\n",
        h, manualVib, manualRPM, manualRuntime);
    return true;
}

PredResult callPiPredict() {
    PredResult empty = {0xFF, 0, 0.0f, false};
    if (WiFi.status() != WL_CONNECTED) return empty;

    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(8000);

    int code = http.POST(buildJSON());
    if (code == 200) {
        StaticJsonDocument<256> doc;
        if (!deserializeJson(doc, http.getString())) {
            PredResult r;
            r.state_id   = (uint8_t)(int)doc["state_id"];
            r.rul        = (uint16_t)(int)doc["rul"];
            r.confidence = doc["confidence"];
            r.valid      = true;
            Serial.printf("[HTTP] → state=%d RUL=%d conf=%.3f\n",
                r.state_id, r.rul, r.confidence);
            http.end();
            return r;
        }
    }
    Serial.printf("[HTTP] Erreur: %d\n", code);
    http.end();
    return empty;
}

void taskHTTP(void* pvParameters) {
    Serial.println("[HTTP] Démarré sur core 1");

    // Warmup
    for (int i = 0; i < SEQ_LEN; i++) {
        generateData();
        vTaskDelay(pdMS_TO_TICKS(500));
    }
    Serial.println("[HTTP] Séquence prête ✓");

    while (true) {
        if (generateData()) {
            PredResult pred = callPiPredict();
            xQueueOverwrite(predQueue, &pred);
            Serial.println("[HTTP] En queue ✓");
        }
        vTaskDelay(pdMS_TO_TICKS(25000));
    }
}

// ═══════════════════════════════════════════════════════
// OVERRIDE HAL LMIC — Protection SPI
// ─────────────────────────────────────────────────────
// Ces fonctions sont appelées par LMIC avant/après
// chaque accès SPI au SX1276.
// On prend le mutex → WiFi ne peut pas interférer.
// ═══════════════════════════════════════════════════════
extern "C" {

// hal_disableIRQs et hal_enableIRQs encadrent CHAQUE
// accès SPI dans LMIC. On les override pour prendre
// notre mutex SPI à la place.
void hal_disableIRQs(void) {
    if (spiMutex) xSemaphoreTake(spiMutex, portMAX_DELAY);
}

void hal_enableIRQs(void) {
    if (spiMutex) xSemaphoreGive(spiMutex);
}

// hal_sleep est appelé quand LMIC n'a rien à faire
// On yield ici pour nourrir le watchdog
void hal_sleep(void) {
    vTaskDelay(1);
}

} // extern "C"

// ═══════════════════════════════════════════════════════
// SETUP + LOOP
// ═══════════════════════════════════════════════════════
void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("=== ESP32 LoRa + WiFi + ML (SPI protected) ===");

    // ── Watchdog : 30s timeout, pas de reboot automatique ─
    esp_task_wdt_config_t wdt_config = {
        .timeout_ms = 30000,
        .idle_core_mask = 0,
        .trigger_panic = false
    };

    esp_task_wdt_init(&wdt_config);
    esp_task_wdt_add(NULL);

    dht.begin();
    delay(2000);

    // ── Créer le mutex SPI AVANT tout ─────────────────────
    // ⚠️ DOIT être créé avant os_init() et WiFi.begin()
    spiMutex = xSemaphoreCreateMutex();
    if (!spiMutex) {
        Serial.println("ERREUR: Mutex SPI non créé !");
        ESP.restart();
    }
    Serial.println("[SPI] Mutex créé ✓");

    // ── WiFi ───────────────────────────────────────────────
    WiFi.begin(ssid, password);
    Serial.print("[WiFi] Connexion");
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 30) {
        delay(500); Serial.print("."); attempts++;
    }
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println(" OK — " + WiFi.localIP().toString());
    } else {
        Serial.println(" ÉCHEC, redémarrage...");
        ESP.restart();
    }

    // ── Queue ──────────────────────────────────────────────
    predQueue = xQueueCreate(1, sizeof(PredResult));
    if (!predQueue) { ESP.restart(); }

    // ── Init SPI + LMIC ────────────────────────────────────
    SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, NSS_PIN);
    SPI.setFrequency(1000000); // 1MHz — plus stable avec WiFi actif

    pinMode(RST_PIN, OUTPUT);
    digitalWrite(RST_PIN, LOW);  delay(10);
    digitalWrite(RST_PIN, HIGH); delay(10);

    os_init();
    LMIC_reset();
    LMIC_setSession(0x1, DEVADDR, (u1_t*)NWKSKEY, (u1_t*)APPSKEY);

    LMIC.seqnoUp = 0;
    LMIC.seqnoDn = 0;

    LMIC_setLinkCheckMode(0);
    LMIC_setAdrMode(0);

    LMIC_setupChannel(0, 867100000,
        DR_RANGE_MAP(DR_SF12, DR_SF7), BAND_CENTI);
    LMIC_setupChannel(1, 867300000,
        DR_RANGE_MAP(DR_SF12, DR_SF7), BAND_CENTI);
    LMIC_setupChannel(2, 867500000,
        DR_RANGE_MAP(DR_SF12, DR_SF7), BAND_CENTI);
    for (int i = 1; i <= 8; i++) LMIC_disableChannel(i);

    LMIC.dn2Dr = DR_SF9;
    LMIC_setDrTxpow(DR_SF7, 14);

    Serial.printf("[LMIC] DevAddr: 0x%08X\n", DEVADDR);
    do_send(&sendjob);

    // ── Tâche HTTP sur Core 1 ──────────────────────────────
    xTaskCreatePinnedToCore(
        taskHTTP, "HTTP", 8192, NULL, 1, NULL, 1
    );

    Serial.println("[Setup] ✓");
}

void loop() {
    // Nourrir le watchdog
    esp_task_wdt_reset();
    // LMIC tourne ici, protégé par le mutex dans hal_disableIRQs
    os_runloop_once();
    // Yield minimal — ne PAS mettre delay() ici
    vTaskDelay(1);
}