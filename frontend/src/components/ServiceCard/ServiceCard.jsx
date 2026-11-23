function ServiceCard({
    icone,
    titulo,
    descricao,
    coluna = "col-md-4"
}) {
    return (
        <article className={coluna}>
            <div className="service-card">

                <div className="service-icon">
                    <i className={`bi ${icone}`}></i>
                </div>

                <h3>{titulo}</h3>

                <p>{descricao}</p>

            </div>
        </article>
    );
}

export default ServiceCard;