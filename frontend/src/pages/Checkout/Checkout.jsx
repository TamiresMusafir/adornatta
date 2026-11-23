import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { criarCheckout, criarPedido } from "../../services/api";
import checkoutSchema from "../../schemas/checkoutSchema";

function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function Checkout() {
    const navigate = useNavigate();
    const { carrinho, limparCarrinho } = useCart();
    const { usuario } = useAuth();
    const [enviandoPedido, setEnviandoPedido] = useState(false);
    const [erroPedido, setErroPedido] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            nome: usuario?.nome || "",
            email: usuario?.email || "",
            telefone: usuario?.telefone || "",
            endereco: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: ""
        }
    });

    useEffect(() => {
        if (!usuario) {
            return;
        }

        const endereco = usuario.endereco || {};
        setValue("nome", usuario.nome || "");
        setValue("email", usuario.email || "");
        setValue("telefone", usuario.telefone || "");
        setValue("endereco", endereco.logradouro || "");
        setValue("numero", endereco.numero || "");
        setValue("complemento", endereco.complemento || "");
        setValue("bairro", endereco.bairro || "");
        setValue("cidade", endereco.cidade || "");
        setValue("estado", endereco.estado || endereco.uf || "");
        setValue("cep", endereco.cep || "");
    }, [usuario, setValue]);

    const total = carrinho.reduce(
        (soma, produto) =>
            soma + Number(produto.preco) * Number(produto.quantidade),
        0
    );

    async function finalizarPedido(dados) {
        setErroPedido("");
        setEnviandoPedido(true);

        try {
            if (!usuario?.id) {
                throw new Error("É necessário entrar na conta para finalizar a compra.");
            }
            if (carrinho.length === 0) {
                throw new Error("Seu carrinho está vazio.");
            }

            const pedido = await criarPedido({
                data: new Date().toISOString(),
                formaPagamento: "Mercado Pago",
                totalEsperado: total,
                enderecoEntrega: {
                    logradouro: dados.endereco,
                    numero: dados.numero,
                    complemento: dados.complemento || null,
                    bairro: dados.bairro,
                    cidade: dados.cidade,
                    uf: dados.estado.toUpperCase(),
                    cep: dados.cep
                },
                itens: carrinho.map((produto) => ({
                    produtoId: produto.id,
                    quantidade: produto.quantidade
                }))
            });

            limparCarrinho();

            try {
                const checkout = await criarCheckout(pedido.id);
                const checkoutUrl = new URL(checkout.checkoutUrl);
                if (checkoutUrl.protocol !== "https:") {
                    throw new Error("A URL de pagamento retornada não é segura.");
                }
                window.location.assign(checkoutUrl.toString());
            } catch (error) {
                navigate(`/pedidos/${pedido.id}`, {
                    replace: true,
                    state: { erroCheckout: error.message }
                });
            }
        } catch (error) {
            setErroPedido(error.message || "Não foi possível finalizar o pedido.");
        } finally {
            setEnviandoPedido(false);
        }
    }

    if (carrinho.length === 0) {
        return (
            <>
                <Header />
                <main className="container py-5 text-center">
                    <i className="bi bi-cart-x display-4"></i>
                    <h1 className="mt-3">Seu carrinho está vazio</h1>
                    <p className="text-muted">
                        Adicione produtos ao carrinho antes de finalizar o pedido.
                    </p>
                    <Link to="/produtos" className="btn btn-dark mt-3">
                        Ver produtos
                    </Link>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="container py-5">
                <header className="mb-5">
                    <p className="text-uppercase small text-muted mb-2">Adornatta</p>
                    <h1>Finalizar pedido</h1>
                    <p className="text-muted mb-0">
                        Informe o endereço de entrega e continue para o pagamento seguro.
                    </p>
                </header>

                {erroPedido && (
                    <div className="alert alert-danger" role="alert">
                        {erroPedido}
                    </div>
                )}

                <form onSubmit={handleSubmit(finalizarPedido)}>
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <section className="mb-5">
                                <h2 className="h4 mb-4">Dados para entrega</h2>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="nome" className="form-label">
                                            Nome completo
                                        </label>
                                        <input
                                            id="nome"
                                            className={`form-control ${errors.nome ? "is-invalid" : ""}`}
                                            {...register("nome")}
                                        />
                                        {errors.nome && (
                                            <div className="invalid-feedback">
                                                {errors.nome.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="telefone" className="form-label">
                                            Telefone
                                        </label>
                                        <input
                                            id="telefone"
                                            type="tel"
                                            className={`form-control ${errors.telefone ? "is-invalid" : ""}`}
                                            {...register("telefone")}
                                        />
                                        {errors.telefone && (
                                            <div className="invalid-feedback">
                                                {errors.telefone.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">
                                            E-mail
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <label htmlFor="endereco" className="form-label">
                                            Logradouro
                                        </label>
                                        <input
                                            id="endereco"
                                            className={`form-control ${errors.endereco ? "is-invalid" : ""}`}
                                            {...register("endereco")}
                                        />
                                        {errors.endereco && (
                                            <div className="invalid-feedback">
                                                {errors.endereco.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="numero" className="form-label">
                                            Número
                                        </label>
                                        <input
                                            id="numero"
                                            className={`form-control ${errors.numero ? "is-invalid" : ""}`}
                                            {...register("numero")}
                                        />
                                        {errors.numero && (
                                            <div className="invalid-feedback">
                                                {errors.numero.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="complemento" className="form-label">
                                            Complemento (opcional)
                                        </label>
                                        <input
                                            id="complemento"
                                            className="form-control"
                                            {...register("complemento")}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="bairro" className="form-label">
                                            Bairro
                                        </label>
                                        <input
                                            id="bairro"
                                            className={`form-control ${errors.bairro ? "is-invalid" : ""}`}
                                            {...register("bairro")}
                                        />
                                        {errors.bairro && (
                                            <div className="invalid-feedback">
                                                {errors.bairro.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="cidade" className="form-label">
                                            Cidade
                                        </label>
                                        <input
                                            id="cidade"
                                            className={`form-control ${errors.cidade ? "is-invalid" : ""}`}
                                            {...register("cidade")}
                                        />
                                        {errors.cidade && (
                                            <div className="invalid-feedback">
                                                {errors.cidade.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="estado" className="form-label">
                                            UF
                                        </label>
                                        <input
                                            id="estado"
                                            maxLength="2"
                                            className={`form-control ${errors.estado ? "is-invalid" : ""}`}
                                            {...register("estado")}
                                        />
                                        {errors.estado && (
                                            <div className="invalid-feedback">
                                                {errors.estado.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="cep" className="form-label">
                                            CEP
                                        </label>
                                        <input
                                            id="cep"
                                            autoComplete="postal-code"
                                            className={`form-control ${errors.cep ? "is-invalid" : ""}`}
                                            {...register("cep")}
                                        />
                                        {errors.cep && (
                                            <div className="invalid-feedback">
                                                {errors.cep.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="border rounded p-4">
                                <h2 className="h5">Pagamento seguro</h2>
                                <p className="mb-0">
                                    O pagamento será realizado no ambiente do Mercado Pago.
                                    Você poderá escolher as opções disponíveis por lá; não
                                    informe dados do cartão neste site.
                                </p>
                            </section>
                        </div>

                        <div className="col-lg-5">
                            <aside className="border p-4">
                                <h2 className="h4 mb-4">Resumo do pedido</h2>
                                {carrinho.map((produto) => (
                                    <div
                                        key={produto.id}
                                        className="d-flex justify-content-between gap-3 mb-3"
                                    >
                                        <div>
                                            <strong>{produto.nome}</strong>
                                            <div className="text-muted small">
                                                Quantidade: {produto.quantidade}
                                            </div>
                                        </div>
                                        <span>
                                            {formatarPreco(
                                                Number(produto.preco) *
                                                Number(produto.quantidade)
                                            )}
                                        </span>
                                    </div>
                                ))}
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <strong>Total</strong>
                                    <strong className="fs-5">
                                        {formatarPreco(total)}
                                    </strong>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-dark w-100 mt-4"
                                    disabled={enviandoPedido}
                                >
                                    {enviandoPedido
                                        ? "Iniciando pagamento..."
                                        : "Continuar para pagamento"}
                                </button>
                            </aside>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    );
}

export default Checkout;
