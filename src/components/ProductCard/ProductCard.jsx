function ProductCard({
    nome,
    descricao,
    preco,
    imagem,
    tag
}) {
    return (
        <article className="col-md-4">
            <div className="product-card">

                <div className="product-image">

                    {tag && (
                        <span className="product-tag">
                            {tag}
                        </span>
                    )}

                    <button
                        className="product-wishlist"
                        type="button"
                        aria-label={`Adicionar ${nome} aos favoritos`}
                    >
                        <i className="bi bi-heart"></i>
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

                <span className="product-price">
                    {preco}
                </span>

            </div>
        </article>
    );
}

export default ProductCard;