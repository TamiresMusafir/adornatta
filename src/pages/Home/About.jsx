import { Link } from "react-router-dom";

function About() {
    return (
        <section className="section section-soft" id="sobre">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <div className="about-image">
                            <img
                                src="/assets/images/colecao_01.jpg"
                                alt="Semijoias Adornatta"
                            />
                        </div>
                    </div>

                    <div className="col-lg-5 offset-lg-1">
                        <div className="section-label">
                            Conheça a Adornatta
                        </div>

                        <h2 className="section-title mb-4">
                            Beleza, personalidade e cuidado em cada escolha.
                        </h2>

                        <p className="section-text mb-4">
                            A Adornatta nasceu com o propósito de oferecer
                            semijoias que combinam beleza, conforto e
                            elegância, permitindo que cada cliente encontre
                            peças que representem seu próprio estilo.
                        </p>

                        <p className="section-text mb-4">
                            Somos uma loja que valoriza a qualidade dos
                            produtos, a atenção aos detalhes e uma experiência
                            de compra simples e especial.
                        </p>

                        <Link
                            to="/sobre"
                            className="btn btn-dark rounded-0 px-4 py-3"
                        >
                            Conheça a Adornatta
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;