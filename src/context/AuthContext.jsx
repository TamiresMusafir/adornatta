import {
    createContext,
    useContext,
    useState
} from "react";

import {
    buscarUsuario,
    criarUsuario,
    atualizarUsuario
} from "../services/api";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const usuarioSalvo =
            localStorage.getItem("adornattaUsuario");

        return usuarioSalvo
            ? JSON.parse(usuarioSalvo)
            : null;
    });

    async function login(email, senha) {
        const usuarioEncontrado =
            await buscarUsuario(email, senha);

        if (!usuarioEncontrado) {
            return null;
        }

        setUsuario(usuarioEncontrado);

        localStorage.setItem(
            "adornattaUsuario",
            JSON.stringify(usuarioEncontrado)
        );

        return usuarioEncontrado;
    }

    async function registrar(dados) {
        const novoUsuario = await criarUsuario({
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha,
            perfil: "cliente"
        });

        setUsuario(novoUsuario);

        localStorage.setItem(
            "adornattaUsuario",
            JSON.stringify(novoUsuario)
        );

        return novoUsuario;
    }

    async function atualizarDados(dados) {
        if (!usuario?.id) {
            return false;
        }

        const usuarioAtualizado =
            await atualizarUsuario(
                usuario.id,
                dados
            );

        setUsuario(usuarioAtualizado);

        localStorage.setItem(
            "adornattaUsuario",
            JSON.stringify(usuarioAtualizado)
        );

        return usuarioAtualizado;
    }

    function logout() {
        setUsuario(null);

        localStorage.removeItem(
            "adornattaUsuario"
        );
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                autenticado: !!usuario,
                login,
                registrar,
                logout,
                atualizarDados
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export {
    AuthProvider,
    useAuth
};