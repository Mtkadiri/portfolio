#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <LoRa.h>

// ================= WIFI =================
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// ================= SERVEUR =================
const char* SERVER_URL = "http://YOUR_LOCAL_SERVER:5000/trigger";

// ================= LORA =================
#define LORA_SS   5
#define LORA_RST  14
#define LORA_DIO0 26

// ================= ULTRASON =================
#define TRIG_PIN 12
#define ECHO_PIN 13

// ================= PARAMÈTRES =================
const float SPEED_THRESHOLD = 5.0; // km/h
bool systemStopped = false;

// ================= VARIABLES =================
float d1 = 0, d2 = 0, d3 = 0;
unsigned long t1 = 0, t2 = 0, t3 = 0;

// =================================================
float measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long dur = pulseIn(ECHO_PIN, HIGH, 30000); // timeout 30 ms
  if (dur == 0) return 0.0;

  float d = dur * 0.0343 / 2.0; // cm
  if (d < 2 || d > 200) return 0.0;
  return d;
}

float calculateSpeed() {
  if (!t1 || !t2 || !t3) return 0.0;

  float v1 = abs(d3 - d2) / ((t3 - t2) / 1000.0);
  float v2 = abs(d2 - d1) / ((t2 - t1) / 1000.0);

  return ((v1 + v2) / 2.0) * 0.036; // km/h
}

// =================================================
void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // -------- Connexion WiFi --------
  Serial.print("Connexion WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi CONNECTÉ");

  // -------- Initialisation LoRa --------
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(433E6)) {
    Serial.println("❌ ERREUR LORA");
    while (true);
  }

  Serial.println("📡 LoRa prêt");
  Serial.println("SYSTÈME PRÊT");
}

// =================================================
void loop() {
  if (systemStopped) return;

  float d = measureDistance();
  unsigned long now = millis();

  d1 = d2;
  d2 = d3;
  d3 = d;

  t1 = t2;
  t2 = t3;
  t3 = now;

  float speed = calculateSpeed();

  Serial.print("Distance: ");
  Serial.print(d, 1);
  Serial.print(" cm | Vitesse: ");
  Serial.print(speed, 2);
  Serial.println(" km/h");

  if (speed >= SPEED_THRESHOLD) {
    Serial.println("\n🚨 VITESSE DÉTECTÉE → APPEL SERVEUR");

    HTTPClient http;
    http.begin(SERVER_URL);
    int code = http.GET();

    if (code == 200) {
      String plate = http.getString();
      plate.trim();

      Serial.println("===== MATRICULE OCR =====");
      Serial.println(plate);

      // ===== MESSAGE LORA FINAL (GARANTI) =====
      String loraMsg = "PLATE=" + plate + ",SPEED=" + String(speed, 2);

      LoRa.beginPacket();
      LoRa.print(loraMsg);
      LoRa.endPacket();

      Serial.println("📡 MESSAGE LORA ENVOYÉ :");
      Serial.println(loraMsg);
    } else {
      Serial.println("❌ ERREUR HTTP");
    }

    http.end();
    systemStopped = true; // stop après une détection
  }

  delay(150);
}