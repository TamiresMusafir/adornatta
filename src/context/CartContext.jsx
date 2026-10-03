import { createContext, useContext, useState } from "react";

const CartContext = createContext();

function CartProvider({ children }) {
    const [carrinho, setCarrinho] = useState([]);

    function adicionarAoCarrinho(produto) {
        setCarrinho((carrinhoAtual) => {
            const produtoExistente = carrinhoAtual.find(
                (item) => item.id === produto.id
            );

            if (produtoExistente) {
                return carrinhoAtual.map((item) =>
                    item.id === produto.id
                        ? {
                              ...item,
                              quantidade: item.quantidade + 1
                          }
                        : item
                );
            }

            return [
                ...carrinhoAtual,
                {
                    ...produto,
                    quantidade: 1
                }
            ];
        });
    }

    function removerDoCarrinho(id) {
        setCarrinho((carrinhoAtual) =>
            carrinhoAtual.filter((item) => item.id !== id)
        );
    }

    function alterarQuantidade(id, quantidade) {
        if (quantidade <= 0) {
            removerDoCarrinho(id);
            return;
        }

        setCarrinho((carrinhoAtual) =>
            carrinhoAtual.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantidade
                      }
                    : item
            )
        );
    }

    return (
        <CartContext.Provider
            value={{
                carrinho,
                adicionarAoCarrinho,
                removerDoCarrinho,
                alterarQuantidade
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

function useCart() {
    return useContext(CartContext);
}

export { CartProvider, useCart };