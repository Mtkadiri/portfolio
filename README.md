# Portfolio — React + Vite

## Lancer en local (Windows / VS Code)
Prérequis : Node.js 18+ (https://nodejs.org). Dans le terminal VS Code (Ctrl+ù) :
```
npm install
npm run dev
```
Ouvrez l'adresse affichée (http://localhost:5173). Aperçu de production : `npm run build` puis `npm run preview`.

## Personnaliser
Tout est dans **src/data.js** : nom, e-mail, GitHub, LinkedIn (un champ vide = élément masqué), textes, projets, compétences, parcours.
- **CV** : copiez votre PDF dans `public/cv.pdf` (le bouton s'active tout seul).
- **Images de projet** : mettez-les dans `public/img/`, puis `images: ['./img/mon-image.png']` dans le projet.
- **Nouveau projet** : copiez un objet de `projects`, changez `id`, `category` (une des `categories`) et les champs.
- **Niveau de compétence** : ajoutez `level: 1 | 2 | 3` à un item (sans `level`, aucun indicateur).
- **Résultats** : ne remplissez `results` qu'avec des mesures réelles. Statuts : `ok`, `wip`, `todo`, `?`.
- **Titre/SEO** : modifiez `index.html` (title, description). Favicon : `public/favicon.svg`.

## Contact
Le site utilise un lien `mailto:` (aucun backend). Pour un vrai formulaire, utilisez un service externe gratuit (Formspree, Web3Forms) : créez un compte, obtenez l'URL du formulaire, puis ajoutez-le ; tant que ce n'est pas configuré, ne l'affichez pas.

## Publier gratuitement
Le routage par `#` fonctionne partout sans configuration.
- **Vercel / Netlify** : poussez le dossier sur GitHub, importez le dépôt ; build `npm run build`, dossier `dist`.
- **GitHub Pages** : `npm run build`, puis publiez `dist` (ex. `npx gh-pages -d dist` après `npm i -D gh-pages`) et activez Pages sur la branche `gh-pages`.

## Trois projets techniques documentés (codes sources)
Les trois fiches du site pointent directement vers des **fichiers réels fournis pour ces projets**, consultables et téléchargeables depuis l'interface.

| Projet | Code publié | Particularités |
|---|---|---|
| Contrôle routier IoT | `public/code/controle-routier-iot/` | Émetteur ESP32 + ultrason + OCR/LoRa, récepteur LoRa/MQTT, source du serveur |
| ESP32 et LoRa RF96 | `public/code/capteurs-lorawan/` | Deux variantes du programme, dont une avec une API de prédiction et FreeRTOS |
| PFA : orchestration LLM | `public/code/orchestration-llm/` | Environnement RL, scheduler MQTT, worker Ollama et gateway FastAPI |

### Code et publication en sécurité
- Les **mots de passe Wi-Fi, identifiants de réseau et clés de session LoRaWAN** présents dans les sources d'origine ont été neutralisés ou remplacés par des valeurs indicatives dans les fichiers publiés. Ne pas publier les anciennes clés ailleurs ; les renouveler avant de réutiliser un déploiement.
- Les scripts sont issus des fichiers fournis ; cette publication **n'est pas une validation de leur compilation ou de leur fonctionnement sans configuration**. La partie serveur du contrôle routier a été fournie dans un fichier texte à syntaxe Python incomplète : elle est conservée comme référence, pas comme serveur prêt à exécuter.
- Pour le PFA, les sources référencent `models/ppo_scheduler_2cards.zip`, **non disponible ici**. L'ordonnanceur prévoit un repli heuristique lorsque ce fichier est absent.
- Les schémas SVG `public/img/architecture-*.svg` sont des **illustrations de l'architecture déduites des sources**, pas des photographies des montages.
- Les mesures de performance sont volontairement non renseignées tant qu'elles ne sont pas étayées par des relevés ou résultats reproductibles.

### Voir les fichiers
Par exemple : `https://github.com/Mtkadiri/portfolio/tree/main/public/code/orchestration-llm`. Les trois fiches du site affichent chaque fichier séparément.
