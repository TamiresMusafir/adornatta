import { useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useCart } from "../../context/CartContext";

function Checkout() {
    const { carrinho } = useCart();

    const [pedidoFinalizado, setPedidoFinalizado] = useState(false);

    const [dadosCliente, setDadosCliente] = useState({
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
            Number(
                produto.preco
                    .replace("R$", "")
                    .replace(".", "")
                    .replace(",", ".")
            ) *
                produto.quantidade,
        0
    );

    function alterarCampo(event) {
        const { name, value } = event.target;

        setDadosCliente((dadosAtuais) => ({
            ...dadosAtuais,
            [name]: value
        }));
    }

    function finalizarPedido(event) {
        event.preventDefault();

        setPedidoFinalizado(true);
    }

    if (carrinho.length === 0 && !pedidoFinalizado) {
        return (
            <>
                <Header />

                <main>
                    <section className="section">
                        <div className="container">

                            <div className="text-center">

                                <span className="section-label">
                                    Finalizar pedido
                                </span>

                                <h1 className="section-title mb-4">
                                    Seu carrinho está vazio.
                                </h1>

                                <p className="section-text mb-4">
                                    Adicione algum produto ao carrinho
                                    antes de continuar.
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

    if (pedidoFinalizado) {
        return (
            <>
                <Header />

                <main>
                    <section className="section">
                        <div className="container">

                            <div className="text-center">

                                <div className="checkout-success-icon">
                                    <i className="bi bi-check-circle"></i>
                                </div>

                                <span className="section-label">
                                    Pedido realizado
                                </span>

                                <h1 className="section-title mb-4">
                                    Obrigado pela sua compra!
                                </h1>

                                <p className="section-text mb-3">
                                    Seu pedido foi registrado com sucesso.
                                </p>

                                <p className="section-text mb-4">
                                    Em uma próxima etapa, poderemos integrar
                                    este processo ao servidor para registrar
                                    o pedido e permitir seu acompanhamento.
                                </p>

                                <div className="d-flex justify-content-center gap-3 flex-wrap">

                                    <Link
                                        to="/produtos"
                                        className="btn btn-gold"
                                    >
                                        Continuar comprando
                                    </Link>

                                    <Link
                                        to="/"
                                        className="btn btn-outline-dark rounded-0 px-4 py-3"
                                    >
                                        Voltar ao início
                                    </Link>

                                </div>

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
                                Finalizar pedido
                            </span>

                            <h1 className="section-title">
                                Finalize sua compra
                            </h1>

                            <p className="section-text">
                                Preencha seus dados para concluir o pedido.
                            </p>
                        </header>

                        <form onSubmit={finalizarPedido}>

                            <div className="row g-5">

                                <div className="col-lg-7">

                                    <section className="checkout-section">

                                        <div className="section-label">
                                            Seus dados
                                        </div>

                                        <h2 className="checkout-title">
                                            Informações pessoais
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
                                                    value={dadosCliente.nome}
                                                    onChange={alterarCampo}
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
                                                    value={dadosCliente.email}
                                                    onChange={alterarCampo}
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
                                                    value={dadosCliente.telefone}
                                                    onChange={alterarCampo}
                                                    required
                                                />
                                            </div>

                                        </div>

                                    </section>

                                    <section className="checkout-section mt-5">

                                        <div className="section-label">
                                            Entrega
                                        </div>

                                        <h2 className="checkout-title">
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
                                                    value={dadosCliente.cep}
                                                    onChange={alterarCampo}
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
                                                    value={dadosCliente.endereco}
                                                    onChange={alterarCampo}
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
                                                    value={dadosCliente.numero}
                                                    onChange={alterarCampo}
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
                                                    value={dadosCliente.complemento}
                                                    onChange={alterarCampo}
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
                                                    value={dadosCliente.cidade}
                                                    onChange={alterarCampo}
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
                                                    value={dadosCliente.estado}
                                                    onChange={alterarCampo}
                                                    required
                                                />
                                            </div>

                                        </div>

                                    </section>

                                    <section className="checkout-section mt-5">

                                        <div className="section-label">
                                            Pagamento
                                        </div>

                                        <h2 className="checkout-title">
                                            Forma de pagamento
                                        </h2>

                                        <div className="row g-3">

                                            <div className="col-md-4">

                                                <label className="checkout-payment-option">

                                                    <input
                                                        type="radio"
                                                        name="pagamento"
                                                        value="Pix"
                                                        checked={
                                                            dadosCliente.pagamento ===
                                                            "Pix"
                                                        }
                                                        onChange={alterarCampo}
                                                    />

                                                    <span>
                                                        <strong>
                                                            Pix
                                                        </strong>

                                                        <small>
                                                            Pagamento via Pix
                                                        </small>
                                                    </span>

                                                </label>

                                            </div>

                                            <div className="col-md-4">

                                                <label className="checkout-payment-option">

                                                    <input
                                                        type="radio"
                                                        name="pagamento"
                                                        value="Cartão de crédito"
                                                        checked={
                                                            dadosCliente.pagamento ===
                                                            "Cartão de crédito"
                                                        }
                                                        onChange={alterarCampo}
                                                    />

                                                    <span>
                                                        <strong>
                                                            Cartão de crédito
                                                        </strong>

                                                        <small>
                                                            Crédito
                                                        </small>
                                                    </span>

                                                </label>

                                            </div>

                                            <div className="col-md-4">

                                                <label className="checkout-payment-option">

                                                    <input
                                                        type="radio"
                                                        name="pagamento"
                                                        value="Cartão de débito"
                                                        checked={
                                                            dadosCliente.pagamento ===
                                                            "Cartão de débito"
                                                        }
                                                        onChange={alterarCampo}
                                                    />

                                                    <span>
                                                        <strong>
                                                            Cartão de débito
                                                        </strong>

                                                        <small>
                                                            Débito
                                                        </small>
                                                    </span>

                                                </label>

                                            </div>

                                        </div>

                                    </section>

                                </div>

                                <aside className="col-lg-5">

                                    <div className="checkout-summary">

                                        <div className="section-label">
                                            Seu pedido
                                        </div>

                                        <h2 className="checkout-title">
                                            Resumo da compra
                                        </h2>

                                        <div className="checkout-products">

                                            {carrinho.map((produto) => (
                                                <article
                                                    key={produto.id}
                                                    className="checkout-product"
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
                                                            Quantidade:{" "}
                                                            {produto.quantidade}
                                                        </p>

                                                        <strong>
                                                            {produto.preco}
                                                        </strong>
                                                    </div>

                                                </article>
                                            ))}

                                        </div>

                                        <div className="checkout-total">

                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                R${" "}
                                                {total
                                                    .toFixed(2)
                                                    .replace(".", ",")}
                                            </strong>

                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-gold w-100 mt-4"
                                        >
                                            Finalizar pedido
                                            <i className="bi bi-check2 ms-2"></i>
                                        </button>

                                        <Link
                                            to="/produtos"
                                            className="btn btn-outline-dark rounded-0 w-100 mt-3"
                                        >
                                            Continuar comprando
                                        </Link>

                                    </div>

                                </aside>

                            </div>

                        </form>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Checkout;