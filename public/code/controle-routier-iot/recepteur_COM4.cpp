#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
#include <PubSubClient.h>

// ---------------- LoRa ----------------
#define SS    5
#define RST   14
#define DIO0  26

// ---------------- WiFi ----------------
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// ---------------- MQTT ----------------
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";
const int mqtt_port = 1883;
const char* mqtt_topic = "vehicle/data";

WiFiClient espClient;
PubSubClient client(espClient);

// ---------------- WiFi ----------------
void connectWiFi() {
  Serial.print("[WiFi] Connexion au réseau ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n[WiFi] Connecté");
  Serial.print("[WiFi] IP ESP32 : ");
  Serial.println(WiFi.localIP());
}

// ---------------- MQTT ----------------
void connectMQTT() {
  Serial.print("[MQTT] Connexion au broker ");
  Serial.println(mqtt_server);

  while (!client.connected()) {
    if (client.connect("ESP32_LoRa_RX")) {
      Serial.println("[MQTT] Connecté");
    } else {
      Serial.print("[MQTT] Echec, rc=");
      Serial.print(client.state());
      Serial.println(" -> nouvelle tentative");
      delay(2000);
    }
  }
}

// ---------------- SETUP ----------------
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n=== DEMARRAGE ESP32 ===");

  connectWiFi();

  client.setServer(mqtt_server, mqtt_port);

  Serial.println("[LoRa] Initialisation...");
  LoRa.setPins(SS, RST, DIO0);

  if (!LoRa.begin(433E6)) {
    Serial.println("[LoRa] ERREUR initialisation");
    while (true);
  }

  Serial.println("[LoRa] RX prêt");
  Serial.println("=== SYSTEME PRET ===");
}

// ---------------- LOOP ----------------
void loop() {

  // Vérifier MQTT
  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();

  // Vérifier LoRa
  int packetSize = LoRa.parsePacket();
  if (packetSize) {

    String message = "";
    while (LoRa.available()) {
      message += (char)LoRa.read();
    }

    Serial.print("[LoRa] Message reçu : ");
    Serial.println(message);

    // Format attendu :
    // PLATE=10045-A-1,SPEED=3.12

    // ----- Extraction plaque -----
    int plateStart = message.indexOf("PLATE=");
    int commaPos   = message.indexOf(",");
    if (plateStart == -1 || commaPos == -1) {
      Serial.println("[ERREUR] Format plaque invalide");
      return;
    }

    String plate = message.substring(plateStart + 6, commaPos);

    // ----- Extraction vitesse -----
    int speedStart = message.indexOf("SPEED=");
    if (speedStart == -1) {
      Serial.println("[ERREUR] Vitesse non trouvée");
      return;
    }

    float speed = message.substring(speedStart + 6).toFloat();

    // ----- Construction JSON MQTT -----
    String payload = "{";
    payload += "\"speed\":" + String(speed, 2) + ",";
    payload += "\"ocr\":{\"plate\":\"" + plate + "\"}";
    payload += "}";

    // ----- Envoi MQTT -----
    if (client.publish("vehicle/data", payload.c_str())) {
      Serial.print("[MQTT] Envoyé : ");
      Serial.println(payload);
    } else {
      Serial.println("[MQTT] ERREUR envoi");
    }
  }
}