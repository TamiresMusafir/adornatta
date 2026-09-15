import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ServiceCard from "../../components/ServiceCard/ServiceCard";

function Sobre() {

  const valores = [
    {
      icon: "bi-gem",
      title: "Qualidade",
      description:
        "Selecionamos nossas peças com atenção aos detalhes."
    },
    {
      icon: "bi-heart",
      title: "Cuidado",
      description:
        "Pensamos em cada detalhe para proporcionar uma ótima experiência."
    },
    {
      icon: "bi-stars",
      title: "Elegância",
      description:
        "Peças pensadas para valorizar seu estilo e sua personalidade."
    }
  ];

  return (
    <>
      <Header />

      <main>

        {/* Cabeçalho da página */}
        <section>
          <h1>Sobre a Adornatta</h1>
          <p>
            Beleza, qualidade e personalidade em cada detalhe.
          </p>
        </section>

        {/* Nossa história */}
        <section>
          <h2>Nossa História</h2>

          <p>
            A Adornatta surgiu com o intuito de oferecer
            novas possibilidades de acessórios, unindo
            beleza, qualidade e personalidade.
          </p>
        </section>

        {/* Nossa essência */}
        <section>
          <h2>Nossa Essência</h2>

          <section>
            {valores.map((valor) => (
              <ServiceCard
                key={valor.title}
                icon={valor.icon}
                title={valor.title}
                description={valor.description}
              />
            ))}
          </section>
        </section>

        {/* Experiência */}
        <section>
          <h2>Uma experiência pensada para você</h2>

          <section>
            <ServiceCard
              icon="bi-search"
              title="Facilidade"
              description="Encontre suas peças de forma simples e rápida."
            />

            <ServiceCard
              icon="bi-heart"
              title="Favoritos"
              description="Guarde suas peças preferidas."
            />

            <ServiceCard
              icon="bi-bag"
              title="Pedidos"
              description="Acompanhe suas compras."
            />

            <ServiceCard
              icon="bi-chat"
              title="Suporte"
              description="Conte com a Adornatta quando precisar."
            />
          </section>
        </section>

        {/* CTA */}
        <section>
          <h2>Encontre seu brilho</h2>

          <p>
            Seu estilo, seu brilho e sua personalidade.
          </p>

          <a href="/produtos">
            Conheça nossas peças
          </a>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Sobre;