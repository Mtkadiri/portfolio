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
    links: { github: 'https://www.linkedin.com/in/mohamed-taha-kadiri-2434003b1/', demo: '' },
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
    links: { github: 'https://www.linkedin.com/in/mohamed-taha-kadiri-2434003b1/', demo: '' },
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
