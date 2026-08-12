import { useState } from 'react'
import InteractiveEffort from './InteractiveEffort'
import VideoLibrary from './VideoLibrary'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const citation = `@article{zhao2026nestdex,
  title   = {NestDex: Nested Policy Learning with Copilot Assisted
             Teleoperation for Dexterous Manipulation},
  author  = {Zhao, James and Tang, Jinhe and Ba, Brian and Zhi, Weiming},
  year    = {2026},
  note    = {Preprint. Project website: https://aus.bot/research/nestdex}
}`

const paperAbstract = `Dexterous manipulation promises substantially richer robot interaction with the physical world, but learning these behaviours remains constrained by the difficulty of collecting consistent, complete-task demonstrations. Unlike parallel-jaw manipulation, dexterous tasks require the operator to coordinate arm motion with precise, contact-rich finger behaviour throughout the task. We introduce NestDex, a nested policy-learning framework that reduces this burden by using learned hand skills to assist demonstration collection. The operator controls the arm and regulates the active hand skill through a single-DoF clutch, rather than directly specifying the full finger trajectory. The inner hand policy adapts its motion from the latest proprioceptive history, while a vision-language selector activates the appropriate skill for each task stage. The resulting demonstrations train a separate outer visuomotor policy that controls both the arm and hand without the inner policies at deployment. A hand-action variational autoencoder provides compact hand-action targets while retaining arm commands in joint space. Across real-world dexterous manipulation experiments, NestDex improves demonstration reliability and efficiency, and the resulting empirical evaluations support effective autonomous policy learning.`

function App() {
  const [copied, setCopied] = useState(false)

  const copyCitation = async () => {
    await navigator.clipboard.writeText(citation)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <main>
      <nav className="site-nav" aria-label="Project navigation">
        <a className="nav-origin" href="https://aus.bot/research/">
          <span>PAIR Lab</span><span aria-hidden="true">/</span><span>Research</span>
        </a>
        <div className="nav-links">
          <a href="#method">Method</a>
          <a href="#execution">Execution</a>
          <a href="#videos">Videos</a>
          <a href="#paper">Paper</a>
        </div>
      </nav>

      <header className="hero page-shell">
        <p className="eyebrow">Nested dexterous policies</p>
        <h1><span>NestDex:</span> Nested Policy Learning with Copilot Assisted Teleoperation for Dexterous Manipulation</h1>

        <div className="author-block">
          <p className="authors">
            <span>James Zhao<sup>1,†</sup></span>
            <span>Jinhe Tang<sup>1,†</sup></span>
            <span>Brian Ba<sup>1</sup></span>
            <span>Weiming Zhi<sup>1,2,3,*</sup></span>
          </p>
          <div className="affiliations">
            <p><sup>1</sup> School of Computer Science and <sup>2</sup> Australian Centre for Robotics, The University of Sydney, Australia</p>
            <p><sup>3</sup> College of Connected Computing, Vanderbilt University, TN, USA</p>
          </div>
          <p className="author-notes"><sup>†</sup> Equal contribution · <sup>*</sup> Corresponding author: <a href="mailto:Weiming.Zhi@sydney.edu.au">Weiming.Zhi@sydney.edu.au</a></p>
        </div>

        <div className="hero-actions" aria-label="Project links">
          <a className="primary-action" href={asset('paper.pdf')} target="_blank" rel="noreferrer">Paper <span aria-hidden="true">↗</span></a>
          <a href="#videos">Videos <span aria-hidden="true">↓</span></a>
          <a href="#citation">BibTeX <span aria-hidden="true">↓</span></a>
        </div>
      </header>

      <figure className="hero-media hero-video-shell">
        <video autoPlay muted loop playsInline poster={asset('media/hero-poster.webp')}>
          <source src={asset('media/hero.mp4')} type="video/mp4" />
        </video>
        <figcaption><span>From assisted collection to autonomous manipulation</span><span>Inner hand skills · outer visuomotor policy</span></figcaption>
      </figure>

      <section className="abstract-section page-shell" aria-labelledby="abstract-title">
        <h2 id="abstract-title">Abstract</h2>
        <p>{paperAbstract}</p>
      </section>

      <section className="method section-band" id="method" aria-labelledby="method-title">
        <div className="page-shell section-intro split-heading">
          <h2 id="method-title">Assistance during collection. Independence at deployment.</h2>
          <p>NestDex nests learned hand skills inside teleoperation so the operator can focus on task-level arm motion. Those skills create the demonstrations; a separate outer policy learns the complete task.</p>
        </div>

        <figure className="method-figure method-media">
          <img src={asset('media/method.webp')} width="1386" height="586" alt="NestDex pipeline showing inner hand policy learning, copilot-assisted teleoperation and complete-task demonstration collection" />
          <figcaption>Retargeted hand-skill demonstrations train a reusable library of proprioceptive inner policies. A vision-language selector and reversible clutch bring the appropriate skill into each stage of complete-task teleoperation.</figcaption>
        </figure>

        <div className="method-steps page-shell">
          <article><span>01</span><h3>Learn hand skills</h3><p>Multi-view hand tracking and retargeting provide compact demonstrations for contact-rich, proprioception-only inner policies.</p></article>
          <article><span>02</span><h3>Collect with a copilot</h3><p>The operator moves the arm and regulates skill progress with a one-DoF clutch. The active inner policy adapts from the latest hand-state history.</p></article>
          <article><span>03</span><h3>Deploy independently</h3><p>Complete demonstrations train a separate visuomotor outer policy. Neither the selector nor the inner skills are required at deployment.</p></article>
        </div>

        <div className="latent-grid page-shell">
          <figure>
            <img src={asset('media/hvae.webp')} width="1600" height="1219" alt="Hand variational autoencoder and outer policy training diagram" />
          </figure>
          <div>
            <p className="eyebrow">Compact dexterous actions</p>
            <h3>Twenty hand joints become ten latent action dimensions.</h3>
            <p>The H-VAE compresses coordinated hand commands while leaving arm commands in joint space. This gives the outer policy a more tractable target without discarding complete hand motion.</p>
          </div>
        </div>
      </section>

      <section className="behaviour section-band" aria-labelledby="behaviour-title">
        <div className="page-shell section-intro split-heading">
          <h2 id="behaviour-title">Contact changes the hand. The policy changes with it.</h2>
          <p>The same grasp policy receives joint positions and efforts, but no object image or identity. Different contact constraints produce different coordinated hand configurations.</p>
        </div>
        <div className="behaviour-grid page-shell">
          <figure className="evidence-card adaptation-card">
            <img src={asset('media/contact-adaptation.webp')} width="1084" height="589" alt="One grasp policy producing different hand configurations around four objects" />
            <figcaption><span>One policy, four learned contact conditions</span><p>Green scallion toy, water bottle, radish toy and paper cup.</p></figcaption>
          </figure>
          <figure className="evidence-card jerk-card">
            <img src={asset('media/jerk-ablation.webp')} width="1512" height="559" alt="Temporal ensembling ablation showing lower executed-command and pre-limit jerk" />
            <figcaption><span>Closed-loop prediction, smoothed online</span><p>Without ensembling, median executed-command P95 jerk is 2.30× that of temporal ensembling at the primary filter window.</p></figcaption>
          </figure>
        </div>
        <figure className="switch-figure page-shell">
          <img src={asset('media/policy-switching.webp')} width="1800" height="427" alt="Automatic selection and execution of a button-press hand skill during toast preparation" />
          <figcaption><strong>Automatic skill switching.</strong> The wrist-camera view selects Button Press, the hand moves to the skill's initial posture, and clutch input regulates execution.</figcaption>
        </figure>
      </section>

      <section className="execution page-shell" id="execution" aria-labelledby="execution-title">
        <div className="section-intro split-heading">
          <h2 id="execution-title">Open the paper figures. Inspect every trial.</h2>
          <p>Figures 9 and 10 share the same 30 physical bottle-grasp trials. The interactive versions preserve the paper’s conditions, closure alignment and default analysis window while exposing the individual traces behind each summary.</p>
        </div>
        <InteractiveEffort />
      </section>

      <section className="videos page-shell" id="videos" aria-labelledby="videos-title">
        <div className="section-intro split-heading">
          <h2 id="videos-title">Task demos, grouped for comparison.</h2>
          <p>Switch between five physical tasks and multiple recorded groups. Short autonomous rollouts and complete copilot-assisted demonstrations are shown side by side where the recordings support it.</p>
        </div>
        <VideoLibrary />
      </section>

      <section className="paper page-shell" id="paper" aria-labelledby="paper-title">
        <div className="section-intro">
          <p className="eyebrow">Preprint · 2026</p>
          <h2 id="paper-title">Paper and citation</h2>
        </div>
        <div className="paper-grid">
          <div>
            <p className="paper-abstract">Read the full paper for the nested-policy formulation, teleoperation interface, six-task evaluation, action representation study and online-execution ablations.</p>
            <div className="paper-links">
              <a className="text-link" href={asset('paper.pdf')} target="_blank" rel="noreferrer">Read the paper <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="https://aus.bot/research/" target="_blank" rel="noreferrer">PAIR Lab research <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="bibtex-wrap" id="citation">
            <button type="button" onClick={copyCitation}>{copied ? 'Copied' : 'Copy BibTeX'}</button>
            <pre><code>{citation}</code></pre>
          </div>
        </div>
      </section>

      <footer className="site-footer page-shell">
        <p><strong>NestDex</strong><br />PAIR Lab · The University of Sydney</p>
        <div><a href={asset('paper.pdf')}>Paper</a><a href="https://aus.bot/research/">PAIR research</a><a href="mailto:weiming.zhi@sydney.edu.au">Contact</a></div>
      </footer>
    </main>
  )
}

export default App
