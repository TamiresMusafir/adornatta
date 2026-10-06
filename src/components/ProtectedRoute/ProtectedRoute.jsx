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
        autenticado
    } = useAuth();

    const location = useLocation();

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
        usuario?.perfil !== "admin"
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