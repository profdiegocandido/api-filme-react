import { useCallback, useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import { LoadingGrid } from "../../components/Loading";
import "./styles.css";

const KEY = process.env.REACT_APP_KEY;
const API = "https://api.themoviedb.org/3";

function Home() {
  const [movies, setMovies] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!KEY) return;
    fetch(`${API}/genre/movie/list?api_key=${KEY}&language=pt-BR`)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error("Não foi possível carregar as categorias.")))
      .then((data) => setGenres(data.genres || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!KEY) return;
    fetch(`${API}/movie/top_rated?api_key=${KEY}&language=pt-BR&page=1`)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error("Não foi possível carregar os melhores avaliados.")))
      .then((data) => setTopRated((data.results || []).slice(0, 6)))
      .catch((err) => console.error(err));
  }, []);

  const fetchMovies = useCallback(async () => {
    if (!KEY) { setError("Chave de API não encontrada. Configure REACT_APP_KEY no arquivo .env e reinicie o servidor."); setLoading(false); return; }
    setLoading(true); setError(null);
    const term = query.trim();
    const endpoint = term ? `/search/movie?api_key=${KEY}&language=pt-BR&query=${encodeURIComponent(term)}&include_adult=false` : selectedGenre ? `/discover/movie?api_key=${KEY}&language=pt-BR&sort_by=popularity.desc&with_genres=${selectedGenre}` : `/movie/popular?api_key=${KEY}&language=pt-BR`;
    try {
      const res = await fetch(`${API}${endpoint}`);
      if (!res.ok) throw new Error();
      const data = await res.json(); setMovies(data.results || []);
    } catch (err) { console.error(err); setError("Não foi possível carregar os filmes. Verifique sua conexão e tente novamente."); }
    finally { setLoading(false); }
  }, [query, selectedGenre]);

  useEffect(() => { const timer = setTimeout(fetchMovies, query.trim() ? 450 : 0); return () => clearTimeout(timer); }, [fetchMovies, query]);
  const activeGenre = genres.find((genre) => genre.id === selectedGenre);
  const clearFilters = () => { setSelectedGenre(null); setQuery(""); };

  return <section className="home" id="home-section">
    <div className="home-hero"><h1 className="home-title">Descubra <span className="title-accent">Filmes</span></h1><p className="home-subtitle">Encontre seu próximo filme, salve favoritos e compartilhe sua lista.</p>
      <label className="search-box" htmlFor="movie-search"><span aria-hidden="true">⌕</span><input id="movie-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar filmes..." />{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar pesquisa">×</button>}</label>
    </div>
    {!query && !selectedGenre && topRated.length > 0 && <section className="top-rated-section" aria-labelledby="top-rated-title"><div className="section-heading"><div><p className="section-kicker">Escolha da audiência</p><h2 id="top-rated-title">Melhores avaliados</h2></div></div><ul className="top-rated-row">{topRated.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} />)}</ul></section>}
    <div className="genre-bar-wrapper" id="genre-filter-bar"><h2 className="visually-hidden">Categorias</h2><div className="genre-bar"><button className={`genre-chip ${selectedGenre === null ? "active" : ""}`} onClick={() => setSelectedGenre(null)}>Todos</button>{genres.map((genre) => <button key={genre.id} className={`genre-chip ${selectedGenre === genre.id ? "active" : ""}`} onClick={() => setSelectedGenre(selectedGenre === genre.id ? null : genre.id)}>{genre.name}</button>)}</div></div>
    {(query || activeGenre) && <div className="active-filter"><span className="active-filter-label">{query ? `Resultados para “${query}”` : `Categoria: ${activeGenre.name}`}</span><button className="active-filter-clear" onClick={clearFilters} aria-label="Limpar filtros">×</button></div>}
    <div className="home-content">{!query && !selectedGenre && <div className="section-heading catalog-heading"><div><p className="section-kicker">Para você</p><h2>Filmes populares</h2></div></div>}{loading && <LoadingGrid count={12} />}{error && <div className="error-state"><span className="error-icon">⚠️</span><p className="error-message">{error}</p><button className="error-retry" onClick={fetchMovies}>Tentar novamente</button></div>}{!loading && !error && movies.length === 0 && <div className="empty-state"><span className="empty-icon">🎬</span><p>Nenhum filme encontrado.</p><button className="explore-button" onClick={clearFilters}>Ver filmes populares</button></div>}{!loading && !error && movies.length > 0 && <ul className="movies-grid">{movies.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} />)}</ul>}</div>
  </section>;
}

export default Home;
