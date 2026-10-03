import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

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

    const itensEmEstoque = produtos.reduce(
        (total, produto) =>
            total + Number(produto.quantidadeDisponivel || 0),
        0
    );

    const produtosEstoqueBaixo = produtos.filter(
        (produto) =>
            Number(produto.quantidadeDisponivel || 0) <= 3
    );

    function sair() {
        logout();
        navigate("/login");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-white border-bottom">
                <div className="container">
                    <a
                        href="/"
                        className="navbar-brand display-font"
                        onClick={(evento) => {
                            evento.preventDefault();
                            navigate("/");
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
                        aria-label="Abrir menu"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="adminNavbar"
                    >
                        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="nav-link border-0 bg-transparent"
                                    onClick={() => navigate("/admin")}
                                >
                                    Painel
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="nav-link border-0 bg-transparent"
                                    onClick={() =>
                                        navigate("/admin/produtos")
                                    }
                                >
                                    Estoque
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="nav-link border-0 bg-transparent"
                                    onClick={() =>
                                        navigate("/admin/pedidos")
                                    }
                                >
                                    Pedidos
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="nav-link border-0 bg-transparent"
                                    onClick={() =>
                                        navigate("/admin/vendas")
                                    }
                                >
                                    Vendas
                                </button>
                            </li>

                            <li className="nav-item ms-lg-3">
                                <span className="text-muted small">
                                    Olá, {usuario?.nome}
                                </span>
                            </li>

                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={sair}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main>
                <section className="section pb-4">
                    <div className="container">
                        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4">
                            <div>
                                <div className="section-label">
                                    Área da loja
                                </div>

                                <h1 className="section-title mb-3">
                                    Painel
                                </h1>

                                <p className="section-text mb-0">
                                    Acompanhe os principais dados da
                                    sua loja em um só lugar.
                                </p>
                            </div>

                            <div className="text-lg-end">
                                <span className="text-muted small d-block">
                                    Usuário conectado
                                </span>

                                <strong>
                                    {usuario?.nome}
                                </strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-5">
                    <div className="container">
                        <div className="row g-3">
                            <div className="col-md-6 col-lg-3">
                                <div className="admin-summary-card">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-currency-dollar"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Vendas do mês
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            Em breve
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="admin-summary-card">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-receipt"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Pedidos
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            Em breve
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="admin-summary-card">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-gem"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Produtos cadastrados
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {isLoading
                                                ? "..."
                                                : totalProdutos}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="admin-summary-card">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-box-seam"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Itens em estoque
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {isLoading
                                                ? "..."
                                                : itensEmEstoque}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-soft py-5">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-lg-7">
                                <div className="bg-white border p-4 h-100">
                                    <div className="section-label mb-2">
                                        Pedidos
                                    </div>

                                    <h2 className="display-font mb-3">
                                        Pedidos recentes
                                    </h2>

                                    <p className="text-muted mb-4">
                                        O acompanhamento detalhado
                                        dos pedidos será disponibilizado
                                        na área de Pedidos.
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-dark"
                                        onClick={() =>
                                            navigate("/admin/pedidos")
                                        }
                                    >
                                        <i className="bi bi-arrow-right me-2"></i>
                                        Acessar pedidos
                                    </button>
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="bg-white border p-4 h-100">
                                    <div className="section-label mb-2">
                                        Atenção
                                    </div>

                                    <h2 className="display-font mb-3">
                                        Estoque baixo
                                    </h2>

                                    {isLoading && (
                                        <p className="text-muted mb-0">
                                            Carregando estoque...
                                        </p>
                                    )}

                                    {isError && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            Não foi possível carregar
                                            o estoque.
                                        </div>
                                    )}

                                    {!isLoading &&
                                        !isError &&
                                        produtosEstoqueBaixo.length === 0 && (
                                            <p className="text-muted mb-0">
                                                Nenhum produto com
                                                estoque baixo.
                                            </p>
                                        )}

                                    {!isLoading &&
                                        !isError &&
                                        produtosEstoqueBaixo.length > 0 && (
                                            <div className="list-group list-group-flush">
                                                {produtosEstoqueBaixo
                                                    .slice(0, 5)
                                                    .map((produto) => (
                                                        <div
                                                            className="list-group-item px-0 d-flex justify-content-between align-items-center"
                                                            key={produto.id}
                                                        >
                                                            <span>
                                                                {produto.nome}
                                                            </span>

                                                            <span className="badge text-bg-light">
                                                                {produto.quantidadeDisponivel}{" "}
                                                                un.
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}

                                    <button
                                        type="button"
                                        className="btn btn-outline-dark mt-4"
                                        onClick={() =>
                                            navigate("/admin/produtos")
                                        }
                                    >
                                        Ver estoque
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5">
                    <div className="container">
                        <div className="section-label mb-2">
                            Acessos rápidos
                        </div>

                        <h2 className="display-font mb-4">
                            Gerencie sua loja
                        </h2>

                        <div className="row g-3">
                            <div className="col-md-4">
                                <button
                                    type="button"
                                    className="admin-summary-card w-100 text-start border"
                                    onClick={() =>
                                        navigate("/admin/produtos")
                                    }
                                >
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-box-seam"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Produtos
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            Estoque
                                        </h3>
                                    </div>
                                </button>
                            </div>

                            <div className="col-md-4">
                                <button
                                    type="button"
                                    className="admin-summary-card w-100 text-start border"
                                    onClick={() =>
                                        navigate("/admin/pedidos")
                                    }
                                >
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-receipt"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Compras
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            Pedidos
                                        </h3>
                                    </div>
                                </button>
                            </div>

                            <div className="col-md-4">
                                <button
                                    type="button"
                                    className="admin-summary-card w-100 text-start border"
                                    onClick={() =>
                                        navigate("/admin/vendas")
                                    }
                                >
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-graph-up"></i>
                                    </div>

                                    <div>
                                        <span className="text-muted small">
                                            Financeiro
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            Vendas
                                        </h3>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Dashboard;