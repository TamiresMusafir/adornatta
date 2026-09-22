import ProductCard from "../../components/ProductCard/ProductCard";

function Products() {
    const produtos = [
        {
            id: 1,
            nome: "Brinco 2 em 1",
            descricao: "Delicadeza e versatilidade em uma única peça.",
            preco: "R$ 39,99",
            imagem: "/assets/images/image-01.jpg",
            tag: "Destaque"
        },
        {
            id: 2,
            nome: "Brinco Flores",
            descricao: "Uma peça delicada para completar seu estilo.",
            preco: "R$ 24,99",
            imagem: "/assets/images/image-02.jpg"
        },
        {
            id: 3,
            nome: "Conjunto Cruz",
            descricao: "Elegância e significado em uma combinação especial.",
            preco: "R$ 49,99",
            imagem: "/assets/images/image-03.jpg"
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <div className="row align-items-end mb-5">
                    <div className="col-lg-7">
                        <span className="section-label">
                            Seleção Adornatta
                        </span>

                        <h2 className="section-title">
                            Peças para você
                        </h2>
                    </div>

                    <div className="col-lg-5">
                        <p className="section-text mb-0">
                            Conheça algumas das nossas peças e encontre
                            aquela que combina com seu estilo.
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    {produtos.map((produto) => (
                        <ProductCard
                            key={produto.id}
                            nome={produto.nome}
                            descricao={produto.descricao}
                            preco={produto.preco}
                            imagem={produto.imagem}
                            tag={produto.tag}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Products;