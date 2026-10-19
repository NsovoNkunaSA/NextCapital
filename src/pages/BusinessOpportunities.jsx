import { useState } from "react";

const focusAreas = [
  { id: "registration", title: "Business registration", category: "Set up", description: "Understand the steps and documents needed to formalise your business." },
  { id: "payments", title: "Digital payments", category: "Run the business", description: "Choose ways to accept payments and keep a clear record of fees and settlements." },
  { id: "bookkeeping", title: "Bookkeeping", category: "Run the business", description: "Record sales and expenses so you can see cash flow and prepare for tax or funding." },
  { id: "procurement", title: "Procurement access", category: "Find opportunities", description: "Prepare supplier information and discover opportunities to sell to larger buyers." },
  { id: "markets", title: "Market links", category: "Find opportunities", description: "Reach customers through digital listings, catalogues and local delivery channels." },
  { id: "funding", title: "Funding readiness and fraud protection", category: "Protect and grow", description: "Keep useful records for finance applications and verify requests before sending money or documents." },
];

export default function BusinessOpportunities() {
  const [readyItems, setReadyItems] = useState([]);
  const readyCount = readyItems.length;

  function toggleReady(itemId) {
    setReadyItems((current) => current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId]);
  }

  return (
    <main className="page-shell business-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">LOCAL BUSINESS, BIG POTENTIAL</p>
          <h1>Business growth</h1>
          <p>Build a practical digital-readiness plan around the needs of your business.</p>
        </div>
      </section>

      <section className="business-prompt">
        <p className="eyebrow eyebrow-clay">THE CHALLENGE</p>
        <h2>How might digital tools help young founders and township or rural businesses start, trade, get paid, manage cash flow and reach formal markets?</h2>
      </section>

      <section className="readiness-section" aria-labelledby="readiness-title">
        <div className="readiness-heading">
          <div>
            <p className="eyebrow">YOUR BUSINESS CHECKLIST</p>
            <h2 id="readiness-title">Choose your next steps</h2>
            <p>Mark the areas you already have in place. Your progress updates as you go.</p>
          </div>
          <div className="readiness-count" aria-live="polite"><strong>{readyCount}<span> / {focusAreas.length}</span></strong><small>areas in place</small></div>
        </div>
        <progress className="readiness-progress" value={readyCount} max={focusAreas.length} aria-label={`${readyCount} of ${focusAreas.length} focus areas in place`} />
        <div className="readiness-grid">
          {focusAreas.map((area) => {
            const checked = readyItems.includes(area.id);
            return (
              <article className={`readiness-item ${checked ? "is-ready" : ""}`} key={area.id}>
                <div className="readiness-item-heading"><span>{area.category}</span><label className="ready-control"><input type="checkbox" checked={checked} onChange={() => toggleReady(area.id)} /><span>{checked ? "In place" : "Mark in place"}</span></label></div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}