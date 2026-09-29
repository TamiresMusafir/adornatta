import { Link } from "react-router-dom";

import SearchOffcanvas from "../SearchOffcanvas/SearchOffcanvas";
import CartOffcanvas from "../CartOffcanvas/CartOffcanvas";

function Header() {
    return (
        <>
            <header>

                {/* <section className="topbar">
                    <p>
                      
                    </p>
                </section> */}

                <nav
                    className="navbar navbar-expand-lg main-navbar sticky-top"
                    aria-label="Navegação principal"
                >
                    <section className="container-fluid d-flex align-items-center justify-content-between px-3 px-lg-4">

                        <Link
                            className="navbar-brand brand mb-0"
                            to="/"
                        >
                            Adornatta
                        </Link>

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
                            className="collapse navbar-collapse justify-content-between align-items-center"
                            id="navbarContent"
                        >

                            <ul className="navbar-nav mx-auto mb-0 align-items-center">

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/"
                                    >
                                        Início
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/produtos"
                                    >
                                        Produtos
                                    </Link>
                                </li>

                                <li className="nav-item dropdown">
                                    <button
                                        className="nav-link dropdown-toggle categories-dropdown-btn"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span>Categorias</span>
                                        <i className="bi bi-chevron-down dropdown-arrow"></i>
                                    </button>

                                    <ul className="dropdown-menu categories-menu border-0 shadow-sm">
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                to="/produtos?categoria=Brincos"
                                            >
                                                Brincos
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                to="/produtos?categoria=Conjuntos"
                                            >
                                                Conjuntos
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                to="/produtos?categoria=Pulseiras"
                                            >
                                                Pulseiras
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                to="/produtos?categoria=Cordões"
                                            >
                                                Cordões
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/sobre"
                                    >
                                        Sobre nós
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        to="/contato"
                                    >
                                        Contato
                                    </Link>
                                </li>

                            </ul>

                            <section className="d-flex align-items-center gap-1">

                                <button
                                    type="button"
                                    className="nav-icon"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#searchOffcanvas"
                                    aria-controls="searchOffcanvas"
                                    aria-label="Buscar produtos"
                                >
                                    <i className="bi bi-search"></i>
                                </button>

                                <Link
                                    to="/login"
                                    className="nav-icon"
                                    aria-label="Minha conta"
                                >
                                    <i className="bi bi-person"></i>
                                </Link>

                                <Link
                                    to="/listaDesejo"
                                    className="nav-icon"
                                    aria-label="Lista de desejos"
                                >
                                    <i className="bi bi-heart"></i>
                                </Link>

                                <button
                                    type="button"
                                    className="nav-icon"
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