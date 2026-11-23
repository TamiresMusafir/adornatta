import { useParams } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
    buscarPedidoPorId,
    buscarItensPedido,
    buscarProdutoPorId
} from "../../services/api";

function AcompanharPedido() {
    const { id } = useParams();

    const {
        data: pedido,
        isLoading: pedidoCarregando,
        isError: pedidoComErro
    } = useQuery({
        queryKey: ["pedido", id],
        queryFn: () => buscarPedidoPorId(id)
    });

    const {
        data: itensPedido = [],
        isLoading: itensCarregando,
        isError: itensComErro
    } = useQuery({
        queryKey: ["itensPedido", id],
        queryFn: () => buscarItensPedido(id),
        enabled: !!pedido
    });

    const consultasProdutos = useQueries({
        queries: itensPedido.map((item) => ({
            queryKey: ["produto", item.produtoId],
            queryFn: () =>
                buscarProdutoPorId(item.produtoId),
            enabled: !!item.produtoId
        }))
    });

    const carregando =
        pedidoCarregando ||
        itensCarregando ||
        consultasProdutos.some(
            (consulta) => consulta.isLoading
        );

    const erro =
        pedidoComErro ||
        itensComErro ||
        consultasProdutos.some(
            (consulta) => consulta.isError
        );

    function formatarPreco(preco) {
        return Number(preco).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    if (carregando) {
        return (
            <>
                <Header />

                <main>
                    <section className="section">
                        <div className="container">
                            <div className="text-center py-5">
                                <span className="section-label">
                                    Acompanhamento
                                </span>

                                <h1 className="section-title mb-3">
                                    Carregando pedido...
                                </h1>

                                <p className="section-text mb-0">
                                    Estamos buscando as informações
                                    do seu pedido.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </>
        );
    }

    if (erro) {
        return (
            <>
                <Header />

                <main>
                    <section className="section">
                        <div className="container">
                            <div className="text-center py-5">
                                <span className="section-label">
                                    Erro
                                </span>

                                <h1 className="section-title mb-3">
                                    Não foi possível carregar o pedido.
                                </h1>

                                <p className="section-text mb-4">
                                    Tente novamente em alguns instantes.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </>
        );
    }

    if (!pedido) {
        return (
            <>
                <Header />

                <main>
                    <section className="section">
                        <div className="container">
                            <div className="text-center py-5">
                                <span className="section-label">
                                    Pedido não encontrado
                                </span>

                                <h1 className="section-title mb-3">
                                    Não encontramos esse pedido.
                                </h1>

                                <p className="section-text mb-4">
                                    Verifique o número informado e
                                    tente novamente.
                                </p>
                            </div>
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

                        <header className="text-center mb-5">
                            <span className="section-label">
                                Acompanhamento
                            </span>

                            <h1 className="section-title">
                                Pedido nº {pedido.id}
                            </h1>

                            <p className="section-text">
                                Confira o status e os produtos
                                do seu pedido.
                            </p>
                        </header>

                        <div className="row g-4">

                            <div className="col-lg-4">

                                <section className="checkout-summary">
                                    <h2>
                                        Resumo do pedido
                                    </h2>

                                    <div className="checkout-total">
                                        <span>
                                            Status
                                        </span>

                                        <strong>
                                            {pedido.status}
                                        </strong>
                                    </div>

                                    <div className="checkout-total">
                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            {formatarPreco(
                                                pedido.valorTotal
                                            )}
                                        </strong>
                                    </div>

                                </section>

                            </div>

                            <div className="col-lg-8">

                                <section className="checkout-summary">

                                    <h2>
                                        Produtos
                                    </h2>

                                    <div className="checkout-products">

                                        {itensPedido.map(
                                            (item, indice) => {
                                                const consultaProduto =
                                                    consultasProdutos[
                                                        indice
                                                    ];

                                                const produto =
                                                    consultaProduto?.data;

                                                if (!produto) {
                                                    return null;
                                                }

                                                return (
                                                    <article
                                                        className="checkout-product"
                                                        key={item.id}
                                                    >
                                                        <img
                                                            src={
                                                                produto.imagem
                                                            }
                                                            alt={
                                                                produto.nome
                                                            }
                                                        />

                                                        <div>
                                                            <h3>
                                                                {
                                                                    produto.nome
                                                                }
                                                            </h3>

                                                            <p>
                                                                {item.quantidade}x{" "}
                                                                {formatarPreco(
                                                                    produto.preco
                                                                )}
                                                            </p>
                                                        </div>
                                                    </article>
                                                );
                                            }
                                        )}

                                    </div>

                                </section>

                            </div>

                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default AcompanharPedido;