import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AdminHeader from "../../../components/AdminHeader/AdminHeader";
import AdminFooter from "../../../components/AdminFooter/AdminFooter";
import { buscarVendas } from "../../../services/api";

function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    if (!data || Number.isNaN(new Date(data).getTime())) {
        return "-";
    }

    return new Date(data).toLocaleDateString("pt-BR");
}

function Vendas() {
    const [busca, setBusca] = useState("");
    const [vendaSelecionada, setVendaSelecionada] = useState(null);

    const {
        data: vendas = [],
        isLoading: carregandoVendas,
        isError: erroVendas,
        error
    } = useQuery({
        queryKey: ["vendas"],
        queryFn: buscarVendas
    });

    const vendasFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) {
            return vendas;
        }

        return vendas.filter((venda) => (
            String(venda.id || "").toLowerCase().includes(termo) ||
            String(venda.cliente || "").toLowerCase().includes(termo) ||
            String(venda.formaPagamento || "").toLowerCase().includes(termo) ||
            venda.itens.some((item) =>
                String(item.nome || "").toLowerCase().includes(termo)
            )
        ));
    }, [busca, vendas]);

    const vendasDoMes = useMemo(() => {
        const agora = new Date();
        return vendas.filter((venda) => {
            const data = new Date(venda.data);
            return data.getMonth() === agora.getMonth() &&
                data.getFullYear() === agora.getFullYear();
        });
    }, [vendas]);

    const faturamentoDoMes = vendasDoMes.reduce(
        (total, venda) => total + Number(venda.valorTotal || 0),
        0
    );

    return (
        <>
            <AdminHeader />

            <main>
                <section className="section-soft py-5">
                    <div className="container">
                        <div className="section-label">Área administrativa</div>
                        <h1 className="section-title mb-3">Vendas</h1>
                        <p className="section-text mb-0">
                            Consulte os pedidos pagos e confirmados pelo Mercado Pago.
                        </p>
                    </div>
                </section>

                <section className="py-5">
                    <div className="container">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <div className="admin-summary-card">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-cart-check"></i>
                                    </div>
                                    <div>
                                        <span className="text-muted small">
                                            Vendas confirmadas
                                        </span>
                                        <h3 className="mb-0 mt-1">{vendas.length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="admin-summary-card">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-calendar3"></i>
                                    </div>
                                    <div>
                                        <span className="text-muted small">
                                            Vendas neste mês
                                        </span>
                                        <h3 className="mb-0 mt-1">
                                            {vendasDoMes.length}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="admin-summary-card">
                                    <div className="admin-summary-icon">
                                        <i className="bi bi-currency-dollar"></i>
                                    </div>
                                    <div>
                                        <span className="text-muted small">
                                            Faturamento do mês
                                        </span>
                                        <h3 className="mb-0 mt-1">
                                            {formatarMoeda(faturamentoDoMes)}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-soft py-5">
                    <div className="container">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                            <div>
                                <div className="section-label">Histórico</div>
                                <h2 className="display-font mb-0">
                                    Pagamentos aprovados
                                </h2>
                            </div>
                            <div className="admin-search">
                                <i className="bi bi-search"></i>
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Buscar venda, cliente ou produto"
                                    value={busca}
                                    onChange={(evento) => setBusca(evento.target.value)}
                                />
                            </div>
                        </div>

                        {carregandoVendas ? (
                            <div className="text-center py-5" role="status">
                                Carregando vendas...
                            </div>
                        ) : erroVendas ? (
                            <div className="alert alert-danger" role="alert">
                                {error.message || "Não foi possível carregar as vendas."}
                            </div>
                        ) : vendasFiltradas.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-cart-x fs-1"></i>
                                <h5 className="mt-3">Nenhuma venda encontrada.</h5>
                                <p className="text-muted mb-0">
                                    As vendas aparecem aqui após a confirmação do pagamento.
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive bg-white">
                                <table className="table admin-table align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Pedido</th>
                                            <th>Cliente e itens</th>
                                            <th>Data</th>
                                            <th>Pagamento</th>
                                            <th>Total</th>
                                            <th className="text-end">Detalhes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendasFiltradas.map((venda) => (
                                            <tr key={venda.id}>
                                                <td>
                                                    <strong>#{venda.id}</strong>
                                                </td>
                                                <td>
                                                    <strong>{venda.cliente}</strong>
                                                    <small className="d-block text-muted">
                                                        {venda.itens.map((item) =>
                                                            `${item.nome} x${item.quantidade}`
                                                        ).join(", ")}
                                                    </small>
                                                </td>
                                                <td>{formatarData(venda.data)}</td>
                                                <td>{venda.formaPagamento || "-"}</td>
                                                <td>{formatarMoeda(venda.valorTotal)}</td>
                                                <td className="text-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={() =>
                                                            setVendaSelecionada(
                                                                vendaSelecionada?.id === venda.id
                                                                    ? null
                                                                    : venda
                                                            )
                                                        }
                                                    >
                                                        {vendaSelecionada?.id === venda.id
                                                            ? "Fechar"
                                                            : "Ver"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {vendaSelecionada && (
                            <section className="bg-white border p-4 mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="h5 mb-0">
                                        Pedido #{vendaSelecionada.id}
                                    </h3>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Fechar detalhes"
                                        onClick={() => setVendaSelecionada(null)}
                                    />
                                </div>
                                <p className="mb-3">
                                    <strong>Cliente:</strong> {vendaSelecionada.cliente}
                                    {" · "}
                                    <strong>Pagamento:</strong>{" "}
                                    {vendaSelecionada.formaPagamento || "-"}
                                    {" · "}
                                    <strong>Status:</strong>{" "}
                                    {vendaSelecionada.statusPedido}
                                </p>
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Quantidade</th>
                                                <th>Preço unitário</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vendaSelecionada.itens.map((item) => (
                                                <tr key={item.produtoId}>
                                                    <td>{item.nome}</td>
                                                    <td>{item.quantidade}</td>
                                                    <td>{formatarMoeda(item.precoUnitario)}</td>
                                                    <td>
                                                        {formatarMoeda(
                                                            item.precoUnitario * item.quantidade
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-end fw-bold mt-3">
                                    Total: {formatarMoeda(vendaSelecionada.valorTotal)}
                                </div>
                            </section>
                        )}
                    </div>
                </section>
            </main>

            <AdminFooter />
        </>
    );
}

export default Vendas;
