import Header from "./Header/header";
import Footer from "./Footer/footer";
import PrivacyPolicy from "./company/privacypolicy";
import Terms from "./company/terms";
import Home from "./Home/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="bg-container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
