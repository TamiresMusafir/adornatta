import { Link, useNavigate } from "react-router-dom";

import SearchOffcanvas from "../SearchOffcanvas/SearchOffcanvas";
import CartOffcanvas from "../CartOffcanvas/CartOffcanvas";

import { useAuth } from "../../context/AuthContext";

function Header() {
    const navigate = useNavigate();

    const {
        usuario,
        autenticado,
        logout
    } = useAuth();

    function sair() {
        logout();
        navigate("/");
    }

    return (
        <>
            <header>

                <section className="topbar">
                    <p></p>
                </section>

                <nav
                    className="navbar navbar-expand-lg main-navbar sticky-top"
                    aria-label="Navegação principal"
                >
                    {/* CONTAINER ANTIGO: container-fluid e justify-content-between para garantir o espaçamento perfeito até às margens */}
                    <section className="container-fluid d-flex align-items-center justify-content-between px-3 px-lg-4">

                        {/* BRAND ANTIGO: Link com a classe 'brand' para ativar a fonte Playfair Display */}
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

                            {/* MENU CENTRALIZADO: mx-auto empurra as margens e centra o menu */}
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

                                {/* DROPDOWN ANTIGO: com a classe categories-dropdown-btn e a seta que roda ao clicar */}
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

                            {/* ÍCONES DA DIREITA: Lógica nova intacta, mas a utilizar a classe 'nav-icon' para voltarem a ser círculos interativos */}
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

                                {autenticado ? (
                                    <>
                                        {usuario?.perfil === "admin" && (
                                            <Link
                                                to="/admin"
                                                className="nav-icon"
                                                aria-label="Painel administrativo"
                                                title="Painel administrativo"
                                            >
                                                <i className="bi bi-speedometer2"></i>
                                            </Link>
                                        )}

                                        <span
                                            className="text-muted small d-none d-lg-inline px-2"
                                            title={usuario?.email}
                                        >
                                            Olá, {usuario?.nome}
                                        </span>

                                        <button
                                            type="button"
                                            className="nav-icon border-0 bg-transparent"
                                            onClick={sair}
                                            aria-label="Sair da conta"
                                            title="Sair"
                                        >
                                            <i className="bi bi-box-arrow-right"></i>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="nav-icon"
                                        aria-label="Minha conta"
                                        title="Entrar"
                                    >
                                        <i className="bi bi-person"></i>
                                    </Link>
                                )}

                                <Link
                                    to="/listaDesejo"
                                    className="nav-icon"
                                    aria-label="Lista de desejos"
                                >
                                    <i className="bi bi-heart"></i>
                                </Link>

                                <button
                                    type="button"
                                    className="nav-icon position-relative border-0 bg-transparent"
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