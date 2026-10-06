import ServiceCard from "../../components/ServiceCard/ServiceCard";

function Services() {
    const servicos = [
        {
            id: 1,
            icone: "bi-gem",
            titulo: "Qualidade",
            descricao:
                "Peças escolhidas com atenção aos detalhes, acabamento e durabilidade."
        },
        {
            id: 2,
            icone: "bi-heart",
            titulo: "Escolha com carinho",
            descricao:
                "Salve seus produtos favoritos e monte sua lista de desejos para não perder suas peças."
        },
        {
            id: 3,
            icone: "bi-box-seam",
            titulo: "Acompanhe seu pedido",
            descricao:
                "Conte com praticidade para acompanhar seus pedidos após a realização da compra."
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <div className="row justify-content-center text-center mb-5">
                    <div className="col-lg-7">
                        <div className="section-label">
                            Por que escolher a Adornatta?
                        </div>

                        <h2 className="section-title mb-3">
                            Uma experiência pensada para você.
                        </h2>

                        <p className="section-text mb-0">
                            Do primeiro olhar à entrega, cuidamos de cada
                            detalhe para tornar sua experiência especial.
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    {servicos.map((servico) => (
                        <ServiceCard
                            key={servico.id}
                            icone={servico.icone}
                            titulo={servico.titulo}
                            descricao={servico.descricao}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Services;