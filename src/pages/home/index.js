import { useEffect, useState, useCallback } from "react";
import MovieCard from "../../components/MovieCard";
import { LoadingGrid } from "../../components/Loading";
import "./styles.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const KEY = process.env.REACT_APP_KEY || "1f697729cfa82930a3b9fb7e391161ea";

  // Fetch genre list on mount
  useEffect(() => {
    if (!KEY) return;
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY}&language=pt-BR`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar gêneros");
        return res.json();
      })
      .then((data) => {
        setGenres(data.genres || []);
      })
      .catch((err) => {
        console.error("Erro ao buscar gêneros:", err);
      });
  }, [KEY]);

  // Fetch movies based on selected genre
  const fetchMovies = useCallback(() => {
    if (!KEY) {
      setError("Chave de API (REACT_APP_KEY) não encontrada. Verifique se o arquivo .env está configurado na raiz do projeto com a chave correta e reinicie o servidor de desenvolvimento (npm start) para aplicar as alterações.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const url = selectedGenre
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${KEY}&language=pt-BR&sort_by=popularity.desc&with_genres=${selectedGenre}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=pt-BR`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar filmes. Verifique se a sua chave de API é válida.");
        return res.json();
      })
      .then((data) => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message === "Failed to fetch"
          ? "Erro de conexão: Não foi possível se conectar à API do TMDB. Verifique sua conexão com a internet ou se algum bloqueador de anúncios (AdBlock) está impedindo o acesso à api.themoviedb.org."
          : err.message);
        setLoading(false);
      });
  }, [KEY, selectedGenre]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
  };

  const activeGenreName = selectedGenre
    ? genres.find((g) => g.id === selectedGenre)?.name
    : null;

  return (
    <section className="home" id="home-section">
      {/* Hero */}
      <div className="home-hero">
        <h1 className="home-title">
          Descubra <span className="title-accent">Filmes</span>
        </h1>
        <p className="home-subtitle">
          Explore os filmes mais populares ou filtre por categoria
        </p>
      </div>

      {/* Genre Filter Bar */}
      <div className="genre-bar-wrapper" id="genre-filter-bar">
        <div className="genre-bar">
          <button
            className={`genre-chip ${selectedGenre === null ? "active" : ""}`}
            onClick={() => setSelectedGenre(null)}
            id="genre-chip-all"
          >
            🔥 Todos
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-chip ${
                selectedGenre === genre.id ? "active" : ""
              }`}
              onClick={() => handleGenreClick(genre.id)}
              id={`genre-chip-${genre.id}`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {activeGenreName && (
        <div className="active-filter animate-fade-in">
          <span className="active-filter-label">Filtrando por:</span>
          <span className="active-filter-tag">
            {activeGenreName}
            <button
              className="active-filter-clear"
              onClick={() => setSelectedGenre(null)}
              aria-label="Limpar filtro"
            >
              ✕
            </button>
          </span>
        </div>
      )}

      {/* Content */}
      <div className="home-content">
        {loading && <LoadingGrid count={12} />}

        {error && (
          <div className="error-state" id="error-state">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            <button className="error-retry" onClick={fetchMovies}>
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="empty-state" id="empty-state">
            <span className="empty-icon">🎬</span>
            <p>Nenhum filme encontrado nesta categoria.</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <ul className="movies-grid" id="movies-grid">
            {movies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default Home;
