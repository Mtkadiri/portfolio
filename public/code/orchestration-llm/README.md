# PFA — orchestration intelligente et distribuée de LLM

Projet PFA réalisé dans le contexte de l'ENSAM Casablanca / CCPS.

## Modules disponibles
- `rl_environment.py` : environnement Gymnasium et fonction de récompense pour la sélection des workers.
- `scheduler_mqtt.py` : réception des tâches et métriques, décision PPO ou heuristique, distribution par MQTT.
- `worker_mqtt.py` : abonné MQTT, requêtes Ollama, réponse, état du worker.
- `gateway.py` : variante de passerelle HTTP / WebSocket en FastAPI.

## Architecture testée / configuration
La voie MQTT du scheduler utilise `pi3` et `pi5`. La configuration du fichier `gateway.py` comporte en parallèle trois profils `pi3`, `pi4` et `pi5` : ces deux chemins ne doivent pas être confondus.

Le scheduler tente de charger `models/ppo_scheduler_2cards.zip`. **Ce modèle de poids n'est pas fourni** dans la sélection de fichiers accessible ici ; dans son absence, le code prévoit un repli heuristique.

## Dépendances
Les scripts utilisent selon le module : Python, paho-mqtt, numpy, stable-baselines3, gymnasium, requests, fastapi, httpx, pydantic et un service Ollama configuré séparément.

Les métriques simulées / récompenses d'environnement ne prouvent pas, à elles seules, la performance sur un déploiement réel. Les chiffres de résultats ne sont pas ajoutés sans protocole de validation.
