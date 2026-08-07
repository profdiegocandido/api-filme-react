import { Link, Navigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import { getFavorites } from "../../services/storage";
import "./styles.css";

function Favorites({ user }) {
  if (!user) return <Navigate to="/entrar?redirect=/minha-lista" replace />;
  const favorites = getFavorites(user.id);
  const share = async () => {
    const text = favorites.length ? `Minha lista CineVerse: ${favorites.map((movie) => movie.title).join(", ")}` : "Minha lista CineVerse ainda está vazia.";
    try { if (navigator.share) await navigator.share({ title: "Minha lista CineVerse", text, url: window.location.href }); else { await navigator.clipboard.writeText(`${text} ${window.location.href}`); alert("Lista copiada para a área de transferência!"); } } catch (error) { if (error.name !== "AbortError") alert("Não foi possível compartilhar a lista."); }
  };
  return <section className="favorites-page"><div className="favorites-heading"><div><h1>Minha lista</h1><p>Filmes salvos por {user.name}.</p></div><button onClick={share} className="share-button">Compartilhar lista</button></div>{favorites.length ? <ul className="movies-grid">{favorites.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} />)}</ul> : <div className="empty-state"><span className="empty-icon">♡</span><p>Sua lista está vazia. Abra um filme e salve seus favoritos.</p><Link className="explore-button" to="/">Explorar filmes</Link></div>}</section>;
}
export default Favorites;
