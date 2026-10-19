import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./Markets.css";

const pairs = [
  { symbol: "EUR/USD", label: "Euro / US dollar", base: 1.08 },
  { symbol: "USD/ZAR", label: "US dollar / South African rand", base: 18.2 },
  { symbol: "GBP/USD", label: "Pound / US dollar", base: 1.27 },
];

const intervals = [
  { value: "1min", label: "1 minute", minutes: 1 },
  { value: "5min", label: "5 minutes", minutes: 5 },
  { value: "15min", label: "15 minutes", minutes: 15 },
  { value: "30min", label: "30 minutes", minutes: 30 },
  { value: "1h", label: "1 hour", minutes: 60 },
  { value: "4h", label: "4 hours", minutes: 240 },
  { value: "1day", label: "1 day", minutes: 1440 },
];

function makeSampleMarkets(symbol, interval) {
  const pair = pairs.find((item) => item.symbol === symbol) ?? pairs[0];
  const intervalMinutes = intervals.find((item) => item.value === interval)?.minutes ?? 1;
  const now = Date.now();

  return Array.from({ length: 30 }, (_, index) => {
    const movement = Math.sin(index / 3) * 0.004 + Math.cos(index / 6) * 0.002;
    const price = pair.base * (1 + movement);
    const date = new Date(now - (29 - index) * intervalMinutes * 60_000);

    return { time: date.toISOString(), price };
  });
}

function formatPrice(price, symbol) {
  return price?.toFixed(symbol === "USD/ZAR" ? 3 : 5) ?? "--";
}

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [interval, setInterval] = useState("1day");
  const [symbol, setSymbol] = useState("USD/ZAR");
  const [loading, setLoading] = useState(true);
  const [sampleMode, setSampleMode] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const apiKey = import.meta.env.VITE_TWELVE_DATA_API_KEY;

  useEffect(() => {
    const controller = new AbortController();

    async function getMarkets() {
      setLoading(true);
      setMessage("");

      if (!apiKey) {
        setMarkets(makeSampleMarkets(symbol, interval));
        setSampleMode(true);
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          apikey: apiKey,
          interval,
          symbol,
          outputsize: "30",
        });
        const response = await fetch(
          `https://api.twelvedata.com/time_series?${params}`,
          { signal: controller.signal },
        );
        const data = await response.json();

        if (!response.ok || data.status === "error" || !Array.isArray(data.values)) {
          throw new Error(data.message || "The market feed is temporarily unavailable.");
        }

        setMarkets(data.values.map((market) => ({
          time: market.datetime,
          price: Number(market.close),
        })).reverse());
        setSampleMode(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMarkets(makeSampleMarkets(symbol, interval));
          setSampleMode(true);
          setMessage("Live prices could not be loaded. Showing illustrative sample data instead.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    getMarkets();
    return () => controller.abort();
  }, [apiKey, interval, refreshKey, symbol]);

  const latestPrice = markets.at(-1)?.price;
  const highPrice = markets.length ? Math.max(...markets.map((item) => item.price)) : undefined;
  const lowPrice = markets.length ? Math.min(...markets.map((item) => item.price)) : undefined;

  return (
    <main className="markets-page page-shell">
      <section className="page-heading markets-heading">
        <div>
          <p className="eyebrow">MARKET WATCH</p>
          <h1>Markets</h1>
          <p>Explore currency movements and compare recent price ranges.</p>
        </div>
        <span className={`market-status ${sampleMode ? "sample-status" : "live-status"}`}>
          <span aria-hidden="true" />
          {sampleMode ? "Illustrative sample" : "Live market data"}
        </span>
      </section>

      <section className="price-card panel" aria-label="Currency price chart">
        <div className="price-header">
          <div>
            <p className="currency-name">{symbol}</p>
            <h2>{formatPrice(latestPrice, symbol)}</h2>
            <p className="pair-description">{pairs.find((pair) => pair.symbol === symbol)?.label}</p>
          </div>
          <div className="market-controls">
            <label>
              <span className="field-label">Currency pair</span>
              <select className="field-control" value={symbol} onChange={(event) => setSymbol(event.target.value)}>
                {pairs.map((pair) => <option value={pair.symbol} key={pair.symbol}>{pair.symbol}</option>)}
              </select>
            </label>
            <label>
              <span className="field-label">Time range</span>
              <select className="field-control" value={interval} onChange={(event) => setInterval(event.target.value)}>
                {intervals.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </label>
            <button className="button-secondary refresh-button" type="button" onClick={() => setRefreshKey((key) => key + 1)} disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {message && <p className="feed-message" role="status">{message}</p>}
        {loading ? (
          <div className="chart-placeholder" role="status">Loading market data...</div>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={markets} margin={{ top: 12, right: 12, bottom: 4, left: 4 }}>
                <CartesianGrid stroke="#e4ebe5" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#5f7069", fontSize: 11 }} tickFormatter={(time) => new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" })} minTickGap={35} />
                <YAxis domain={["auto", "auto"]} axisLine={false} tickLine={false} tick={{ fill: "#5f7069", fontSize: 11 }} tickFormatter={(price) => Number(price).toFixed(symbol === "USD/ZAR" ? 2 : 4)} width={65} />
                <Tooltip formatter={(value) => [formatPrice(Number(value), symbol), symbol]} labelFormatter={(time) => new Date(time).toLocaleString()} contentStyle={{ borderRadius: 0, borderColor: "#d9e2da" }} />
                <Line type="monotone" dataKey="price" stroke="#2e7259" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "#b25443" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {sampleMode && <p className="sample-disclaimer">Sample values are for demonstration only and do not represent current exchange rates.</p>}
      </section>

      <section className="market-info" aria-label="Market summary">
        <article className="summary-item"><p>Latest shown</p><strong>{formatPrice(latestPrice, symbol)}</strong></article>
        <article className="summary-item"><p>Period high</p><strong>{formatPrice(highPrice, symbol)}</strong></article>
        <article className="summary-item"><p>Period low</p><strong>{formatPrice(lowPrice, symbol)}</strong></article>
        <article className="summary-item"><p>Observations</p><strong>{markets.length || "--"}</strong></article>
      </section>
      <p className="market-footnote">Market data is provided for general information, not as financial advice.</p>
    </main>
  );
}