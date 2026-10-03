import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Toast from "../../components/Toast/Toast";

import { useCart } from "../../context/CartContext";

function ProdutoDetalhes() {
    const { id } = useParams();

    const { adicionarAoCarrinho } = useCart();

    const [toastVisivel, setToastVisivel] = useState(false);

    const produtos = [
        {
            id: 1,
            nome: "Brinco 2 em 1",
            categoria: "Brincos",
            descricao:
                "Delicadeza e versatilidade em uma única peça.",
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
            preco: "R$ 24,99",
            imagem: "/assets/images/brinco_flores.jpeg"
        },
        {
            id: 3,
            nome: "Conjunto Cruz",
            categoria: "Conjuntos",
            descricao:
                "Elegância e significado em uma combinação especial.",
            preco: "R$ 49,99",
            imagem: "/assets/images/conjunto_cruz.jpeg"
        },
        {
            id: 4,
            nome: "Conjunto Ponto de Luz",
            categoria: "Conjuntos",
            descricao:
                "Delicadeza e brilho para diferentes ocasiões.",
            preco: "R$ 59,99",
            imagem: "/assets/images/conjunto_ponto_de_luz.jpeg"
        },
        {
            id: 5,
            nome: "Pulseira Ponto de Luz",
            categoria: "Pulseiras",
            descricao:
                "Um toque delicado de brilho para o seu visual.",
            preco: "R$ 34,99",
            imagem: "/assets/images/pulseira_ponto_de_luz.jpeg"
        },
        {
            id: 6,
            nome: "Bracelete Fino",
            categoria: "Pulseiras",
            descricao:
                "Uma peça delicada e versátil para o dia a dia.",
            preco: "R$ 34,99",
            imagem: "/assets/images/bracelete_fino.jpeg"
        },
        {
            id: 7,
            nome: "Brinco Flor",
            categoria: "Brincos",
            descricao:
                "Delicadeza e feminilidade em uma peça especial.",
            preco: "R$ 24,99",
            imagem: "/assets/images/brinco_flor.jpeg"
        },
        {
            id: 8,
            nome: "Brinco de Argola Tripla",
            categoria: "Brincos",
            descricao:
                "Um modelo moderno para destacar seu estilo.",
            preco: "R$ 34,99",
            imagem: "/assets/images/brinco_argola_tripla.jpeg"
        },
        {
            id: 9,
            nome: "Bracelete Liso",
            categoria: "Pulseiras",
            descricao:
                "Design minimalista e elegante.",
            preco: "R$ 59,99",
            imagem: "/assets/images/bracelete_liso.jpeg"
        },
        {
            id: 10,
            nome: "Choker Medalhas",
            categoria: "Cordões",
            descricao:
                "Uma peça moderna para complementar diferentes looks.",
            preco: "R$ 39,99",
            imagem: "/assets/images/choker_medalhas.jpeg"
        },
        {
            id: 11,
            nome: "Gravatinha de Medalhas",
            categoria: "Cordões",
            descricao:
                "Delicadeza e personalidade em um design especial.",
            preco: "R$ 44,99",
            imagem: "/assets/images/gravatinha_medalhas.jpeg"
        }
    ];

    const produto = produtos.find(
        (produto) => produto.id === Number(id)
    );

    function adicionarProduto() {
        adicionarAoCarrinho(produto);
        setToastVisivel(true);
    }

    if (!produto) {
        return (
            <>
                <Header />

                <main>
                    <section className="section">
                        <div className="container text-center">

                            <span className="section-label">
                                Produto
                            </span>

                            <h1 className="section-title mb-4">
                                Produto não encontrado.
                            </h1>

                            <p className="section-text mb-4">
                                O produto que você está procurando
                                não está disponível.
                            </p>

                            <Link
                                to="/produtos"
                                className="btn btn-gold"
                            >
                                Ver produtos
                                <i className="bi bi-arrow-right ms-2"></i>
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

                                <p className="product-detail-price mb-4">
                                    {produto.preco}
                                </p>

                                <p className="section-text mb-4">
                                    {produto.descricao}
                                </p>

                                <div className="product-detail-info mb-4">

                                    <p>
                                        <strong>
                                            Material:
                                        </strong>{" "}
                                        Semijoia banhada a ouro 18K.
                                    </p>

                                    <p>
                                        <strong>
                                            Característica:
                                        </strong>{" "}
                                        Hipoalergênica.
                                    </p>

                                    <p>
                                        <strong>
                                            Categoria:
                                        </strong>{" "}
                                        {produto.categoria}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className="btn btn-gold"
                                    onClick={adicionarProduto}
                                >
                                    Adicionar ao carrinho
                                    <i className="bi bi-bag-plus ms-2"></i>
                                </button>

                                <Link
                                    to="/produtos"
                                    className="btn btn-outline-dark rounded-0 ms-3"
                                >
                                    Voltar aos produtos
                                </Link>

                            </div>

                        </div>

                    </div>
                </section>

            </main>

            <Toast
                mensagem="Produto adicionado ao carrinho!"
                visivel={toastVisivel}
                onFechar={() => setToastVisivel(false)}
            />

            <Footer />
        </>
    );
}

export default ProdutoDetalhes;