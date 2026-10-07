import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Markets from "./pages/Markets";
import OnlineClasses from "./pages/OnlineClasses";
import BusinessOpportunities from "./pages/BusinessOpportunities";
import Investments from "./pages/Investments";

function MarketsButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/markets")}>
      <h1>Markets</h1>
      <p>
        Explore the latest market trends and insights in South African Economy.
      </p>
    </button>
  );
}

function OnlineClassesButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/online-classes")}>
      <h1>Online Classes</h1>
      <p>
        Enhance your skills with our interactive online courses.
      </p>
    </button>
  );
}

function BusinessOpportunitiesButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/business-opportunities")}>
      <h1>Business Opportunities</h1>
      <p>
        Discover new business opportunities and investment prospects.
      </p>
    </button>
  );
}

function InvestmentsButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/investments")}>
      <h1>Investments</h1>
      <p>
        Grow your wealth with our expert investment strategies.
      </p>
    </button>
  );
}

function Information() {
  return (
    <>
      <h1>About Us</h1>
      <h1>Contact Us</h1>
      <h1>Privacy Policy</h1>
      <h1>Terms of Service</h1>
      <h1>FAQ</h1>
      <h1>Support</h1>
    </>
  );
}

function Home() {
  return (
    <>
      <h1>Welcome To NextCapital</h1>

      <p>Where Innovation Meets Excellence</p>

      <MarketsButton />

      <OnlineClassesButton />

      <BusinessOpportunitiesButton />

      <InvestmentsButton />

      <Information />
    </>
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