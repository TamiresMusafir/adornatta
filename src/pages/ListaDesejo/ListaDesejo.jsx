import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";

import { useWishlist } from "../../context/WishlistContext";

function ListaDesejo() {
    const {
        listaDesejos,
        removerFavorito
    } = useWishlist();

    return (
        <>
            <Header />

            <main>
                <section className="section">
                    <div className="container">

                        <header className="text-center mb-5">
                            <span className="section-label">
                                Seus favoritos
                            </span>

                            <h1 className="section-title">
                                Lista de desejos
                            </h1>

                            <p className="section-text">
                                Guarde suas peças favoritas para
                                encontrá-las novamente quando quiser.
                            </p>
                        </header>

                        {listaDesejos.length === 0 ? (
                            <div className="wishlist-empty text-center">

                                <div className="wishlist-empty-icon">
                                    <i className="bi bi-heart"></i>
                                </div>

                                <h2>
                                    Sua lista está vazia.
                                </h2>

                                <p>
                                    Explore nossas peças e salve
                                    seus produtos favoritos.
                                </p>

                                <Link
                                    to="/produtos"
                                    className="btn btn-gold"
                                >
                                    Explorar produtos
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </Link>

                            </div>
                        ) : (
                            <section
                                className="row g-4"
                                aria-label="Produtos favoritos"
                            >
                                {listaDesejos.map((produto) => (
                                    <article
                                        className="col-md-4"
                                        key={produto.id}
                                    >

                                        <ProductCard
                                            id={produto.id}
                                            nome={produto.nome}
                                            descricao={produto.descricao}
                                            preco={produto.preco}
                                            imagem={produto.imagem}
                                            tag={produto.tag}
                                        />

                                        <button
                                            type="button"
                                            className="wishlist-remove"
                                            onClick={() =>
                                                removerFavorito(produto.id)
                                            }
                                        >
                                            <i className="bi bi-heart-fill me-1"></i>
                                            Remover dos favoritos
                                        </button>

                                    </article>
                                ))}
                            </section>
                        )}

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default ListaDesejo;