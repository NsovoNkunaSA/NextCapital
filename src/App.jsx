import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import BusinessOpportunities from "./pages/BusinessOpportunities";
import Investments from "./pages/Investments";
import Markets from "./pages/Markets";
import OnlineClasses from "./pages/OnlineClasses";

const sections = [
  {
    path: "/markets",
    number: "01",
    eyebrow: "UNDERSTAND THE MOVEMENT",
    title: "Markets",
    description: "Follow currency pairs, compare recent price ranges and explore what changes over time.",
    features: ["Currency pair comparison", "Adjustable time ranges", "Market data summaries"],
    action: "Explore markets",
  },
  {
    path: "/online-classes",
    number: "02",
    eyebrow: "BUILD PRACTICAL SKILLS",
    title: "Learn",
    description: "Learn at your own pace with short lessons on money, business and investing basics.",
    features: ["Searchable lessons", "Topic filters", "Completion tracking"],
    action: "Browse classes",
  },
  {
    path: "/business-opportunities",
    number: "03",
    eyebrow: "TOOLS FOR LOCAL BUSINESS",
    title: "Business Growth",
    description: "Cash-flow tracking, a practical readiness checklist and next-step recommendations for young founders and township or rural businesses.",
    features: ["Sales, expenses and stock costs", "Business readiness checklist", "Personalised action plan"],
    action: "Open business tools",
  },
  {
    path: "/investments",
    number: "04",
    eyebrow: "PLAN FOR THE LONG TERM",
    title: "Investments",
    description: "See how a starting amount, regular contributions and time can shape a hypothetical investment projection.",
    features: ["Adjustable starting amount", "Monthly contributions", "Estimated growth"],
    action: "Try the calculator",
  },
];

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="NextCapital home">
        <span className="brand-mark" aria-hidden="true">N</span>
        <span>NextCapital</span>
      </Link>
      <span className="header-note">Financial knowledge. Opportunities. Growth.</span>
    </header>
  );
}

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">FINANCIAL TOOLS FOR REAL LIFE</p>
          <h1>Make your next move <em>count.</em></h1>
          <p className="hero-intro">Clear tools for understanding markets, building money skills, growing a business and planning for the future.</p>
          <a className="primary-link" href="#platforms">Explore the sections <span aria-hidden="true">↓</span></a>
        </div>
        <aside className="hero-note">
          <span className="note-kicker">A better financial starting point</span>
          <p>Learn at your pace. Make informed choices. Keep your goals in view.</p>
          <span className="note-rule" aria-hidden="true" />
          <span className="note-caption">Built for the long game</span>
        </aside>
      </section>

      <section className="platform-section" id="platforms" aria-labelledby="platform-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR NEXT STEP</p>
            <h2 id="platform-title">Explore the platform</h2>
          </div>
          <p>Tools and guidance for the choices you are working through.</p>
        </div>
        <div className="platform-sections">
          {sections.map((section) => (
            <section className={`platform-section-row section-${section.number}`} key={section.path}>
              <div className="platform-section-main">
                <span className="card-number">{section.number}</span>
                <p className="eyebrow">{section.eyebrow}</p>
                <h3>{section.title}</h3>
                <p className="platform-description">{section.description}</p>
                <Link className="section-action" to={section.path}>{section.action} <span aria-hidden="true">↗</span></Link>
              </div>
              <ul className="platform-details">
                {section.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <section className="home-footer-note">
        <p>Small, consistent steps can build lasting confidence.</p>
        <span>NextCapital · Financial knowledge. Opportunities. Growth.</span>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="site-shell">
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/online-classes" element={<OnlineClasses />} />
          <Route path="/business-opportunities" element={<BusinessOpportunities />} />
          <Route path="/investments" element={<Investments />} />
        </Routes>
        <footer className="site-footer">
          <span>NextCapital</span>
          <span>Make informed choices. Grow with intention.</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}