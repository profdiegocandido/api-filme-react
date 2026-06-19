import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LoadingSpinner } from "../../components/Loading";
import "./styles.css";

const Movie = () => {
  const { id } = useParams();
  const imagePath = "https://image.tmdb.org/t/p/w500";
  const backdropPath = "https://image.tmdb.org/t/p/w1280";

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const KEY = process.env.REACT_APP_KEY || "1f697729cfa82930a3b9fb7e391161ea";

  useEffect(() => {
    if (!KEY) {
      setError("Chave de API (REACT_APP_KEY) não encontrada. Verifique se o arquivo .env está configurado na raiz do projeto com a chave correta e reinicie o servidor de desenvolvimento (npm start) para aplicar as alterações.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}&language=pt-BR`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Filme não encontrado. Verifique se a sua chave de API é válida.");
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message === "Failed to fetch"
          ? "Erro de conexão: Não foi possível se conectar à API do TMDB. Verifique sua conexão com a internet ou se algum bloqueador de anúncios (AdBlock) está impedindo o acesso à api.themoviedb.org."
          : err.message);
        setLoading(false);
      });
  }, [id, KEY]);

  const getRatingColor = (rating) => {
    if (rating >= 7) return "var(--rating-high)";
    if (rating >= 5) return "var(--rating-mid)";
    return "var(--rating-low)";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}min`;
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="movie-error" id="movie-error">
        <span className="movie-error-icon">😕</span>
        <h2>Oops!</h2>
        <p>{error}</p>
        <Link to="/" className="movie-back-btn">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="movie-page animate-fade-in" id="movie-detail-page">
      {/* Hero Backdrop */}
      {movie.backdrop_path && (
        <div className="movie-hero">
          <img
            src={`${backdropPath}${movie.backdrop_path}`}
            alt={`Cena de ${movie.title}`}
            className="movie-hero-img"
          />
          <div className="movie-hero-overlay" />
        </div>
      )}

      {/* Content */}
      <div className="movie-detail-content">
        {/* Poster */}
        <div className="movie-detail-poster">
          <img
            src={`${imagePath}${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster-img"
          />
        </div>

        {/* Info */}
        <div className="movie-detail-info">
          <h1 className="movie-detail-title" id="movie-title">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="movie-tagline">"{movie.tagline}"</p>
          )}

          {/* Meta */}
          <div className="movie-meta">
            <span
              className="movie-rating-badge"
              style={{ backgroundColor: getRatingColor(movie.vote_average) }}
            >
              ★ {movie.vote_average?.toFixed(1)}
            </span>
            <span className="movie-meta-item">
              📅 {formatDate(movie.release_date)}
            </span>
            {formatRuntime(movie.runtime) && (
              <span className="movie-meta-item">
                ⏱ {formatRuntime(movie.runtime)}
              </span>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-genres" id="movie-genres">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="movie-genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {movie.overview && (
            <div className="movie-overview">
              <h2 className="movie-section-title">Sinopse</h2>
              <p className="movie-overview-text">{movie.overview}</p>
            </div>
          )}

          {/* Extra Info */}
          <div className="movie-extra-info">
            {movie.vote_count > 0 && (
              <div className="movie-extra-item">
                <span className="extra-label">Votos</span>
                <span className="extra-value">
                  {movie.vote_count.toLocaleString("pt-BR")}
                </span>
              </div>
            )}
            {movie.popularity && (
              <div className="movie-extra-item">
                <span className="extra-label">Popularidade</span>
                <span className="extra-value">
                  {movie.popularity.toFixed(0)}
                </span>
              </div>
            )}
            {movie.original_language && (
              <div className="movie-extra-item">
                <span className="extra-label">Idioma Original</span>
                <span className="extra-value">
                  {movie.original_language.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Back Button */}
          <Link to="/" className="movie-back-btn" id="movie-back-btn">
            ← Voltar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Movie;
