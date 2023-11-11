import "./footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <nav className="nav">
        <Link to="/privacy-policy" className="nav-link">
          Privacy Policy
        </Link>
        <Link to="/terms" className="nav-link">
          Terms
        </Link>
      </nav>
    </div>
  );
}

export default Footer;
