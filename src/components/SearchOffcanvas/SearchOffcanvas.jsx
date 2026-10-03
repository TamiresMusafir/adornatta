import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchOffcanvas() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [busca, setBusca] = useState("");

    useEffect(() => {
        setBusca(searchParams.get("busca") || "");
    }, [searchParams]);

    function pesquisar(event) {
        event.preventDefault();

        const termo = busca.trim();

        if (!termo) {
            navigate("/produtos");
            return;
        }

        navigate(
            `/produtos?busca=${encodeURIComponent(termo)}`
        );
    }

    return (
        <aside
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="searchOffcanvas"
            aria-labelledby="searchOffcanvasLabel"
        >
            <header className="offcanvas-header">
                <h2
                    className="offcanvas-title"
                    id="searchOffcanvasLabel"
                >
                    Buscar produtos
                </h2>

                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Fechar"
                ></button>
            </header>

            <section className="offcanvas-body">

                <form onSubmit={pesquisar}>

                    <label
                        htmlFor="searchInput"
                        className="form-label"
                    >
                        O que você está procurando?
                    </label>

                    <input
                        type="search"
                        className="form-control"
                        id="searchInput"
                        value={busca}
                        onChange={(event) =>
                            setBusca(event.target.value)
                        }
                        placeholder="Buscar semijoias..."
                        autoComplete="off"
                    />

                    <button
                        type="submit"
                        className="btn btn-gold mt-3"
                        data-bs-dismiss="offcanvas"
                    >
                        Buscar
                        <i className="bi bi-search ms-2"></i>
                    </button>

                </form>

            </section>
        </aside>
    );
}

export default SearchOffcanvas;