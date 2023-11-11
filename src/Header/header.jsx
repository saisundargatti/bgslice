import "./header.css"; // Import the CSS file for styling
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dlvc5pfmx/image/upload/v1699707340/bg-slice-high-resolution-logo-transparent_1_ocyyr5.png"
            alt="BG Slice"
            style={{ width: "120px", boxShadow: "none" }} // Corrected the syntax here
          />
        </Link>
      </div>
      <nav className="nav-header">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <a href="#about" className="nav-link">
          About
        </a>
        <a href="#contact" className="nav-link">
          Contact Us
        </a>
      </nav>
    </header>
  );
}

export default Header;
