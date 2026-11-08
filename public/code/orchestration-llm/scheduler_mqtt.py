# scheduler_mqtt.py
import paho.mqtt.client as mqtt
import json
import time
import uuid
import threading
import numpy as np
import os
from stable_baselines3 import PPO

# ==========================================
# CONFIGURATION
# ==========================================
BROKER_HOST = "localhost"
BROKER_PORT = 1883

MODEL_PATH = "models/ppo_scheduler_2cards.zip"

TOPIC_REQUETES = "requetes"
TOPIC_REPONSE_PREFIX = "reponse"
TOPIC_RESSOURCE_PREFIX = "ressource"
TOPIC_HEARTBEAT_PREFIX = "heartbeat"

# ==========================================
# ETAT DES WORKERS
# ==========================================
workers_state = {
    "pi3": {"cpu_usage": 0, "ram_usage": 0, "temperature": 40, "queue_length": 0,
            "avg_latency": 0, "is_healthy": True, "last_heartbeat": 0},
    "pi5": {"cpu_usage": 0, "ram_usage": 0, "temperature": 40, "queue_length": 0,
            "avg_latency": 0, "is_healthy": True, "last_heartbeat": 0}
}

WORKER_NAMES = ["pi3", "pi5"]

# ==========================================
# CHARGEMENT DU MODELE RL
# ==========================================
print("=" * 60)
print("SCHEDULER MQTT AVEC RL")
print("=" * 60)

if os.path.exists(MODEL_PATH):
    print(f"Chargement du modele : {MODEL_PATH}")
    model = PPO.load(MODEL_PATH)
    print("Modele PPO charge")
else:
    print(f"Modele non trouve : {MODEL_PATH}")
    print("Utilisation de l'heuristique")
    model = None

pending_responses = {}

# ==========================================
# ANALYSE DE COMPLEXITE
# ==========================================
def analyze_complexity(message):
    complexity = 0.0
    urgency = 0.0
    task_type = "chat"

    msg_lower = message.lower()

    if len(message) > 50:
        complexity += 0.15
    if len(message) > 100:
        complexity += 0.15

    complex_kw = ["explique", "compare", "analyse", "code", "algorithme", "programme", "detaille"]
    for kw in complex_kw:
        if kw in msg_lower:
            complexity += 0.15

    tech_kw = ["thermodynamique", "asynchrone", "quantique", "physique", "mathematique"]
    for kw in tech_kw:
        if kw in msg_lower:
            complexity += 0.2

    complexity = min(complexity, 1.0)

    urgent_kw = ["urgence", "immediatement", "critique", "maintenant", "rapidement", "vite"]
    for kw in urgent_kw:
        if kw in msg_lower:
            urgency += 0.4
    urgency = min(urgency, 1.0)

    if any(kw in msg_lower for kw in ["code", "programme", "fonction", "python"]):
        task_type = "code"
    elif any(kw in msg_lower for kw in ["explique", "analyse", "compare"]):
        task_type = "analysis"

    return complexity, urgency, task_type

# ==========================================
# CONSTRUCTION DE L'OBSERVATION
# ==========================================
def build_observation(complexity, urgency, task_type):
    obs = []

    for worker in WORKER_NAMES:
        state = workers_state[worker]
        obs.extend([
            state["cpu_usage"] / 100.0,
            state["ram_usage"] / 100.0,
            state["temperature"] / 80.0,
            min(state["queue_length"] / 10.0, 1.0)
        ])

    obs.append(complexity)
    obs.append(urgency)

    type_encoding = {"chat": 0.0, "code": 0.5, "analysis": 1.0}
    obs.append(type_encoding.get(task_type, 0.0))

    return np.array(obs, dtype=np.float32)

# ==========================================
# SELECTION DU WORKER
# ==========================================
def select_worker(complexity, urgency, task_type):
    if model is not None:
        obs = build_observation(complexity, urgency, task_type)
        action, _ = model.predict(obs, deterministic=True)
        worker = WORKER_NAMES[int(action)]
        print(f"[RL] Decision : {worker} (complexite: {complexity:.2f})")
        return worker
    else:
        if complexity > 0.5:
            return "pi5"
        else:
            return "pi3"

# ==========================================
# CALLBACKS MQTT
# ==========================================
def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Scheduler connecte au broker MQTT")
        client.subscribe(f"{TOPIC_RESSOURCE_PREFIX}/#")
        client.subscribe(f"{TOPIC_REPONSE_PREFIX}/#")
        client.subscribe(f"{TOPIC_HEARTBEAT_PREFIX}/#")
        print("Abonne a: ressource/#, reponse/#, heartbeat/#")
    else:
        print(f"Echec connexion: {reason_code}")

def on_message(client, userdata, msg):
    topic = msg.topic
    try:
        data = json.loads(msg.payload.decode())

        if topic.startswith(TOPIC_HEARTBEAT_PREFIX):
            worker = data.get("worker")
            if worker in workers_state:
                workers_state[worker]["last_heartbeat"] = time.time()
                workers_state[worker]["is_healthy"] = True

        elif topic.startswith(TOPIC_RESSOURCE_PREFIX):
            worker = data.get("worker_type")
            if worker in workers_state:
                workers_state[worker].update({
                    "cpu_usage": data.get("cpu_usage", 0),
                    "ram_usage": data.get("ram_usage", 0),
                    "temperature": data.get("temperature", 40),
                    "queue_length": data.get("queue_length", 0),
                    "avg_latency": data.get("avg_latency", 0),
                    "is_healthy": data.get("is_healthy", True)
                })

        elif topic.startswith(TOPIC_REPONSE_PREFIX):
            request_id = data.get("request_id")
            if request_id in pending_responses:
                pending_responses[request_id]["response"] = data
                pending_responses[request_id]["event"].set()

    except Exception as e:
        print(f"Erreur message: {e}")

# ==========================================
# ENVOI D'UNE REQUETE
# ==========================================
def send_request(client, message):
    complexity, urgency, task_type = analyze_complexity(message)
    worker = select_worker(complexity, urgency, task_type)

    request_id = str(uuid.uuid4())
    event = threading.Event()
    pending_responses[request_id] = {"event": event, "response": None}

    payload = {
        "request_id": request_id,
        "target_worker": worker,
        "message": message,
        "complexity": complexity,
        "urgency": urgency,
        "task_type": task_type,
        "timestamp": time.time()
    }

    print(f"\nTache: {task_type} | Complexite: {complexity:.2f} | Urgence: {urgency:.2f} -> {worker}")

    client.publish(TOPIC_REQUETES, json.dumps(payload))

    if event.wait(timeout=120):
        response = pending_responses[request_id]["response"]
        del pending_responses[request_id]
        return response
    else:
        del pending_responses[request_id]
        return {"error": "Timeout"}

# ==========================================
# MAIN
# ==========================================
if __name__ == "__main__":
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="scheduler_rl")
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(BROKER_HOST, BROKER_PORT, 60)
    client.loop_start()

    time.sleep(2)

    print("\nTapez vos messages (ou 'quit' pour quitter):\n")

    try:
        while True:
            message = input("Vous: ")
            if message.lower() in ["quit", "exit", "q"]:
                break

            if not message.strip():
                continue

            response = send_request(client, message)

            if response and "response" in response:
                print(f"\n[{response.get('worker', '?')}] {response['response']}")
                print(f"Latence: {response.get('latency', 0):.2f}s\n")
            else:
                print(f"\nErreur: {response}\n")

    except KeyboardInterrupt:
        print("\nArret...")

    client.loop_stop()
    client.disconnect()