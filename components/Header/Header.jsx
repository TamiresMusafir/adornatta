function Header() {
    return (
        <header>

            {/* TOPBAR */}
            <div className="topbar py-2">
                <div className="container text-center">
                    <span>
                        Elegância em cada detalhe · Descubra a coleção Adornatta
                    </span>
                </div>
            </div>

            {/* NAVBAR */}
            <nav className="navbar navbar-expand-lg main-navbar sticky-top">

                <div className="container">

                    <a className="navbar-brand brand" href="/">
                        ADORNATTA
                    </a>

                    <button
                        className="navbar-toggler border-0 shadow-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainMenu"
                        aria-controls="mainMenu"
                        aria-expanded="false"
                        aria-label="Abrir menu"
                    >
                        <i className="bi bi-list fs-3"></i>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="mainMenu"
                    >

                        <ul className="navbar-nav mx-auto mb-3 mb-lg-0">

                            <li className="nav-item">
                                <a className="nav-link" href="/">
                                    Início
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/sobre">
                                    Sobre nós
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

                                <ul className="dropdown-menu border-0 shadow-lg rounded-0 p-2">

                                    <li>
                                        <a
                                            className="dropdown-item py-2"
                                            href="/categorias"
                                        >
                                            Anéis
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="dropdown-item py-2"
                                            href="/categorias"
                                        >
                                            Colares
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="dropdown-item py-2"
                                            href="/categorias"
                                        >
                                            Brincos
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="dropdown-item py-2"
                                            href="/categorias"
                                        >
                                            Pulseiras
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="dropdown-item py-2"
                                            href="/categorias"
                                        >
                                            Conjuntos
                                        </a>
                                    </li>

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>

                                    <li>
                                        <a
                                            className="dropdown-item py-2 fw-semibold"
                                            href="/categorias"
                                        >
                                            Ver todas as categorias
                                            <i className="bi bi-arrow-right ms-1"></i>
                                        </a>
                                    </li>

                                </ul>

                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/contato">
                                    Contato
                                </a>
                            </li>

                        </ul>

                        {/* AÇÕES DO CLIENTE */}
                        <div className="d-flex align-items-center justify-content-center gap-1">

                            {/* PESQUISA */}
                            <button
                                className="nav-icon"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#searchCanvas"
                                aria-label="Pesquisar"
                                title="Pesquisar produtos"
                            >
                                <i className="bi bi-search"></i>
                            </button>

                            {/* CONTA */}
                            <div className="dropdown">

                                <button
                                    className="nav-icon"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    aria-label="Minha conta"
                                    title="Minha conta"
                                >
                                    <i className="bi bi-person"></i>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-0 p-2">

                                    <li>
                                        <a
                                            className="dropdown-item py-2"
                                            href="/login"
                                        >
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Entrar
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            className="dropdown-item py-2"
                                            href="/cadastro"
                                        >
                                            <i className="bi bi-person-plus me-2"></i>
                                            Cadastrar-se
                                        </a>
                                    </li>

                                </ul>

                            </div>

                            {/* LISTA DE DESEJOS */}
                            <a
                                className="nav-icon"
                                href="/lista-desejos"
                                title="Lista de desejos"
                                aria-label="Lista de desejos"
                            >
                                <i className="bi bi-heart"></i>
                                <span className="icon-badge">2</span>
                            </a>

                            {/* CARRINHO */}
                            <button
                                className="nav-icon"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#cartCanvas"
                                aria-label="Carrinho"
                                title="Carrinho"
                            >
                                <i className="bi bi-bag"></i>
                                <span className="icon-badge">
                                    2
                                </span>
                            </button>

                        </div>

                    </div>

                </div>

            </nav>

        </header>
    );
}

export default Header;