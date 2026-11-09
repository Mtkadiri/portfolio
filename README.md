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

## Projets publiés et confidentialité

Le portfolio présente trois projets, dont le PFA mené au laboratoire CCPS de l'ENSAM Casablanca.

| Projet | Publication des sources |
|---|---|
| Contrôle routier IoT | Codes disponibles dans `public/code/controle-routier-iot/` |
| ESP32 et LoRa RF96 | Codes disponibles dans `public/code/capteurs-lorawan/` |
| PFA — Orchestration des LLM avec PPO | **Code réservé au laboratoire CCPS** : pas de fichiers sources, de résultats détaillés ou de liens de téléchargement publics dans le portfolio |

**Important :** le code du PFA appartient au laboratoire. Le dépôt spécifique `Mtkadiri/PFA-LLM-Orchestration-PPO` doit être **privé** et réservé aux collaborateurs habilités. Les fichiers du PFA qui avaient été publiés dans ce portfolio ont été retirés de sa branche principale. Les anciens commits Git peuvent cependant continuer à contenir des copies ; leur suppression complète requiert une opération distincte de purge d'historique et la vérification des forks ou clones.

### Sécurité des autres projets

Les identifiants Wi-Fi ou LoRaWAN éventuellement présents dans les codes des autres projets ont été remplacés par des valeurs indicatives lors de leur publication. Vérifier leur validité et leur confidentialité avant tout déploiement.

## Parcours et certifications

- Formation ENSAM Casablanca 2024–présent, DEUG Faculté des Sciences d'Oujda 2021–2024, baccalauréat 2020–2021.
- Stages : OCP Group de juillet à août 2025 ; PFA CCPS du 15 juin au 30 septembre 2026.
- Certifications : Cisco Networking Academy — Python Essentials 1 (2026) ; SNEE UH2C (2025–2026) ; MATLAB Onramp, mentionné dans le CV (2026).

Les justificatifs de formation et les attestations nominatives ne sont pas publiés automatiquement.
