// ====== TOUT CE QUI SE MODIFIE EST ICI ======
// Laissez une valeur vide ('') : l'élément correspondant n'est pas affiché.
export const profile = {
  name: 'MOHAMED TAHA KADIRI',
  title: 'Engineering Student | Industrial IoT, AI & Automation',
  intro:
    "Élève ingénieur en Management des Systèmes Électriques Intelligents à l'ENSAM Casablanca. Je m'intéresse aux systèmes industriels connectés : capteurs, communication, supervision et intelligence artificielle appliquée à l'industrie.",
  email: 'kadkadiri01@gmail.com',     // ex : 'prenom.nom@email.com'
  github: 'https://github.com/Mtkadiri',    // ex : 'https://github.com/pseudo'
  linkedin: 'https://www.linkedin.com/in/mohamed-taha-kadiri-2434003b1/',  // ex : 'https://www.linkedin.com/in/pseudo'
  cv: 'cv.pdf',  // placez votre fichier dans public/cv.pdf
  about: [
    "Ma formation à l'ENSAM Casablanca (MSEI) me place à la jonction de l'électrique, de l'informatique et de l'automatisme. Ce qui m'intéresse : comprendre comment une mesure physique devient une donnée exploitable, puis une décision.",
    "Mes projets portent sur la communication industrielle (MQTT, LoRaWAN), les systèmes embarqués (ESP32), les systèmes distribués et l'apprentissage par renforcement. J'aborde chaque sujet comme un problème d'ingénierie : définir le besoin, concevoir l'architecture, tester, puis documenter ce qui fonctionne et ce qui reste à faire.",
  ],
  languages: ['Arabe', 'Français', 'Anglais'],
}

export const categories = ['IA', 'IoT', 'Embarqué', 'Automatisation', 'Logiciel']

// Pour ajouter un projet : copiez un objet ci-dessous. L'URL sera #/projet/<id>.
// status des fonctionnalités : 'ok' (implémenté) | 'wip' (en cours) | 'todo' (à développer) | '?' (à confirmer)
export const projects = [
  {
    "id": "orchestration-llm",
    "title": "Orchestration intelligente et distribuée de modèles LLM",
    "category": "IA",
    "tag": "PFA — ENSAM Casablanca / CCPS",
    "summary": "Orchestrateur de requêtes LLM combinant MQTT, Ollama et un ordonnanceur à apprentissage par renforcement (PPO), avec repli heuristique.",
    "problem": "Répartir des requêtes de complexités variables entre des workers aux ressources limitées, sans choisir systématiquement la même machine et en tenant compte des indicateurs de charge.",
    "objectives": [
      "Définir un environnement Gymnasium et une fonction de récompense pour l'ordonnancement.",
      "Analyser complexité et urgence des requêtes ; construire les observations des workers.",
      "Distribuer les tâches par MQTT et superviser les réponses et métriques.",
      "Exploiter une politique PPO lorsqu'un modèle entraîné est disponible, sinon une sélection heuristique."
    ],
    "flow": [
      "Requête utilisateur",
      "Analyse de complexité",
      "Scheduler PPO / heuristique",
      "Broker MQTT",
      "Workers pi3 / pi5 + Ollama",
      "Réponse"
    ],
    "stack": [
      "Python",
      "Gymnasium",
      "Stable-Baselines3 (PPO)",
      "MQTT / Mosquitto",
      "Ollama",
      "FastAPI",
      "Systèmes distribués"
    ],
    "state": "Les scripts MQTT fournis ciblent deux workers (pi3 et pi5). Un autre fichier, gateway.py, définit une passerelle HTTP avec trois profils de workers (pi3, pi4 et pi5). Le fichier de poids PPO est référencé dans le code, mais n'a pas été retrouvé parmi les fichiers publiés.",
    "contribution": "Développement des composants d'orchestration, du worker MQTT, de l'environnement RL et de la passerelle HTTP dans le cadre du projet PFA.",
    "features": [
      {
        "label": "Environnement Gymnasium et récompense multi-critères",
        "status": "ok"
      },
      {
        "label": "Ordonnancement MQTT à deux workers et communication avec Ollama",
        "status": "ok"
      },
      {
        "label": "Chargement PPO avec repli heuristique si modèle absent",
        "status": "ok"
      },
      {
        "label": "Gateway FastAPI / WebSocket à profils multiples",
        "status": "ok"
      },
      {
        "label": "Poids entraînés PPO disponibles dans le dépôt",
        "status": "todo"
      }
    ],
    "results": [],
    "links": {
      "github": "https://github.com/Mtkadiri/portfolio/tree/main/public/code/orchestration-llm",
      "demo": ""
    },
    "images": [
      "./img/architecture-pfa.svg"
    ],
    "sources": [
      {
        "label": "scheduler_mqtt.py",
        "path": "code/orchestration-llm/scheduler_mqtt.py",
        "desc": "Ordonnanceur MQTT et chargement PPO"
      },
      {
        "label": "worker_mqtt.py",
        "path": "code/orchestration-llm/worker_mqtt.py",
        "desc": "Workers et requêtes Ollama"
      },
      {
        "label": "rl_environment.py",
        "path": "code/orchestration-llm/rl_environment.py",
        "desc": "Environnement d'apprentissage Gymnasium"
      },
      {
        "label": "gateway.py",
        "path": "code/orchestration-llm/gateway.py",
        "desc": "API et supervision FastAPI"
      }
    ]
  },
  {
    "wiring": [
      ["Rouge","VCC","3.3 V"],
      ["Noir","GND","GND"],
      ["Jaune","SCK","GPIO 18"],
      ["Vert","MISO","GPIO 19"],
      ["Bleu","MOSI","GPIO 23"],
      ["Orange","NSS / CS","GPIO 5"],
      ["Violet","RST","GPIO 14"],
      ["Blanc","DIO0","GPIO 26"]
    ],
    "id": "controle-routier-iot",
    "title": "Système intelligent de contrôle routier IoT",
    "category": "IoT",
    "tag": "Prototype embarqué",
    "summary": "Détection de vitesse par capteur ultrason, déclenchement d'une capture pour OCR de plaque et transmission LoRa vers un récepteur qui publie les données en MQTT.",
    "problem": "Relier la détection d'un véhicule à une acquisition visuelle et à une transmission de données de contrôle vers un système de supervision.",
    "objectives": [
      "Mesurer des distances successives à l'aide d'un capteur ultrason et estimer une vitesse.",
      "Déclencher un serveur Flask pour récupérer une image et solliciter un service OCR.",
      "Envoyer plaque et vitesse via radio LoRa entre deux cartes ESP32.",
      "Publier les messages décodés dans un topic MQTT pour leur exploitation ultérieure."
    ],
    "flow": [
      "Capteur ultrason / ESP32 émetteur",
      "Détection de vitesse",
      "Serveur Flask + caméra",
      "OCR de la plaque",
      "Liaison LoRa SX1278",
      "ESP32 récepteur",
      "Broker MQTT"
    ],
    "stack": [
      "ESP32",
      "C++ / Arduino",
      "Ultrason",
      "LoRa SX1278",
      "Wi-Fi / HTTP",
      "Flask",
      "OCR",
      "MQTT"
    ],
    "state": "Le seuil du prototype est fixé à 5 km/h dans le code fourni (valeur d'essai, pas une limite routière). L'émetteur s'arrête après la première détection. Le fichier serveur_original.txt a été fourni sous forme de texte dont la syntaxe Python est incomplète ; il est publié comme archive documentaire, pas comme serveur exécutable.",
    "contribution": "Programmation de l'émetteur et du récepteur, intégration HTTP/LoRa/MQTT et construction de la chaîne de déclenchement OCR.",
    "features": [
      {
        "label": "Acquisition ultrason et estimation de vitesse",
        "status": "ok"
      },
      {
        "label": "Déclenchement HTTP / OCR",
        "status": "ok"
      },
      {
        "label": "Transmission LoRa des données de contrôle",
        "status": "ok"
      },
      {
        "label": "Réception LoRa et publication MQTT (vehicle/data)",
        "status": "ok"
      },
      {
        "label": "Validation métrologique en conditions réelles",
        "status": "?"
      }
    ],
    "results": [],
    "links": {
      "github": "https://github.com/Mtkadiri/portfolio/tree/main/public/code/controle-routier-iot",
      "demo": ""
    },
    "images": [
      "./img/architecture-routier.svg"
    ],
    "sources": [
      {
        "label": "emetteur_COM3.cpp",
        "path": "code/controle-routier-iot/emetteur_COM3.cpp",
        "desc": "ESP32 émetteur, vitesse, HTTP, LoRa"
      },
      {
        "label": "recepteur_COM4.cpp",
        "path": "code/controle-routier-iot/recepteur_COM4.cpp",
        "desc": "ESP32 récepteur LoRa vers MQTT"
      },
      {
        "label": "serveur_original.txt",
        "path": "code/controle-routier-iot/serveur_original.txt",
        "desc": "Texte source du serveur Flask et du relais OCR (syntaxe incomplète)"
      }
    ]
  },
  {
    "id": "capteurs-lorawan",
    "title": "Système IoT basé sur ESP32 et LoRa (RF96)",
    "category": "Embarqué",
    "tag": "Projet métier — LoRaWAN",
    "summary": "Prototype ESP32 + module radio RF96/SX127x : acquisition DHT11, transmission LoRaWAN et variante connectée à un serveur de prédiction d'état d'équipement.",
    "problem": "Collecter des mesures et remonter des informations de terrain par radio longue portée, en associant une passerelle et une plateforme de supervision.",
    "objectives": [
      "Configurer le bus SPI, les interruptions et le module RF96 avec LMIC.",
      "Lire température/humidité avec le capteur DHT11 et émettre des trames LoRaWAN.",
      "Exploiter la passerelle et la chaîne ChirpStack / Node-RED documentées par les essais.",
      "Expérimenter une variante ESP32 envoyant des séquences au serveur de prédiction et retransmettant un état/RUL via LoRaWAN."
    ],
    "flow": [
      "DHT11 / entrées d'essai",
      "ESP32 + RF96 (LMIC)",
      "LoRaWAN",
      "Passerelle / ChirpStack",
      "Supervision Node-RED"
    ],
    "stack": [
      "ESP32",
      "Arduino C++",
      "RF96 / SX127x",
      "LoRaWAN / LMIC",
      "SPI",
      "DHT11",
      "Raspberry Pi",
      "ChirpStack",
      "Node-RED",
      "FreeRTOS"
    ],
    "state": "Deux versions de code ont été fournies : un émetteur DHT11/LoRaWAN et une version avancée avec requête HTTP /predict, file FreeRTOS et envoi d'un état et d'une estimation RUL. Dans cette dernière version, certaines entrées (vibration, RPM et durée) sont simulées ; le modèle du serveur n'est pas inclus. Les identifiants LoRaWAN et Wi-Fi ont été neutralisés avant publication.",
    "contribution": "Câblage et configuration ESP32/RF96, programmation LMIC, gestion des mesures, expérimentation de la communication radio et de l'intégration serveur.",
    "features": [
      {
        "label": "Acquisition DHT11 et émission LoRaWAN",
        "status": "ok"
      },
      {
        "label": "Configuration SPI et LMIC / activation ABP",
        "status": "ok"
      },
      {
        "label": "Variante HTTP de prédiction avec file FreeRTOS",
        "status": "ok"
      },
      {
        "label": "Essais de passerelle, serveur et tableau de bord",
        "status": "ok"
      },
      {
        "label": "Modèle de prédiction côté serveur disponible",
        "status": "todo"
      }
    ],
    "results": [],
    "links": {
      "github": "https://github.com/Mtkadiri/portfolio/tree/main/public/code/capteurs-lorawan",
      "demo": ""
    },
    "images": [
      "./img/architecture-lorawan.svg"
    ],
    "sources": [
      {
        "label": "lora_end_divice_final.ino",
        "path": "code/capteurs-lorawan/lora_end_divice_final.ino",
        "desc": "Variante LoRaWAN + HTTP /predict + FreeRTOS"
      },
      {
        "label": "ESP32_RF96_version_initiale.txt",
        "path": "code/capteurs-lorawan/ESP32_RF96_version_initiale.txt",
        "desc": "Version DHT11 et transmission LoRaWAN"
      },
      {
        "label": "lmic_config.h",
        "path": "code/capteurs-lorawan/lmic_config.h",
        "desc": "Configuration LMIC initiale"
      }
    ]
  }
]


// level (optionnel) : 1 notions, 2 pratique, 3 solide. Sans level : pas d'indicateur.
export const skills = [
  { cat: 'Programmation', items: [{ n: 'Python' }, { n: 'C' }, { n: 'JavaScript' }, { n: 'HTML / CSS' }] },
  { cat: 'IA et apprentissage automatique', items: [{ n: 'Apprentissage par renforcement' }, { n: 'Modèles de langage (LLM)' }] },
  { cat: 'IoT et systèmes embarqués', items: [{ n: 'ESP32' }, { n: 'LoRa / LoRaWAN' }, { n: 'Capteurs (DHT11)' }] },
  { cat: 'Communication industrielle et protocoles', items: [{ n: 'MQTT' }, { n: 'ChirpStack' }] },
  { cat: 'Automatisation et supervision', items: [{ n: 'TIA Portal' }, { n: 'Node-RED' }] },
  { cat: 'Outils de développement', items: [{ n: 'Firebase' }, { n: 'Git / GitHub' }] },
]

export const timeline = [
  { kind: 'Formation', title: "Cycle ingénieur MSEI — ENSAM Casablanca", period: '', text: 'Management des Systèmes Électriques Intelligents.' },
]
