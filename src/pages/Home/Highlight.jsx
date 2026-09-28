import { Link } from "react-router-dom";

function Highlight() {
    return (
        <section className="section section-soft" id="destaques">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-5 offset-lg-1">
                        <div className="section-label">
                            Coleção em destaque
                        </div>

                        <h2 className="section-title mb-4">
                            Para momentos que merecem ser lembrados.
                        </h2>

                        <p className="section-text mb-4">
                            Descubra peças selecionadas para celebrar
                            momentos especiais. Joias que combinam
                            delicadeza, personalidade e elegância.
                        </p>

                        <Link to="/produtos" className="btn btn-gold">
                            Conhecer coleção
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>

                    <div className="col-lg-6">
                        <img
                            src="/assets/images/colecao_02.jpeg"
                            alt="Coleção em destaque"
                            className="img-fluid w-100"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Highlight;