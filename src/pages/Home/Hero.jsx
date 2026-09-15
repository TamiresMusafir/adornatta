function Hero() {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <span className="hero-eyebrow">
                        Semijoias Adornatta
                    </span>

                    <h1>
                        Seu estilo,
                        <br />
                        seu brilho.
                        <br />
                        Sua personalidade.
                    </h1>

                    <p className="hero-description">
                        Semijoias pensadas para trazer conforto, beleza
                        e elegância para cada momento.
                    </p>

                    <div className="d-flex gap-3">
                        <a href="/produtos" className="btn btn-gold">
                            Ver produtos
                        </a>

                        <a
                            href="/sobre"
                            className="btn btn-outline-light-custom"
                        >
                            Conheça a Adornatta
                        </a>
                    </div>
                </div>
            </div>

            <div className="hero-gradient"></div>
        </section>
    );
}

export default Hero;