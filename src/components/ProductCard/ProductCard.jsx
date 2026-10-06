import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import Toast from "../Toast/Toast";

function ProductCard({ id, nome, descricao, preco, imagem, tag, quantidadeDisponivel, layout }) {
    const { alternarFavorito, estaNosFavoritos } = useWishlist();
    const { adicionarAoCarrinho } = useCart(); 

    const [toastVisivel, setToastVisivel] = useState(false);
    const [mensagemToast, setMensagemToast] = useState("");

    const favorito = estaNosFavoritos(id);
    const foraDeEstoque = quantidadeDisponivel <= 0;

    const cardRef = useRef(null);
    const imageWrapRef = useRef(null);
    const imgRef = useRef(null);
    const frameRef = useRef(null);
    const wishlistRef = useRef(null);
    const shineRef = useRef(null);
    const ctaRef = useRef(null);

    function formatarPreco(valor) {
        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function alternarProdutoFavorito(e) {
        e.preventDefault();
        e.stopPropagation();

        const produtoEstaFavoritado = estaNosFavoritos(id);
        alternarFavorito({ id, nome, descricao, preco, imagem, tag, quantidadeDisponivel });

        if (!produtoEstaFavoritado) {
            setMensagemToast("Produto adicionado à lista de desejos.");
            setToastVisivel(true);
        }

        gsap.fromTo(e.currentTarget,
            { scale: 0.7 },
            { scale: 1, duration: 0.5, ease: "elastic.out(1.5, 0.4)" }
        );
    }

    function handleAdicionarCarrinho(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!foraDeEstoque) {
            adicionarAoCarrinho({ id, nome, descricao, preco, imagem, tag, quantidadeDisponivel });
            setMensagemToast("Produto adicionado ao carrinho.");
            setToastVisivel(true);
        }
    }

    useEffect(() => {
        const card = cardRef.current;
        const img = imgRef.current;
        const frame = frameRef.current;
        const wishlist = wishlistRef.current;
        const shine = shineRef.current;
        const cta = ctaRef.current;

        gsap.set(img, { scale: 1 });
        gsap.set(card, { y: 0 });
        gsap.set(frame, { top: 20, left: 20, right: 20, bottom: 20, borderRadius: "20px" });

        const onEnter = () => {
            gsap.to(card, { y: -10, boxShadow: "0 30px 60px rgba(41, 38, 33, 0.18), 0 8px 20px rgba(176,138,87,0.15)", duration: 0.45, ease: "power3.out", overwrite: true });
            gsap.to(img, { scale: 1.08, duration: 0.7, ease: "power2.out", overwrite: true });
            gsap.to(shine, { opacity: 1, x: "110%", duration: 0.65, ease: "power2.out", overwrite: true });
            gsap.to(wishlist, { scale: 1.1, duration: 0.3, ease: "back.out(2)", overwrite: true });
            gsap.to(cta, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", overwrite: true });
            gsap.to(frame, { top: 0, left: 0, right: 0, bottom: 0, borderRadius: "20px 20px 0 0", duration: 0.9, ease: "power3.out", overwrite: true });
        };

        const onLeave = () => {
            gsap.to(card, { y: 0, boxShadow: "0 4px 20px rgba(41, 38, 33, 0.06)", duration: 0.5, ease: "power3.out", overwrite: true });
            gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out", overwrite: true });
            gsap.to(shine, { opacity: 0, x: "-30%", duration: 0.3, overwrite: true });
            gsap.to(wishlist, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: true });
            gsap.to(cta, { opacity: 0, y: 10, duration: 0.3, ease: "power3.in", overwrite: true });
            gsap.to(frame, { top: 20, left: 20, right: 20, bottom: 20, borderRadius: "20px", duration: 0.5, ease: "power3.out", overwrite: true });
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);

        return () => {
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    const classeLayout = layout === "grande" 
        ? "col-12 col-md-8 col-lg-6 mx-auto mb-5" 
        : layout === "lista"
        ? "w-100"
        : "col-12 col-sm-6 col-md-4";

    return (
        <>
            <div className={classeLayout}>
                <article className="product-card" ref={cardRef}>

                    <div className="product-image" ref={imageWrapRef}>
                        
                        <div className="product-shine" ref={shineRef} />

                        {tag && <span className="product-tag">{tag}</span>}

                        <button
                            className={`product-wishlist ${favorito ? "active" : ""}`}
                            type="button"
                            ref={wishlistRef}
                            aria-label={favorito ? `Remover ${nome} dos favoritos` : `Adicionar ${nome} aos favoritos`}
                            onClick={alternarProdutoFavorito}
                        >
                            <i className={favorito ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                        </button>

                        <div className="product-image-frame" ref={frameRef}>
                            <img ref={imgRef} src={imagem} alt={nome} />
                        </div>

                        <div className="product-cta-overlay" ref={ctaRef}>
                            <button 
                                className="product-cta-btn" 
                                type="button"
                                onClick={handleAdicionarCarrinho}
                                disabled={foraDeEstoque}
                                style={foraDeEstoque ? { background: "rgba(41, 38, 33, 0.95)", borderColor: "#444", cursor: "not-allowed" } : {}}
                            >
                                {foraDeEstoque ? (
                                    <>
                                        <i className="bi bi-x-circle text-danger" />
                                        <span className="text-white-50">Fora de estoque</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-bag-plus" />
                                        <span>Adicionar ao carrinho</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </div>

                    <div className="product-info">
                        <div className="product-info-top">
                            <h3 className="product-name">{nome}</h3>
                            <span className="product-price">{formatarPreco(preco)}</span>
                        </div>
                        
                        <p className="product-description">{descricao}</p>

                        <Link
                            to={`/produtos/${id}`}
                            className="btn btn-outline-dark rounded-0 mt-2"
                        >
                            Ver detalhes
                            <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>

                </article>
            </div>

            <Toast
                mensagem={mensagemToast}
                tipo="sucesso"
                visivel={toastVisivel}
                onFechar={() => setToastVisivel(false)}
            />
        </>
    );
}

export default ProductCard;