import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Markets from "./pages/Markets";
import OnlineClasses from "./pages/OnlineClasses";
import BusinessOpportunities from "./pages/BusinessOpportunities";
import Investments from "./pages/Investments";

function MarketsButton() {
  const navigate = useNavigate();

  return (
    <button
      className="feature-button"
      onClick={() => navigate("/markets")}
    >
      <h2>Markets</h2>

      <p>
        Explore the latest market trends and insights in South African Economy.
      </p>
    </button>
  );
}

function OnlineClassesButton() {
  const navigate = useNavigate();

  return (
    <button
      className="feature-button"
      onClick={() => navigate("/online-classes")}
    >
      <h2>Online Classes</h2>

      <p>
        Enhance your skills with our interactive online courses.
      </p>
    </button>
  );
}

function BusinessOpportunitiesButton() {
  const navigate = useNavigate();

  return (
    <button
      className="feature-button"
      onClick={() => navigate("/business-opportunities")}
    >
      <h2>Business Opportunities</h2>

      <p>
        Discover new business opportunities and investment prospects.
      </p>
    </button>
  );
}

function InvestmentsButton() {
  const navigate = useNavigate();

  return (
    <button
      className="feature-button"
      onClick={() => navigate("/investments")}
    >
      <h2>Investments</h2>

      <p>
        Grow your wealth with our expert investment strategies.
      </p>
    </button>
  );
}

function Information() {
  return (
    <section className="information">
      <h3>About Us</h3>
      <h3>Contact Us</h3>
      <h3>Privacy Policy</h3>
      <h3>Terms of Service</h3>
      <h3>FAQ</h3>
      <h3>Support</h3>
    </section>
  );
}

function Home() {
  return (
    <div className="home">

      <header className="header">
        <h1>NextCapital</h1>

        <p>Financial knowledge. Opportunities. Growth.</p>
      </header>

      <main>

        <section className="hero">
          <h2>Build Your Financial Future</h2>

          <p>
            Explore financial markets, learn new skills, discover business
            opportunities and make informed investment decisions.
          </p>
        </section>

        <section className="features">

          <MarketsButton />

          <OnlineClassesButton />

          <BusinessOpportunitiesButton />

          <InvestmentsButton />

        </section>

        <Information />

      </main>

      <footer>
        <p>© 2026 NextCapital. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/markets" element={<Markets />} />

        <Route
          path="/online-classes"
          element={<OnlineClasses />}
        />

        <Route
          path="/business-opportunities"
          element={<BusinessOpportunities />}
        />

        <Route
          path="/investments"
          element={<Investments />}
        />

      </Routes>

    </BrowserRouter>
  );
}