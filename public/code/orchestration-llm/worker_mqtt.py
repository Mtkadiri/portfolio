# worker_mqtt.py
import paho.mqtt.client as mqtt
import json
import time
import requests
import threading
import random
import sys

# ==========================================
# CONFIGURATION
# ==========================================
BROKER_HOST = "localhost"  # Sur un vrai Pi, mettre l'IP du PC
BROKER_PORT = 1883

WORKER_TYPE = sys.argv[1] if len(sys.argv) > 1 else "pi3"
OLLAMA_URL = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:11435"
OLLAMA_MODEL = sys.argv[3] if len(sys.argv) > 3 else "qwen2.5:0.5b"

# Topics
TOPIC_REQUETES = "requetes"
TOPIC_RESSOURCE = f"ressource/{WORKER_TYPE}"
TOPIC_REPONSE = f"reponse/{WORKER_TYPE}"

# ==========================================
# ÉTAT DU WORKER
# ==========================================
worker_state = {
    "worker_type": WORKER_TYPE,
    "model": OLLAMA_MODEL,
    "cpu_usage": 0.0,
    "ram_usage": 0.0,
    "temperature": 40.0,
    "queue_length": 0,
    "avg_latency": 0.0,
    "is_healthy": True,
    "requests_processed": 0
}

latency_history = []

# ==========================================
# CLIENT MQTT
# ==========================================
def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print(f"✅ [{WORKER_TYPE}] Connecté au broker MQTT")
        # S'abonner aux requêtes
        client.subscribe(TOPIC_REQUETES)
        print(f"📡 [{WORKER_TYPE}] Abonné à: {TOPIC_REQUETES}")
    else:
        print(f"❌ [{WORKER_TYPE}] Échec connexion: {reason_code}")

def on_message(client, userdata, msg):
    """Réception d'une requête"""
    try:
        data = json.loads(msg.payload.decode())
        target_worker = data.get("target_worker")
        
        # Vérifier si la requête est pour ce worker
        if target_worker and target_worker != WORKER_TYPE:
            return
        
        print(f"📨 [{WORKER_TYPE}] Requête reçue: {data.get('message', '')[:50]}...")
        
        # Traiter la requête
        process_request(client, data)
        
    except Exception as e:
        print(f"❌ [{WORKER_TYPE}] Erreur traitement: {e}")

def process_request(client, data):
    """Traite une requête et publie la réponse"""
    global worker_state
    
    message = data.get("message", "")
    request_id = data.get("request_id", "unknown")
    
    # Mettre à jour la file d'attente
    worker_state["queue_length"] += 1
    
    start_time = time.time()
    
    try:
        # Appel à Ollama
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": message,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 256
                }
            },
            timeout=120
        )
        
        result = response.json()
        response_text = result.get("response", "Pas de réponse")
        
        latency = time.time() - start_time
        latency_history.append(latency)
        if len(latency_history) > 100:
            latency_history.pop(0)
        
        # Mettre à jour l'état
        worker_state["requests_processed"] += 1
        worker_state["avg_latency"] = sum(latency_history) / len(latency_history)
        worker_state["queue_length"] = max(0, worker_state["queue_length"] - 1)
        worker_state["cpu_usage"] = min(100, worker_state["cpu_usage"] + random.uniform(10, 30))
        worker_state["temperature"] = min(80, worker_state["temperature"] + random.uniform(0.5, 2.0))
        
        # Publier la réponse
        response_payload = {
            "request_id": request_id,
            "worker": WORKER_TYPE,
            "model": OLLAMA_MODEL,
            "response": response_text,
            "latency": latency,
            "timestamp": time.time()
        }
        
        client.publish(TOPIC_REPONSE, json.dumps(response_payload))
        print(f"📤 [{WORKER_TYPE}] Réponse publiée (latence: {latency:.2f}s)")
        
    except Exception as e:
        print(f"❌ [{WORKER_TYPE}] Erreur Ollama: {e}")
        
        # Publier une erreur
        error_payload = {
            "request_id": request_id,
            "worker": WORKER_TYPE,
            "error": str(e),
            "timestamp": time.time()
        }
        client.publish(TOPIC_REPONSE, json.dumps(error_payload))
        worker_state["queue_length"] = max(0, worker_state["queue_length"] - 1)

# ==========================================
# PUBLICATION PÉRIODIQUE DES MÉTRIQUES
# ==========================================
def publish_metrics_loop(client):
    """Publie les métriques du worker toutes les 5 secondes"""
    global worker_state
    
    while True:
        try:
            # Simulation de variations réalistes
            worker_state["cpu_usage"] = max(5, min(100, 
                worker_state["cpu_usage"] + random.uniform(-10, 10)))
            worker_state["ram_usage"] = max(20, min(95,
                worker_state["ram_usage"] + random.uniform(-5, 5)))
            worker_state["temperature"] = max(35, min(80,
                worker_state["temperature"] + random.uniform(-1, 1)))
            
            # Vérifier la santé
            worker_state["is_healthy"] = worker_state["temperature"] < 75
            
            # Publier
            client.publish(TOPIC_RESSOURCE, json.dumps(worker_state))
            
        except Exception as e:
            print(f"❌ [{WORKER_TYPE}] Erreur publication métriques: {e}")
        
        time.sleep(5)

# ==========================================
# MAIN
# ==========================================
if __name__ == "__main__":
    print("=" * 60)
    print(f"🚀 WORKER MQTT: {WORKER_TYPE.upper()}")
    print("=" * 60)
    print(f"📡 Broker: {BROKER_HOST}:{BROKER_PORT}")
    print(f"🤖 Ollama: {OLLAMA_URL}")
    print(f"🧠 Modèle: {OLLAMA_MODEL}")
    print(f"📤 Topic réponse: {TOPIC_REPONSE}")
    print(f"📊 Topic métriques: {TOPIC_RESSOURCE}")
    print("=" * 60)
    
    # Créer le client MQTT
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=f"worker-{WORKER_TYPE}")
    client.on_connect = on_connect
    client.on_message = on_message
    
    # Se connecter
    client.connect(BROKER_HOST, BROKER_PORT, 60)
    
    # Démarrer la boucle MQTT
    client.loop_start()
    
    # Démarrer la publication des métriques dans un thread séparé
    metrics_thread = threading.Thread(target=publish_metrics_loop, args=(client,), daemon=True)
    metrics_thread.start()
    
    print(f"✅ [{WORKER_TYPE}] Worker prêt ! En attente de requêtes...")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print(f"\n🛑 [{WORKER_TYPE}] Arrêt...")
        client.loop_stop()
        client.disconnect()