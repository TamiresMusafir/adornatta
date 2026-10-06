import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Toast from "../../components/Toast/Toast";

import { useCart } from "../../context/CartContext";

import { buscarProdutoPorId } from "../../services/api";

function ProdutoDetalhes() {
    const { id } = useParams();

    const { adicionarAoCarrinho } = useCart();

    const [toastVisivel, setToastVisivel] = useState(false);

    const {
        data: produto,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["produto", id],
        queryFn: () => buscarProdutoPorId(id)
    });

    function formatarPreco(preco) {
        return Number(preco).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    function adicionarProduto() {
        if (!produto) {
            return;
        }

        adicionarAoCarrinho(produto);
        setToastVisivel(true);
    }

    return (
        <>
            <Header />

            <main>

                {isLoading && (
                    <section className="section">
                        <div className="container">

                            <div className="text-center py-5">

                                <span className="section-label">
                                    Aguarde
                                </span>

                                <h1 className="section-title mb-3">
                                    Carregando produto...
                                </h1>

                                <p className="section-text mb-0">
                                    Estamos buscando os detalhes da peça.
                                </p>

                            </div>

                        </div>
                    </section>
                )}

                {isError && (
                    <section className="section">
                        <div className="container">

                            <div className="text-center py-5">

                                <span className="section-label">
                                    Erro
                                </span>

                                <h1 className="section-title mb-3">
                                    Não foi possível carregar o produto.
                                </h1>

                                <p className="section-text mb-0">
                                    Verifique se o servidor da aplicação
                                    está funcionando e tente novamente.
                                </p>

                            </div>

                        </div>
                    </section>
                )}

                {!isLoading && !isError && !produto && (
                    <section className="section">
                        <div className="container">

                            <div className="text-center py-5">

                                <span className="section-label">
                                    Produto não encontrado
                                </span>

                                <h1 className="section-title mb-3">
                                    Essa peça não existe.
                                </h1>

                                <p className="section-text mb-0">
                                    O produto que você está procurando
                                    não foi encontrado em nossa coleção.
                                </p>

                            </div>

                        </div>
                    </section>
                )}

                {!isLoading && !isError && produto && (
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

                                <div className="col-lg-6">

                                    <span className="section-label">
                                        Detalhes da peça
                                    </span>

                                    <h1 className="product-detail-title">
                                        {produto.nome}
                                    </h1>

                                    <p className="product-detail-price">
                                        {formatarPreco(produto.preco)}
                                    </p>

                                    <p className="section-text mb-4">
                                        {produto.descricao}
                                    </p>

                                    <div className="product-detail-info">

                                        <div>
                                            <span>
                                                Material:
                                            </span>

                                            <strong>
                                                {produto.material}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Tipo de banho:
                                            </span>

                                            <strong>
                                                {produto.tipoBanho}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Disponibilidade:
                                            </span>

                                            <strong>
                                                {produto.quantidadeDisponivel > 0
                                                    ? "Em estoque"
                                                    : "Produto esgotado"}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-gold"
                                            disabled={
                                                produto.quantidadeDisponivel <= 0
                                            }
                                            onClick={adicionarProduto}
                                        >
                                            Adicionar ao carrinho
                                            <i className="bi bi-bag ms-2"></i>
                                        </button>

                                        <Link
                                            to="/produtos"
                                            className="btn btn-outline-dark rounded-0"
                                        >
                                            Voltar aos produtos
                                            <i className="bi bi-arrow-left ms-2"></i>
                                        </Link>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </section>
                )}

            </main>

            <Footer />

            <Toast
                mensagem="Produto adicionado ao carrinho."
                tipo="sucesso"
                visivel={toastVisivel}
                onFechar={() => setToastVisivel(false)}
            />
        </>
    );
}

export default ProdutoDetalhes;