// Simple loader shown while the initial contact list is "loading".
function Loader() {
  return (
    <div className="loader">
      <div className="spinner" />
      <p>Cargando contactos...</p>
    </div>
  );
}

export default Loader;
