import { useEffect } from "react";

function Toast({
    mensagem,
    tipo = "sucesso",
    visivel,
    onFechar
}) {
    useEffect(() => {
        if (!visivel) {
            return;
        }

        const temporizador = setTimeout(() => {
            onFechar();
        }, 3000);

        return () => {
            clearTimeout(temporizador);
        };
    }, [visivel, onFechar]);

    if (!visivel) {
        return null;
    }

    const icone =
        tipo === "sucesso"
            ? "bi-check-circle"
            : "bi-heart";

    return (
        <div
            className="toast-container position-fixed bottom-0 end-0 p-4"
            style={{ zIndex: 1080 }}
        >
            <div
                className="toast show"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
            >
                <div className="toast-header">

                    <i
                        className={`bi ${icone} me-2`}
                    ></i>

                    <strong className="me-auto">
                        Adornatta
                    </strong>

                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Fechar"
                        onClick={onFechar}
                    ></button>

                </div>

                <div className="toast-body">
                    {mensagem}
                </div>

            </div>
        </div>
    );
}

export default Toast;