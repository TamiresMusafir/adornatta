import { Link } from "react-router-dom";

function AdminFooter() {
    return (
        <footer className="footer admin-footer">

            <div className="container">

                <div className="row g-5">

                    <div className="col-lg-6">

                        <div className="brand mb-3">
                            ADORNATTA
                        </div>

                        <p className="text-muted mb-0">
                            Área administrativa da loja Adornatta.
                            Gerencie estoque, pedidos e vendas.
                        </p>

                    </div>

                    <div className="col-lg-6">

                        <h6>
                            Área administrativa
                        </h6>

                        <ul className="list-unstyled">

                            <li>
                                <Link to="/admin">
                                    Painel
                                </Link>
                            </li>

                            <li>
                                <Link to="/admin/estoque">
                                    Estoque
                                </Link>
                            </li>

                            <li>
                                <Link to="/admin/pedidos">
                                    Pedidos
                                </Link>
                            </li>

                            <li>
                                <Link to="/admin/vendas">
                                    Vendas
                                </Link>
                            </li>

                        </ul>

                    </div>

                </div>

                <div className="footer-bottom mt-5 pt-4 border-top">

                    <small className="text-muted">
                        © 2026 Adornatta.
                        Todos os direitos reservados.
                    </small>

                </div>

            </div>

        </footer>
    );
}

export default AdminFooter;