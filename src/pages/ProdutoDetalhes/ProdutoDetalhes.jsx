import { Link, useParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";

function ProdutoDetalhes() {
    const { id } = useParams();
    const { adicionarAoCarrinho } = useCart();

    const produtos = [
        {
            id: 1,
            nome: "Brinco 2 em 1",
            categoria: "Brincos",
            descricao:
                "Delicadeza e versatilidade em uma única peça.",
            detalhes:
                "O Brinco 2 em 1 combina delicadeza e praticidade, permitindo diferentes formas de uso para acompanhar diversos estilos e ocasiões.",
            preco: "R$ 39,99",
            imagem: "/assets/images/brinco_2_em_1.jpeg",
            tag: "Destaque"
        },
        {
            id: 2,
            nome: "Brinco Flores",
            categoria: "Brincos",
            descricao:
                "Uma peça delicada para completar seu estilo.",
            detalhes:
                "O Brinco Flores traz um design delicado e elegante, ideal para complementar diferentes produções.",
            preco: "R$ 24,99",
            imagem: "/assets/images/brinco_flores.jpeg"
        },
        {
            id: 3,
            nome: "Conjunto Cruz",
            categoria: "Conjuntos",
            descricao:
                "Elegância e significado em uma combinação especial.",
            detalhes:
                "O Conjunto Cruz combina brinco e cordão em uma composição delicada e versátil.",
            preco: "R$ 49,99",
            imagem: "/assets/images/conjunto_cruz.jpeg"
        },
        {
            id: 4,
            nome: "Conjunto Ponto de Luz",
            categoria: "Conjuntos",
            descricao:
                "Delicadeza e brilho para diferentes ocasiões.",
            detalhes:
                "O Conjunto Ponto de Luz apresenta um design delicado e elegante, ideal para quem busca um toque discreto de brilho.",
            preco: "R$ 59,99",
            imagem: "/assets/images/conjunto_ponto_de_luz.jpeg"
        },
        {
            id: 5,
            nome: "Pulseira Ponto de Luz",
            categoria: "Pulseiras",
            descricao:
                "Um toque delicado de brilho para o seu visual.",
            detalhes:
                "A Pulseira Ponto de Luz combina delicadeza e brilho em uma peça versátil para diferentes momentos.",
            preco: "R$ 34,99",
            imagem: "/assets/images/pulseira_ponto_luz.jpeg"
        },
        {
            id: 6,
            nome: "Bracelete Fino",
            categoria: "Pulseiras",
            descricao:
                "Uma peça delicada e versátil para o dia a dia.",
            detalhes:
                "O Bracelete Fino apresenta um design minimalista e elegante, podendo ser utilizado sozinho ou combinado com outras peças.",
            preco: "R$ 34,99",
            imagem: "/assets/images/bracelete_fino.jpeg"
        },
        {
            id: 7,
            nome: "Brinco Flor",
            categoria: "Brincos",
            descricao:
                "Delicadeza e feminilidade em uma peça especial.",
            detalhes:
                "O Brinco Flor apresenta um formato delicado que combina facilmente com diferentes estilos.",
            preco: "R$ 24,99",
            imagem: "/assets/images/brinco_flor.jpeg"
        },
        {
            id: 8,
            nome: "Brinco de Argola Tripla",
            categoria: "Brincos",
            descricao:
                "Um modelo moderno para destacar seu estilo.",
            detalhes:
                "O Brinco de Argola Tripla possui um design marcante e moderno para complementar diferentes produções.",
            preco: "R$ 34,99",
            imagem: "/assets/images/brinco_argola_tripla.jpeg"
        },
        {
            id: 9,
            nome: "Bracelete Liso",
            categoria: "Pulseiras",
            descricao:
                "Design minimalista e elegante.",
            detalhes:
                "O Bracelete Liso possui um design minimalista e versátil, ideal para diferentes ocasiões.",
            preco: "R$ 59,99",
            imagem: "/assets/images/bracelete_liso.jpeg"
        },
        {
            id: 10,
            nome: "Choker Medalhas",
            categoria: "Cordões",
            descricao:
                "Uma peça moderna para complementar diferentes looks.",
            detalhes:
                "A Choker Medalhas combina um design moderno com detalhes delicados para complementar diferentes estilos.",
            preco: "R$ 39,99",
            imagem: "/assets/images/choker_medalhas.jpeg"
        },
        {
            id: 11,
            nome: "Gravatinha de Medalhas",
            categoria: "Cordões",
            descricao:
                "Delicadeza e personalidade em um design especial.",
            detalhes:
                "A Gravatinha de Medalhas apresenta um design delicado e marcante para completar diferentes produções.",
            preco: "R$ 44,99",
            imagem: "/assets/images/gravatinha_medalhas.jpeg"
        }
    ];

    const produto = produtos.find(
        (produto) => produto.id === Number(id)
    );

    if (!produto) {
        return (
            <>
                <Header />

                <main>
                    <section className="section">
                        <div className="container text-center">
                            <span className="section-label">
                                Produto não encontrado
                            </span>

                            <h1 className="section-title mb-4">
                                Não encontramos esse produto.
                            </h1>

                            <Link
                                to="/produtos"
                                className="btn btn-gold"
                            >
                                Voltar para produtos
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main>
                <section className="section">
                    <div className="container">

                        <div className="row align-items-center g-5">

                            <div className="col-lg-6">
                                <div className="product-detail-image">

                                    {produto.tag && (
                                        <span className="product-tag">
                                            {produto.tag}
                                        </span>
                                    )}

                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                    />

                                </div>
                            </div>

                            <div className="col-lg-5 offset-lg-1">

                                <span className="section-label">
                                    {produto.categoria}
                                </span>

                                <h1 className="section-title mb-3">
                                    {produto.nome}
                                </h1>

                                <p className="section-text mb-4">
                                    {produto.descricao}
                                </p>

                                <p className="product-detail-price mb-4">
                                    {produto.preco}
                                </p>

                                <div className="product-detail-info mb-4">
                                    <p>
                                        <strong>Material:</strong>{" "}
                                        Semijoia banhada a ouro 18K
                                    </p>

                                    <p>
                                        <strong>Características:</strong>{" "}
                                        Hipoalergênica
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-gold w-100 mb-3"
                                    onClick={() => adicionarAoCarrinho(produto)}
                                >
                                    Adicionar ao carrinho
                                    <i className="bi bi-bag ms-2"></i>
                                </button>

                                <Link
                                    to="/produtos"
                                    className="btn btn-outline-dark rounded-0 w-100"
                                >
                                    Continuar comprando
                                </Link>

                            </div>

                        </div>

                        <div className="row mt-5 pt-5 border-top">

                            <div className="col-lg-8">

                                <span className="section-label">
                                    Sobre a peça
                                </span>

                                <h2 className="section-title mb-4">
                                    Detalhes do produto
                                </h2>

                                <p className="section-text mb-0">
                                    {produto.detalhes}
                                </p>

                            </div>

                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default ProdutoDetalhes;