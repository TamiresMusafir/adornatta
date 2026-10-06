import CategoryCard from "../../components/CategoryCard/CategoryCard";

function Categories() {
    const categorias = [
        {
            id: 1,
            numero: "01",
            nome: "Brincos",
            imagem: "/assets/images/brinco_flor.jpeg"
        },
        {
            id: 2,
            numero: "02",
            nome: "Conjuntos",
            imagem: "/assets/images/conjunto_ponto_de_luz.jpeg"
        },
        {
            id: 3,
            numero: "03",
            nome: "Pulseiras",
            imagem: "/assets/images/bracelete_liso.jpeg"
        },
        {
            id: 4,
            numero: "04",
            nome: "Cordões",
            imagem: "/assets/images/choker_medalhas.jpeg"
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