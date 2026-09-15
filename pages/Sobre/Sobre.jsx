import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ServiceCard from "../../components/ServiceCard/ServiceCard";

function Sobre() {

    const valores = [
        {
            id: 1,
            icon: "bi-gem",
            title: "Qualidade",
            description:
                "Selecionamos peças pensando não apenas na beleza, mas também em sua qualidade e durabilidade."
        },
        {
            id: 2,
            icon: "bi-heart",
            title: "Cuidado",
            description:
                "Cuidamos de cada detalhe para proporcionar uma experiência segura e especial."
        },
        {
            id: 3,
            icon: "bi-stars",
            title: "Elegância",
            description:
                "Buscamos peças que permitam expressar personalidade, complementar diferentes estilos e transformar pequenos detalhes em grandes destaques."
        }
    ];

    return (
        <>
            <Header />

            <main>

                {/* CABEÇALHO DA PÁGINA */}

                <section className="section section-soft">

                    <div className="container">

                        <div className="row justify-content-center text-center">

                            <div className="col-lg-8">

                                <div className="section-label">
                                    Nossa história
                                </div>

                                <h1 className="section-title mb-4">
                                    Seu estilo, seu brilho, sua personalidade.
                                </h1>

                                <p className="section-text mb-0">
                                    Conheça a história da Adornatta e os valores
                                    que estão presentes em cada escolha, desde
                                    a seleção de uma joia até a experiência
                                    de nossos clientes.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* NOSSA HISTÓRIA */}

                <section className="section">

                    <div className="container">

                        <div className="row align-items-center g-5">

                            <div className="col-lg-6">

                                <div className="about-image">

                                    <img
                                        src="/images/image-03.jpg"
                                        alt="Ateliê de joias Adornatta"
                                    />

                                </div>

                            </div>

                            <div className="col-lg-5 offset-lg-1">

                                <div className="section-label">
                                    Adornatta
                                </div>

                                <h2 className="section-title mb-4">
                                    Semijoias pensadas para você.
                                </h2>

                                <p className="section-text mb-4">
                                    A Adornatta nasceu com o propósito de
                                    transformar pequenos detalhes em formas
                                    de expressão. Criamos uma seleção de
                                    semijoias pensadas para valorizar a beleza,
                                    a personalidade e o estilo de cada pessoa.
                                </p>

                                <p className="section-text mb-4">
                                    Nossa proposta une elegância, qualidade e
                                    cuidado, com peças cuidadosamente
                                    selecionadas, hipoalergênicas e banhadas
                                    a ouro 18K, para proporcionar uma
                                    experiência especial em cada escolha.
                                </p>

                                <p className="section-text mb-0">
                                    Para nós, uma semijoia vai além de um
                                    simples acessório. Ela acompanha momentos,
                                    destaca personalidades e transforma cada
                                    detalhe em uma oportunidade de brilhar
                                    e expressar quem você é.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* NOSSA ESSÊNCIA */}

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
                                    semijoias. Na Adornatta, buscamos criar
                                    uma experiência baseada em qualidade,
                                    confiança e cuidado, desde a escolha
                                    de cada peça até o momento em que ela
                                    chega até você.
                                </p>

                            </div>

                        </div>

                        <div className="row g-4">

                            {valores.map((valor) => (

                                <div
                                    className="col-md-4"
                                    key={valor.id}
                                >

                                    <ServiceCard
                                        icon={valor.icon}
                                        title={valor.title}
                                        description={valor.description}
                                    />

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* EXPERIÊNCIA */}

                <section className="section">

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
                                    A Adornatta foi desenvolvida para tornar
                                    a busca por uma semijoia mais prática
                                    e agradável.
                                </p>

                                <p className="section-text mb-0">
                                    Em nossa plataforma, o cliente pode
                                    pesquisar produtos, conhecer diferentes
                                    categorias, salvar seus favoritos,
                                    realizar compras e acompanhá-las
                                    de maneira simples.
                                </p>

                            </div>

                            <div className="col-lg-6 offset-lg-1">

                                <div className="row g-4">

                                    <div className="col-sm-6">
                                        <ServiceCard
                                            icon="bi-search"
                                            title="Encontre sua semijoia"
                                            description="Pesquise produtos por nome, categoria ou tipo."
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <ServiceCard
                                            icon="bi-heart"
                                            title="Salve seus favoritos"
                                            description="Monte sua lista de desejos e consulte suas escolhas quando quiser."
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <ServiceCard
                                            icon="bi-bag-check"
                                            title="Acompanhe seus pedidos"
                                            description="Consulte suas compras e acompanhe o andamento dos pedidos."
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <ServiceCard
                                            icon="bi-headset"
                                            title="Conte com nosso atendimento"
                                            description="Entre em contato com nossa equipe sempre que precisar."
                                        />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* CHAMADA FINAL */}

                <section className="section section-soft">

                    <div className="container">

                        <div className="row justify-content-center text-center align-items-center">

                            <div className="col-lg-7">

                                <div className="section-label">
                                    Conheça a Adornatta
                                </div>

                                <h2 className="section-title mb-3">
                                    Encontre uma semijoia para marcar seu momento.
                                </h2>

                                <p className="section-text mb-4">
                                    Explore nossas coleções e descubra peças
                                    selecionadas para diferentes estilos
                                    e ocasiões.
                                </p>

                                <div className="d-flex justify-content-center flex-wrap gap-3">

                                    <a
                                        href="/produtos"
                                        className="btn btn-gold d-inline-flex align-items-center justify-content-center"
                                    >
                                        Explorar produtos
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </a>

                                    <a
                                        href="/contato"
                                        className="btn btn-outline-dark rounded-0 px-4 py-3 d-inline-flex align-items-center justify-content-center"
                                    >
                                        Entrar em contato
                                    </a>

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