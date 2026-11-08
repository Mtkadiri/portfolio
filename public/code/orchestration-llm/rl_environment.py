# rl_environment.py
import gymnasium as gym
from gymnasium import spaces
import numpy as np
import random
import math


class LLMSchedulerEnv(gym.Env):
    """
    Environnement RL qui simule le cluster LLM (Pi3, Pi5).
    
    Observation (11 dimensions) :
    - Pi3 : CPU, RAM, Temp, Queue (4)
    - Pi5 : CPU, RAM, Temp, Queue (4)
    - Tâche : complexité, urgence, type (3)
    = 11 dimensions
    
    Actions (2) :
    - 0 : Pi3 (Qwen2.5 0.5B)
    - 1 : Pi5 (Gemma3 4B)
    
    Récompense :
    - Basée sur latence, qualité, équilibrage, adéquation
    """
    
    def __init__(self, max_steps=100):
        super().__init__()
        
        # Observation : 11 dimensions
        self.observation_space = spaces.Box(
            low=0.0, high=1.0, shape=(11,), dtype=np.float32
        )
        
        # Action : 2 workers
        self.action_space = spaces.Discrete(2)
        
        self.max_steps = max_steps
        self.step_count = 0
        
        # Caractéristiques des workers (simulation réaliste)
        self.workers = {
            0: {  # Pi3 - Qwen2.5 0.5B
                "name": "pi3",
                "speed": 0.9,           # Rapide (petit modèle)
                "quality": 0.5,         # Qualité moyenne
                "max_complexity": 0.4,  # Bon pour tâches simples
                "base_latency": 1.5
            },
            1: {  # Pi5 - Gemma3 4B
                "name": "pi5",
                "speed": 0.5,           # Plus lent
                "quality": 1.0,         # Excellente qualité
                "max_complexity": 1.0,  # Bon pour tout
                "base_latency": 5.0
            }
        }
        
        # Historique pour l'apprentissage
        self.worker_history = {0: [], 1: []}
        self.latency_history = {0: [], 1: []}
        
        self.reset()
    
    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.step_count = 0
        
        # État initial des workers
        self.worker_states = {
            0: {"cpu": 0.2, "ram": 0.3, "queue": 0.0, "temp": 0.4},
            1: {"cpu": 0.2, "ram": 0.3, "queue": 0.0, "temp": 0.4}
        }
        
        # Nouvelle tâche
        self.current_task = self._generate_task()
        
        return self._get_observation(), {}
    
    def _generate_task(self):
        """Génère une tâche aléatoire"""
        complexity = random.uniform(0.0, 1.0)
        urgency = random.uniform(0.0, 1.0)
        
        # Type de tâche
        task_types = ["chat", "code", "analysis"]
        task_type = random.choices(task_types, weights=[0.5, 0.3, 0.2])[0]
        
        return {
            "complexity": complexity,
            "urgency": urgency,
            "task_type": task_type,
            "length": random.randint(20, 300)
        }
    
    def _get_observation(self):
        """Construit l'observation (11 dimensions)"""
        obs = []
        
        # État des 2 workers (2 × 4 = 8 dimensions)
        for i in range(2):
            state = self.worker_states[i]
            obs.extend([
                state["cpu"],
                state["ram"],
                state["queue"],
                state["temp"]
            ])
        
        # Caractéristiques de la tâche (3 dimensions)
        obs.append(self.current_task["complexity"])
        obs.append(self.current_task["urgency"])
        
        # Type de tâche encodé
        task_type_encoding = {
            "chat": 0.0,
            "code": 0.5,
            "analysis": 1.0
        }
        obs.append(task_type_encoding.get(self.current_task["task_type"], 0.0))
        
        return np.array(obs, dtype=np.float32)
    
    def _calculate_latency(self, worker_id, task):
        """Calcule la latence simulée"""
        worker = self.workers[worker_id]
        state = self.worker_states[worker_id]
        
        # Latence de base
        base = worker["base_latency"]
        
        # Facteur de complexité
        complexity_factor = 1.0 + task["complexity"] * 2.0
        
        # Facteur de charge
        load_factor = 1.0 + state["cpu"] * 1.5 + state["queue"] * 2.0
        
        # Facteur de température
        temp_factor = 1.0 + max(0, state["temp"] - 0.7) * 2.0
        
        # Latence finale
        latency = base * complexity_factor * load_factor * temp_factor
        
        # Variation aléatoire
        latency *= random.uniform(0.85, 1.15)
        
        return latency
    
    def _calculate_quality(self, worker_id, task):
        """Calcule la qualité de la réponse"""
        worker = self.workers[worker_id]
        quality = worker["quality"]
        
        # Pénalité si le worker est inadapté
        if task["complexity"] > worker["max_complexity"]:
            quality *= 0.5  # Mauvaise qualité car tâche trop complexe
        
        # Bonus si bien adapté
        if task["complexity"] <= worker["max_complexity"] * 0.8:
            quality *= 1.1
        
        return min(quality, 1.0)
    
    def step(self, action):
        self.step_count += 1
        worker_id = int(action)
        task = self.current_task
        state = self.worker_states[worker_id]
        
        # ==========================================
        # 1. SIMULER L'EXÉCUTION
        # ==========================================
        latency = self._calculate_latency(worker_id, task)
        quality = self._calculate_quality(worker_id, task)
        
        # ==========================================
        # 2. METTRE À JOUR L'ÉTAT DU WORKER
        # ==========================================
        state["cpu"] = min(1.0, state["cpu"] + 0.3 + task["complexity"] * 0.3)
        state["ram"] = min(1.0, state["ram"] + 0.2 + task["complexity"] * 0.2)
        state["temp"] = min(1.0, state["temp"] + 0.05 + task["complexity"] * 0.1)
        state["queue"] = min(1.0, state["queue"] + 0.1)
        
        # Refroidissement de l'autre worker
        other = 1 - worker_id
        self.worker_states[other]["cpu"] = max(0.0, self.worker_states[other]["cpu"] - 0.05)
        self.worker_states[other]["temp"] = max(0.2, self.worker_states[other]["temp"] - 0.02)
        self.worker_states[other]["queue"] = max(0.0, self.worker_states[other]["queue"] - 0.05)
        
        # Sauvegarder dans l'historique
        self.latency_history[worker_id].append(latency)
        self.worker_history[worker_id].append(self.step_count)
        
        # ==========================================
        # 3. CALCULER LA RÉCOMPENSE
        # ==========================================
        reward = self._calculate_reward(worker_id, task, latency, quality)
        
        # ==========================================
        # 4. NOUVELLE TÂCHE
        # ==========================================
        self.current_task = self._generate_task()
        
        # ==========================================
        # 5. OBSERVATION ET FIN
        # ==========================================
        obs = self._get_observation()
        done = self.step_count >= self.max_steps
        
        info = {
            "worker": self.workers[worker_id]["name"],
            "latency": latency,
            "quality": quality,
            "complexity": task["complexity"],
            "urgency": task["urgency"],
            "task_type": task["task_type"]
        }
        
        return obs, reward, done, False, info
    
    def _calculate_reward(self, worker_id, task, latency, quality):
        """Calcule la récompense"""
        reward = 0.0
        
        # 1. Latence (pénalité augmentée)
        reward -= latency * 0.15
        
        # 2. Qualité (récompense réduite)
        reward += quality * 5.0
        
        # 3. Adéquation complexité/worker (renforcée)
        worker = self.workers[worker_id]
        if task["complexity"] <= worker["max_complexity"]:
            reward += 2.0  # Bonne adéquation
        else:
            reward -= 3.0  # Mauvaise adéquation
        
        # 4. Urgence → privilégier Pi5
        if task["urgency"] > 0.7:
            if worker_id == 1:  # Pi5
                reward += 0.5
            else:  # Pi3
                reward -= 0.5
        
        # 5. État du système
        state = self.worker_states[worker_id]
        if state["cpu"] > 0.9:
            reward -= 0.5
        if state["temp"] > 0.85:
            reward -= 1.0
        if state["queue"] > 0.7:
            reward -= 0.3
        
        # 6. Équilibrage (renforcé)
        total_usage = sum(len(h) for h in self.worker_history.values())
        if total_usage > 10:
            usage_rates = [len(h) / total_usage for h in self.worker_history.values()]
            # Entropie (équilibre)
            entropy = -sum(r * math.log(r + 1e-6) for r in usage_rates)
            entropy_normalized = entropy / math.log(2)  # ln(2) pour 2 workers
            reward += entropy_normalized * 2.0
        
        # 7. Type de tâche
        if task["task_type"] == "code" and worker_id == 1:  # Pi5
            reward += 0.3
        elif task["task_type"] == "chat" and worker_id == 0:  # Pi3
            reward += 0.2
        
        # 8. Pénalité overkill (Pi5 pour tâche simple)
        if worker_id == 1 and task["complexity"] < 0.3:
            reward -= 3.0
        
        # 9. Bonus Pi3 pour tâche simple
        if worker_id == 0 and task["complexity"] < 0.3:
            reward += 2.0
        
        # 10. Pénalité Pi3 pour tâche complexe
        if worker_id == 0 and task["complexity"] > 0.6:
            reward -= 3.0
        
        # 11. Bonus Pi5 pour tâche complexe
        if worker_id == 1 and task["complexity"] > 0.6:
            reward += 2.0
        
        return reward