import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/home";
import Movie from "./pages/movie";
import Auth from "./pages/auth";
import Favorites from "./pages/favorites";
import { getCurrentUser, logoutUser } from "./services/storage";
import "./App.css";

function App() {
  const [user, setUser] = useState(getCurrentUser);
  const logout = () => { logoutUser(); setUser(null); };
  return <div className="app"><Header user={user} onLogout={logout} /><main className="app-content"><Routes><Route path="/" element={<Home />} /><Route path="/entrar" element={<Auth onAuth={setUser} />} /><Route path="/minha-lista" element={<Favorites user={user} />} /><Route path="/:id" element={<Movie user={user} />} /></Routes></main></div>;
}
export default App;
