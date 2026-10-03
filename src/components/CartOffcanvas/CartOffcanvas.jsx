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
            Number(
                produto.preco
                    .replace("R$", "")
                    .replace(".", "")
                    .replace(",", ".")
            ) *
                produto.quantidade,
        0
    );

    function fecharOffcanvas() {
        const offcanvas = document.getElementById("cartOffcanvas");

        if (offcanvas && window.bootstrap) {
            const instancia =
                window.bootstrap.Offcanvas.getInstance(offcanvas);

            if (instancia) {
                instancia.hide();
            }
        }

        document
            .querySelectorAll(".offcanvas-backdrop")
            .forEach((elemento) => elemento.remove());

        document.body.classList.remove("offcanvas-backdrop");
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
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
                    <div>

                        <p className="text-muted">
                            Seu carrinho está vazio.
                        </p>

                        <button
                            type="button"
                            className="btn btn-gold"
                            onClick={irParaProdutos}
                        >
                            Ver produtos
                        </button>

                    </div>
                ) : (
                    <div>

                        {carrinho.map((produto) => (
                            <article
                                key={produto.id}
                                className="cart-item"
                            >

                                <img
                                    src={produto.imagem}
                                    alt={produto.nome}
                                    className="cart-item-image"
                                />

                                <div className="cart-item-content">

                                    <h3>
                                        {produto.nome}
                                    </h3>

                                    <p>
                                        {produto.preco}
                                    </p>

                                    <div className="cart-item-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                alterarQuantidade(
                                                    produto.id,
                                                    produto.quantidade - 1
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {produto.quantidade}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                alterarQuantidade(
                                                    produto.id,
                                                    produto.quantidade + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    <button
                                        type="button"
                                        className="cart-item-remove"
                                        onClick={() =>
                                            removerDoCarrinho(produto.id)
                                        }
                                    >
                                        Remover
                                    </button>

                                </div>

                            </article>
                        ))}

                        <div className="cart-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                R$ {total.toFixed(2).replace(".", ",")}
                            </strong>

                        </div>

                        <button
                            type="button"
                            className="btn btn-gold w-100 mt-4"
                            onClick={irParaCheckout}
                        >
                            Finalizar pedido
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-dark rounded-0 w-100 mt-3"
                            onClick={irParaProdutos}
                        >
                            Continuar comprando
                        </button>

                    </div>
                )}

            </section>
        </aside>
    );
}

export default CartOffcanvas;