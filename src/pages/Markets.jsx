import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./Markets.css";

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [interval, setInterval] = useState("1min");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

  useEffect(() => {
    async function getMarkets() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://api.twelvedata.com/time_series?apikey=${API_KEY}&interval=${interval}&symbol=EUR/USD&outputsize=30`
        );

        const data = await response.json();

        console.log(data);

        if (data.status === "error") {
          throw new Error(data.message);
        }

        const chartData = data.values
          .map((market) => ({
            time: market.datetime,
            price: Number(market.close)
          }))
          .reverse();

        setMarkets(chartData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getMarkets();
  }, [API_KEY, interval]);

  if (loading) {
    return (
      <main className="markets-page">
        <h1>Loading Markets...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="markets-page">
        <h1>Market Data Error</h1>
        <p>{error}</p>
      </main>
    );
  }

  const latestPrice = markets[markets.length - 1]?.price;

  return (
    <main className="markets-page">

      <section className="markets-header">
        <div>
          <p className="section-label">MARKET OVERVIEW</p>
          <h1>Markets</h1>
          <p>Track financial markets and monitor price movements.</p>
        </div>

        <div className="market-status">
          <span></span>
          Live Market Data
        </div>
      </section>


      <section className="price-card">

        <div className="price-header">

          <div>
            <p className="currency-name">EUR / USD</p>

            <h2>
              {latestPrice?.toFixed(5)}
            </h2>
          </div>


          <div className="interval-selector">

            <label htmlFor="interval">
              Interval
            </label>

            <select
              id="interval"
              value={interval}
              onChange={(event) =>
                setInterval(event.target.value)
              }
            >
              <option value="1min">1 Min</option>
              <option value="5min">5 Min</option>
              <option value="15min">15 Min</option>
              <option value="30min">30 Min</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1day">1 Day</option>
              <option value="1week">1 Week</option>
              <option value="1month">1 Month</option>
            </select>

          </div>

        </div>


        <div className="chart-container">

          <ResponsiveContainer width="100%" height={400}>

            <LineChart data={markets}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                tickFormatter={(time) =>
                  time.slice(11, 16)
                }
              />

              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 12 }}
                tickFormatter={(price) =>
                  price.toFixed(4)
                }
              />

              <Tooltip
                formatter={(value) => [
                  value.toFixed(5),
                  "EUR/USD"
                ]}
                labelFormatter={(time) =>
                  `Time: ${time}`
                }
              />

              <Line
                type="monotone"
                dataKey="price"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </section>


      <section className="market-info">

        <article>
          <p>Latest Price</p>
          <h2>{latestPrice?.toFixed(5)}</h2>
        </article>

        <article>
          <p>Data Points</p>
          <h2>{markets.length}</h2>
        </article>

        <article>
          <p>Interval</p>
          <h2>{interval}</h2>
        </article>

        <article>
          <p>Currency</p>
          <h2>EUR/USD</h2>
        </article>

      </section>

    </main>
  );
}