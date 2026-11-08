// Extraits pédagogiques reconstitués quand les fichiers originaux ne sont pas disponibles.
// Les exemples ne doivent pas être présentés comme les dépôts historiques des projets.
export const codeExamples = {
  "orchestration-llm": {
    "language": "python",
    "label": "Exemple pédagogique — ordonnanceur (non issu du code source original)",
    "content": "def choisir_worker(workers, complexite):\n    # Exemple simplifié de sélection ; pas une implémentation PPO.\n    candidats = [w for w in workers if w[\"disponible\"]]\n    if not candidats:\n        return None\n    return min(candidats, key=lambda w:\n        w[\"charge_cpu\"] + 2 * w[\"file_attente\"] +\n        (20 if complexite == \"haute\" and not w[\"puissant\"] else 0)\n    )\n"
  },
  "controle-routier-iot": {
    "language": "javascript",
    "label": "Exemple pédagogique — télémétrie IoT (sans OCR)",
    "content": "// Exemple de message MQTT de télémétrie, données fictives.\nconst telemetry = {\n  device_id: \"road-node-01\",\n  ts: new Date().toISOString(),\n  speed_kmh: 42,\n  sensor_status: \"online\"\n};\nmsg.topic = \"demo/road/telemetry\";\nmsg.payload = JSON.stringify(telemetry);\nreturn msg;\n"
  },
  "capteurs-lorawan": {
    "language": "cpp",
    "label": "Exemple pédagogique — acquisition de mesures (hors pile LoRaWAN)",
    "content": "// Exemple Arduino/ESP32 : acquisition du DHT11.\n#include <DHT.h>\nDHT dht(4, DHT11);\nvoid setup() {\n  Serial.begin(115200);\n  dht.begin();\n}\nvoid loop() {\n  float t = dht.readTemperature();\n  float h = dht.readHumidity();\n  if (!isnan(t) && !isnan(h)) {\n    Serial.printf(\"Temperature: %.1f C | Humidite: %.1f %%\\n\", t, h);\n  }\n  delay(2000);\n}\n"
  },
  "serre-connectee": {
    "language": "javascript",
    "label": "Extrait réel du TP — logique de régulation",
    "content": "// Extrait de la fonction Node-RED « Régulation »\nlet vent = context.get(\"vent\") || \"OFF\";\nlet irrig = context.get(\"irrig\") || \"OFF\";\nconst m = msg.payload;\nif (m.temperature >= 30) vent = \"ON\";\nelse if (m.temperature <= 28) vent = \"OFF\";\nif (m.soil_moisture <= 35) irrig = \"ON\";\nelse if (m.soil_moisture >= 60) irrig = \"OFF\";\ncontext.set(\"vent\", vent);\ncontext.set(\"irrig\", irrig);\nreturn [\n  {payload: {actuator: \"ventilation\", state: vent}},\n  {payload: {actuator: \"irrigation\", state: irrig}}\n];\n// Flow complet disponible en JSON ci-dessous.\n"
  },
  "robot-aspirateur": {
    "language": "python",
    "label": "Exemple pédagogique — règles d'un agent réflexe",
    "content": "grille = [[1, 0, 1], [0, 1, 0], [1, 0, 1]]\nposition = (0, 0)\n\ndef agir(grille, position):\n    i, j = position\n    if grille[i][j] == 1:\n        grille[i][j] = 0\n        return \"aspirer\"\n    return \"avancer\"\n"
  },
  "todo-tkinter": {
    "language": "python",
    "label": "Exemple pédagogique — sauvegarde des tâches en JSON",
    "content": "import json\nfrom pathlib import Path\n\nCHEMIN = Path(\"taches.json\")\n\ndef sauvegarder(taches):\n    CHEMIN.write_text(\n        json.dumps(taches, ensure_ascii=False, indent=2),\n        encoding=\"utf-8\"\n    )\n\ndef charger():\n    if not CHEMIN.exists():\n        return []\n    return json.loads(CHEMIN.read_text(encoding=\"utf-8\"))\n"
  },
  "mnist-cnn": {
    "language": "python",
    "label": "Exemple pédagogique — CNN Keras",
    "content": "from tensorflow import keras\n\n(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()\nx_train = x_train.astype(\"float32\").reshape(-1, 28, 28, 1) / 255\nx_test = x_test.astype(\"float32\").reshape(-1, 28, 28, 1) / 255\n\nmodel = keras.Sequential([\n    keras.layers.Input(shape=(28, 28, 1)),\n    keras.layers.Conv2D(32, 3, activation=\"relu\"),\n    keras.layers.MaxPooling2D(),\n    keras.layers.Flatten(),\n    keras.layers.Dense(10, activation=\"softmax\")\n])\nmodel.compile(optimizer=\"adam\",\n              loss=\"sparse_categorical_crossentropy\",\n              metrics=[\"accuracy\"])\nmodel.fit(x_train, y_train, epochs=3, validation_split=0.1)\nprint(model.evaluate(x_test, y_test))\n"
  },
  "weather-aus": {
    "language": "python",
    "label": "Exemple pédagogique — pipeline de classification",
    "content": "from sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.preprocessing import OneHotEncoder\nfrom sklearn.ensemble import RandomForestClassifier\n\npre = ColumnTransformer([\n    (\"num\", SimpleImputer(strategy=\"median\"), numeric_columns),\n    (\"cat\", Pipeline([\n        (\"fill\", SimpleImputer(strategy=\"most_frequent\")),\n        (\"encode\", OneHotEncoder(handle_unknown=\"ignore\"))\n    ]), categorical_columns)\n])\nmodel = Pipeline([\n    (\"preprocess\", pre),\n    (\"classifier\", RandomForestClassifier(random_state=42))\n])\nmodel.fit(X_train, y_train)\n"
  },
  "maintenance-predictive": {
    "language": "python",
    "label": "Exemple pédagogique — compromis taille/précision",
    "content": "from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score, recall_score\n\nfor n in (200, 50, 10):\n    clf = RandomForestClassifier(\n        n_estimators=n, class_weight=\"balanced\", random_state=42\n    ).fit(X_train, y_train)\n    y_pred = clf.predict(X_test)\n    print(n, accuracy_score(y_test, y_pred),\n          recall_score(y_test, y_pred, pos_label=\"Critical\"))\n"
  },
  "cruise-control": {
    "language": "matlab",
    "label": "Exemple pédagogique — système d'état et PI",
    "content": "% Exemple générique ; matrices à adapter au modèle du TP\nA = -0.2; B = 1; C = 1; D = 0;\nsys = ss(A, B, C, D);\nKp = 0.8; Ki = 0.2;\nCpi = pid(Kp, Ki);\nT = feedback(Cpi * sys, 1);\nstep(T); grid on;\n"
  },
  "redresseur-matlab": {
    "language": "matlab",
    "label": "Exemple pédagogique — calcul de grandeurs",
    "content": "% Illustration numérique, sans remplacement du modèle Simulink.\nt = linspace(0, 0.1, 2000);\nf = 50;\nvin = 120 * sqrt(2) * sin(2*pi*f*t);\nvredresse = abs(vin);\nplot(t, vredresse);\nxlabel('Temps (s)'); ylabel('Tension (V)');\ngrid on;\n"
  },
  "basket-vr": {
    "language": "csharp",
    "label": "Exemple pédagogique — script Unity",
    "content": "using UnityEngine;\n\npublic class BallReset : MonoBehaviour {\n    private Vector3 initialPosition;\n    private Rigidbody rb;\n    void Start() {\n        initialPosition = transform.position;\n        rb = GetComponent<Rigidbody>();\n    }\n    public void ResetBall() {\n        rb.linearVelocity = Vector3.zero; // Unity 6\n        rb.angularVelocity = Vector3.zero;\n        transform.position = initialPosition;\n    }\n}\n"
  },
  "pic-mikroc": {
    "language": "c",
    "label": "Exemple pédagogique — lecture analogique en mikroC",
    "content": "void main() {\n    unsigned int mesure;\n    ANSEL = 0x01;\n    TRISA = 0x01;\n    ADC_Init();\n    while (1) {\n        mesure = ADC_Read(0);\n        Delay_ms(100);\n    }\n}\n"
  },
  "vhdl-fpga": {
    "language": "vhdl",
    "label": "Exemple pédagogique — registre 8 bits",
    "content": "library IEEE;\nuse IEEE.STD_LOGIC_1164.ALL;\nentity registre is\n  port(clk : in std_logic;\n       d   : in std_logic_vector(7 downto 0);\n       q   : out std_logic_vector(7 downto 0));\nend registre;\narchitecture rtl of registre is\nbegin\n  process(clk)\n  begin\n    if rising_edge(clk) then q <= d; end if;\n  end process;\nend rtl;\n"
  }
}
