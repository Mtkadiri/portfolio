# Projet métier — ESP32 et LoRa RF96

## Deux versions de code
- `ESP32_RF96_version_initiale.txt` — acquisition de température et d'humidité par DHT11 et émission LoRaWAN via LMIC.
- `lora_end_divice_final.ino` — variante avec client Wi-Fi, requête HTTP `/predict`, file FreeRTOS et émission d'un état prédictif / RUL sur LoRaWAN.
- `lmic_config.h` — configuration initiale des broches du transceiver (attention : la version plus récente définit également un `lmic_pinmap` ; ne pas compiler les deux définitions ensemble sans adaptation).

## Liaisons utilisées
ESP32 : SPI SCK=18, MISO=19, MOSI=23, NSS=5, RST=14, DIO0=2. La version avancée utilise aussi DIO1=4 ; DHT11 sur GPIO27.

Le montage a été documenté avec Raspberry Pi, passerelle LoRaWAN, ChirpStack et supervision Node-RED.

## Publication
Les mots de passe et clés de session ABP ont été remplacés par des paramètres factices. Le montage ne fonctionnera pas sans des identifiants LoRaWAN légitimes à provisionner côté application.

Dans la variante avancée, les mesures vibration, RPM, temps de fonctionnement (et une valeur de température) sont simulées/fixées dans le programme fourni. Le code du serveur de prédiction n'est pas inclus ici. Aucune mesure de performance n'est prétendue.
