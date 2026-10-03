import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function CartOffcanvas() {
    const navigate = useNavigate();

    const {
        carrinho,
        removerDoCarrinho,
        alterarQuantidade
    } = useCart();

    const total = carrinho.reduce(
        (soma, produto) =>
            soma +
            Number(produto.preco) *
                produto.quantidade,
        0
    );

    function formatarPreco(preco) {
        return Number(preco).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    function fecharOffcanvas() {
        const offcanvas =
            document.getElementById("cartOffcanvas");

        if (offcanvas && window.bootstrap) {
            const instancia =
                window.bootstrap.Offcanvas.getInstance(
                    offcanvas
                );

            if (instancia) {
                instancia.hide();
            }
        }

        document
            .querySelectorAll(".offcanvas-backdrop")
            .forEach((elemento) =>
                elemento.remove()
            );

        document.body.classList.remove(
            "offcanvas-backdrop"
        );

        document.body.classList.remove(
            "modal-open"
        );

        document.body.style.removeProperty(
            "overflow"
        );

        document.body.style.removeProperty(
            "padding-right"
        );
    }

    function irParaProdutos() {
        fecharOffcanvas();
        navigate("/produtos");
    }

    function irParaCheckout() {
        fecharOffcanvas();
        navigate("/checkout");
    }

    return (
        <aside
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="cartOffcanvas"
            aria-labelledby="cartOffcanvasLabel"
        >
            <header className="offcanvas-header">

                <h2
                    className="offcanvas-title"
                    id="cartOffcanvasLabel"
                >
                    Seu carrinho
                </h2>

                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Fechar"
                ></button>

            </header>

            <section className="offcanvas-body">

                {carrinho.length === 0 ? (
                    <div className="cart-empty text-center">

                        <div className="cart-empty-icon">
                            <i className="bi bi-bag"></i>
                        </div>

                        <h3>
                            Seu carrinho está vazio.
                        </h3>

                        <p>
                            Explore nossas peças e
                            encontre algo especial para você.
                        </p>

                        <button
                            type="button"
                            className="btn btn-gold"
                            onClick={irParaProdutos}
                        >
                            Ver produtos
                            <i className="bi bi-arrow-right ms-2"></i>
                        </button>

                    </div>
                ) : (
                    <>
                        <div className="cart-items">

                            {carrinho.map((produto) => (
                                <article
                                    className="cart-item"
                                    key={produto.id}
                                >

                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                    />

                                    <div className="cart-item-info">

                                        <h3>
                                            {produto.nome}
                                        </h3>

                                        <span>
                                            {formatarPreco(
                                                produto.preco
                                            )}
                                        </span>

                                        <div className="cart-item-actions">

                                            <label
                                                htmlFor={`quantidade-${produto.id}`}
                                                className="visually-hidden"
                                            >
                                                Quantidade de{" "}
                                                {produto.nome}
                                            </label>

                                            <input
                                                id={`quantidade-${produto.id}`}
                                                type="number"
                                                min="1"
                                                value={
                                                    produto.quantidade
                                                }
                                                onChange={(event) =>
                                                    alterarQuantidade(
                                                        produto.id,
                                                        Number(
                                                            event.target.value
                                                        )
                                                    )
                                                }
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-link"
                                                onClick={() =>
                                                    removerDoCarrinho(
                                                        produto.id
                                                    )
                                                }
                                            >
                                                Remover
                                            </button>

                                        </div>

                                    </div>

                                </article>
                            ))}

                        </div>

                        <footer className="cart-footer">

                            <div className="cart-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    {formatarPreco(total)}
                                </strong>

                            </div>

                            <button
                                type="button"
                                className="btn btn-gold w-100"
                                onClick={irParaCheckout}
                            >
                                Finalizar pedido
                                <i className="bi bi-arrow-right ms-2"></i>
                            </button>

                        </footer>
                    </>
                )}

            </section>
        </aside>
    );
}

export default CartOffcanvas;