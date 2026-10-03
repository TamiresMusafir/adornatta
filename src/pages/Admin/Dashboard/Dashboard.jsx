import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { buscarProdutos } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

function Dashboard() {
    const navigate = useNavigate();

    const { usuario, logout } = useAuth();

    const {
        data: produtos = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ["produtos"],
        queryFn: buscarProdutos
    });

    const totalProdutos = produtos.length;

    const totalEstoque = useMemo(() => {
        return produtos.reduce(
            (total, produto) =>
                total +
                Number(produto.quantidadeDisponivel || 0),
            0
        );
    }, [produtos]);

    const produtosEstoqueBaixo = useMemo(() => {
        return produtos.filter(
            (produto) =>
                Number(produto.quantidadeDisponivel) > 0 &&
                Number(produto.quantidadeDisponivel) <= 3
        );
    }, [produtos]);

    const produtosSemEstoque = useMemo(() => {
        return produtos.filter(
            (produto) =>
                Number(produto.quantidadeDisponivel) <= 0
        );
    }, [produtos]);

    function sair() {
        logout();
        navigate("/login");
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
                            navigate("/admin");
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
                                    className="nav-link active"
                                    onClick={(evento) => {
                                        evento.preventDefault();
                                        navigate("/admin");
                                    }}
                                >
                                    Painel
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/estoque"
                                    className="nav-link"
                                    onClick={(evento) => {
                                        evento.preventDefault();
                                        navigate("/admin/estoque");
                                    }}
                                >
                                    Estoque
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/pedidos"
                                    className="nav-link"
                                    onClick={(evento) => {
                                        evento.preventDefault();
                                        navigate("/admin/pedidos");
                                    }}
                                >
                                    Pedidos
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/vendas"
                                    className="nav-link"
                                    onClick={(evento) => {
                                        evento.preventDefault();
                                        navigate("/admin/vendas");
                                    }}
                                >
                                    Vendas
                                </a>
                            </li>

                            <li className="nav-item ms-lg-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={sair}
                                >
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="container py-5">
                <div className="mb-5">
                    <div className="section-label mb-2">
                        Área administrativa
                    </div>

                    <h1 className="display-font mb-2">
                        Painel
                    </h1>

                    <p className="text-muted mb-0">
                        Olá, {usuario?.nome || "Administrador"}.
                        Aqui você acompanha as principais
                        informações da loja.
                    </p>
                </div>

                <div className="row g-3 mb-5">
                    <div className="col-md-6 col-lg-3">
                        <div className="admin-summary-card h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="admin-summary-icon">
                                    <i className="bi bi-box-seam"></i>
                                </div>

                                <div>
                                    <div className="text-muted small">
                                        Produtos cadastrados
                                    </div>

                                    <div className="fs-3 fw-semibold">
                                        {isLoading
                                            ? "..."
                                            : totalProdutos}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div className="admin-summary-card h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="admin-summary-icon">
                                    <i className="bi bi-stack"></i>
                                </div>

                                <div>
                                    <div className="text-muted small">
                                        Itens em estoque
                                    </div>

                                    <div className="fs-3 fw-semibold">
                                        {isLoading
                                            ? "..."
                                            : totalEstoque}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div className="admin-summary-card h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="admin-summary-icon">
                                    <i className="bi bi-exclamation-triangle"></i>
                                </div>

                                <div>
                                    <div className="text-muted small">
                                        Estoque baixo
                                    </div>

                                    <div className="fs-3 fw-semibold">
                                        {isLoading
                                            ? "..."
                                            : produtosEstoqueBaixo.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                        <div className="admin-summary-card h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="admin-summary-icon">
                                    <i className="bi bi-x-circle"></i>
                                </div>

                                <div>
                                    <div className="text-muted small">
                                        Sem estoque
                                    </div>

                                    <div className="fs-3 fw-semibold">
                                        {isLoading
                                            ? "..."
                                            : produtosSemEstoque.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isError && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        Não foi possível carregar as informações
                        dos produtos.
                    </div>
                )}

                <div className="row g-4">
                    <div className="col-lg-7">
                        <section className="border bg-white h-100">
                            <div className="p-4 border-bottom">
                                <div className="section-label mb-1">
                                    Estoque
                                </div>

                                <h2 className="section-title mb-0">
                                    Situação do estoque
                                </h2>
                            </div>

                            <div className="p-4">
                                {isLoading ? (
                                    <div className="text-center py-4">
                                        <div
                                            className="spinner-border"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Carregando...
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span>
                                                Produtos cadastrados
                                            </span>

                                            <strong>
                                                {totalProdutos}
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span>
                                                Itens disponíveis
                                            </span>

                                            <strong>
                                                {totalEstoque}
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span>
                                                Estoque baixo
                                            </span>

                                            <strong>
                                                {
                                                    produtosEstoqueBaixo.length
                                                }
                                            </strong>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>
                                                Sem estoque
                                            </span>

                                            <strong>
                                                {
                                                    produtosSemEstoque.length
                                                }
                                            </strong>
                                        </div>

                                        <hr className="my-4" />

                                        <button
                                            type="button"
                                            className="btn btn-dark"
                                            onClick={() =>
                                                navigate(
                                                    "/admin/estoque"
                                                )
                                            }
                                        >
                                            <i className="bi bi-box-seam me-2"></i>
                                            Ver estoque
                                        </button>
                                    </>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="col-lg-5">
                        <section className="border bg-white h-100">
                            <div className="p-4 border-bottom">
                                <div className="section-label mb-1">
                                    Acesso rápido
                                </div>

                                <h2 className="section-title mb-0">
                                    Gerenciamento
                                </h2>
                            </div>

                            <div className="p-4">
                                <div className="d-grid gap-3">
                                    <button
                                        type="button"
                                        className="btn btn-outline-dark text-start p-3"
                                        onClick={() =>
                                            navigate(
                                                "/admin/estoque"
                                            )
                                        }
                                    >
                                        <i className="bi bi-box-seam me-2"></i>
                                        <strong>
                                            Produtos em estoque
                                        </strong>

                                        <span className="d-block text-muted small mt-1">
                                            Gerencie produtos,
                                            preços e quantidades.
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-dark text-start p-3"
                                        onClick={() =>
                                            navigate(
                                                "/admin/pedidos"
                                            )
                                        }
                                    >
                                        <i className="bi bi-receipt me-2"></i>
                                        <strong>
                                            Pedidos
                                        </strong>

                                        <span className="d-block text-muted small mt-1">
                                            Consulte e atualize os
                                            pedidos dos clientes.
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-dark text-start p-3"
                                        onClick={() =>
                                            navigate(
                                                "/admin/vendas"
                                            )
                                        }
                                    >
                                        <i className="bi bi-graph-up me-2"></i>
                                        <strong>
                                            Vendas
                                        </strong>

                                        <span className="d-block text-muted small mt-1">
                                            Acompanhe as vendas e
                                            o faturamento.
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <section className="border bg-white mt-4">
                    <div className="p-4 border-bottom">
                        <div className="section-label mb-1">
                            Estoque baixo
                        </div>

                        <h2 className="section-title mb-0">
                            Produtos que precisam de atenção
                        </h2>
                    </div>

                    <div className="p-4">
                        {isLoading ? (
                            <div className="text-center py-3">
                                <div
                                    className="spinner-border"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Carregando...
                                    </span>
                                </div>
                            </div>
                        ) : produtosEstoqueBaixo.length === 0 &&
                          produtosSemEstoque.length === 0 ? (
                            <div className="text-center py-4">
                                <i className="bi bi-check-circle display-6"></i>

                                <h3 className="h5 mt-3">
                                    Estoque em boas condições
                                </h3>

                                <p className="text-muted mb-0">
                                    Nenhum produto está com
                                    estoque baixo no momento.
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>
                                                Produto
                                            </th>

                                            <th>
                                                Quantidade
                                            </th>

                                            <th>
                                                Situação
                                            </th>

                                            <th className="text-end">
                                                Ação
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {[
                                            ...produtosSemEstoque,
                                            ...produtosEstoqueBaixo
                                        ].map((produto) => (
                                            <tr
                                                key={produto.id}
                                            >
                                                <td>
                                                    <strong>
                                                        {
                                                            produto.nome
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        produto.quantidadeDisponivel
                                                    }
                                                </td>

                                                <td>
                                                    {Number(
                                                        produto.quantidadeDisponivel
                                                    ) <= 0 ? (
                                                        <span className="badge rounded-pill bg-danger-subtle text-danger">
                                                            Sem estoque
                                                        </span>
                                                    ) : (
                                                        <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">
                                                            Estoque baixo
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={() =>
                                                            navigate(
                                                                "/admin/estoque"
                                                            )
                                                        }
                                                    >
                                                        Ver estoque
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}

export default Dashboard;