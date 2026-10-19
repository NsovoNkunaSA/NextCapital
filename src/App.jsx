import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Markets from "./pages/Markets";
import OnlineClasses from "./pages/OnlineClasses";
import BusinessOpportunities from "./pages/BusinessOpportunities";
import Investments from "./pages/Investments";

const platforms = [
  {
    path: "/markets",
    number: "01",
    title: "Markets",
    id: "markets",
    eyebrow: "UNDERSTAND THE MOVEMENT",
    description: "Follow currency pairs, compare recent price ranges and explore what changes over time.",
    details: ["Currency pair comparison", "Adjustable time ranges", "Market data summaries"],
    action: "Open Markets",
  },
  {
    path: "/online-classes",
    number: "02",
    title: "Learn",
    id: "learn",
    eyebrow: "BUILD PRACTICAL SKILLS",
    description: "Learn at your own pace with short lessons on money, business and investing basics.",
    details: ["Searchable lessons", "Filter by topic", "Track completed classes"],
    action: "Browse classes",
  },
  {
    path: "/business-opportunities",
    number: "03",
    title: "Business Growth",
    id: "business",
    eyebrow: "TOOLS FOR LOCAL BUSINESS",
    description: "How might digital tools help young founders and township or rural businesses start, trade, get paid, manage cash flow and reach formal markets?",
    details: ["Business registration", "Digital payments", "Bookkeeping", "Procurement access", "Market links", "Funding readiness and fraud protection"],
    action: "Build a readiness plan",
  },
  {
    path: "/investments",
    number: "04",
    title: "Investments",
    id: "invest",
    eyebrow: "PLAN FOR THE LONG TERM",
    description: "See how a starting amount, regular contributions and time can shape an investment projection.",
    details: ["Set a starting amount", "Adjust monthly contributions", "Compare estimated growth"],
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
          <p className="hero-intro">
            Clear tools for understanding markets, building money skills, growing a business
            and planning for the future.
          </p>
          <a className="primary-link" href="#platforms">Explore the sections <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-note">
          <span className="note-kicker">A better financial starting point</span>
          <p>Learn at your pace. Make informed choices. Keep your goals in view.</p>
          <span className="note-rule" aria-hidden="true" />
          <span className="note-caption">Built for the long game</span>
        </div>
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
          {platforms.map((platform) => (
            <section className={`platform-section-row section-${platform.id}`} id={platform.id} key={platform.path}>
              <div className="platform-section-main">
                <span className="card-number">{platform.number}</span>
                <p className="eyebrow">{platform.eyebrow}</p>
                <h3>{platform.title}</h3>
                <p className="platform-description">{platform.description}</p>
                <Link className="section-action" to={platform.path}>{platform.action} <span aria-hidden="true">↗</span></Link>
              </div>
              <ul className="platform-details">
                {platform.details.map((detail) => <li key={detail}>{detail}</li>)}
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
