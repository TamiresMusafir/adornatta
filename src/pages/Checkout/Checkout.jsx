import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useCart } from "../../context/CartContext";

import {
    criarPedido,
    criarItemPedido
} from "../../services/api";

import checkoutSchema from "../../schemas/checkoutSchema";

function Checkout() {
    const { carrinho } = useCart();
    const navigate = useNavigate();

    const [enviandoPedido, setEnviandoPedido] = useState(false);
    const [erroPedido, setErroPedido] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(checkoutSchema)
    });

    const total = carrinho.reduce(
        (soma, produto) =>
            soma +
            Number(produto.preco) *
                produto.quantidade,
        0
    );

    async function finalizarPedido() {
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

    function formatarPreco(preco) {
        return Number(preco).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    if (carrinho.length === 0) {
        return (
            <>
                <Header />

                <main className="container py-5">
                    <div className="text-center py-5">
                        <i className="bi bi-cart-x display-4"></i>

                        <h1 className="mt-3">
                            Seu carrinho está vazio
                        </h1>

                        <p className="text-muted">
                            Adicione produtos ao carrinho
                            antes de finalizar seu pedido.
                        </p>

                        <Link
                            to="/produtos"
                            className="btn btn-dark mt-3"
                        >
                            Ver produtos
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="container py-5">
                <div className="mb-5">
                    <h1>Finalizar pedido</h1>
                    <p className="text-muted">
                        Preencha seus dados para concluir
                        seu pedido.
                    </p>
                </div>

                {erroPedido && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {erroPedido}
                    </div>
                )}

                <div className="row g-5">
                    <div className="col-lg-7">
                        <form
                            onSubmit={handleSubmit(
                                finalizarPedido
                            )}
                        >
                            <h2 className="h4 mb-4">
                                Dados para entrega
                            </h2>

                            <div className="mb-3">
                                <label
                                    htmlFor="nome"
                                    className="form-label"
                                >
                                    Nome completo
                                </label>

                                <input
                                    id="nome"
                                    type="text"
                                    className={`form-control ${
                                        errors.nome
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register("nome")}
                                />

                                {errors.nome && (
                                    <div className="invalid-feedback">
                                        {
                                            errors.nome
                                                .message
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="email"
                                    className="form-label"
                                >
                                    E-mail
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    className={`form-control ${
                                        errors.email
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register("email")}
                                />

                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {
                                            errors.email
                                                .message
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="telefone"
                                    className="form-label"
                                >
                                    Telefone
                                </label>

                                <input
                                    id="telefone"
                                    type="tel"
                                    className={`form-control ${
                                        errors.telefone
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register("telefone")}
                                />

                                {errors.telefone && (
                                    <div className="invalid-feedback">
                                        {
                                            errors.telefone
                                                .message
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="endereco"
                                    className="form-label"
                                >
                                    Endereço
                                </label>

                                <input
                                    id="endereco"
                                    type="text"
                                    className={`form-control ${
                                        errors.endereco
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register("endereco")}
                                />

                                {errors.endereco && (
                                    <div className="invalid-feedback">
                                        {
                                            errors.endereco
                                                .message
                                        }
                                    </div>
                                )}
                            </div>

                            <div className="row g-3">
                                <div className="col-md-8">
                                    <label
                                        htmlFor="cidade"
                                        className="form-label"
                                    >
                                        Cidade
                                    </label>

                                    <input
                                        id="cidade"
                                        type="text"
                                        className={`form-control ${
                                            errors.cidade
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register(
                                            "cidade"
                                        )}
                                    />

                                    {errors.cidade && (
                                        <div className="invalid-feedback">
                                            {
                                                errors
                                                    .cidade
                                                    .message
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-4">
                                    <label
                                        htmlFor="estado"
                                        className="form-label"
                                    >
                                        Estado
                                    </label>

                                    <input
                                        id="estado"
                                        type="text"
                                        className={`form-control ${
                                            errors.estado
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register(
                                            "estado"
                                        )}
                                    />

                                    {errors.estado && (
                                        <div className="invalid-feedback">
                                            {
                                                errors
                                                    .estado
                                                    .message
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 mb-4">
                                <label
                                    htmlFor="cep"
                                    className="form-label"
                                >
                                    CEP
                                </label>

                                <input
                                    id="cep"
                                    type="text"
                                    className={`form-control ${
                                        errors.cep
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register("cep")}
                                />

                                {errors.cep && (
                                    <div className="invalid-feedback">
                                        {
                                            errors.cep
                                                .message
                                        }
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                                disabled={enviandoPedido}
                            >
                                {enviandoPedido
                                    ? "Finalizando pedido..."
                                    : "Finalizar pedido"}
                            </button>
                        </form>
                    </div>

                    <div className="col-lg-5">
                        <div className="border rounded p-4">
                            <h2 className="h4 mb-4">
                                Resumo do pedido
                            </h2>

                            {carrinho.map((produto) => (
                                <div
                                    key={produto.id}
                                    className="d-flex justify-content-between gap-3 mb-3"
                                >
                                    <div>
                                        <strong>
                                            {produto.nome}
                                        </strong>

                                        <div className="text-muted small">
                                            Quantidade:{" "}
                                            {
                                                produto.quantidade
                                            }
                                        </div>
                                    </div>

                                    <span>
                                        {formatarPreco(
                                            Number(
                                                produto.preco
                                            ) *
                                                produto.quantidade
                                        )}
                                    </span>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between">
                                <strong>Total</strong>

                                <strong>
                                    {formatarPreco(total)}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Checkout;