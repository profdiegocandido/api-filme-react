import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/storage";
import "./styles.css";

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const submit = (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = mode === "login" ? loginUser(form) : registerUser(form);
      onAuth(user);
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link to="/" className="auth-logo">Cine<span>Verse</span></Link>
        <h1>{mode === "login" ? "Entre na sua conta" : "Crie sua conta"}</h1>
        <p>Salve filmes, comente e compartilhe sua lista.</p>
        <div className="auth-tabs">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Entrar</button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Cadastrar</button>
        </div>
        {mode === "register" && <label>Nome<input required minLength="2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}
        <label>E-mail<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Senha<input type="password" required minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" disabled={submitting}>{submitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}</button>
      </form>
    </section>
  );
}

export default Auth;
