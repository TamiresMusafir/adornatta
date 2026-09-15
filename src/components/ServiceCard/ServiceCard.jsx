function ServiceCard({ icon, title, description }) {
    return (
        <article className="col-md-4">
            <div className="service-card">

                <div className="service-icon">
                    <i className={`bi ${icon}`}></i>
                </div>

                <h3>{title}</h3>

                <p>{description}</p>

            </div>
        </article>
    );
}

export default ServiceCard;