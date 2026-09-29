import { useRef, useEffect } from "react";
import { gsap } from "gsap";

function ProductCard({ nome, descricao, preco, imagem, tag }) {
    const cardRef = useRef(null);
    const imageWrapRef = useRef(null);
    const imgRef = useRef(null);
    const frameRef = useRef(null);
    const infoRef = useRef(null);
    const wishlistRef = useRef(null);
    const shineRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const img = imgRef.current;
        const frame = frameRef.current;
        const imageWrap = imageWrapRef.current;
        const info = infoRef.current;
        const wishlist = wishlistRef.current;
        const shine = shineRef.current;
        const cta = ctaRef.current;

        gsap.set(img, { scale: 1 });
        gsap.set(card, { y: 0 });
        gsap.set(frame, { top: 20, left: 20, right: 20, bottom: 20, borderRadius: "20px" });

        const onEnter = (e) => {
            gsap.to(card, {
                y: -10,
                boxShadow: "0 30px 60px rgba(41, 38, 33, 0.18), 0 8px 20px rgba(176,138,87,0.15)",
                duration: 0.45,
                ease: "power3.out",
                overwrite: true
            });
            gsap.to(img, {
                scale: 1.08,
                duration: 0.7,
                ease: "power2.out",
                overwrite: true
            });
            gsap.to(shine, {
                opacity: 1,
                x: "110%",
                duration: 0.65,
                ease: "power2.out",
                overwrite: true
            });
            gsap.to(cta, {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: "power3.out",
                overwrite: true
            });
            gsap.to(wishlist, {
                scale: 1.1,
                duration: 0.3,
                ease: "back.out(2)",
                overwrite: true
            });
            gsap.to(frame, {
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: "20px 20px 0 0",
                duration: 0.9,
                ease: "power3.out",
                overwrite: true
            });
        };

        const onLeave = () => {
            gsap.to(card, {
                y: 0,
                boxShadow: "0 4px 20px rgba(41, 38, 33, 0.06)",
                duration: 0.5,
                ease: "power3.out",
                overwrite: true
            });
            gsap.to(img, {
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                overwrite: true
            });
            gsap.to(shine, {
                opacity: 0,
                x: "-30%",
                duration: 0.3,
                overwrite: true
            });
            gsap.to(cta, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: "power3.in",
                overwrite: true
            });
            gsap.to(wishlist, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
            gsap.to(frame, {
                top: 20, left: 20, right: 20, bottom: 20,
                borderRadius: "20px",
                duration: 0.5,
                ease: "power3.out",
                overwrite: true
            });
        };

        let cardRect = null;

        const onMove = (e) => {
            if (!cardRect) return;
            const cx = cardRect.left + cardRect.width / 2;
            const cy = cardRect.top + cardRect.height / 2;
            const dx = (e.clientX - cx) / (cardRect.width / 2);
            const dy = (e.clientY - cy) / (cardRect.height / 2);
            gsap.to(card, {
                rotateX: -dy * 4,
                rotateY: dx * 4,
                transformPerspective: 900,
                duration: 0.35,
                ease: "power2.out",
                overwrite: "auto"
            });
        };

        const onLeaveReset = () => {
            cardRect = null;
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                transformPerspective: 900,
                duration: 0.6,
                ease: "power3.out",
                overwrite: "auto"
            });
        };

        const onEnterWithRect = (e) => {
            cardRect = card.getBoundingClientRect();
            onEnter(e);
        };

        card.addEventListener("mouseenter", onEnterWithRect);
        card.addEventListener("mouseleave", (e) => { onLeave(); onLeaveReset(); });
        card.addEventListener("mousemove", onMove);

        const heartBtn = wishlist;
        const onHeartClick = () => {
            heartBtn.classList.toggle("active");
            gsap.fromTo(heartBtn,
                { scale: 0.7 },
                { scale: 1, duration: 0.5, ease: "elastic.out(1.5, 0.4)" }
            );
        };
        heartBtn.addEventListener("click", onHeartClick);

        return () => {
            card.removeEventListener("mouseenter", onEnterWithRect);
            card.removeEventListener("mouseleave", onLeave);
            card.removeEventListener("mousemove", onMove);
            heartBtn.removeEventListener("click", onHeartClick);
        };
    }, []);

    return (
        <article className="col-md-4">
            <div className="product-card" ref={cardRef}>

                <div className="product-image" ref={imageWrapRef}>
                    <div className="product-shine" ref={shineRef} />

                    {tag && (
                        <span className="product-tag">{tag}</span>
                    )}

                    <button
                        className="product-wishlist"
                        type="button"
                        ref={wishlistRef}
                        aria-label={`Adicionar ${nome} aos favoritos`}
                    >
                        <i className="bi bi-heart" />
                    </button>

                    <div className="product-image-frame" ref={frameRef}>
                        <img
                            ref={imgRef}
                            src={imagem}
                            alt={nome}
                        />
                    </div>

                    <div className="product-cta-overlay" ref={ctaRef}>
                        <button className="product-cta-btn" type="button">
                            <i className="bi bi-bag-plus" />
                            <span>Adicionar ao carrinho</span>
                        </button>
                    </div>
                </div>

                <div className="product-info" ref={infoRef}>
                    <div className="product-info-top">
                        <h3 className="product-name">{nome}</h3>
                        <span className="product-price">{preco}</span>
                    </div>
                    <p className="product-description">{descricao}</p>
                </div>

            </div>
        </article>
    );
}

export default ProductCard;