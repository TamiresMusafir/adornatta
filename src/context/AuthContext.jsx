import { createContext, useContext, useState } from "react";
import { buscarUsuario } from "../services/api";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const usuarioSalvo = localStorage.getItem("adornattaUsuario");

        return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    });

    async function login(email, senha) {
        const usuarioEncontrado = await buscarUsuario(email, senha);

        console.log("Usuário encontrado:", usuarioEncontrado);

        if (!usuarioEncontrado) {
            return false;
        }

        setUsuario(usuarioEncontrado);

        localStorage.setItem(
            "adornattaUsuario",
            JSON.stringify(usuarioEncontrado)
        );

        return true;
    }

    function logout() {
        setUsuario(null);
        localStorage.removeItem("adornattaUsuario");
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                autenticado: !!usuario,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };