import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function CartOffcanvas() {
    const {
        carrinho,
        removerDoCarrinho,
        alterarQuantidade
    } = useCart();

    const total = carrinho.reduce(
        (soma, produto) =>
            soma + Number(
                produto.preco
                    .replace("R$", "")
                    .replace(".", "")
                    .replace(",", ".")
            ) * produto.quantidade,
        0
    );

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

                        <Link
                            to="/produtos"
                            className="btn btn-gold"
                            data-bs-dismiss="offcanvas"
                        >
                            Ver produtos
                        </Link>
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

                        <Link
                            to="/checkout"
                            className="btn btn-gold w-100 mt-4"
                        >
                            Finalizar pedido
                        </Link>

                    </div>
                )}

            </section>
        </aside>
    );
}

export default CartOffcanvas;