import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/ProductCard/ProductCard";

// Importamos a mesma função que busca os produtos reais do banco de dados
import { buscarProdutos } from "../../services/api";

function Products() {
    // Busca os produtos da API (exatamente igual a página de Produtos faz)
    const {
        data: produtos = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ["produtos"],
        queryFn: buscarProdutos
    });

    // Pega apenas os 3 primeiros produtos da lista para mostrar no Início
    // (Se quiser, pode trocar para exibir produtos específicos)
    const produtosDestaque = produtos.slice(0, 3);

    return (
        <section className="section">
            <div className="container">
                <div className="row align-items-end mb-5">
                    <div className="col-lg-7">
                        <span className="section-label">
                            Seleção Adornatta
                        </span>

                        <h2 className="section-title">
                            Peças para você
                        </h2>
                    </div>
                </div>

                {isLoading && <p className="text-muted">Carregando destaques...</p>}
                
                {isError && <p className="text-danger">Erro ao carregar os produtos em destaque.</p>}

                {!isLoading && !isError && (
                    <div className="row g-4">
                        {produtosDestaque.map((produto) => (
                            <ProductCard
                                key={produto.id}
                                id={produto.id}
                                nome={produto.nome}
                                descricao={produto.descricao}
                                preco={produto.preco}
                                imagem={produto.imagem}
                                tag={produto.tag}
                                quantidadeDisponivel={produto.quantidadeDisponivel}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Products;
