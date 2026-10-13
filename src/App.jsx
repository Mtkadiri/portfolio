import { useEffect, useState } from 'react'
import { profile, projects, categories, skills, timeline } from './data.js'

const NAV = [['apropos', 'À propos'], ['projets', 'Projets'], ['competences', 'Compétences'], ['parcours', 'Parcours'], ['contact', 'Contact']]
const STATUS = { ok: 'Implémenté', wip: 'En cours', todo: 'À développer', '?': 'À confirmer' }

function useHash() {
  const [h, setH] = useState(window.location.hash)
  useEffect(() => {
    const f = () => setH(window.location.hash)
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return h
}

// Défilement vers une section, y compris depuis une page de détail
function goTo(id) {
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  if (window.location.hash.startsWith('#/projet') || window.location.hash === '#/404') {
    window.location.hash = '#/'
    setTimeout(scroll, 60)
  } else scroll()
}

function useCv() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    if (!profile.cv) return
    fetch(profile.cv, { method: 'HEAD' })
      .then((r) => setOk(r.ok && (r.headers.get('content-type') || '').includes('pdf')))
      .catch(() => setOk(false))
  }, [])
  return ok
}

function Header() {
  const [open, setOpen] = useState(false)
  const click = (id) => { setOpen(false); goTo(id) }
  return (
    <header className="bar">
      <a className="brand" href="#/" aria-label="Accueil">{profile.name}</a>
      <button className="burger" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
        {open ? 'Fermer' : 'Menu'}
      </button>
      <nav id="menu" className={open ? 'open' : ''} aria-label="Navigation principale">
        {NAV.map(([id, l]) => <button key={id} onClick={() => click(id)}>{l}</button>)}
      </nav>
    </header>
  )
}

// Composition graphique : topologie capteurs -> passerelle -> broker -> agents
function Topology() {
  const N = [
    [60, 70, 'ESP32'], [60, 170, 'LoRa'], [60, 270, 'PLC'],
    [200, 120, 'GW'], [200, 220, 'MQTT'],
    [340, 70, 'RL'], [340, 170, 'LLM'], [340, 270, 'DB'],
  ]
  const L = [[0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [3, 5], [4, 6], [4, 7], [5, 6]]
  return (
    <svg className="topo" viewBox="0 0 400 340" role="img" aria-label="Schéma : capteurs, passerelle, broker MQTT et agents d'intelligence artificielle">
      {L.map(([a, b], i) => (
        <line key={i} x1={N[a][0]} y1={N[a][1]} x2={N[b][0]} y2={N[b][1]} className="wire" style={{ animationDelay: `${i * -0.7}s` }} />
      ))}
      {N.map(([x, y, t]) => (
        <g key={t} transform={`translate(${x - 30} ${y - 16})`}>
          <rect width="60" height="32" rx="3" className="node" />
          <text x="30" y="21" textAnchor="middle" className="nt">{t}</text>
        </g>
      ))}
      <text x="60" y="320" textAnchor="middle" className="cap">terrain</text>
      <text x="200" y="320" textAnchor="middle" className="cap">transport</text>
      <text x="340" y="320" textAnchor="middle" className="cap">décision</text>
    </svg>
  )
}

function Social({ cls = '' }) {
  const items = [['GitHub', profile.github], ['LinkedIn', profile.linkedin], ['E-mail', profile.email && `mailto:${profile.email}`]].filter((i) => i[1])
  if (!items.length) return <p className="muted small">Liens GitHub, LinkedIn et e-mail : à renseigner dans src/data.js.</p>
  return <ul className={`social ${cls}`}>{items.map(([l, u]) => <li key={l}><a href={u} target="_blank" rel="noopener noreferrer">{l}</a></li>)}</ul>
}

function Hero() {
  const cv = useCv()
  return (
    <section className="hero wrap" id="accueil">
      <div className="hero-text">
        <p className="mono">{profile.title}</p>
        <h1>{profile.name}</h1>
        <p className="lead">{profile.intro}</p>
        <div className="actions">
          <button className="btn primary" onClick={() => goTo('projets')}>Découvrir mes projets</button>
          {cv
            ? <a className="btn" href={profile.cv} download>Télécharger mon CV</a>
            : <span className="btn disabled" aria-disabled="true" title="Ajoutez public/cv.pdf pour activer ce bouton">CV bientôt disponible</span>}
        </div>
        <Social />
      </div>
      <Topology />
    </section>
  )
}

function Section({ id, title, children }) {
  return <section className="wrap section" id={id}><h2>{title}</h2>{children}</section>
}

function Flow({ steps }) {
  return <ol className="flow" aria-label="Flux de données">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
}

function Projects() {
  const [f, setF] = useState('Tous')
  const used = categories.filter((c) => projects.some((p) => p.category === c))
  const list = projects.filter((p) => f === 'Tous' || p.category === f)
  return (
    <Section id="projets" title="Projets">
      <div className="filters" role="group" aria-label="Filtrer par catégorie">
        {['Tous', ...used].map((c) => <button key={c} className={f === c ? 'on' : ''} aria-pressed={f === c} onClick={() => setF(c)}>{c}</button>)}
      </div>
      <div className="grid">
        {list.map((p) => (
          <a key={p.id} className="card" href={`#/projet/${p.id}`}>
            <span className="meta">{p.category} — {p.tag}</span>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            <ul className="chips">{p.stack.slice(0, 4).map((s) => <li key={s}>{s}</li>)}</ul>
          </a>
        ))}
      </div>
    </Section>
  )
}

function ProjectPage({ p }) {
  useEffect(() => window.scrollTo(0, 0), [p.id])
  const L = [['Code source (GitHub)', p.links.github], ['Démonstration', p.links.demo]].filter((l) => l[1])
  return (
    <main className="wrap detail">
      <a href="#/" className="back">Retour aux projets</a>
      <p className="mono">{p.category} — {p.tag}</p>
      <h1>{p.title}</h1>
      <p className="lead">{p.summary}</p>
      <h2>Problème</h2><p>{p.problem}</p>
      <h2>Objectifs</h2><ul className="bul">{p.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
      <h2>Architecture</h2>
      <Flow steps={p.flow} />
      {p.state && <p className="muted">{p.state}</p>}
      <h2>Technologies</h2><ul className="chips">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
      <h2>Ma contribution</h2><p>{p.contribution}</p>
      <h2>État des fonctionnalités</h2>
      <ul className="feat">{p.features.map((x) => <li key={x.label}><span className={`st ${x.status === '?' ? 'q' : x.status}`}>{STATUS[x.status]}</span>{x.label}</li>)}</ul>
      <h2>Résultats</h2>
      {p.results.length ? <ul className="bul">{p.results.map((r) => <li key={r}>{r}</li>)}</ul> : <p className="muted">Aucun résultat mesuré n'est publié pour l'instant.</p>}
      {p.images.length > 0 && <div className="shots">{p.images.map((src) => <img key={src} src={src} alt={`Capture du projet ${p.title}`} loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />)}</div>}
      <h2>Liens</h2>
      {L.length ? <ul className="social">{L.map(([l, u]) => <li key={l}><a href={u} target="_blank" rel="noopener noreferrer">{l}</a></li>)}</ul> : <p className="muted">Dépôt et démonstration : pas encore publiés.</p>}
    </main>
  )
}

function Skills() {
  return (
    <Section id="competences" title="Compétences">
      <div className="skills">
        {skills.map((g) => (
          <div key={g.cat} className="sk">
            <h3>{g.cat}</h3>
            <ul>{g.items.map((i) => (
              <li key={i.n}>{i.n}{i.level && <span className="dots" role="img" aria-label={`Niveau ${i.level} sur 3`}>{[1, 2, 3].map((d) => <i key={d} className={d <= i.level ? 'f' : ''} />)}</span>}</li>
            ))}</ul>
          </div>
        ))}
      </div>
      <p className="muted small">Langues : {profile.languages.join(', ')}.</p>
    </Section>
  )
}

function Parcours() {
  return (
    <Section id="parcours" title="Formation et expérience">
      <ol className="tl">
        {timeline.map((t, i) => (
          <li key={i} className={t.text ? '' : 'empty'}>
            <span className="meta">{t.kind}{t.period && ` — ${t.period}`}</span>
            <h3>{t.title}</h3>{t.text && <p>{t.text}</p>}
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p className="lead">Un stage PFE, une question technique ou un projet : écrivez-moi.</p>
      {profile.email
        ? <a className="btn primary" href={`mailto:${profile.email}`}>M'envoyer un e-mail</a>
        : <p className="muted">Adresse e-mail à renseigner dans src/data.js.</p>}
      <Social cls="mt" />
    </Section>
  )
}

function NotFound() {
  return <main className="wrap detail"><h1>Page introuvable</h1><p className="lead">Cette adresse ne correspond à aucune page.</p><a className="btn primary" href="#/">Retour à l'accueil</a></main>
}

export default function App() {
  const h = useHash()
  const m = h.match(/^#\/projet\/(.+)$/)
  const home = h === '' || h === '#' || h === '#/'
  const proj = m && projects.find((p) => p.id === m[1])
  return (
    <>
      <a className="skip" href="#contenu">Aller au contenu</a>
      <Header />
      <div id="contenu">
        {home ? <main><Hero /><About /><Projects /><Skills /><Parcours /><Contact /></main> : proj ? <ProjectPage p={proj} /> : <NotFound />}
      </div>
      <footer className="wrap foot">© {new Date().getFullYear()} {profile.name}</footer>
    </>
  )
}

function About() {
  return <Section id="apropos" title="À propos">{profile.about.map((t) => <p key={t} className="prose">{t}</p>)}</Section>
}
