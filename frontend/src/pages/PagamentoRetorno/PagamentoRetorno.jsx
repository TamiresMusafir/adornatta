import { Link, useSearchParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const mensagensPagamento = {
    approved: "O Mercado Pago informou que o pagamento foi aprovado.",
    pending: "O pagamento está pendente de confirmação.",
    failure: "O pagamento não foi concluído."
};

function PagamentoRetorno() {
    const [searchParams] = useSearchParams();
    const pedidoId = searchParams.get("pedidoId");
    const resultado = searchParams.get("resultado");
    const mensagem = mensagensPagamento[resultado] ||
        "Não foi possível identificar o resultado do pagamento.";

    return (
        <>
            <Header />
            <main className="container py-5">
                <div className="text-center py-5">
                    <span className="section-label">Pagamento</span>
                    <h1 className="section-title mb-3">Retorno do Mercado Pago</h1>
                    <p className="section-text mb-4">{mensagem}</p>
                    <p>
                        Consulte o pedido para ver o status atualizado pelo backend.
                    </p>
                    {pedidoId ? (
                        <Link
                            to={`/pedidos/${encodeURIComponent(pedidoId)}`}
                            className="btn btn-dark"
                        >
                            Acompanhar pedido
                        </Link>
                    ) : (
                        <Link to="/produtos" className="btn btn-dark">
                            Voltar à loja
                        </Link>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default PagamentoRetorno;
