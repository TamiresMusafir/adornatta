import SearchOffcanvas from "../SearchOffcanvas/SearchOffcanvas";
import CartOffcanvas from "../CartOffcanvas/CartOffcanvas";

function Header() {
  return (
    <>
      <header>

        <section className="topbar">
          <p>
            Frete grátis para compras acima de R$ 199,90
          </p>
        </section>

        <nav
          className="navbar navbar-expand-lg main-navbar sticky-top"
          aria-label="Navegação principal"
        >
          <section className="container">

            <a className="navbar-brand" href="/">
              Adornatta
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Abrir menu"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <section
              className="collapse navbar-collapse"
              id="navbarContent"
            >

              <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                <li className="nav-item">
                  <a className="nav-link" href="/">
                    Início
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/produtos">
                    Produtos
                  </a>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categorias
                  </a>

                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/produtos">
                        Brincos
                      </a>
                    </li>

                    <li>
                      <a className="dropdown-item" href="/produtos">
                        Conjuntos
                      </a>
                    </li>

                    <li>
                      <a className="dropdown-item" href="/produtos">
                        Pulseiras
                      </a>
                    </li>

                    <li>
                      <a className="dropdown-item" href="/produtos">
                        Cordões
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/sobre">
                    Sobre nós
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/contato">
                    Contato
                  </a>
                </li>

              </ul>

              <section className="d-flex align-items-center gap-3">

                <button
                  type="button"
                  className="btn btn-link"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#searchOffcanvas"
                  aria-controls="searchOffcanvas"
                  aria-label="Buscar produtos"
                >
                  <i className="bi bi-search"></i>
                </button>

                <a
                  href="/login"
                  className="btn btn-link"
                  aria-label="Minha conta"
                >
                  <i className="bi bi-person"></i>
                </a>

                <a
                  href="/listaDesejo"
                  className="btn btn-link"
                  aria-label="Lista de desejos"
                >
                  <i className="bi bi-heart"></i>
                </a>

                <button
                  type="button"
                  className="btn btn-link position-relative"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#cartOffcanvas"
                  aria-controls="cartOffcanvas"
                  aria-label="Carrinho"
                >
                  <i className="bi bi-bag"></i>
                </button>

              </section>

            </section>
          </section>
        </nav>

      </header>

      <SearchOffcanvas />
      <CartOffcanvas />
    </>
  );
}

export default Header;