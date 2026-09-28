import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";

function Produtos() {
    const categorias = [
        "Todos",
        "Brincos",
        "Conjuntos",
        "Pulseiras",
        "Cordões"
    ];

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

    const [searchParams, setSearchParams] = useSearchParams();

    const categoriaDaUrl = searchParams.get("categoria");

    const [categoriaSelecionada, setCategoriaSelecionada] = useState(
        categorias.includes(categoriaDaUrl)
            ? categoriaDaUrl
            : "Todos"
    );

    useEffect(() => {
        const categoriaValida = categorias.includes(categoriaDaUrl);

        setCategoriaSelecionada(
            categoriaValida
                ? categoriaDaUrl
                : "Todos"
        );
    }, [categoriaDaUrl]);

    function selecionarCategoria(categoria) {
        setCategoriaSelecionada(categoria);

        if (categoria === "Todos") {
            setSearchParams({});
            return;
        }

        setSearchParams({
            categoria: categoria
        });
    }

    const produtosFiltrados = produtos.filter((produto) => {
        if (categoriaSelecionada === "Todos") {
            return true;
        }

        return produto.categoria === categoriaSelecionada;
    });

    return (
        <>
            <Header />

            <main>
                <section className="section">
                    <div className="container">

                        <header className="text-center mb-5">
                            <span className="section-label">
                                Nossa coleção
                            </span>

                            <h1 className="section-title">
                                Encontre seu brilho
                            </h1>

                            <p className="section-text">
                                Explore nossas semijoias e encontre a peça
                                ideal para o seu estilo.
                            </p>
                        </header>

                        <nav
                            className="product-filters"
                            aria-label="Filtrar produtos por categoria"
                        >
                            {categorias.map((categoria) => (
                                <button
                                    key={categoria}
                                    type="button"
                                    className={`product-filter ${
                                        categoriaSelecionada === categoria
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        selecionarCategoria(categoria)
                                    }
                                >
                                    {categoria}
                                </button>
                            ))}
                        </nav>

                        <section
                            className="row g-4"
                            aria-label="Lista de produtos"
                        >
                            {produtosFiltrados.map((produto) => (
                                <ProductCard
                                    key={produto.id}
                                    nome={produto.nome}
                                    descricao={produto.descricao}
                                    preco={produto.preco}
                                    imagem={produto.imagem}
                                    tag={produto.tag}
                                />
                            ))}
                        </section>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Produtos;