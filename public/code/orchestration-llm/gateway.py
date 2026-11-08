# gateway.py
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import httpx
import asyncio
from typing import Dict, List, Optional
import json
from datetime import datetime
import uuid
import time
import random

app = FastAPI(title="LLM Scheduler Gateway", version="0.2.0")

# ==========================================
# CONFIGURATION DES WORKERS (OLLAMA)
# ==========================================
WORKERS = {
    "pi3": {
        "url": "http://localhost:11435",
        "model": "qwen2.5:0.5b",
        "quality_score": 0.6,
        "max_complexity": 0.4,  # Bon pour tâches simples
        "speed": "fast"
    },
    "pi4": {
        "url": "http://localhost:11436",
        "model": "phi",
        "quality_score": 0.8,
        "max_complexity": 0.7,  # Bon pour tâches moyennes
        "speed": "medium"
    },
    "pi5": {
        "url": "http://localhost:11437",
        "model": "gemma3:4b",
        "quality_score": 1.0,
        "max_complexity": 1.0,  # Bon pour tâches complexes
        "speed": "powerful"
    }
}

# ==========================================
# MODÈLES DE DONNÉES
# ==========================================
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class WorkerMetrics(BaseModel):
    worker_type: str
    cpu_usage: float
    ram_usage: float
    ram_available: float
    temperature: float
    queue_length: int
    avg_latency: float
    is_healthy: bool
    requests_processed: int
    model: str
    quality_score: float
    timestamp: float

# ==========================================
# ÉTAT DES WORKERS
# ==========================================
workers_state = {
    "pi3": {
        "cpu_usage": 0.0,
        "ram_usage": 0.0,
        "ram_available": 2.0,
        "temperature": 0.0,
        "queue_length": 0,
        "avg_latency": 0.0,
        "is_healthy": True,
        "requests_processed": 0,
        "model": "qwen2.5:0.5b",
        "quality_score": 0.6,
        "last_update": 0.0,
        "total_latency": 0.0
    },
    "pi4": {
        "cpu_usage": 0.0,
        "ram_usage": 0.0,
        "ram_available": 4.0,
        "temperature": 0.0,
        "queue_length": 0,
        "avg_latency": 0.0,
        "is_healthy": True,
        "requests_processed": 0,
        "model": "phi",
        "quality_score": 0.8,
        "last_update": 0.0,
        "total_latency": 0.0
    },
    "pi5": {
        "cpu_usage": 0.0,
        "ram_usage": 0.0,
        "ram_available": 8.0,
        "temperature": 0.0,
        "queue_length": 0,
        "avg_latency": 0.0,
        "is_healthy": True,
        "requests_processed": 0,
        "model": "gemma3:4b",
        "quality_score": 1.0,
        "last_update": 0.0,
        "total_latency": 0.0
    }
}

# ==========================================
# RÉCEPTION DES MÉTRIQUES (HTTP)
# ==========================================
@app.post("/worker_metrics")
async def receive_metrics(metrics: WorkerMetrics):
    """Reçoit les métriques HTTP des workers en temps réel"""
    worker = metrics.worker_type
    if worker in workers_state:
        workers_state[worker].update({
            "cpu_usage": metrics.cpu_usage,
            "ram_usage": metrics.ram_usage,
            "ram_available": metrics.ram_available,
            "temperature": metrics.temperature,
            "queue_length": metrics.queue_length,
            "avg_latency": metrics.avg_latency,
            "is_healthy": metrics.is_healthy,
            "requests_processed": metrics.requests_processed,
            "model": metrics.model,
            "quality_score": metrics.quality_score,
            "last_update": time.time()
        })
        print(f"📊 {worker}: CPU={metrics.cpu_usage:.0f}%, RAM={metrics.ram_usage:.0f}%, Temp={metrics.temperature:.0f}°C, Queue={metrics.queue_length}")
    return {"status": "ok"}

# ==========================================
# ANALYSE DES TÂCHES
# ==========================================
def analyze_task(message: str) -> Dict:
    """Analyse la tâche pour en extraire les caractéristiques"""
    complexity = 0.0
    urgency = 0.0
    task_type = "chat"
    
    # 1. Complexité basée sur la longueur
    if len(message) > 50:
        complexity += 0.2
    if len(message) > 100:
        complexity += 0.2
    if len(message) > 200:
        complexity += 0.2
    
    # 2. Mots-clés de complexité
    complex_keywords = [
        "explique", "compare", "analyse", "évalue", "code", 
        "algorithme", "programme", "fonction", "détaillé", 
        "complexe", "approfondi", "développe"
    ]
    for keyword in complex_keywords:
        if keyword in message.lower():
            complexity += 0.1
    
    # 3. Questions
    if "?" in message:
        complexity += 0.1
    
    complexity = min(complexity, 1.0)
    
    # 4. Urgence
    urgent_keywords = ["urgence", "immédiatement", "critique", "maintenant", "alerte", "rapidement"]
    for keyword in urgent_keywords:
        if keyword in message.lower():
            urgency += 0.3
    
    urgency = min(urgency, 1.0)
    
    # 5. Type de tâche
    if any(kw in message.lower() for kw in ["code", "programme", "fonction", "algorithme"]):
        task_type = "code"
    elif any(kw in message.lower() for kw in ["explique", "analyse", "compare", "détaillé"]):
        task_type = "analysis"
    elif any(kw in message.lower() for kw in ["traduis", "traduction", "translate"]):
        task_type = "translation"
    
    return {
        "complexity": complexity,
        "urgency": urgency,
        "task_type": task_type,
        "length": len(message)
    }

# ==========================================
# ORDONNANCEUR INTELLIGENT
# ==========================================
class Scheduler:
    def __init__(self):
        self.request_queue = []
        self.history = []
        self.worker_usage = {"pi3": 0, "pi4": 0, "pi5": 0}
    
    def add_request(self, request):
        self.request_queue.append(request)
        if len(self.request_queue) > 100:
            self.request_queue.pop(0)
    
    def select_worker(self, complexity: float, urgency: float, task_type: str) -> str:
        """Sélectionne le meilleur worker selon la complexité et l'état"""
        scores = {}
        
        for name, state in workers_state.items():
            if not state.get("is_healthy", False):
                scores[name] = 999
                continue
            
            cpu = state.get("cpu_usage", 0) / 100
            ram = state.get("ram_usage", 0) / 100
            queue = state.get("queue_length", 0)
            latency = state.get("avg_latency", 1.0)
            quality = state.get("quality_score", 0.5)
            
            score = 0.0
            
            # 1. Charge (CPU + RAM + Queue)
            load_score = (cpu * 0.3) + (ram * 0.2) + (queue * 0.1)
            score += load_score * 0.4
            
            # 2. Adéquation complexité/worker
            if name == "pi3":
                if complexity < 0.3:
                    score -= 0.5  # Parfait pour simple
                elif complexity < 0.5:
                    score += 0.0
                else:
                    score += 1.0  # Trop complexe
            elif name == "pi4":
                if 0.3 <= complexity <= 0.6:
                    score -= 0.5  # Parfait pour medium
                elif complexity < 0.3:
                    score += 0.3
                else:
                    score += 0.0
            elif name == "pi5":
                if complexity > 0.6:
                    score -= 0.5  # Parfait pour complexe
                elif complexity > 0.4:
                    score += 0.0
                else:
                    score += 0.5  # Overkill
            
            # 3. Urgence → privilégier les rapides
            if urgency > 0.5:
                if name == "pi5":
                    score -= 0.3
                elif name == "pi3":
                    score += 0.3
            
            # 4. Type de tâche
            if task_type == "code" and name == "pi5":
                score -= 0.2
            elif task_type == "chat" and name == "pi3":
                score -= 0.1
            
            # 5. Latence
            if latency > 5.0:
                score += 0.3
            elif latency > 10.0:
                score += 0.5
            
            scores[name] = score
        
        best_worker = min(scores, key=scores.get)
        
        self.history.append({
            "timestamp": datetime.now().isoformat(),
            "complexity": complexity,
            "urgency": urgency,
            "task_type": task_type,
            "selected": best_worker,
            "scores": scores
        })
        
        self.worker_usage[best_worker] += 1
        return best_worker

scheduler = Scheduler()

# ==========================================
# SESSION MANAGEMENT
# ==========================================
session_store = {}

# ==========================================
# APPEL AU WORKER (OLLAMA)
# ==========================================
async def call_worker(worker_name: str, message: str, history: list = None) -> Dict:
    """Envoie une requête à un worker Ollama"""
    worker_config = WORKERS[worker_name]
    worker_url = worker_config["url"]
    model = worker_config["model"]
    
    # Construire le prompt avec l'historique
    prompt = message
    if history:
        # Ajouter un contexte simple
        context = "\n".join([
            f"{'Utilisateur' if h['role'] == 'user' else 'Assistant'}: {h['content']}"
            for h in history[-4:]
        ])
        prompt = f"{context}\nUtilisateur: {message}\nAssistant:"
    
    start_time = time.time()
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{worker_url}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "num_predict": 256
                    }
                }
            )
            result = response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Worker {worker_name} error: {str(e)}")
    
    latency = time.time() - start_time
    
    # Mettre à jour les stats du worker
    state = workers_state[worker_name]
    state["requests_processed"] += 1
    state["total_latency"] += latency
    state["avg_latency"] = state["total_latency"] / state["requests_processed"]
    
    return {
        "response": result.get("response", "Pas de réponse"),
        "model": model,
        "latency": latency,
        "worker": worker_name,
        "total_duration": result.get("total_duration", 0),
        "eval_count": result.get("eval_count", 0)
    }

# ==========================================
# CHAT ENDPOINT
# ==========================================
@app.post("/chat")
async def chat(request: ChatRequest):
    """Endpoint principal pour envoyer un message"""
    
    # 1. Session
    session_id = request.session_id or str(uuid.uuid4())
    history = session_store.get(session_id, [])
    
    # 2. Analyser la tâche
    task_analysis = analyze_task(request.message)
    complexity = task_analysis["complexity"]
    urgency = task_analysis["urgency"]
    task_type = task_analysis["task_type"]
    
    # 3. Ajouter à la file d'attente
    scheduler.add_request({
        "message": request.message,
        "complexity": complexity,
        "urgency": urgency,
        "task_type": task_type,
        "timestamp": datetime.now().isoformat()
    })
    
    # 4. Sélectionner le worker
    selected_worker = scheduler.select_worker(complexity, urgency, task_type)
    
    print(f"🎯 Tâche: {task_type} | Complexité: {complexity:.2f} | Urgence: {urgency:.2f} → Worker: {selected_worker}")
    
    # 5. Appeler le worker
    try:
        result = await call_worker(selected_worker, request.message, history)
    except HTTPException:
        # Fallback: essayer un autre worker
        print(f"⚠️ Échec sur {selected_worker}, fallback...")
        for fallback in ["pi4", "pi5", "pi3"]:
            if fallback != selected_worker:
                try:
                    result = await call_worker(fallback, request.message, history)
                    selected_worker = fallback
                    break
                except:
                    continue
        else:
            raise HTTPException(status_code=503, detail="Tous les workers sont indisponibles")
    
    # 6. Mettre à jour l'historique
    history.append({"role": "user", "content": request.message})
    history.append({"role": "assistant", "content": result["response"]})
    session_store[session_id] = history[-50:]
    
    # 7. Réponse
    return {
        "response": result["response"],
        "session_id": session_id,
        "worker": selected_worker,
        "model": result["model"],
        "latency": result["latency"],
        "complexity": complexity,
        "urgency": urgency,
        "task_type": task_type,
        "worker_state": workers_state[selected_worker]
    }

# ==========================================
# WEBSOCKET UTILISATEURS
# ==========================================
@app.websocket("/ws")
async def websocket_user(websocket: WebSocket):
    """WebSocket pour les utilisateurs (chat en temps réel)"""
    await websocket.accept()
    session_id = str(uuid.uuid4())
    print(f"👤 Utilisateur connecté: {session_id}")
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("message", "")
            
            task_analysis = analyze_task(user_message)
            selected_worker = scheduler.select_worker(
                task_analysis["complexity"],
                task_analysis["urgency"],
                task_analysis["task_type"]
            )
            
            try:
                result = await call_worker(selected_worker, user_message)
                await websocket.send_text(json.dumps({
                    "response": result["response"],
                    "worker": selected_worker,
                    "model": result["model"],
                    "latency": result["latency"],
                    "complexity": task_analysis["complexity"],
                    "urgency": task_analysis["urgency"],
                    "task_type": task_analysis["task_type"]
                }))
            except Exception as e:
                await websocket.send_text(json.dumps({"error": str(e)}))
            
    except WebSocketDisconnect:
        print(f"👤 Utilisateur déconnecté: {session_id}")

# ==========================================
# STATUS ENDPOINTS
# ==========================================
@app.get("/status")
async def get_status():
    """Retourne l'état en temps réel de tous les workers"""
    return workers_state

@app.get("/scheduler/queue")
async def get_queue():
    """Affiche la file d'attente"""
    return {
        "queue_length": len(scheduler.request_queue),
        "queue": scheduler.request_queue[-10:]
    }

@app.get("/scheduler/history")
async def get_history():
    """Affiche l'historique des décisions"""
    return {
        "total_decisions": len(scheduler.history),
        "worker_usage": scheduler.worker_usage,
        "history": scheduler.history[-20:]
    }

@app.get("/scheduler/info")
async def scheduler_info():
    return {
        "scheduler_type": "Smart Scheduler with RL",
        "workers": list(workers_state.keys()),
        "models": {name: state["model"] for name, state in workers_state.items()}
    }

@app.get("/health")
async def health_check():
    """Vérifie que le gateway et les workers sont opérationnels"""
    results = {}
    for name, config in WORKERS.items():
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{config['url']}/api/tags")
                results[name] = {
                    "status": "healthy",
                    "model": config["model"],
                    "url": config["url"]
                }
        except Exception as e:
            results[name] = {
                "status": "unhealthy",
                "error": str(e),
                "url": config["url"]
            }
    return results

# ==========================================
# ROOT
# ==========================================
@app.get("/")
async def root():
    return {
        "message": "LLM Scheduler Gateway",
        "version": "0.2.0",
        "workers": list(WORKERS.keys()),
        "endpoints": {
            "/chat": "POST - Send a message",
            "/status": "GET - Worker status",
            "/scheduler/queue": "GET - Request queue",
            "/scheduler/history": "GET - Decision history",
            "/health": "GET - Health check",
            "/docs": "GET - API Documentation"
        }
    }

# ==========================================
# RUN
# ==========================================
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("🚀 SMART GATEWAY - CONNECTÉ AUX 3 WORKERS OLLAMA")
    print("=" * 60)
    print(f"📡 Pi3 (Qwen2.5): {WORKERS['pi3']['url']}")
    print(f"📡 Pi4 (Phi):     {WORKERS['pi4']['url']}")
    print(f"📡 Pi5 (Gemma3):  {WORKERS['pi5']['url']}")
    print("=" * 60)
    print("📊 HTTP API: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")