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
