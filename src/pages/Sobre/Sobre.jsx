import { Link } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ServiceCard from "../../components/ServiceCard/ServiceCard";

function Sobre() {
    const valores = [
        {
            id: 1,
            icone: "bi-gem",
            titulo: "Qualidade",
            descricao:
                "Selecionamos nossas peças pensando em materiais, acabamento e durabilidade, buscando oferecer produtos que possam acompanhar nossos clientes em diferentes momentos."
        },
        {
            id: 2,
            icone: "bi-heart",
            titulo: "Cuidado",
            descricao:
                "Cada etapa da experiência é pensada com atenção, desde a escolha dos produtos até o atendimento e o acompanhamento dos pedidos."
        },
        {
            id: 3,
            icone: "bi-stars",
            titulo: "Elegância",
            descricao:
                "Valorizamos peças versáteis e delicadas, que possam representar diferentes estilos e fazer parte de momentos especiais."
        }
    ];

    const experiencias = [
        {
            id: 1,
            icone: "bi-search",
            titulo: "Encontre sua joia",
            descricao:
                "Pesquise produtos por nome, categoria ou tipo."
        },
        {
            id: 2,
            icone: "bi-heart",
            titulo: "Salve seus favoritos",
            descricao:
                "Monte sua lista de desejos e consulte suas escolhas quando quiser."
        },
        {
            id: 3,
            icone: "bi-bag-check",
            titulo: "Acompanhe seus pedidos",
            descricao:
                "Consulte suas compras e acompanhe o andamento dos pedidos."
        },
        {
            id: 4,
            icone: "bi-headset",
            titulo: "Conte com nosso atendimento",
            descricao:
                "Entre em contato com nossa equipe sempre que precisar."
        }
    ];

    return (
        <>
            <Header />

            <main className="about-page">

                <section className="section section-soft">
                    <div className="container">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">

                                <div className="section-label">
                                    Conheça a Adornatta
                                </div>

                                <h1 className="section-title mb-4">
                                    Uma marca criada para valorizar o seu estilo.
                                </h1>

                                <p className="section-text mb-0">
                                    A Adornatta nasceu com o propósito de
                                    oferecer semijoias que unem beleza,
                                    conforto e elegância, valorizando a
                                    personalidade de cada cliente.
                                </p>

                            </div>
                        </div>
                    </div>
                </section>

                <section className="section">
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
                                    A Adornatta
                                </div>

                                <h2 className="section-title mb-4">
                                    Beleza, personalidade e cuidado em cada escolha.
                                </h2>

                                <p className="section-text mb-4">
                                    A Adornatta nasceu com o propósito de
                                    oferecer semijoias que combinam beleza,
                                    conforto e elegância, permitindo que
                                    cada cliente encontre peças que
                                    representem seu próprio estilo.
                                </p>

                                <p className="section-text mb-4">
                                    Somos uma loja que valoriza a qualidade
                                    dos produtos, a atenção aos detalhes e
                                    uma experiência de compra simples e
                                    especial.
                                </p>

                                <p className="section-text mb-0">
                                    Mais do que acessórios, queremos oferecer
                                    peças que façam parte dos momentos e da
                                    personalidade de cada cliente.
                                </p>

                            </div>

                        </div>
                    </div>
                </section>

                <section className="section section-soft">
                    <div className="container">

                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-lg-7">

                                <div className="section-label">
                                    Nossa essência
                                </div>

                                <h2 className="section-title mb-3">
                                    O que guia a Adornatta.
                                </h2>

                                <p className="section-text">
                                    Nossa proposta vai além de oferecer
                                    produtos. Buscamos construir uma
                                    experiência de compra baseada em
                                    confiança, qualidade e atenção aos
                                    detalhes.
                                </p>

                            </div>
                        </div>

                        <div className="row g-4">
                            {valores.map((valor) => (
                                <ServiceCard
                                    key={valor.id}
                                    icone={valor.icone}
                                    titulo={valor.titulo}
                                    descricao={valor.descricao}
                                />
                            ))}
                        </div>

                    </div>
                </section>

                <section className="section about-experience">
                    <div className="container">

                        <div className="row align-items-center g-5">

                            <div className="col-lg-5">

                                <div className="section-label">
                                    Mais do que uma loja
                                </div>

                                <h2 className="section-title mb-4">
                                    Uma experiência pensada para você.
                                </h2>

                                <p className="section-text mb-4">
                                    A Adornatta foi criada para tornar a
                                    busca por uma semijoia mais prática e
                                    agradável.
                                </p>

                                <p className="section-text mb-0">
                                    Em nossa plataforma, o cliente pode
                                    pesquisar produtos, conhecer diferentes
                                    categorias, salvar seus favoritos,
                                    realizar compras e acompanhá-las de
                                    maneira simples.
                                </p>

                            </div>

                            <div className="col-lg-6 offset-lg-1">

                                <div className="row g-4">
                                    {experiencias.map((experiencia) => (
                                        <ServiceCard
                                            key={experiencia.id}
                                            icone={experiencia.icone}
                                            titulo={experiencia.titulo}
                                            descricao={experiencia.descricao}
                                        />
                                    ))}
                                </div>

                            </div>

                        </div>

                    </div>
                </section>

                <section className="section section-soft about-cta">
                    <div className="container">

                        <div className="row justify-content-center text-center align-items-center">
                            <div className="col-lg-7">

                                <div className="section-label">
                                    Conheça a Adornatta
                                </div>

                                <h2 className="section-title mb-3">
                                    Encontre uma joia para marcar seu momento.
                                </h2>

                                <p className="section-text mb-4">
                                    Explore nossas coleções e descubra peças
                                    selecionadas para diferentes estilos e
                                    ocasiões.
                                </p>

                                <div className="d-flex justify-content-center flex-wrap gap-3">

                                    <Link
                                        to="/produtos"
                                        className="btn btn-gold d-inline-flex align-items-center justify-content-center"
                                    >
                                        Explorar produtos

                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </Link>

                                    <Link
                                        to="/contato"
                                        className="btn btn-outline-dark rounded-0 px-4 py-3 d-inline-flex align-items-center justify-content-center"
                                    >
                                        Entrar em contato
                                    </Link>

                                </div>

                            </div>
                        </div>

                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default Sobre;