import {
    Navigate,
    useLocation
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({
    children,
    admin = false
}) {
    const {
        usuario,
        autenticado,
        carregandoSessao,
        erroSessao,
        recarregarSessao
    } = useAuth();

    const location = useLocation();

    if (carregandoSessao) {
        return (
            <main className="container py-5">
                <p role="status">Verificando sessão...</p>
            </main>
        );
    }

    if (erroSessao) {
        return (
            <main className="container py-5">
                <div className="alert alert-danger" role="alert">
                    Não foi possível verificar sua sessão: {erroSessao.message}
                </div>
                <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={recarregarSessao}
                >
                    Tentar novamente
                </button>
            </main>
        );
    }

    if (!autenticado) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location
                }}
            />
        );
    }

    if (
        admin &&
        usuario?.perfil !== "admin" &&
        usuario?.perfil !== "administrador"
    ) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;