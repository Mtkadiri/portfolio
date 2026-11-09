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
    "tag": "Stage PFA — CCPS / ENSAM Casablanca (2026)",
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
    "state": "Projet réalisé au laboratoire CCPS. Le code source et les résultats détaillés sont réservés au laboratoire et aux collaborateurs autorisés.",
    "contribution": "Développement des composants d'orchestration, du worker MQTT, de l'environnement RL et de la passerelle HTTP dans le cadre du projet PFA.",
    "features": [],
    "results": [],
    "links": {
      "github": "",
      "demo": ""
    },
    "images": [],
    "sources": []
  },
  {
    "wiring": [
      [
        "Rouge",
        "VCC",
        "3.3 V"
      ],
      [
        "Noir",
        "GND",
        "GND"
      ],
      [
        "Jaune",
        "SCK",
        "GPIO 18"
      ],
      [
        "Vert",
        "MISO",
        "GPIO 19"
      ],
      [
        "Bleu",
        "MOSI",
        "GPIO 23"
      ],
      [
        "Orange",
        "NSS / CS",
        "GPIO 5"
      ],
      [
        "Violet",
        "RST",
        "GPIO 14"
      ],
      [
        "Blanc",
        "DIO0",
        "GPIO 26"
      ]
    ],
    "id": "controle-routier-iot",
    "title": "Système intelligent de contrôle routier IoT",
    "category": "IoT",
    "tag": "Projet académique — oct.–déc. 2025",
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
    "tag": "Projet métier — mars–mai 2026",
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
  {
    "cat": "Langages de programmation",
    "items": [
      {
        "n": "C"
      },
      {
        "n": "Python"
      },
      {
        "n": "Assembleur"
      },
      {
        "n": "VHDL"
      }
    ]
  },
  {
    "cat": "Développement web",
    "items": [
      {
        "n": "HTML"
      },
      {
        "n": "CSS"
      },
      {
        "n": "JavaScript"
      }
    ]
  },
  {
    "cat": "Systèmes embarqués & IoT",
    "items": [
      {
        "n": "ESP32"
      },
      {
        "n": "LoRa (RF96)"
      },
      {
        "n": "MQTT"
      },
      {
        "n": "ChirpStack"
      }
    ]
  },
  {
    "cat": "CAO",
    "items": [
      {
        "n": "CATIA V5 (bases 2D/3D, Part Design, Drafting)"
      },
      {
        "n": "AutoCAD (bases)"
      }
    ]
  },
  {
    "cat": "Automatisation industrielle",
    "items": [
      {
        "n": "TIA Portal"
      }
    ]
  },
  {
    "cat": "Outils & Technologies immersives",
    "items": [
      {
        "n": "Word"
      },
      {
        "n": "Excel"
      },
      {
        "n": "Unity"
      },
      {
        "n": "XR Toolkit"
      }
    ]
  },
  {
    "cat": "Modélisation & Simulation",
    "items": [
      {
        "n": "MATLAB"
      },
      {
        "n": "Simulink"
      }
    ]
  }
]

export const timeline = [
  {
    "kind": "Stage PFA",
    "title": "Laboratoire CCPS — ENSAM Casablanca",
    "period": "15/06/2026 – 30/09/2026",
    "text": "Conception d'un orchestrateur de modèles LLM avec MQTT, Python et apprentissage par renforcement (PPO) : environnement RL, ordonnanceur, workers et tolérance aux pannes."
  },
  {
    "kind": "Stage d'observation",
    "title": "OCP Group — Casablanca",
    "period": "07/2025 – 08/2025",
    "text": "Participation à une étude de déviation de ligne haute tension pour le projet de Jorf Lasfar : contraintes techniques, continuité du réseau, risques HSE et suivi des travaux."
  },
  {
    "kind": "Formation",
    "title": "Cycle ingénieur MSEI — ENSAM Casablanca, Université Hassan II",
    "period": "2024 – présent",
    "text": "Management des Systèmes Électriques Intelligents, option Systèmes Industriels Connectés (SIC). Automatisation, IoT industriel, systèmes embarqués et IA appliquée à l'industrie."
  },
  {
    "kind": "Formation",
    "title": "DEUG — Faculté des Sciences d'Oujda, Université Mohammed Premier",
    "period": "2021 – 2024",
    "text": "Sciences Mathématiques et Informatiques — mention Assez Bien."
  },
  {
    "kind": "Formation",
    "title": "Baccalauréat — Lycée Abdellah Ghennoun, Oujda",
    "period": "09/2020 – 06/2021",
    "text": "Sciences expérimentales, option Sciences Physiques — mention Bien."
  },
  {
    "kind": "Projet académique",
    "title": "Système IoT ESP32 et LoRa (RF96)",
    "period": "03/2026 – 05/2026",
    "text": "Acquisition de données DHT11, communication LoRaWAN, intégration ChirpStack et visualisation en temps réel."
  },
  {
    "kind": "Projet académique",
    "title": "Système intelligent de contrôle routier IoT",
    "period": "10/2025 – 12/2025",
    "text": "Détection des excès de vitesse et reconnaissance de plaques par OCR avec ESP32, LoRa, MQTT, Firebase et Node-RED."
  },
  {
    "kind": "Distinction sportive",
    "title": "Taekwondo — Ceinture noire, 1er dan",
    "period": "",
    "text": "Grade de ceinture noire, premier dan."
  }
]

export const certifications = [
  {
    "id": "cisco-python",
    "title": "Python Essentials 1",
    "issuer": "Cisco Networking Academy",
    "period": "04/10/2026",
    "verification": "Certificat fourni",
    "description": "Formation de programmation Python réussie dans le cadre du programme Cisco Networking Academy."
  },
  {
    "id": "snee",
    "title": "Statut National Étudiant Entrepreneur (SNEE)",
    "issuer": "Université Hassan II de Casablanca — Pôle Insertion & Entrepreneuriat",
    "period": "2025–2026 (délivré le 23/06/2026)",
    "verification": "Certificat fourni",
    "description": "Statut national d'étudiant entrepreneur, 7e promotion SNEE."
  },
  {
    "id": "matlab-onramp",
    "title": "MATLAB Onramp",
    "issuer": "MathWorks",
    "period": "2026",
    "verification": "Mentionné dans le CV",
    "description": "Formation d'initiation à MATLAB indiquée dans le CV."
  }
]
