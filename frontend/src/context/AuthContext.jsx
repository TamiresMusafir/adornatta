import {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useState
} from "react";

import {
    loginUsuario,
    buscarSessao,
    encerrarSessao,
    criarUsuario,
    atualizarUsuario
} from "../services/api";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregandoSessao, setCarregandoSessao] = useState(true);
    const [erroSessao, setErroSessao] = useState(null);

    const recarregarSessao = useCallback(async () => {
        setCarregandoSessao(true);
        setErroSessao(null);

        try {
            setUsuario(await buscarSessao());
        } catch (error) {
            setUsuario(null);
            setErroSessao(error);
        } finally {
            setCarregandoSessao(false);
        }
    }, []);

    useEffect(() => {
        recarregarSessao();
    }, [recarregarSessao]);

    async function login(email, senha) {
        const usuarioAutenticado = await loginUsuario(email, senha);
        setUsuario(usuarioAutenticado);
        setErroSessao(null);
        return usuarioAutenticado;
    }

    async function registrar(dados) {
        const novoUsuario = await criarUsuario(dados);
        setUsuario(novoUsuario);
        setErroSessao(null);
        return novoUsuario;
    }

    async function atualizarDados(dados) {
        if (!usuario?.id) {
            return false;
        }

        const usuarioAtualizado = await atualizarUsuario(usuario.id, dados);
        setUsuario(usuarioAtualizado);
        return usuarioAtualizado;
    }

    async function logout() {
        await encerrarSessao();
        setUsuario(null);
        setErroSessao(null);
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                autenticado: !!usuario,
                carregandoSessao,
                erroSessao,
                recarregarSessao,
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