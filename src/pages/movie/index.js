import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/Loading";
import { addComment, getComments, getFavorites, toggleFavorite } from "../../services/storage";
import "./styles.css";

const KEY = process.env.REACT_APP_KEY;
const imagePath = "https://image.tmdb.org/t/p/w500";
const backdropPath = "https://image.tmdb.org/t/p/w1280";

function Movie({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (!KEY) { setError("Chave de API não encontrada. Configure REACT_APP_KEY no arquivo .env."); setLoading(false); return; }
    setLoading(true); setError(null);
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}&language=pt-BR`)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error("Filme não encontrado.")))
      .then((data) => setMovie(data))
      .catch((err) => setError(err.message || "Não foi possível carregar o filme."))
      .finally(() => setLoading(false));
    setComments(getComments(id));
  }, [id]);

  useEffect(() => setFavorite(Boolean(user && getFavorites(user.id).some((item) => item.id === Number(id)))), [id, user]);
  const requireLogin = () => navigate(`/entrar?redirect=/${id}`);
  const handleFavorite = () => { if (!user) return requireLogin(); setFavorite(toggleFavorite(user.id, movie).some((item) => item.id === movie.id)); };
  const submitComment = (event) => { event.preventDefault(); if (!user) return requireLogin(); if (!comment.trim()) return; setComments(addComment(id, user, comment)); setComment(""); };
  const getRatingColor = (rating) => rating >= 7 ? "var(--rating-high)" : rating >= 5 ? "var(--rating-mid)" : "var(--rating-low)";
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : "—";
  const runtime = (minutes) => minutes ? `${Math.floor(minutes / 60)}h ${minutes % 60}min` : null;

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="movie-error"><span className="movie-error-icon">😕</span><h2>Oops!</h2><p>{error}</p><Link to="/" className="movie-back-btn">Voltar ao início</Link></div>;
  if (!movie) return null;

  return <div className="movie-page animate-fade-in">{movie.backdrop_path && <div className="movie-hero"><img src={`${backdropPath}${movie.backdrop_path}`} alt={`Cena de ${movie.title}`} className="movie-hero-img" /><div className="movie-hero-overlay" /></div>}<div className="movie-detail-content"><div className="movie-detail-poster">{movie.poster_path ? <img src={`${imagePath}${movie.poster_path}`} alt={movie.title} className="movie-poster-img" /> : <div className="missing-poster">Sem pôster</div>}</div><div className="movie-detail-info"><div className="movie-title-row"><h1 className="movie-detail-title">{movie.title}</h1><button className={`favorite-button ${favorite ? "saved" : ""}`} onClick={handleFavorite} aria-pressed={favorite}>{favorite ? "♥ Na minha lista" : "♡ Salvar na lista"}</button></div>{movie.tagline && <p className="movie-tagline">“{movie.tagline}”</p>}<div className="movie-meta"><span className="movie-rating-badge" style={{ backgroundColor: getRatingColor(movie.vote_average) }}>★ {movie.vote_average?.toFixed(1)}</span><span className="movie-meta-item">📅 {formatDate(movie.release_date)}</span>{runtime(movie.runtime) && <span className="movie-meta-item">⏱ {runtime(movie.runtime)}</span>}</div>{movie.genres?.length > 0 && <div className="movie-genres">{movie.genres.map((genre) => <span key={genre.id} className="movie-genre-tag">{genre.name}</span>)}</div>}{movie.overview && <div className="movie-overview"><h2 className="movie-section-title">Sinopse</h2><p className="movie-overview-text">{movie.overview}</p></div>}<div className="movie-extra-info">{movie.vote_count > 0 && <div className="movie-extra-item"><span className="extra-label">Votos</span><span className="extra-value">{movie.vote_count.toLocaleString("pt-BR")}</span></div>}{movie.popularity && <div className="movie-extra-item"><span className="extra-label">Popularidade</span><span className="extra-value">{movie.popularity.toFixed(0)}</span></div>}{movie.original_language && <div className="movie-extra-item"><span className="extra-label">Idioma original</span><span className="extra-value">{movie.original_language.toUpperCase()}</span></div>}</div><section className="comments-section"><h2 className="movie-section-title">Comentários</h2><form className="comment-form" onSubmit={submitComment}><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength="500" placeholder={user ? "O que você achou deste filme?" : "Entre para deixar um comentário"} /><button type="submit">{user ? "Publicar comentário" : "Entrar para comentar"}</button></form>{comments.length ? <ul className="comments-list">{comments.map((item) => <li key={item.id}><strong>{item.author}</strong><time>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</time><p>{item.text}</p></li>)}</ul> : <p className="no-comments">Ainda não há comentários. Seja a primeira pessoa a comentar.</p>}</section><Link to="/" className="movie-back-btn">← Voltar</Link></div></div></div>;
}
export default Movie;
