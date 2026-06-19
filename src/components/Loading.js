import "./Loading.css";

function LoadingGrid({ count = 12 }) {
  return (
    <ul className="loading-grid" id="loading-grid">
      {Array.from({ length: count }).map((_, i) => (
        <li className="skeleton-card" key={i}>
          <div className="skeleton-poster" />
          <div className="skeleton-info">
            <div className="skeleton-title" />
            <div className="skeleton-date" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function LoadingSpinner() {
  return (
    <div className="loading-spinner-wrapper" id="loading-spinner">
      <div className="loading-spinner" />
      <p className="loading-text">Carregando...</p>
    </div>
  );
}

export { LoadingGrid, LoadingSpinner };
