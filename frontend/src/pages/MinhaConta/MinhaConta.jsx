import { useMemo, useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useAuth } from "../../context/AuthContext";

import {
    buscarPedidosPorUsuario,
    buscarFormasPagamentoPorUsuario,
    criarFormaPagamento,
    excluirFormaPagamento
} from "../../services/api";

const dadosSchema = z.object({
    nome: z
        .string()
        .min(2, "Informe seu nome."),

    telefone: z
        .string()
        .min(10, "Informe um telefone válido."),

    cpf: z
        .string()
        .min(11, "Informe um CPF válido."),

    cep: z
        .string()
        .min(8, "Informe um CEP válido."),

    logradouro: z
        .string()
        .min(2, "Informe o logradouro."),

    numero: z
        .string()
        .min(1, "Informe o número."),

    complemento: z
        .string()
        .optional(),

    bairro: z
        .string()
        .min(2, "Informe o bairro."),

    cidade: z
        .string()
        .min(2, "Informe a cidade."),

    estado: z
        .string()
        .min(2, "Informe o estado.")
});

const pagamentoSchema = z.object({
    tipo: z
        .string()
        .min(1, "Selecione o tipo de pagamento."),

    bandeira: z
        .string()
        .min(2, "Informe a bandeira."),

    ultimosDigitos: z
        .string()
        .regex(
            /^\d{4}$/,
            "Informe os 4 últimos dígitos."
        ),

    nomeCartao: z
        .string()
        .min(2, "Informe o nome do titular.")
});

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function formatarData(data) {
    if (!data) {
        return "-";
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return "-";
    }

    return dataObj.toLocaleDateString(
        "pt-BR"
    );
}

function obterClasseStatus(status) {
    switch (status) {
        case "Entregue":
            return "bg-success-subtle text-success";

        case "Cancelado":
            return "bg-danger-subtle text-danger";

        case "Enviado":
            return "bg-info-subtle text-info-emphasis";

        case "Em preparação":
            return "bg-primary-subtle text-primary";

        case "Em análise":
            return "bg-warning-subtle text-warning-emphasis";

        default:
            return "bg-secondary-subtle text-secondary";
    }
}

function classificarPedido(status) {
    if (status === "Entregue") {
        return "concluidos";
    }

    if (status === "Cancelado") {
        return "cancelados";
    }

    return "pendentes";
}

function MinhaConta() {
    const {
        usuario,
        atualizarDados
    } = useAuth();

    const queryClient = useQueryClient();

    const [filtroPedidos, setFiltroPedidos] =
        useState("todos");

    const [mensagem, setMensagem] =
        useState("");

    const {
        data: pedidos = [],
        isLoading: carregandoPedidos,
        isError: erroPedidos
    } = useQuery({
        queryKey: [
            "pedidos-usuario",
            usuario?.id
        ],
        queryFn: () =>
            buscarPedidosPorUsuario(
                usuario.id
            ),
        enabled: !!usuario?.id
    });

    const {
        data: formasPagamento = [],
        isLoading: carregandoPagamentos,
        isError: erroPagamentos
    } = useQuery({
        queryKey: [
            "formas-pagamento",
            usuario?.id
        ],
        queryFn: () =>
            buscarFormasPagamentoPorUsuario(
                usuario.id
            ),
        enabled: !!usuario?.id
    });

    const {
        register: registerDados,
        handleSubmit: handleSubmitDados,
        formState: {
            errors: errosDados
        }
    } = useForm({
        resolver: zodResolver(
            dadosSchema
        ),
        defaultValues: {
            nome: usuario?.nome || "",
            telefone: usuario?.telefone || "",
            cpf: usuario?.cpf || "",
            cep: usuario?.endereco?.cep || "",
            logradouro:
                usuario?.endereco?.logradouro || "",
            numero:
                usuario?.endereco?.numero || "",
            complemento:
                usuario?.endereco?.complemento || "",
            bairro:
                usuario?.endereco?.bairro || "",
            cidade:
                usuario?.endereco?.cidade || "",
            estado:
                usuario?.endereco?.estado || ""
        }
    });

    const {
        register: registerPagamento,
        handleSubmit: handleSubmitPagamento,
        reset: resetPagamento,
        formState: {
            errors: errosPagamento
        }
    } = useForm({
        resolver: zodResolver(
            pagamentoSchema
        ),
        defaultValues: {
            tipo: "Cartão de crédito",
            bandeira: "",
            ultimosDigitos: "",
            nomeCartao: ""
        }
    });

    const atualizarDadosMutation =
        useMutation({
            mutationFn: atualizarDados,

            onSuccess: () => {
                setMensagem(
                    "Dados atualizados com sucesso."
                );

                setTimeout(() => {
                    setMensagem("");
                }, 3000);
            },

            onError: () => {
                setMensagem(
                    "Não foi possível atualizar seus dados."
                );
            }
        });

    const criarPagamentoMutation =
        useMutation({
            mutationFn: criarFormaPagamento,

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "formas-pagamento",
                        usuario?.id
                    ]
                });

                resetPagamento();

                setMensagem(
                    "Forma de pagamento salva com sucesso."
                );

                setTimeout(() => {
                    setMensagem("");
                }, 3000);
            },

            onError: () => {
                setMensagem(
                    "Não foi possível salvar a forma de pagamento."
                );
            }
        });

    const excluirPagamentoMutation =
        useMutation({
            mutationFn: excluirFormaPagamento,

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "formas-pagamento",
                        usuario?.id
                    ]
                });

                setMensagem(
                    "Forma de pagamento removida."
                );

                setTimeout(() => {
                    setMensagem("");
                }, 3000);
            }
        });

    const pedidosFiltrados = useMemo(() => {
        if (filtroPedidos === "todos") {
            return pedidos;
        }

        return pedidos.filter(
            (pedido) =>
                classificarPedido(
                    pedido.status
                ) === filtroPedidos
        );
    }, [
        pedidos,
        filtroPedidos
    ]);

    function salvarDados(dados) {
        atualizarDadosMutation.mutate({
            nome: dados.nome,
            telefone: dados.telefone,
            cpf: dados.cpf,

            endereco: {
                cep: dados.cep,
                logradouro: dados.logradouro,
                numero: dados.numero,
                complemento:
                    dados.complemento || "",
                bairro: dados.bairro,
                cidade: dados.cidade,
                estado: dados.estado
            }
        });
    }

    function salvarPagamento(dados) {
        criarPagamentoMutation.mutate({
            usuarioId: usuario.id,
            tipo: dados.tipo,
            bandeira: dados.bandeira,
            ultimosDigitos:
                dados.ultimosDigitos,
            nomeCartao: dados.nomeCartao
        });
    }

    function removerPagamento(id) {
        const confirmou = window.confirm(
            "Deseja realmente remover esta forma de pagamento?"
        );

        if (!confirmou) {
            return;
        }

        excluirPagamentoMutation.mutate(id);
    }

    return (
        <>
            <Header />

            <main>
                <section className="section">
                    <div className="container">

                        <div className="mb-5">
                            <div className="section-label mb-2">
                                Minha conta
                            </div>

                            <h1 className="display-font mb-3">
                                Olá, {usuario?.nome}.
                            </h1>

                            <p className="text-muted mb-0">
                                Gerencie seus dados,
                                acompanhe seus pedidos
                                e salve suas formas
                                de pagamento.
                            </p>
                        </div>

                        {mensagem && (
                            <div
                                className="alert alert-success"
                                role="alert"
                            >
                                {mensagem}
                            </div>
                        )}

                        <div className="row g-4">

                            <div className="col-lg-7">

                                <div className="p-4 p-md-5 border bg-white mb-4">

                                    <div className="section-label mb-2">
                                        Dados pessoais
                                    </div>

                                    <h2 className="h4 mb-4">
                                        Suas informações
                                    </h2>

                                    <form
                                        onSubmit={handleSubmitDados(
                                            salvarDados
                                        )}
                                    >

                                        <div className="row g-3">

                                            <div className="col-12">
                                                <label
                                                    htmlFor="nome"
                                                    className="form-label"
                                                >
                                                    Nome
                                                </label>

                                                <input
                                                    id="nome"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "nome"
                                                    )}
                                                />

                                                {errosDados.nome && (
                                                    <small className="text-danger">
                                                        {
                                                            errosDados
                                                                .nome
                                                                .message
                                                        }
                                                    </small>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="email"
                                                    className="form-label"
                                                >
                                                    E-mail
                                                </label>

                                                <input
                                                    id="email"
                                                    type="email"
                                                    className="form-control"
                                                    value={
                                                        usuario?.email ||
                                                        ""
                                                    }
                                                    disabled
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
                                                    id="telefone"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "telefone"
                                                    )}
                                                />

                                                {errosDados.telefone && (
                                                    <small className="text-danger">
                                                        {
                                                            errosDados
                                                                .telefone
                                                                .message
                                                        }
                                                    </small>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="cpf"
                                                    className="form-label"
                                                >
                                                    CPF
                                                </label>

                                                <input
                                                    id="cpf"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "cpf"
                                                    )}
                                                />

                                                {errosDados.cpf && (
                                                    <small className="text-danger">
                                                        {
                                                            errosDados
                                                                .cpf
                                                                .message
                                                        }
                                                    </small>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="cep"
                                                    className="form-label"
                                                >
                                                    CEP
                                                </label>

                                                <input
                                                    id="cep"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "cep"
                                                    )}
                                                />

                                                {errosDados.cep && (
                                                    <small className="text-danger">
                                                        {
                                                            errosDados
                                                                .cep
                                                                .message
                                                        }
                                                    </small>
                                                )}
                                            </div>

                                            <div className="col-md-8">
                                                <label
                                                    htmlFor="logradouro"
                                                    className="form-label"
                                                >
                                                    Logradouro
                                                </label>

                                                <input
                                                    id="logradouro"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "logradouro"
                                                    )}
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
                                                    id="numero"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "numero"
                                                    )}
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label
                                                    htmlFor="complemento"
                                                    className="form-label"
                                                >
                                                    Complemento
                                                </label>

                                                <input
                                                    id="complemento"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "complemento"
                                                    )}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="bairro"
                                                    className="form-label"
                                                >
                                                    Bairro
                                                </label>

                                                <input
                                                    id="bairro"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "bairro"
                                                    )}
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="cidade"
                                                    className="form-label"
                                                >
                                                    Cidade
                                                </label>

                                                <input
                                                    id="cidade"
                                                    className="form-control"
                                                    {...registerDados(
                                                        "cidade"
                                                    )}
                                                />
                                            </div>

                                            <div className="col-md-2">
                                                <label
                                                    htmlFor="estado"
                                                    className="form-label"
                                                >
                                                    UF
                                                </label>

                                                <input
                                                    id="estado"
                                                    className="form-control"
                                                    maxLength="2"
                                                    {...registerDados(
                                                        "estado"
                                                    )}
                                                />
                                            </div>

                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-gold mt-4"
                                            disabled={
                                                atualizarDadosMutation.isPending
                                            }
                                        >
                                            {atualizarDadosMutation.isPending
                                                ? "Salvando..."
                                                : "Salvar dados"}
                                        </button>

                                    </form>

                                </div>

                                <div className="p-4 p-md-5 border bg-white">

                                    <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
                                        <div>
                                            <div className="section-label mb-2">
                                                Formas de pagamento
                                            </div>

                                            <h2 className="h4 mb-0">
                                                Pagamentos salvos
                                            </h2>
                                        </div>
                                    </div>

                                    {carregandoPagamentos && (
                                        <p className="text-muted">
                                            Carregando formas de pagamento...
                                        </p>
                                    )}

                                    {erroPagamentos && (
                                        <div className="alert alert-danger">
                                            Não foi possível carregar
                                            suas formas de pagamento.
                                        </div>
                                    )}

                                    {!carregandoPagamentos &&
                                        formasPagamento.length === 0 && (
                                            <p className="text-muted">
                                                Você ainda não possui
                                                nenhuma forma de
                                                pagamento salva.
                                            </p>
                                        )}

                                    <div className="d-grid gap-3 mb-4">
                                        {formasPagamento.map(
                                            (pagamento) => (
                                                <div
                                                    key={
                                                        pagamento.id
                                                    }
                                                    className="border p-3"
                                                >
                                                    <div className="d-flex justify-content-between align-items-start gap-3">

                                                        <div>
                                                            <strong>
                                                                {pagamento.tipo}
                                                            </strong>

                                                            <div className="text-muted small mt-1">
                                                                {pagamento.bandeira}
                                                                {" • "}
                                                                ****{" "}
                                                                {pagamento.ultimosDigitos}
                                                            </div>

                                                            <div className="text-muted small">
                                                                {
                                                                    pagamento.nomeCartao
                                                                }
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                removerPagamento(
                                                                    pagamento.id
                                                                )
                                                            }
                                                        >
                                                            Remover
                                                        </button>

                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <form
                                        onSubmit={handleSubmitPagamento(
                                            salvarPagamento
                                        )}
                                    >
                                        <h3 className="h6 mb-3">
                                            Adicionar forma de pagamento
                                        </h3>

                                        <div className="row g-3">

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="tipo"
                                                    className="form-label"
                                                >
                                                    Tipo
                                                </label>

                                                <select
                                                    id="tipo"
                                                    className="form-select"
                                                    {...registerPagamento(
                                                        "tipo"
                                                    )}
                                                >
                                                    <option value="Cartão de crédito">
                                                        Cartão de crédito
                                                    </option>

                                                    <option value="Cartão de débito">
                                                        Cartão de débito
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="bandeira"
                                                    className="form-label"
                                                >
                                                    Bandeira
                                                </label>

                                                <input
                                                    id="bandeira"
                                                    className="form-control"
                                                    placeholder="Ex.: Visa"
                                                    {...registerPagamento(
                                                        "bandeira"
                                                    )}
                                                />

                                                {errosPagamento.bandeira && (
                                                    <small className="text-danger">
                                                        {
                                                            errosPagamento
                                                                .bandeira
                                                                .message
                                                        }
                                                    </small>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="ultimosDigitos"
                                                    className="form-label"
                                                >
                                                    Últimos 4 dígitos
                                                </label>

                                                <input
                                                    id="ultimosDigitos"
                                                    className="form-control"
                                                    maxLength="4"
                                                    inputMode="numeric"
                                                    {...registerPagamento(
                                                        "ultimosDigitos"
                                                    )}
                                                />

                                                {errosPagamento.ultimosDigitos && (
                                                    <small className="text-danger">
                                                        {
                                                            errosPagamento
                                                                .ultimosDigitos
                                                                .message
                                                        }
                                                    </small>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="nomeCartao"
                                                    className="form-label"
                                                >
                                                    Nome no cartão
                                                </label>

                                                <input
                                                    id="nomeCartao"
                                                    className="form-control"
                                                    {...registerPagamento(
                                                        "nomeCartao"
                                                    )}
                                                />

                                                {errosPagamento.nomeCartao && (
                                                    <small className="text-danger">
                                                        {
                                                            errosPagamento
                                                                .nomeCartao
                                                                .message
                                                        }
                                                    </small>
                                                )}
                                            </div>

                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-outline-dark mt-4"
                                            disabled={
                                                criarPagamentoMutation.isPending
                                            }
                                        >
                                            {criarPagamentoMutation.isPending
                                                ? "Salvando..."
                                                : "Salvar pagamento"}
                                        </button>

                                    </form>

                                </div>

                            </div>

                            <div className="col-lg-5">

                                <div className="p-4 p-md-5 border bg-white">

                                    <div className="section-label mb-2">
                                        Histórico
                                    </div>

                                    <h2 className="h4 mb-4">
                                        Meus pedidos
                                    </h2>

                                    <div className="d-flex flex-wrap gap-2 mb-4">

                                        <button
                                            type="button"
                                            className={`btn btn-sm ${
                                                filtroPedidos === "todos"
                                                    ? "btn-dark"
                                                    : "btn-outline-dark"
                                            }`}
                                            onClick={() =>
                                                setFiltroPedidos(
                                                    "todos"
                                                )
                                            }
                                        >
                                            Todos
                                        </button>

                                        <button
                                            type="button"
                                            className={`btn btn-sm ${
                                                filtroPedidos === "pendentes"
                                                    ? "btn-dark"
                                                    : "btn-outline-dark"
                                            }`}
                                            onClick={() =>
                                                setFiltroPedidos(
                                                    "pendentes"
                                                )
                                            }
                                        >
                                            Pendentes
                                        </button>

                                        <button
                                            type="button"
                                            className={`btn btn-sm ${
                                                filtroPedidos === "concluidos"
                                                    ? "btn-dark"
                                                    : "btn-outline-dark"
                                            }`}
                                            onClick={() =>
                                                setFiltroPedidos(
                                                    "concluidos"
                                                )
                                            }
                                        >
                                            Concluídos
                                        </button>

                                        <button
                                            type="button"
                                            className={`btn btn-sm ${
                                                filtroPedidos === "cancelados"
                                                    ? "btn-dark"
                                                    : "btn-outline-dark"
                                            }`}
                                            onClick={() =>
                                                setFiltroPedidos(
                                                    "cancelados"
                                                )
                                            }
                                        >
                                            Cancelados
                                        </button>

                                    </div>

                                    {carregandoPedidos && (
                                        <p className="text-muted">
                                            Carregando pedidos...
                                        </p>
                                    )}

                                    {erroPedidos && (
                                        <div className="alert alert-danger">
                                            Não foi possível carregar
                                            seus pedidos.
                                        </div>
                                    )}

                                    {!carregandoPedidos &&
                                        pedidosFiltrados.length === 0 && (
                                            <div className="text-center py-4">
                                                <i className="bi bi-receipt fs-1 text-muted"></i>

                                                <p className="text-muted mt-3 mb-0">
                                                    Nenhum pedido encontrado
                                                    neste filtro.
                                                </p>
                                            </div>
                                        )}

                                    <div className="d-grid gap-3">

                                        {pedidosFiltrados.map(
                                            (pedido) => (
                                                <div
                                                    key={
                                                        pedido.id
                                                    }
                                                    className="border p-3"
                                                >
                                                    <div className="d-flex justify-content-between align-items-start gap-3">

                                                        <div>
                                                            <span className="small text-muted">
                                                                Pedido
                                                            </span>

                                                            <div className="fw-semibold">
                                                                #{pedido.id}
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`badge ${obterClasseStatus(
                                                                pedido.status
                                                            )}`}
                                                        >
                                                            {
                                                                pedido.status
                                                            }
                                                        </span>

                                                    </div>

                                                    <div className="d-flex justify-content-between align-items-center mt-3">

                                                        <div>
                                                            <div className="small text-muted">
                                                                Data
                                                            </div>

                                                            <div>
                                                                {formatarData(
                                                                    pedido.data
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-end">
                                                            <div className="small text-muted">
                                                                Total
                                                            </div>

                                                            <strong>
                                                                {formatarMoeda(
                                                                    pedido.valorTotal
                                                                )}
                                                            </strong>
                                                        </div>

                                                    </div>

                                                    <Link
                                                        to={`/pedidos/${pedido.id}`}
                                                        className="btn btn-sm btn-outline-dark w-100 mt-3"
                                                    >
                                                        Acompanhar pedido
                                                    </Link>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default MinhaConta;