import { Link } from "react-router-dom";

function CategoryCard({ numero, nome, imagem }) {
    return (
        <article className="col-md-4">
            <Link
                to={`/produtos?categoria=${nome}`}
                className="category-card"
            >
                <img
                    src={imagem}
                    alt={nome}
                />

                <div className="category-info">
                    <span>{numero} · Coleção</span>

                    <h3>{nome}</h3>

                    <span>
                        Ver coleção
                        <i className="bi bi-arrow-right ms-1"></i>
                    </span>
                </div>
            </Link>
        </article>
    );
}

export default CategoryCard;