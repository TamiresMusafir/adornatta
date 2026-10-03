import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Contato() {
    const [mensagemEnviada, setMensagemEnviada] = useState(false);

    const [dadosContato, setDadosContato] = useState({
        nome: "",
        email: "",
        assunto: "",
        mensagem: ""
    });

    function alterarCampo(event) {
        const { name, value } = event.target;

        setDadosContato((dadosAtuais) => ({
            ...dadosAtuais,
            [name]: value
        }));
    }

    function enviarMensagem(event) {
        event.preventDefault();

        setMensagemEnviada(true);

        setDadosContato({
            nome: "",
            email: "",
            assunto: "",
            mensagem: ""
        });
    }

    return (
        <>
            <Header />

            <main>

                <section className="section section-soft">
                    <div className="container">

                        <div className="row justify-content-center text-center">

                            <div className="col-lg-8">

                                <span className="section-label">
                                    Entre em contato
                                </span>

                                <h1 className="section-title mb-4">
                                    Estamos aqui para ajudar.
                                </h1>

                                <p className="section-text mb-0">
                                    Ficou com alguma dúvida sobre nossos
                                    produtos, pedidos ou atendimento?
                                    Envie uma mensagem para a Adornatta.
                                </p>

                            </div>

                        </div>

                    </div>
                </section>

                <section className="section">
                    <div className="container">

                        <div className="row g-5">

                            <div className="col-lg-5">

                                <div className="section-label">
                                    Fale com a Adornatta
                                </div>

                                <h2 className="section-title mb-4">
                                    Como podemos ajudar?
                                </h2>

                                <p className="section-text mb-5">
                                    Nossa equipe está à disposição para
                                    ajudar você com informações sobre
                                    produtos, pedidos e dúvidas relacionadas
                                    à sua experiência de compra.
                                </p>

                                <div className="contact-info">

                                    <article className="contact-info-item">

                                        <div className="contact-info-icon">
                                            <i className="bi bi-envelope"></i>
                                        </div>

                                        <div>
                                            <h3>
                                                E-mail
                                            </h3>

                                            <p>
                                                Entre em contato conosco
                                                através do formulário ao lado.
                                            </p>
                                        </div>

                                    </article>

                                    <article className="contact-info-item">

                                        <div className="contact-info-icon">
                                            <i className="bi bi-chat-heart"></i>
                                        </div>

                                        <div>
                                            <h3>
                                                Atendimento
                                            </h3>

                                            <p>
                                                Estamos prontos para receber
                                                suas dúvidas, sugestões e
                                                solicitações.
                                            </p>
                                        </div>

                                    </article>

                                    <article className="contact-info-item">

                                        <div className="contact-info-icon">
                                            <i className="bi bi-box-seam"></i>
                                        </div>

                                        <div>
                                            <h3>
                                                Pedidos
                                            </h3>

                                            <p>
                                                Consulte nossa equipe caso
                                                precise de ajuda com seu pedido.
                                            </p>
                                        </div>

                                    </article>

                                </div>

                            </div>

                            <div className="col-lg-7">

                                <section className="contact-form">

                                    {!mensagemEnviada ? (
                                        <form onSubmit={enviarMensagem}>

                                            <div className="row g-4">

                                                <div className="col-md-6">

                                                    <label
                                                        htmlFor="nome"
                                                        className="form-label"
                                                    >
                                                        Nome
                                                    </label>

                                                    <input
                                                        type="text"
                                                        id="nome"
                                                        name="nome"
                                                        className="form-control"
                                                        value={
                                                            dadosContato.nome
                                                        }
                                                        onChange={
                                                            alterarCampo
                                                        }
                                                        required
                                                    />

                                                </div>

                                                <div className="col-md-6">

                                                    <label
                                                        htmlFor="email"
                                                        className="form-label"
                                                    >
                                                        E-mail
                                                    </label>

                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        value={
                                                            dadosContato.email
                                                        }
                                                        onChange={
                                                            alterarCampo
                                                        }
                                                        required
                                                    />

                                                </div>

                                                <div className="col-12">

                                                    <label
                                                        htmlFor="assunto"
                                                        className="form-label"
                                                    >
                                                        Assunto
                                                    </label>

                                                    <input
                                                        type="text"
                                                        id="assunto"
                                                        name="assunto"
                                                        className="form-control"
                                                        value={
                                                            dadosContato.assunto
                                                        }
                                                        onChange={
                                                            alterarCampo
                                                        }
                                                        required
                                                    />

                                                </div>

                                                <div className="col-12">

                                                    <label
                                                        htmlFor="mensagem"
                                                        className="form-label"
                                                    >
                                                        Mensagem
                                                    </label>

                                                    <textarea
                                                        id="mensagem"
                                                        name="mensagem"
                                                        className="form-control"
                                                        rows="7"
                                                        value={
                                                            dadosContato.mensagem
                                                        }
                                                        onChange={
                                                            alterarCampo
                                                        }
                                                        required
                                                    ></textarea>

                                                </div>

                                                <div className="col-12">

                                                    <button
                                                        type="submit"
                                                        className="btn btn-gold"
                                                    >
                                                        Enviar mensagem
                                                        <i className="bi bi-arrow-right ms-2"></i>
                                                    </button>

                                                </div>

                                            </div>

                                        </form>
                                    ) : (
                                        <div className="contact-success text-center">

                                            <div className="contact-success-icon">
                                                <i className="bi bi-check-circle"></i>
                                            </div>

                                            <h2>
                                                Mensagem enviada!
                                            </h2>

                                            <p>
                                                Obrigado por entrar em contato
                                                com a Adornatta. Sua mensagem
                                                foi registrada nesta interface.
                                            </p>

                                            <button
                                                type="button"
                                                className="btn btn-outline-dark rounded-0"
                                                onClick={() =>
                                                    setMensagemEnviada(false)
                                                }
                                            >
                                                Enviar outra mensagem
                                            </button>

                                        </div>
                                    )}

                                </section>

                            </div>

                        </div>

                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default Contato;