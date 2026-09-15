function SearchOffcanvas() {
  return (
    <aside
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="searchOffcanvas"
      aria-labelledby="searchOffcanvasLabel"
    >
      <header className="offcanvas-header">
        <h2 className="offcanvas-title" id="searchOffcanvasLabel">
          Buscar produtos
        </h2>

        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Fechar"
        ></button>
      </header>

      <section className="offcanvas-body">
        <form>
          <label htmlFor="searchInput" className="form-label">
            O que você está procurando?
          </label>

          <input
            type="search"
            className="form-control"
            id="searchInput"
            placeholder="Digite o nome do produto..."
          />

          <button type="submit" className="btn btn-dark mt-3">
            <i className="bi bi-search"></i>
            {" "}Buscar
          </button>
        </form>
      </section>
    </aside>
  );
}

export default SearchOffcanvas;