# Système intelligent de contrôle routier IoT

## Architecture
Capteur ultrason → ESP32 émetteur → déclenchement HTTP → serveur Flask / capture caméra / OCR → émission LoRa → ESP32 récepteur → publication MQTT `vehicle/data`.

## Fichiers
- `emetteur_COM3.cpp` — acquisition ultrason, calcul de vitesse et transmission LoRa après un appel HTTP.
- `recepteur_COM4.cpp` — réception radio et conversion du message en JSON MQTT (extension .ccp fournie, renommée .cpp).
- `serveur_original.txt` — transcription du serveur Flask fournie ; **syntaxe Python incomplète** dans le document d'origine, à corriger avant exécution.

## Connexion ESP32 ↔ SX1278
| Couleur | LoRa | ESP32 |
|---|---|---|
| Rouge | VCC | 3,3 V |
| Noir | GND | GND |
| Jaune | SCK | GPIO 18 |
| Vert | MISO | GPIO 19 |
| Bleu | MOSI | GPIO 23 |
| Orange | NSS/CS | GPIO 5 |
| Violet | RST | GPIO 14 |
| Blanc | DIO0 | GPIO 26 |

**Limites :** le seuil de 5 km/h est une valeur d'essai dans le programme, sans validation métrologique fournie ; après une détection, le code arrête sa boucle principale. Les adresses et le mot de passe Wi-Fi ont été remplacés par des paramètres génériques avant publication.
