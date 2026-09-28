import CategoryCard from "../../components/CategoryCard/CategoryCard";

function Categories() {
    const categorias = [
        {
            id: 1,
            numero: "01",
            nome: "Brincos",
            imagem: "/assets/images/image-01.jpg"
        },
        {
            id: 2,
            numero: "02",
            nome: "Conjuntos",
            imagem: "/assets/images/image-02.jpg"
        },
        {
            id: 3,
            numero: "03",
            nome: "Pulseiras",
            imagem: "/assets/images/image-03.jpg"
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <div className="row align-items-end mb-5">
                    <div className="col-lg-7">
                        <span className="section-label">
                            Explore
                        </span>

                        <h2 className="section-title">
                            Encontre seu brilho
                        </h2>
                    </div>

                    <div className="col-lg-5">
                        <p className="section-text mb-0">
                            Descubra peças pensadas para combinar
                            com seu estilo, sua personalidade e seus
                            momentos especiais.
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    {categorias.map((categoria) => (
                        <CategoryCard
                            key={categoria.id}
                            numero={categoria.numero}
                            nome={categoria.nome}
                            imagem={categoria.imagem}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Categories;