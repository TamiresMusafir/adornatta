import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

function WishlistProvider({ children }) {
    const [listaDesejos, setListaDesejos] = useState([]);

    function alternarFavorito(produto) {
        setListaDesejos((listaAtual) => {
            const produtoExiste = listaAtual.some(
                (item) => item.id === produto.id
            );

            if (produtoExiste) {
                return listaAtual.filter(
                    (item) => item.id !== produto.id
                );
            }

            return [...listaAtual, produto];
        });
    }

    function removerFavorito(id) {
        setListaDesejos((listaAtual) =>
            listaAtual.filter((item) => item.id !== id)
        );
    }

    function estaNosFavoritos(id) {
        return listaDesejos.some(
            (item) => item.id === id
        );
    }

    return (
        <WishlistContext.Provider
            value={{
                listaDesejos,
                alternarFavorito,
                removerFavorito,
                estaNosFavoritos
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

function useWishlist() {
    return useContext(WishlistContext);
}

export { WishlistProvider, useWishlist };