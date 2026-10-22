import { useEffect, useState } from "react";

const STORAGE_KEY = "nextcapital.business-planner.v1";
const transactionTypes = ["sale", "expense", "stock"];
const focusAreas = [
  { id: "sales", title: "Record every sale", category: "Daily records", description: "Log cash and digital sales so you can compare what you earned with what was paid out." },
  { id: "separate-money", title: "Separate personal and business money", category: "Money habits", description: "Use a dedicated account or wallet where possible, and label any owner withdrawals." },
  { id: "records", title: "Prepare financial records", category: "Funding readiness", description: "Keep sales, expenses, stock costs, invoices and receipts together and up to date." },
  { id: "registration", title: "Explore business registration", category: "Formalise", description: "Check the current official requirements and documents for your business structure." },
  { id: "payments", title: "Accept digital payments", category: "Get paid", description: "Compare provider fees and settlement times before choosing a way to accept payments." },
  { id: "procurement", title: "Prepare for procurement", category: "Reach buyers", description: "Keep supplier details and supporting documents ready when exploring buyer opportunities." },
  { id: "markets", title: "Build market links", category: "Reach customers", description: "Choose one suitable channel to present your products and reach new customers." },
  { id: "funding", title: "Check funding offers carefully", category: "Protect your business", description: "Verify the provider independently and be cautious of upfront fees or pressure to act fast." },
];

const demoTransactions = [
  { id: "demo-sale-1", type: "sale", description: "Weekend market sales", amountCents: 245000, date: "2026-10-17" },
  { id: "demo-sale-2", type: "sale", description: "Customer orders", amountCents: 116000, date: "2026-10-16" },
  { id: "demo-expense-1", type: "expense", description: "Transport and data", amountCents: 48000, date: "2026-10-16" },
  { id: "demo-stock-1", type: "stock", description: "Stock replenishment", amountCents: 90000, date: "2026-10-15" },
  { id: "demo-expense-2", type: "expense", description: "Packaging", amountCents: 27500, date: "2026-10-15" },
];

const moneyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 2,
});

function formatMoney(amountCents) {
  return moneyFormatter.format(amountCents / 100);
}

function localDateString() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localTime.toISOString().slice(0, 10);
}

function loadPlannerData() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (Array.isArray(data.transactions) && Array.isArray(data.readyItems)) {
        return {
          transactions: data.transactions.filter((item) => (
            typeof item.id === "string"
            && transactionTypes.includes(item.type)
            && typeof item.description === "string"
            && Number.isSafeInteger(item.amountCents)
            && item.amountCents > 0
            && typeof item.date === "string"
          )),
          readyItems: data.readyItems.filter((id) => focusAreas.some((area) => area.id === id)),
        };
      }
    }
  } catch {
    // Continue with demo data if browser storage is unavailable or invalid.
  }

  return { transactions: demoTransactions, readyItems: [] };
}

function checkStorageAvailability() {
  try {
    const testKey = `${STORAGE_KEY}.test`;
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function buildActionPlan({ totals, readyItems }) {
  const actions = [];

  if (totals.balanceCents < 0) {
    actions.push({
      priority: "Urgent",
      title: "Recorded outflows are above sales",
      detail: "Review recent expenses and stock purchases. Check due dates and avoid taking on new costs until you understand the gap.",
      href: "#cash-flow",
    });
  } else if (totals.incomeCents === 0) {
    actions.push({
      priority: "Start here",
      title: "Add your recent sales",
      detail: "Recording sales gives the cash-flow summary a useful starting point.",
      href: "#transaction-form",
    });
  } else if (totals.expensesCents / totals.incomeCents >= 0.75) {
    actions.push({
      priority: "Review",
      title: "Check costs against sales",
      detail: "Expenses are using a large share of recorded income. Review recurring costs, stock usage and pricing.",
      href: "#cash-flow",
    });
  }

  const checklistActions = [
    { id: "sales", title: "Build a daily sales-record habit", detail: "Record cash and digital sales on the day they happen." },
    { id: "separate-money", title: "Separate business and personal money", detail: "Choose a clear way to distinguish business funds and owner withdrawals." },
    { id: "records", title: "Organise records before seeking funding", detail: "Gather recent sales, expenses, stock costs, invoices and receipts." },
    { id: "registration", title: "Check official registration requirements", detail: "Confirm the steps and documents with the relevant official service." },
    { id: "payments", title: "Compare digital payment options", detail: "Check provider fees, settlement periods and support before choosing." },
    { id: "procurement", title: "Prepare a supplier information pack", detail: "Keep business details and supporting documents easy to find." },
    { id: "markets", title: "Choose one channel to reach buyers", detail: "Create or improve a product listing or catalogue for your customers." },
    { id: "funding", title: "Verify a funding provider before sharing details", detail: "Confirm the provider independently and never let urgency replace checks." },
  ];

  for (const action of checklistActions) {
    if (!readyItems.includes(action.id)) {
      actions.push({
        priority: "Next step",
        title: action.title,
        detail: action.detail,
        href: "#readiness-checklist",
      });
    }
    if (actions.length >= 4) break;
  }

  if (actions.length === 0) {
    actions.push({
      priority: "Maintain",
      title: "Review your records each week",
      detail: "Update your sales, expenses and stock costs, then check your readiness steps again.",
      href: "#transaction-form",
    });
  }

  return actions.slice(0, 4);
}

export default function BusinessOpportunities() {
  const [plannerData, setPlannerData] = useState(loadPlannerData);
  const [storageAvailable] = useState(checkStorageAvailability);
  const [type, setType] = useState("sale");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(localDateString);
  const [formError, setFormError] = useState("");
  const { transactions, readyItems } = plannerData;
  const readyCount = readyItems.length;

  useEffect(() => {
    if (!storageAvailable) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerData));
    } catch {
      // The planner remains usable for the current page session.
    }
  }, [plannerData, storageAvailable]);

  const totals = transactions.reduce((summary, transaction) => {
    if (transaction.type === "sale") summary.incomeCents += transaction.amountCents;
    if (transaction.type === "expense") summary.expensesCents += transaction.amountCents;
    if (transaction.type === "stock") {
      summary.stockCents += transaction.amountCents;
      summary.expensesCents += transaction.amountCents;
    }
    return summary;
  }, { incomeCents: 0, expensesCents: 0, stockCents: 0 });
  totals.balanceCents = totals.incomeCents - totals.expensesCents;

  const actionPlan = buildActionPlan({ totals, readyItems });
  const hasDemoTransactions = transactions.some((transaction) => transaction.id.startsWith("demo-"));

  function updatePlannerData(updater) {
    setPlannerData((current) => updater(current));
  }

  function toggleReady(itemId) {
    updatePlannerData((current) => ({
      ...current,
      readyItems: current.readyItems.includes(itemId)
        ? current.readyItems.filter((id) => id !== itemId)
        : [...current.readyItems, itemId],
    }));
  }

  function addTransaction(event) {
    event.preventDefault();
    const amountNumber = Number(amount);
    const amountCents = Math.round(amountNumber * 100);

    if (!description.trim()) {
      setFormError("Enter a short description for this transaction.");
      return;
    }
    if (!Number.isFinite(amountNumber) || amountCents <= 0 || !Number.isSafeInteger(amountCents)) {
      setFormError("Enter an amount greater than R0.00.");
      return;
    }
    if (!date) {
      setFormError("Choose the date for this transaction.");
      return;
    }

    const transaction = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      description: description.trim(),
      amountCents,
      date,
    };

    updatePlannerData((current) => ({
      ...current,
      transactions: [transaction, ...current.transactions],
    }));
    setDescription("");
    setAmount("");
    setFormError("");
  }

  function removeTransaction(transactionId) {
    updatePlannerData((current) => ({
      ...current,
      transactions: current.transactions.filter((transaction) => transaction.id !== transactionId),
    }));
  }

  function clearDemoTransactions() {
    updatePlannerData((current) => ({
      ...current,
      transactions: current.transactions.filter((transaction) => !transaction.id.startsWith("demo-")),
    }));
  }

  return (
    <main className="page-shell business-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">LOCAL BUSINESS, BIG POTENTIAL</p>
          <h1>Business growth</h1>
          <p>Track day-to-day cash flow and turn business priorities into practical next steps.</p>
        </div>
      </section>

      <section className="business-prompt">
        <p className="eyebrow eyebrow-clay">THE CHALLENGE</p>
        <h2>How might digital tools help young founders and township or rural businesses start, trade, get paid, manage cash flow and reach formal markets?</h2>
      </section>

      <section className="cashflow-section" id="cash-flow" aria-labelledby="cashflow-title">
        <div className="cashflow-heading">
          <div>
            <p className="eyebrow">BUSINESS CASH FLOW</p>
            <h2 id="cashflow-title">Know what is coming in and going out</h2>
            <p>Log sales, everyday expenses and stock purchases to see your recorded cash position.</p>
          </div>
          <span className="local-data-note">{storageAvailable ? "Saved in this browser" : "Browser storage unavailable; changes last only until this page closes"}</span>
        </div>

        {totals.balanceCents < 0 && (
          <div className="cashflow-warning" role="alert">
            <strong>Recorded expenses are higher than sales.</strong>
            <span>Review your costs and upcoming payments. This summary only includes transactions entered here.</span>
          </div>
        )}

        <div className="cashflow-summary" aria-label="Cash-flow summary" aria-live="polite">
          <article className="cashflow-metric"><span>Total sales</span><strong>{formatMoney(totals.incomeCents)}</strong><small>{transactions.filter((transaction) => transaction.type === "sale").length} entries</small></article>
          <article className="cashflow-metric"><span>Total expenses</span><strong>{formatMoney(totals.expensesCents)}</strong><small>Includes stock purchases</small></article>
          <article className="cashflow-metric"><span>Stock costs</span><strong>{formatMoney(totals.stockCents)}</strong><small>{transactions.filter((transaction) => transaction.type === "stock").length} entries</small></article>
          <article className={`cashflow-metric cash-position ${totals.balanceCents < 0 ? "cash-negative" : ""}`}><span>Remaining cash</span><strong>{formatMoney(totals.balanceCents)}</strong><small>Sales minus recorded expenses</small></article>
        </div>

        <div className="cashflow-workspace">
          <form className="transaction-form" id="transaction-form" onSubmit={addTransaction}>
            <p className="eyebrow">ADD A RECORD</p>
            <h3>New transaction</h3>
            <label className="business-field">
              <span className="field-label">Type</span>
              <select className="field-control" value={type} onChange={(event) => setType(event.target.value)}>
                <option value="sale">Sale / income</option>
                <option value="expense">Expense</option>
                <option value="stock">Stock purchase</option>
              </select>
            </label>
            <label className="business-field">
              <span className="field-label">Description</span>
              <input className="field-control" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={80} placeholder="For example, Saturday sales" />
            </label>
            <div className="business-form-row">
              <label className="business-field">
                <span className="field-label">Amount (ZAR)</span>
                <input className="field-control" type="number" min="0.01" max="999999999.99" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
              </label>
              <label className="business-field">
                <span className="field-label">Date</span>
                <input className="field-control" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </label>
            </div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <button className="button-primary transaction-submit" type="submit">Add transaction <span aria-hidden="true">+</span></button>
            <p className="form-helper">Entries are stored locally in this browser, not sent to a bank or server.</p>
          </form>

          <section className="transaction-ledger" aria-labelledby="ledger-title">
            <div className="ledger-heading">
              <div>
                <p className="eyebrow">RECENT ACTIVITY</p>
                <h3 id="ledger-title">Transactions</h3>
              </div>
              {hasDemoTransactions && <button className="text-button" type="button" onClick={clearDemoTransactions}>Remove sample data</button>}
            </div>
            {hasDemoTransactions && <p className="demo-data-note">Illustrative demo entries are loaded. Remove them before entering your own figures.</p>}
            {transactions.length === 0 ? (
              <p className="ledger-empty">No transactions yet. Add a sale, expense or stock purchase to begin.</p>
            ) : (
              <div className="ledger-table-wrap">
                <table className="ledger-table">
                  <thead><tr><th scope="col">Description</th><th scope="col">Type</th><th scope="col">Date</th><th scope="col">Amount</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr></thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.description}</td>
                        <td><span className={`transaction-type type-${transaction.type}`}>{transaction.type === "sale" ? "Sale" : transaction.type === "stock" ? "Stock" : "Expense"}</span></td>
                        <td>{new Date(`${transaction.date}T00:00:00`).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className={transaction.type === "sale" ? "amount-income" : "amount-outflow"}>{transaction.type === "sale" ? "+" : "−"}{formatMoney(transaction.amountCents)}</td>
                        <td><button className="remove-entry" type="button" aria-label={`Remove ${transaction.description}`} onClick={() => removeTransaction(transaction.id)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
        <p className="cashflow-disclaimer">This is a simple recordkeeping aid, not a bank balance. It does not connect to accounts, include unrecorded transactions or provide accounting or tax advice.</p>
      </section>

      <section className="readiness-section" id="readiness-checklist" aria-labelledby="readiness-title">
        <div className="readiness-heading">
          <div>
            <p className="eyebrow">YOUR BUSINESS CHECKLIST</p>
            <h2 id="readiness-title">Build your foundations</h2>
            <p>Mark the steps you have in place. Your action plan updates with your answers.</p>
          </div>
          <div className="readiness-count" aria-live="polite"><strong>{readyCount}<span> / {focusAreas.length}</span></strong><small>steps in place</small></div>
        </div>
        <progress className="readiness-progress" value={readyCount} max={focusAreas.length} aria-label={`${readyCount} of ${focusAreas.length} readiness steps in place`} />
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

      <section className="action-plan-section" aria-labelledby="action-plan-title">
        <div className="readiness-heading">
          <div>
            <p className="eyebrow eyebrow-clay">PERSONALISED ACTION PLAN</p>
            <h2 id="action-plan-title">A few useful next steps</h2>
            <p>Suggestions respond to your cash-flow entries and checklist selections.</p>
          </div>
        </div>
        <div className="action-plan-list" aria-live="polite">
          {actionPlan.map((action, index) => (
            <article className="action-plan-item" key={`${action.title}-${index}`}>
              <span className={`action-priority ${action.priority === "Urgent" ? "priority-urgent" : ""}`}>{action.priority}</span>
              <div><h3>{action.title}</h3><p>{action.detail}</p></div>
              <a href={action.href} aria-label={`Go to ${action.title}`}>Go to step <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}