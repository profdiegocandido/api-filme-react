import { Link } from "react-router-dom";
import "./Header.css";

function Header({ user, onLogout }) {
  return <header className="header" id="main-header"><div className="header-inner"><Link to="/" className="header-logo"><span className="logo-icon">🎬</span><span className="logo-text">Cine<span className="logo-accent">Verse</span></span></Link><nav className="header-nav"><Link to="/" className="nav-link">Início</Link><a href="/#genre-filter-bar" className="nav-link">Categorias</a>{user ? <><Link to="/minha-lista" className="nav-link">Minha lista</Link><span className="user-name">Olá, {user.name}</span><button className="nav-link logout-button" onClick={onLogout}>Sair</button></> : <Link to="/entrar" className="nav-link nav-login">Entrar</Link>}</nav></div></header>;
}
export default Header;
