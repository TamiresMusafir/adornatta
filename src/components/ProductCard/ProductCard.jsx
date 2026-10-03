import { useState } from "react";
import { Link } from "react-router-dom";

import { useWishlist } from "../../context/WishlistContext";
import Toast from "../Toast/Toast";

function ProductCard({
    id,
    nome,
    descricao,
    preco,
    imagem,
    tag
}) {
    const {
        alternarFavorito,
        estaNosFavoritos
    } = useWishlist();

    const [toastVisivel, setToastVisivel] = useState(false);

    const favorito = estaNosFavoritos(id);

    function alternarProdutoFavorito() {
        const produtoEstaFavoritado = estaNosFavoritos(id);

        alternarFavorito({
            id,
            nome,
            descricao,
            preco,
            imagem,
            tag
        });

        if (!produtoEstaFavoritado) {
            setToastVisivel(true);
        }
    }

    return (
        <>
            <div className="col-md-4">
                <article className="product-card">

                    <div className="product-image">

                        {tag && (
                            <span className="product-tag">
                                {tag}
                            </span>
                        )}

                        <button
                            className={`product-wishlist ${
                                favorito ? "active" : ""
                            }`}
                            type="button"
                            aria-label={
                                favorito
                                    ? `Remover ${nome} dos favoritos`
                                    : `Adicionar ${nome} aos favoritos`
                            }
                            onClick={alternarProdutoFavorito}
                        >
                            <i
                                className={
                                    favorito
                                        ? "bi bi-heart-fill"
                                        : "bi bi-heart"
                                }
                            ></i>
                        </button>

                        <img
                            src={imagem}
                            alt={nome}
                        />

                    </div>

                    <h3 className="product-name">
                        {nome}
                    </h3>

                    <p className="product-description">
                        {descricao}
                    </p>

                    <span className="product-price d-block mb-3">
                        {preco}
                    </span>

                    <Link
                        to={`/produtos/${id}`}
                        className="btn btn-outline-dark rounded-0"
                    >
                        Ver detalhes
                        <i className="bi bi-arrow-right ms-2"></i>
                    </Link>

                </article>
            </div>

            <Toast
                mensagem="Produto adicionado à lista de desejos."
                tipo="sucesso"
                visivel={toastVisivel}
                onFechar={() => setToastVisivel(false)}
            />
        </>
    );
}

export default ProductCard;