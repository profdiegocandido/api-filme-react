import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header" id="main-header">
      <div className="header-inner">
        <Link to="/" className="header-logo" id="header-logo-link">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">
            Cine<span className="logo-accent">Verse</span>
          </span>
        </Link>

        <nav className="header-nav" id="header-nav">
          <Link to="/" className="nav-link" id="nav-home-link">
            Início
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
