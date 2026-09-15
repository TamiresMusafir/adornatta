function ServiceCard({ icon, title, description }) {
    return (
        <article className="service-card">

            <i className={`bi ${icon} service-icon`}></i>

            <h3>
                {title}
            </h3>

            <p>
                {description}
            </p>

        </article>
    );
}

export default ServiceCard;