import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";

import {
    buscarProdutos,
    buscarCategorias
} from "../../services/api";

function Produtos() {
    const [searchParams, setSearchParams] = useSearchParams();

    const categoriaDaUrl = searchParams.get("categoria");
    const buscaDaUrl = searchParams.get("busca") || "";

    const [categoriaSelecionada, setCategoriaSelecionada] =
        useState("Todos");

    const {
        data: produtos = [],
        isLoading: produtosCarregando,
        isError: produtosComErro
    } = useQuery({
        queryKey: ["produtos"],
        queryFn: buscarProdutos
    });

    const {
        data: categorias = [],
        isLoading: categoriasCarregando,
        isError: categoriasComErro
    } = useQuery({
        queryKey: ["categorias"],
        queryFn: buscarCategorias
    });

    useEffect(() => {
        const categoriaExiste = categorias.some(
            (categoria) =>
                categoria.nome === categoriaDaUrl
        );

        if (categoriaExiste) {
            setCategoriaSelecionada(categoriaDaUrl);
            return;
        }

        setCategoriaSelecionada("Todos");
    }, [categoriaDaUrl, categorias]);

    function selecionarCategoria(categoria) {
        setCategoriaSelecionada(categoria);

        const novosParametros = {};

        if (categoria !== "Todos") {
            novosParametros.categoria = categoria;
        }

        if (buscaDaUrl) {
            novosParametros.busca = buscaDaUrl;
        }

        setSearchParams(novosParametros);
    }

    const categoriaSelecionadaObj =
        categorias.find(
            (categoria) =>
                categoria.nome === categoriaSelecionada
        );

    const buscaNormalizada = buscaDaUrl
        .toLowerCase()
        .trim();

    const produtosFiltrados = produtos.filter(
        (produto) => {

            const correspondeCategoria =
                categoriaSelecionada === "Todos" ||
                Number(produto.categoriaId) ===
                    Number(categoriaSelecionadaObj?.id);

            const correspondeBusca =
                !buscaNormalizada ||
                produto.nome
                    .toLowerCase()
                    .includes(buscaNormalizada) ||
                produto.descricao
                    .toLowerCase()
                    .includes(buscaNormalizada);

            return (
                correspondeCategoria &&
                correspondeBusca
            );
        }
    );

    const carregando =
        produtosCarregando ||
        categoriasCarregando;

    const erro =
        produtosComErro ||
        categoriasComErro;

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

                        {buscaDaUrl && (
                            <div className="text-center mb-4">

                                <p className="section-text mb-0">
                                    Resultados para:

                                    <strong className="ms-2">
                                        "{buscaDaUrl}"
                                    </strong>
                                </p>

                            </div>
                        )}

                        {!carregando && !erro && (
                            <nav
                                className="product-filters"
                                aria-label="Filtrar produtos por categoria"
                            >
                                <button
                                    type="button"
                                    className={`product-filter ${
                                        categoriaSelecionada ===
                                        "Todos"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        selecionarCategoria(
                                            "Todos"
                                        )
                                    }
                                >
                                    Todos
                                </button>

                                {categorias.map(
                                    (categoria) => (
                                        <button
                                            key={categoria.id}
                                            type="button"
                                            className={`product-filter ${
                                                categoriaSelecionada ===
                                                categoria.nome
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                selecionarCategoria(
                                                    categoria.nome
                                                )
                                            }
                                        >
                                            {categoria.nome}
                                        </button>
                                    )
                                )}
                            </nav>
                        )}

                        {carregando ? (
                            <section
                                className="text-center py-5"
                                aria-live="polite"
                            >

                                <span className="section-label">
                                    Aguarde
                                </span>

                                <h2 className="section-title mb-3">
                                    Carregando produtos...
                                </h2>

                                <p className="section-text mb-0">
                                    Estamos buscando nossa coleção.
                                </p>

                            </section>
                        ) : erro ? (
                            <section
                                className="text-center py-5"
                                aria-live="assertive"
                            >

                                <span className="section-label">
                                    Erro
                                </span>

                                <h2 className="section-title mb-3">
                                    Não foi possível carregar o catálogo.
                                </h2>

                                <p className="section-text mb-0">
                                    Verifique se o servidor da aplicação
                                    está funcionando e tente novamente.
                                </p>

                            </section>
                        ) : produtosFiltrados.length > 0 ? (
                            <section
                                className="row g-4"
                                aria-label="Lista de produtos"
                            >

                                {produtosFiltrados.map(
                                    (produto) => (
                                        <ProductCard
                                            key={produto.id}
                                            id={produto.id}
                                            nome={produto.nome}
                                            descricao={produto.descricao}
                                            preco={produto.preco}
                                            imagem={produto.imagem}
                                            tag={produto.tag}
                                            quantidadeDisponivel={produto.quantidadeDisponivel} 
                                        />
                                    )
                                )}

                            </section>
                        ) : (
                            <section className="text-center py-5">

                                <span className="section-label">
                                    Nenhum resultado
                                </span>

                                <h2 className="section-title mb-3">
                                    Não encontramos produtos.
                                </h2>

                                <p className="section-text mb-4">
                                    Tente pesquisar por outro termo ou
                                    selecione uma categoria diferente.
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-gold"
                                    onClick={() =>
                                        setSearchParams({})
                                    }
                                >
                                    Ver todos os produtos
                                </button>

                            </section>
                        )}

                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default Produtos;
