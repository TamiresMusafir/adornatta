import { Link } from "react-router-dom";

function CartOffcanvas() {
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
                <p className="text-muted">
                    Seu carrinho está vazio.
                </p>

                <Link
                    to="/produtos"
                    className="btn btn-gold"
                >
                    Ver produtos
                </Link>
            </section>
        </aside>
    );
}

export default CartOffcanvas;