function Footer() {
    return (
        <footer className="pt-5 pb-4">

            <div className="container">

                <div className="row g-5">

                    {/* MARCA */}
                    <section className="col-lg-5">

                        <div className="footer-brand mb-3">
                            ADORNATTA
                        </div>

                        <p className="mb-0">
                            Joias escolhidas com cuidado para acompanhar
                            momentos especiais.
                        </p>

                    </section>

                    {/* NAVEGAÇÃO */}
                    <section className="col-6 col-lg-2">

                        <div className="footer-title">
                            Navegação
                        </div>

                        <p className="mb-2">
                            <a href="/">
                                Início
                            </a>
                        </p>

                        <p className="mb-2">
                            <a href="/produtos">
                                Produtos
                            </a>
                        </p>

                        <p className="mb-2">
                            <a href="/categorias">
                                Categorias
                            </a>
                        </p>

                        <p className="mb-2">
                            <a href="/sobre">
                                Sobre nós
                            </a>
                        </p>

                    </section>

                    {/* ATENDIMENTO */}
                    <section className="col-6 col-lg-2">

                        <div className="footer-title">
                            Atendimento
                        </div>

                        <p className="mb-2">
                            <a href="/contato">
                                Contato
                            </a>
                        </p>

                        <p className="mb-2">
                            <a href="/lista-desejos">
                                Lista de desejos
                            </a>
                        </p>

                        <p className="mb-2">
                            <a href="/login">
                                Minha conta
                            </a>
                        </p>

                    </section>

                    {/* CONTATO */}
                    <section className="col-lg-3">

                        <div className="footer-title">
                            Contato
                        </div>

                        <p className="mb-2">
                            <i className="bi bi-envelope me-2"></i>
                            contato@adornatta.com
                        </p>

                        <p className="mb-2">
                            <i className="bi bi-telephone me-2"></i>
                            (21) 99999-9999
                        </p>

                    </section>

                </div>

                <hr className="border-secondary opacity-25 my-4" />

                <div className="d-flex flex-column flex-md-row justify-content-between gap-2">

                    <p className="mb-0">
                        © 2026 Adornatta. Todos os direitos reservados.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;