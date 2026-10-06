import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
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
        <header>
            <nav
                className="navbar navbar-expand-lg border-bottom bg-white"
                aria-label="Navegação administrativa"
            >
                <div className="container">

                    <span className="navbar-brand display-font">
                        ADORNATTA
                    </span>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#adminNavbar"
                        aria-controls="adminNavbar"
                        aria-expanded="false"
                        aria-label="Abrir menu administrativo"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="adminNavbar"
                    >

                        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

                            {autenticado &&
                                usuario?.perfil === "admin" && (
                                    <li className="nav-item">
                                        <Link
                                            to="/admin"
                                            className="nav-link"
                                        >
                                            <i className="bi bi-speedometer2 me-1"></i>
                                            Painel
                                        </Link>
                                    </li>
                                )}

                            <li className="nav-item">
                                <Link
                                    to="/"
                                    className="nav-link"
                                >
                                    <i className="bi bi-shop me-1"></i>
                                    Acessar loja
                                </Link>
                            </li>

                            {autenticado && (
                                <li className="nav-item ms-lg-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark btn-sm"
                                        onClick={sair}
                                    >
                                        <i className="bi bi-box-arrow-right me-1"></i>
                                        Sair
                                    </button>
                                </li>
                            )}

                        </ul>

                    </div>

                </div>
            </nav>
        </header>
    );
}

export default AdminHeader;