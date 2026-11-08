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
    id: 'orchestration-llm',
    title: "Orchestration distribuée de modèles de langage",
    category: 'IA',
    tag: 'Travail expérimental',
    summary: "Ordonnanceur intelligent qui répartit des tâches entre des travailleurs simulés, guidé par apprentissage par renforcement.",
    problem: "Répartir des requêtes vers plusieurs modèles de langage hétérogènes sans saturer les machines : la charge CPU/RAM, la température et la file d'attente varient, et toutes les tâches n'ont pas la même complexité.",
    objectives: [
      "Concevoir un ordonnanceur qui choisit le travailleur et le modèle adaptés à chaque tâche.",
      "Définir un environnement de renforcement avec une récompense combinant latence, qualité, équilibrage de charge et adéquation modèle/tâche.",
      "Faire communiquer les composants par messages MQTT.",
    ],
    flow: ['Tâches entrantes', 'Ordonnanceur (agent RL)', 'Broker MQTT', 'Travailleurs simulés', 'Retour : latence, qualité'],
    stack: ['Python', 'MQTT', 'LLM', 'Apprentissage par renforcement', 'Systèmes distribués'],
    state: "L'état observé par l'agent inclut CPU, RAM, température, longueur de file et complexité de la tâche.",
    contribution: 'À compléter : décrivez précisément ce que vous avez conçu et codé.',
    features: [
      { label: 'Environnement de renforcement et fonction de récompense', status: '?' },
      { label: 'Travailleurs simulés', status: '?' },
      { label: 'Communication MQTT', status: '?' },
    ],
    results: [], // Aucune mesure réelle fournie : n'ajoutez ici que des résultats mesurés.
    links: { github: '', demo: '' },
    images: [],
  },
  {
    id: 'controle-routier-iot',
    title: 'Système intelligent de contrôle routier IoT',
    category: 'IoT',
    tag: 'Prototype',
    summary: "Surveillance du trafic, détection d'excès de vitesse, lecture de plaques et supervision en temps réel.",
    problem: "Surveiller le trafic et repérer les excès de vitesse à distance, avec remontée des données vers un tableau de supervision.",
    objectives: [
      "Mesurer le trafic et la vitesse avec des nœuds embarqués.",
      "Transmettre les données par LoRa et MQTT.",
      "Lire les plaques d'immatriculation (OCR) et superviser en temps réel.",
    ],
    flow: ['Capteurs + ESP32', 'Liaison LoRa', 'Passerelle / MQTT', 'Firebase', 'Supervision Node-RED'],
    stack: ['ESP32', 'LoRa', 'MQTT', 'Firebase', 'Node-RED'],
    contribution: 'À compléter.',
    features: [
      { label: 'Surveillance du trafic', status: '?' },
      { label: "Détection d'excès de vitesse", status: '?' },
      { label: 'Reconnaissance de plaques (OCR)', status: '?' },
      { label: 'Supervision temps réel', status: '?' },
    ],
    results: [],
    links: { github: '', demo: '' },
    images: [],
  },
  {
    id: 'capteurs-lorawan',
    title: 'Surveillance de capteurs avec LoRaWAN',
    category: 'Embarqué',
    tag: 'Prototype',
    summary: "Collecte de mesures environnementales, transmission sans fil et visualisation dans ChirpStack.",
    problem: "Collecter température et humidité sur un nœud autonome, les transmettre sans fil sur longue portée et les visualiser.",
    objectives: [
      "Lire un capteur DHT11 avec un ESP32.",
      "Émettre les mesures via un module radio RFM96 en LoRaWAN.",
      "Recevoir et visualiser les données dans ChirpStack.",
    ],
    flow: ['DHT11', 'ESP32', 'Radio RFM96', 'Passerelle LoRaWAN', 'ChirpStack', 'Visualisation'],
    stack: ['ESP32', 'RFM96', 'DHT11', 'LoRaWAN', 'ChirpStack'],
    contribution: 'À compléter.',
    features: [
      { label: 'Acquisition DHT11', status: '?' },
      { label: 'Transmission LoRaWAN', status: '?' },
      { label: 'Visualisation ChirpStack', status: '?' },
    ],
    results: [],
    links: { github: '', demo: '' },
    images: [],
  },
{
  "id": "serre-connectee",
  "title": "Serre connectée : supervision et régulation MQTT",
  "category": "Automatisation",
  "tag": "TP Node-RED",
  "summary": "Simulation de capteurs, validation des données, tableaux de bord et commande automatique/manuelle de ventilation et d’irrigation.",
  "problem": "Construire un flux de télémétrie fiable et commander les actionneurs avec des seuils et une hystérésis.",
  "objectives": [
    "Générer quatre mesures simulées avec horodatage et numéro de séquence.",
    "Valider les mesures reçues via MQTT.",
    "Superviser les paramètres et réguler les actionneurs."
  ],
  "flow": [
    "Simulation JSON",
    "MQTT",
    "Validation",
    "Node-RED Dashboard",
    "Régulation",
    "CSV"
  ],
  "stack": [
    "Node-RED",
    "MQTT",
    "JavaScript",
    "JSON",
    "Dashboard",
    "CSV"
  ],
  "contribution": "Conception des fonctions Node-RED de simulation, validation, régulation et visualisation.",
  "features": [
    {
      "label": "Simulateur des mesures",
      "status": "ok"
    },
    {
      "label": "Validation des plages",
      "status": "ok"
    },
    {
      "label": "Mode AUTO/MANUEL et hystérésis",
      "status": "ok"
    },
    {
      "label": "Courbes et gauges",
      "status": "ok"
    },
    {
      "label": "Export CSV",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "original",
  "codeFile": "/code/serre-node-red-flows.json"
},
{
  "id": "robot-aspirateur",
  "title": "Robot aspirateur à agent réflexe",
  "category": "IA",
  "tag": "Projet Python",
  "summary": "Simulation d’un agent réflexe dans un environnement à grille 3 × 3.",
  "problem": "Choisir une action selon la position et l’état local de propreté.",
  "objectives": [
    "Représenter une grille de neuf cases.",
    "Appliquer des règles de déplacement et de nettoyage.",
    "Visualiser les changements d’état."
  ],
  "flow": [
    "État de la grille",
    "Perception",
    "Règles de l’agent",
    "Action",
    "Mise à jour"
  ],
  "stack": [
    "Python",
    "IA symbolique",
    "Simulation"
  ],
  "contribution": "Implémentation d’un agent à règles et d’un environnement discret.",
  "features": [
    {
      "label": "Règles de perception/action",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "todo-tkinter",
  "title": "Gestionnaire de tâches en Python",
  "category": "Logiciel",
  "tag": "Projet POO",
  "summary": "Application de liste de tâches avec interface Tkinter et sauvegarde JSON.",
  "problem": "Organiser des tâches et conserver leur état entre deux sessions.",
  "objectives": [
    "Créer une interface utilisateur.",
    "Ajouter et supprimer des tâches.",
    "Persister les données en JSON."
  ],
  "flow": [
    "Interface Tkinter",
    "Gestion des tâches",
    "Sauvegarde JSON"
  ],
  "stack": [
    "Python",
    "Tkinter",
    "POO",
    "JSON"
  ],
  "contribution": "Conception d’une application bureautique orientée objet.",
  "features": [
    {
      "label": "Interface de tâches",
      "status": "ok"
    },
    {
      "label": "Persistance JSON",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "mnist-cnn",
  "title": "Classification de chiffres manuscrits avec CNN",
  "category": "IA",
  "tag": "Machine Learning",
  "summary": "Réseau convolutif Keras entraîné sur MNIST.",
  "problem": "Reconnaître des chiffres manuscrits à partir d’images de 28 × 28 pixels.",
  "objectives": [
    "Normaliser les pixels.",
    "Entraîner un modèle CNN.",
    "Évaluer le modèle sur un jeu de test."
  ],
  "flow": [
    "MNIST",
    "Prétraitement",
    "CNN",
    "Apprentissage",
    "Évaluation"
  ],
  "stack": [
    "Python",
    "TensorFlow",
    "Keras",
    "CNN",
    "NumPy"
  ],
  "contribution": "Préparation des images et construction d’un modèle de classification.",
  "features": [
    {
      "label": "Prétraitement",
      "status": "ok"
    },
    {
      "label": "Entraînement et évaluation",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "weather-aus",
  "title": "Prédiction de pluie avec WeatherAUS",
  "category": "IA",
  "tag": "Machine Learning",
  "summary": "Nettoyage des données météorologiques et comparaison de classifieurs.",
  "problem": "Prédire une variable binaire RainTomorrow à partir des observations météorologiques.",
  "objectives": [
    "Traiter les valeurs manquantes.",
    "Préparer les variables numériques et catégorielles.",
    "Optimiser et évaluer un classifieur."
  ],
  "flow": [
    "Données WeatherAUS",
    "Imputation",
    "Encodage",
    "GridSearchCV",
    "Évaluation"
  ],
  "stack": [
    "Python",
    "pandas",
    "scikit-learn",
    "GridSearchCV"
  ],
  "contribution": "Prétraitement et optimisation de modèles supervisés.",
  "features": [
    {
      "label": "Pipeline de classification",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "maintenance-predictive",
  "title": "Diagnostic de capteurs industriels par Random Forest",
  "category": "IA",
  "tag": "Machine Learning",
  "summary": "Comparaison de trois Random Forest selon la taille, le temps d’inférence et les métriques.",
  "problem": "Détecter un état critique à partir de la température, des vibrations et de la pression.",
  "objectives": [
    "Entraîner des classifieurs de tailles différentes.",
    "Comparer précision et rappel de la classe Critical.",
    "Évaluer la taille des modèles et leur latence."
  ],
  "flow": [
    "Capteurs",
    "Jeu d’entraînement",
    "Random Forest",
    "Mesures",
    "Comparaison"
  ],
  "stack": [
    "Python",
    "scikit-learn",
    "joblib",
    "pandas"
  ],
  "contribution": "Entraînement, compression comparative et évaluation des modèles.",
  "features": [
    {
      "label": "Modèles de 200, 50 et 10 arbres",
      "status": "ok"
    },
    {
      "label": "Comparaison d’inférence",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "cruise-control",
  "title": "Régulateur de vitesse en espace d’état",
  "category": "Automatisation",
  "tag": "MATLAB / Simulink",
  "summary": "Modélisation du cruise control et conception d’une régulation PI.",
  "problem": "Maintenir une vitesse de consigne malgré les variations du système.",
  "objectives": [
    "Définir les matrices A, B, C et D.",
    "Analyser le comportement du modèle.",
    "Tester la réponse avec correction PI."
  ],
  "flow": [
    "Modèle mécanique",
    "Espace d’état",
    "Régulateur PI",
    "Simulink",
    "Analyse"
  ],
  "stack": [
    "MATLAB",
    "Simulink",
    "Commande PI",
    "Espace d’état"
  ],
  "contribution": "Modélisation et étude du comportement du système asservi.",
  "features": [
    {
      "label": "Modèle d’état",
      "status": "ok"
    },
    {
      "label": "Étude de la correction PI",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "redresseur-matlab",
  "title": "Analyse d’un redresseur à point milieu",
  "category": "Automatisation",
  "tag": "MATLAB / Simulink",
  "summary": "Étude de redressement commandé et de grandeurs électriques sur une charge RL.",
  "problem": "Étudier les tensions et courants d’un convertisseur commandé.",
  "objectives": [
    "Simuler le circuit et la charge RL.",
    "Observer les formes d’onde.",
    "Calculer les grandeurs électriques utiles."
  ],
  "flow": [
    "Source AC",
    "Redresseur",
    "Charge RL",
    "Simulation",
    "Analyse"
  ],
  "stack": [
    "MATLAB",
    "Simulink",
    "Électronique de puissance"
  ],
  "contribution": "Étude et simulation d’un convertisseur électrique.",
  "features": [
    {
      "label": "Modélisation du circuit",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "basket-vr",
  "title": "Jeu de basket-ball en réalité virtuelle",
  "category": "Logiciel",
  "tag": "Unity XR",
  "summary": "Prototype interactif de basket-ball en VR.",
  "problem": "Créer une expérience immersive avec interactions et physique 3D.",
  "objectives": [
    "Placer le terrain et les objets.",
    "Configurer les interactions XR.",
    "Tester les collisions et mouvements."
  ],
  "flow": [
    "Unity",
    "XR Toolkit",
    "Interaction",
    "Physique",
    "Casque VR"
  ],
  "stack": [
    "Unity",
    "C#",
    "XR Interaction Toolkit",
    "Physique 3D"
  ],
  "contribution": "Développement d’interactions et de scènes dans Unity.",
  "features": [
    {
      "label": "Interactions XR",
      "status": "ok"
    },
    {
      "label": "Physique 3D",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "pic-mikroc",
  "title": "Programmation PIC : LCD, ADC et interruptions",
  "category": "Embarqué",
  "tag": "Travaux pratiques",
  "summary": "Exercices embarqués avec afficheur LCD, acquisition analogique et gestion des interruptions.",
  "problem": "Interfacer les périphériques d’un microcontrôleur PIC.",
  "objectives": [
    "Configurer les ports.",
    "Acquérir des données via ADC.",
    "Gérer des interruptions et affichages."
  ],
  "flow": [
    "Capteur",
    "ADC",
    "PIC",
    "Traitement",
    "Affichage"
  ],
  "stack": [
    "mikroC",
    "PIC",
    "ADC",
    "LCD",
    "Interruptions"
  ],
  "contribution": "Programmation de périphériques et tests de fonctions embarquées.",
  "features": [
    {
      "label": "Acquisition ADC",
      "status": "ok"
    },
    {
      "label": "Interface LCD",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
},
{
  "id": "vhdl-fpga",
  "title": "Circuits numériques en VHDL",
  "category": "Embarqué",
  "tag": "Travaux pratiques",
  "summary": "Description de circuits combinatoires et séquentiels en VHDL.",
  "problem": "Décrire et simuler des comportements logiques sur un support HDL.",
  "objectives": [
    "Écrire des entités et architectures.",
    "Utiliser les signaux et l’horloge.",
    "Vérifier les sorties par simulation."
  ],
  "flow": [
    "Entrées",
    "Logique VHDL",
    "Simulation",
    "Sorties"
  ],
  "stack": [
    "VHDL",
    "Logique séquentielle",
    "Logique combinatoire"
  ],
  "contribution": "Description de modules numériques en VHDL.",
  "features": [
    {
      "label": "Circuits combinatoires",
      "status": "ok"
    },
    {
      "label": "Circuits séquentiels",
      "status": "ok"
    }
  ],
  "results": [],
  "links": {
    "github": "",
    "demo": ""
  },
  "images": [],
  "codeKind": "example",
  "codeFile": ""
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
  { kind: 'Stage', title: 'Stage — à renseigner', period: '', text: '' },
  { kind: 'Projet académique', title: 'Projet académique — à renseigner', period: '', text: '' },
  { kind: 'Certification', title: 'Certification — à renseigner', period: '', text: '' },
]
