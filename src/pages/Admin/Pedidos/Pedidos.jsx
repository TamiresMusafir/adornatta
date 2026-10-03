import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    buscarPedidos,
    buscarProdutos,
    buscarItensPedido,
    atualizarPedido
} from "../../../services/api";

const STATUS_PEDIDO = [
    "Em análise",
    "Em preparação",
    "Enviado",
    "Entregue",
    "Cancelado"
];

function formatarData(data) {
    if (!data) {
        return "-";
    }

    return new Intl.DateTimeFormat("pt-BR").format(
        new Date(data)
    );
}

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}

function obterClasseStatus(status) {
    switch (status) {
        case "Em análise":
            return "bg-warning-subtle text-warning-emphasis";

        case "Em preparação":
            return "bg-primary-subtle text-primary";

        case "Enviado":
            return "bg-info-subtle text-info-emphasis";

        case "Entregue":
            return "bg-success-subtle text-success";

        case "Cancelado":
            return "bg-danger-subtle text-danger";

        default:
            return "bg-secondary-subtle text-secondary";
    }
}

function Pedidos() {
    const queryClient = useQueryClient();

    const [pesquisa, setPesquisa] = useState("");
    const [pedidoSelecionado, setPedidoSelecionado] =
        useState(null);
    const [novoStatus, setNovoStatus] = useState("");

    const {
        data: pedidos = [],
        isLoading: carregandoPedidos,
        isError: erroPedidos
    } = useQuery({
        queryKey: ["pedidos"],
        queryFn: buscarPedidos
    });

    const {
        data: produtos = [],
        isLoading: carregandoProdutos
    } = useQuery({
        queryKey: ["produtos"],
        queryFn: buscarProdutos
    });

    const produtosMap = useMemo(() => {
        return new Map(
            produtos.map((produto) => [
                String(produto.id),
                produto
            ])
        );
    }, [produtos]);

    const atualizarStatusMutation = useMutation({
        mutationFn: ({ id, status }) =>
            atualizarPedido(id, { status }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pedidos"]
            });

            setPedidoSelecionado(null);
            setNovoStatus("");
        }
    });

    const pedidosFiltrados = useMemo(() => {
        const termo = pesquisa
            .trim()
            .toLowerCase();

        if (!termo) {
            return pedidos;
        }

        return pedidos.filter((pedido) =>
            String(pedido.id)
                .toLowerCase()
                .includes(termo)
        );
    }, [pedidos, pesquisa]);

    const totalPedidos = pedidos.length;

    const pedidosEmAnalise = pedidos.filter(
        (pedido) =>
            pedido.status === "Em análise"
    ).length;

    const pedidosEmPreparacao = pedidos.filter(
        (pedido) =>
            pedido.status === "Em preparação"
    ).length;

    const pedidosEnviados = pedidos.filter(
        (pedido) =>
            pedido.status === "Enviado"
    ).length;

    function abrirDetalhes(pedido) {
        setPedidoSelecionado(pedido);
        setNovoStatus(pedido.status);
    }

    function fecharDetalhes() {
        setPedidoSelecionado(null);
        setNovoStatus("");
    }

    function salvarStatus() {
        if (!pedidoSelecionado) {
            return;
        }

        atualizarStatusMutation.mutate({
            id: pedidoSelecionado.id,
            status: novoStatus
        });
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg border-bottom bg-white">
                <div className="container">
                    <a
                        href="/admin"
                        className="navbar-brand display-font"
                        onClick={(evento) => {
                            evento.preventDefault();
                            window.location.href =
                                "/admin";
                        }}
                    >
                        ADORNATTA
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#adminNavbar"
                        aria-controls="adminNavbar"
                        aria-expanded="false"
                        aria-label="Alternar navegação"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="adminNavbar"
                    >
                        <ul className="navbar-nav ms-auto align-items-lg-center">
                            <li className="nav-item">
                                <a
                                    href="/admin"
                                    className="nav-link"
                                >
                                    Painel
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/estoque"
                                    className="nav-link"
                                >
                                    Estoque
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/pedidos"
                                    className="nav-link active"
                                >
                                    Pedidos
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/vendas"
                                    className="nav-link"
                                >
                                    Vendas
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main>
                <section className="container py-5">
                    <div className="mb-5">
                        <div className="section-label mb-2">
                            Área da loja
                        </div>

                        <h1 className="display-font mb-3">
                            Pedidos
                        </h1>

                        <p className="text-muted mb-0">
                            Consulte os pedidos realizados
                            pelos clientes e acompanhe o
                            andamento de cada compra.
                        </p>
                    </div>

                    <div className="row g-3 mb-5">
                        <div className="col-md-6 col-lg-3">
                            <div className="admin-summary-card h-100">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-receipt"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Total de pedidos
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {carregandoPedidos
                                                ? "..."
                                                : totalPedidos}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="admin-summary-card h-100">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-clock"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Em análise
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {carregandoPedidos
                                                ? "..."
                                                : pedidosEmAnalise}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="admin-summary-card h-100">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-box-seam"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Em preparação
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {carregandoPedidos
                                                ? "..."
                                                : pedidosEmPreparacao}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="admin-summary-card h-100">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-truck"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Enviados
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {carregandoPedidos
                                                ? "..."
                                                : pedidosEnviados}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {erroPedidos && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            Não foi possível carregar os
                            pedidos.
                        </div>
                    )}

                    <section className="section-soft py-5">
                        <div className="container">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                                <div>
                                    <div className="section-label">
                                        Gerenciamento
                                    </div>

                                    <h2 className="display-font mb-0">
                                        Pedidos realizados
                                    </h2>
                                </div>

                                <div className="admin-search">
                                    <div className="input-group">
                                        <span className="input-group-text bg-white">
                                            <i className="bi bi-search"></i>
                                        </span>

                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Pesquisar pedido..."
                                            value={pesquisa}
                                            onChange={(evento) =>
                                                setPesquisa(
                                                    evento.target
                                                        .value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {carregandoPedidos ||
                            carregandoProdutos ? (
                                <div className="text-center py-5">
                                    <div
                                        className="spinner-border"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Carregando...
                                        </span>
                                    </div>
                                </div>
                            ) : pedidosFiltrados.length === 0 ? (
                                <div className="bg-white border p-5 text-center">
                                    <i className="bi bi-receipt display-5"></i>

                                    <h3 className="h5 mt-3">
                                        Nenhum pedido encontrado
                                    </h3>

                                    <p className="text-muted mb-0">
                                        Tente pesquisar por
                                        outro número de pedido.
                                    </p>
                                </div>
                            ) : (
                                <div className="table-responsive bg-white">
                                    <table className="table admin-table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Pedido
                                                </th>

                                                <th>
                                                    Cliente
                                                </th>

                                                <th>
                                                    Data
                                                </th>

                                                <th>
                                                    Total
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th className="text-end">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {pedidosFiltrados.map(
                                                (pedido) => (
                                                    <tr
                                                        key={
                                                            pedido.id
                                                        }
                                                    >
                                                        <td>
                                                            <strong>
                                                                #
                                                                {
                                                                    pedido.id
                                                                }
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                Cliente
                                                            </strong>

                                                            <small className="d-block text-muted">
                                                                Dados do
                                                                cliente não
                                                                vinculados
                                                                ao pedido
                                                            </small>
                                                        </td>

                                                        <td>
                                                            {formatarData(
                                                                pedido.data
                                                            )}
                                                        </td>

                                                        <td>
                                                            {formatarMoeda(
                                                                pedido.valorTotal
                                                            )}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`badge ${obterClasseStatus(
                                                                    pedido.status
                                                                )}`}
                                                            >
                                                                {
                                                                    pedido.status
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="text-end">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-dark"
                                                                onClick={() =>
                                                                    abrirDetalhes(
                                                                        pedido
                                                                    )
                                                                }
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </section>
            </main>

            {pedidoSelecionado && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    style={{
                        backgroundColor:
                            "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded-0 border-0">
                            <div className="modal-header border-bottom">
                                <div>
                                    <div className="section-label mb-1">
                                        Pedido
                                    </div>

                                    <h5 className="modal-title display-font">
                                        Detalhes do pedido
                                    </h5>
                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Fechar"
                                    onClick={
                                        fecharDetalhes
                                    }
                                ></button>
                            </div>

                            <div className="modal-body p-4">
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <span className="text-muted small">
                                            Número do pedido
                                        </span>

                                        <strong className="d-block mt-1">
                                            #
                                            {
                                                pedidoSelecionado.id
                                            }
                                        </strong>
                                    </div>

                                    <div className="col-md-6">
                                        <span className="text-muted small">
                                            Data
                                        </span>

                                        <strong className="d-block mt-1">
                                            {formatarData(
                                                pedidoSelecionado.data
                                            )}
                                        </strong>
                                    </div>

                                    <div className="col-md-6">
                                        <span className="text-muted small">
                                            Cliente
                                        </span>

                                        <strong className="d-block mt-1">
                                            Cliente não
                                            identificado
                                        </strong>
                                    </div>

                                    <div className="col-md-6">
                                        <span className="text-muted small">
                                            Total
                                        </span>

                                        <strong className="d-block mt-1">
                                            {formatarMoeda(
                                                pedidoSelecionado.valorTotal
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div className="border-top pt-4">
                                    <h6 className="mb-3">
                                        Produtos
                                    </h6>

                                    <ItensDoPedido
                                        pedidoId={
                                            pedidoSelecionado.id
                                        }
                                        produtosMap={
                                            produtosMap
                                        }
                                    />
                                </div>

                                <div className="border-top pt-4 mt-4">
                                    <label
                                        htmlFor="orderStatus"
                                        className="form-label"
                                    >
                                        Status do pedido
                                    </label>

                                    <select
                                        id="orderStatus"
                                        className="form-select"
                                        value={novoStatus}
                                        onChange={(evento) =>
                                            setNovoStatus(
                                                evento.target
                                                    .value
                                            )
                                        }
                                    >
                                        {STATUS_PEDIDO.map(
                                            (status) => (
                                                <option
                                                    key={
                                                        status
                                                    }
                                                    value={
                                                        status
                                                    }
                                                >
                                                    {status}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {atualizarStatusMutation.isError && (
                                    <div
                                        className="alert alert-danger mt-4 mb-0"
                                        role="alert"
                                    >
                                        Não foi possível
                                        atualizar o status
                                        do pedido.
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer border-top">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark"
                                    onClick={
                                        fecharDetalhes
                                    }
                                >
                                    Fechar
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={
                                        salvarStatus
                                    }
                                    disabled={
                                        atualizarStatusMutation.isPending
                                    }
                                >
                                    {atualizarStatusMutation.isPending
                                        ? "Atualizando..."
                                        : "Atualizar status"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function ItensDoPedido({
    pedidoId,
    produtosMap
}) {
    const {
        data: itens = [],
        isLoading
    } = useQuery({
        queryKey: [
            "itensPedido",
            pedidoId
        ],
        queryFn: () =>
            buscarItensPedido(pedidoId)
    });

    if (isLoading) {
        return (
            <div className="text-center py-3">
                <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                >
                    <span className="visually-hidden">
                        Carregando produtos...
                    </span>
                </div>
            </div>
        );
    }

    if (itens.length === 0) {
        return (
            <div className="p-3 bg-light text-muted">
                Nenhum produto encontrado neste pedido.
            </div>
        );
    }

    return (
        <div className="bg-light p-3">
            {itens.map((item) => {
                const produto =
                    produtosMap.get(
                        String(item.produtoId)
                    );

                return (
                    <div
                        key={item.id}
                        className="d-flex justify-content-between align-items-center border-bottom py-2"
                    >
                        <span>
                            {produto?.nome ||
                                `Produto ${item.produtoId}`}
                        </span>

                        <strong>
                            x{item.quantidade}
                        </strong>
                    </div>
                );
            })}
        </div>
    );
}

export default Pedidos;