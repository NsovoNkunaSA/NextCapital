import { useState } from "react";

export default function Investments() {
  const [startingAmount, setStartingAmount] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [annualReturn, setAnnualReturn] = useState(6);
  const [years, setYears] = useState(10);
  const months = years * 12;
  const monthlyRate = annualReturn / 100 / 12;
  const projectedValue = monthlyRate === 0
    ? startingAmount + monthlyContribution * months
    : startingAmount * (1 + monthlyRate) ** months
      + monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);
  const amountInvested = startingAmount + monthlyContribution * months;
  const formatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  });

  return (
    <main className="page-shell investment-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">A LONG-TERM VIEW</p>
          <h1>Investment planner</h1>
          <p>Explore how regular contributions and time could affect a hypothetical investment.</p>
        </div>
      </section>

      <div className="investment-layout">
        <section className="investment-controls panel" aria-labelledby="investment-controls-title">
          <p className="eyebrow">ADJUST YOUR ASSUMPTIONS</p>
          <h2 id="investment-controls-title">Your plan</h2>
          <label className="investment-field">
            <span className="field-label">Starting amount</span>
            <span className="input-with-prefix"><span>R</span><input className="field-control" type="number" min="0" max="10000000" step="500" value={startingAmount} onChange={(event) => setStartingAmount(Number(event.target.value))} /></span>
          </label>
          <label className="investment-field">
            <span className="field-label">Monthly contribution</span>
            <span className="input-with-prefix"><span>R</span><input className="field-control" type="number" min="0" max="100000" step="100" value={monthlyContribution} onChange={(event) => setMonthlyContribution(Number(event.target.value))} /></span>
          </label>
          <label className="investment-field">
            <span className="field-label">Estimated annual return <strong>{annualReturn}%</strong></span>
            <input className="range-control" type="range" min="0" max="15" step="0.5" value={annualReturn} onChange={(event) => setAnnualReturn(Number(event.target.value))} />
            <span className="range-labels"><span>0%</span><span>15%</span></span>
          </label>
          <label className="investment-field">
            <span className="field-label">Time invested <strong>{years} years</strong></span>
            <input className="range-control" type="range" min="1" max="40" step="1" value={years} onChange={(event) => setYears(Number(event.target.value))} />
            <span className="range-labels"><span>1 year</span><span>40 years</span></span>
          </label>
        </section>

        <section className="projection-panel" aria-live="polite" aria-labelledby="projection-title">
          <p className="eyebrow">HYPOTHETICAL PROJECTION</p>
          <h2 id="projection-title">Estimated value after {years} years</h2>
          <p className="projection-value">{formatter.format(projectedValue)}</p>
          <div className="projection-breakdown">
            <div><span>Total contributions</span><strong>{formatter.format(amountInvested)}</strong></div>
            <div><span>Estimated growth</span><strong>{formatter.format(projectedValue - amountInvested)}</strong></div>
          </div>
          <p className="projection-note">This estimate assumes a constant return compounded monthly. Actual returns vary, and investments can lose value. This tool is for learning, not financial advice.</p>
        </section>
      </div>
    </main>
  );
}