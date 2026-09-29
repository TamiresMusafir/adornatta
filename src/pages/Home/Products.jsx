import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "../../components/ProductCard/ProductCard";

gsap.registerPlugin(ScrollTrigger);

function Products() {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const cardsRef = useRef(null);

    const produtos = [
        {
            id: 1,
            nome: "Brinco 2 em 1",
            descricao: "Delicadeza e versatilidade em uma única peça.",
            preco: "R$ 39,99",
            imagem: "/assets/images/brinco_2_em_1.jpeg",
            tag: "Destaque"
        },
        {
            id: 2,
            nome: "Brinco Flores",
            descricao: "Uma peça delicada para completar seu estilo.",
            preco: "R$ 24,99",
            imagem: "/assets/images/brinco_flores.jpeg"
        },
        {
            id: 3,
            nome: "Conjunto Cruz",
            descricao: "Elegância e significado em uma combinação especial.",
            preco: "R$ 49,99",
            imagem: "/assets/images/conjunto_cruz.jpeg"
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headingRef.current.children, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            const cards = cardsRef.current.querySelectorAll(".product-card");
            gsap.fromTo(cards,
                { y: 60, opacity: 0, scale: 0.94 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.75,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="section" ref={sectionRef}>
            <div className="container">
                <div className="row align-items-end mb-5" ref={headingRef}>
                    <div className="col-lg-7">
                        <span className="section-label">
                            Seleção Adornatta
                        </span>

                        <h2 className="section-title">
                            Peças para você
                        </h2>
                    </div>

                    <div className="col-lg-5">
                        <p className="section-text mb-0">
                            Conheça algumas das nossas peças e encontre
                            aquela que combina com seu estilo.
                        </p>
                    </div>
                </div>

                <div className="row g-4" ref={cardsRef}>
                    {produtos.map((produto) => (
                        <ProductCard
                            key={produto.id}
                            nome={produto.nome}
                            descricao={produto.descricao}
                            preco={produto.preco}
                            imagem={produto.imagem}
                            tag={produto.tag}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Products;