import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useCart } from "../../context/CartContext";

import {
    criarPedido,
    criarItemPedido
} from "../../services/api";

function Checkout() {
    const navigate = useNavigate();

    const {
        carrinho
    } = useCart();

    const [enviandoPedido, setEnviandoPedido] =
        useState(false);

    const [erroPedido, setErroPedido] =
        useState("");

    const [dadosCliente, setDadosCliente] =
        useState({
            nome: "",
            email: "",
            telefone: "",
            cep: "",
            endereco: "",
            numero: "",
            complemento: "",
            cidade: "",
            estado: "",
            pagamento: "Pix"
        });

    const total = carrinho.reduce(
        (soma, produto) =>
            soma +
            Number(produto.preco) *
                produto.quantidade,
        0
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

    function alterarCampo(event) {
        const {
            name,
            value
        } = event.target;

        setDadosCliente((dadosAtuais) => ({
            ...dadosAtuais,
            [name]: value
        }));
    }

    async function finalizarPedido(event) {
        event.preventDefault();

        setEnviandoPedido(true);
        setErroPedido("");

        try {
            const pedido = await criarPedido({
                data: new Date().toISOString(),
                valorTotal: total,
                status: "Em análise"
            });

            for (const produto of carrinho) {
                await criarItemPedido({
                    pedidoId: pedido.id,
                    produtoId: produto.id,
                    quantidade: produto.quantidade
                });
            }

            navigate(`/pedidos/${pedido.id}`);
        } catch (erro) {
            setErroPedido(
                erro.message ||
                "Não foi possível finalizar o pedido."
            );
        } finally {
            setEnviandoPedido(false);
        }
    }

    if (carrinho.length === 0) {
        return (
            <>
                <Header />

                <main>
                    <section className="section">
                        <div className="container">

                            <div className="text-center py-5">

                                <span className="section-label">
                                    Checkout
                                </span>

                                <h1 className="section-title mb-3">
                                    Seu carrinho está vazio.
                                </h1>

                                <p className="section-text mb-4">
                                    Adicione pelo menos um produto
                                    antes de finalizar seu pedido.
                                </p>

                                <Link
                                    to="/produtos"
                                    className="btn btn-gold"
                                >
                                    Ver produtos
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </Link>

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
                                Finalização
                            </span>

                            <h1 className="section-title">
                                Finalize seu pedido
                            </h1>

                            <p className="section-text">
                                Confira seus produtos e preencha
                                os dados para finalizar a compra.
                            </p>

                        </header>

                        <div className="row g-5">

                            <div className="col-lg-7">

                                <form
                                    className="checkout-form"
                                    onSubmit={finalizarPedido}
                                >

                                    <section className="checkout-section">

                                        <h2>
                                            Dados pessoais
                                        </h2>

                                        <div className="row g-3">

                                            <div className="col-12">

                                                <label
                                                    htmlFor="nome"
                                                    className="form-label"
                                                >
                                                    Nome completo
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="nome"
                                                    name="nome"
                                                    value={
                                                        dadosCliente.nome
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                    required
                                                />

                                            </div>

                                            <div className="col-md-6">

                                                <label
                                                    htmlFor="email"
                                                    className="form-label"
                                                >
                                                    E-mail
                                                </label>

                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    value={
                                                        dadosCliente.email
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                    required
                                                />

                                            </div>

                                            <div className="col-md-6">

                                                <label
                                                    htmlFor="telefone"
                                                    className="form-label"
                                                >
                                                    Telefone
                                                </label>

                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    id="telefone"
                                                    name="telefone"
                                                    value={
                                                        dadosCliente.telefone
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>

                                    </section>

                                    <section className="checkout-section">

                                        <h2>
                                            Endereço de entrega
                                        </h2>

                                        <div className="row g-3">

                                            <div className="col-md-4">

                                                <label
                                                    htmlFor="cep"
                                                    className="form-label"
                                                >
                                                    CEP
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="cep"
                                                    name="cep"
                                                    value={
                                                        dadosCliente.cep
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                    required
                                                />

                                            </div>

                                            <div className="col-md-8">

                                                <label
                                                    htmlFor="endereco"
                                                    className="form-label"
                                                >
                                                    Endereço
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="endereco"
                                                    name="endereco"
                                                    value={
                                                        dadosCliente.endereco
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                    required
                                                />

                                            </div>

                                            <div className="col-md-4">

                                                <label
                                                    htmlFor="numero"
                                                    className="form-label"
                                                >
                                                    Número
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="numero"
                                                    name="numero"
                                                    value={
                                                        dadosCliente.numero
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                    required
                                                />

                                            </div>

                                            <div className="col-md-8">

                                                <label
                                                    htmlFor="complemento"
                                                    className="form-label"
                                                >
                                                    Complemento
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="complemento"
                                                    name="complemento"
                                                    value={
                                                        dadosCliente.complemento
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                />

                                            </div>

                                            <div className="col-md-8">

                                                <label
                                                    htmlFor="cidade"
                                                    className="form-label"
                                                >
                                                    Cidade
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="cidade"
                                                    name="cidade"
                                                    value={
                                                        dadosCliente.cidade
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                    required
                                                />

                                            </div>

                                            <div className="col-md-4">

                                                <label
                                                    htmlFor="estado"
                                                    className="form-label"
                                                >
                                                    Estado
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="estado"
                                                    name="estado"
                                                    value={
                                                        dadosCliente.estado
                                                    }
                                                    onChange={
                                                        alterarCampo
                                                    }
                                                    required
                                                />

                                            </div>

                                        </div>

                                    </section>

                                    <section className="checkout-section">

                                        <h2>
                                            Forma de pagamento
                                        </h2>

                                        <div>

                                            <label
                                                htmlFor="pagamento"
                                                className="form-label"
                                            >
                                                Escolha uma opção
                                            </label>

                                            <select
                                                className="form-select"
                                                id="pagamento"
                                                name="pagamento"
                                                value={
                                                    dadosCliente.pagamento
                                                }
                                                onChange={
                                                    alterarCampo
                                                }
                                            >
                                                <option value="Pix">
                                                    Pix
                                                </option>

                                                <option value="Cartão de crédito">
                                                    Cartão de crédito
                                                </option>

                                                <option value="Boleto">
                                                    Boleto
                                                </option>
                                            </select>

                                        </div>

                                    </section>

                                    {erroPedido && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            {erroPedido}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-gold w-100"
                                        disabled={enviandoPedido}
                                    >
                                        {enviandoPedido
                                            ? "Registrando pedido..."
                                            : "Finalizar pedido"}

                                        {!enviandoPedido && (
                                            <i className="bi bi-check-lg ms-2"></i>
                                        )}
                                    </button>

                                </form>

                            </div>

                            <aside className="col-lg-5">

                                <section className="checkout-summary">

                                    <h2>
                                        Resumo do pedido
                                    </h2>

                                    <div className="checkout-products">

                                        {carrinho.map((produto) => (
                                            <article
                                                className="checkout-product"
                                                key={produto.id}
                                            >

                                                <img
                                                    src={produto.imagem}
                                                    alt={produto.nome}
                                                />

                                                <div>

                                                    <h3>
                                                        {produto.nome}
                                                    </h3>

                                                    <p>
                                                        {produto.quantidade}x{" "}
                                                        {formatarPreco(
                                                            produto.preco
                                                        )}
                                                    </p>

                                                </div>

                                            </article>
                                        ))}

                                    </div>

                                    <div className="checkout-total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            {formatarPreco(total)}
                                        </strong>

                                    </div>

                                </section>

                            </aside>

                        </div>

                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default Checkout;