// lmic_config.h
#ifndef _LMIC_CONFIG_H_
#define _LMIC_CONFIG_H_

// Forcer la configuration manuelle des broches
#define LMIC_USE_INTERRUPTS
#define LMIC_PRINTF_TO Serial

// Configuration pour ESP32 avec RF96
static const lmic_pinmap lmic_pins = {
    .nss = 5,      // CS (NSS) - GPIO5
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 14,     // RESET - GPIO14
    .dio = {2, LMIC_UNUSED_PIN, LMIC_UNUSED_PIN},  // DIO0 - GPIO2
};

#endif