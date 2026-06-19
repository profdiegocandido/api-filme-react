import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie, index }) {
  const imagePath = "https://image.tmdb.org/t/p/w500";

  const getRatingColor = (rating) => {
    if (rating >= 7) return "var(--rating-high)";
    if (rating >= 5) return "var(--rating-mid)";
    return "var(--rating-low)";
  };

  return (
    <li
      className="movie-card"
      id={`movie-card-${movie.id}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link to={`/${movie.id}`} className="movie-card-link">
        <div className="movie-card-poster">
          <img
            src={`${imagePath}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
          <div className="movie-card-overlay">
            <span className="movie-card-detail-btn">Ver Detalhes</span>
          </div>
          <div
            className="movie-card-rating"
            style={{ backgroundColor: getRatingColor(movie.vote_average) }}
          >
            ★ {movie.vote_average?.toFixed(1)}
          </div>
        </div>
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
          <p className="movie-card-date">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "—"}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default MovieCard;
