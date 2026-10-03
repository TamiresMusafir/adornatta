import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
    buscarProdutos,
    buscarCategorias,
    atualizarProduto,
    criarProduto,
    excluirProduto
} from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";

const produtoSchema = z.object({
    nome: z
        .string()
        .min(2, "Informe o nome do produto."),

    descricao: z
        .string()
        .min(5, "Informe uma descrição válida."),

    preco: z
        .number()
        .positive("O preço deve ser maior que zero."),

    material: z
        .string()
        .min(2, "Informe o material."),

    tipoBanho: z
        .string()
        .min(2, "Informe o tipo de banho."),

    quantidadeDisponivel: z
        .number()
        .int("A quantidade deve ser um número inteiro.")
        .min(0, "A quantidade não pode ser negativa."),

    imagem: z
        .string()
        .min(1, "Informe o caminho da imagem."),

    categoriaId: z
        .number()
        .int()
        .positive("Selecione uma categoria."),

    tag: z
        .string()
        .optional()
});

function Estoque() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { logout } = useAuth();

    const [busca, setBusca] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const {
        data: produtos = [],
        isLoading: carregandoProdutos,
        isError: erroProdutos
    } = useQuery({
        queryKey: ["produtos"],
        queryFn: buscarProdutos
    });

    const {
        data: categorias = [],
        isLoading: carregandoCategorias
    } = useQuery({
        queryKey: ["categorias"],
        queryFn: buscarCategorias
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(produtoSchema),
        defaultValues: {
            nome: "",
            descricao: "",
            preco: 0,
            material: "Semijoia",
            tipoBanho: "Ouro 18K",
            quantidadeDisponivel: 0,
            imagem: "",
            categoriaId: 0,
            tag: ""
        }
    });

    const atualizarProdutoMutation = useMutation({
        mutationFn: ({ id, produto }) =>
            atualizarProduto(id, produto),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["produtos"]
            });

            setMensagem("Produto atualizado com sucesso.");

            setTimeout(() => {
                setMensagem("");
            }, 3000);
        },

        onError: () => {
            setMensagem("Não foi possível atualizar o produto.");

            setTimeout(() => {
                setMensagem("");
            }, 3000);
        }
    });

    const criarProdutoMutation = useMutation({
        mutationFn: criarProduto,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["produtos"]
            });

            setMensagem("Produto cadastrado com sucesso.");

            setTimeout(() => {
                setMensagem("");
            }, 3000);
        },

        onError: () => {
            setMensagem("Não foi possível cadastrar o produto.");

            setTimeout(() => {
                setMensagem("");
            }, 3000);
        }
    });

    const excluirProdutoMutation = useMutation({
        mutationFn: excluirProduto,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["produtos"]
            });

            setMensagem("Produto excluído com sucesso.");

            setTimeout(() => {
                setMensagem("");
            }, 3000);
        },

        onError: () => {
            setMensagem("Não foi possível excluir o produto.");

            setTimeout(() => {
                setMensagem("");
            }, 3000);
        }
    });

    const produtosFiltrados = useMemo(() => {
        return produtos.filter((produto) => {
            const correspondeBusca =
                produto.nome
                    .toLowerCase()
                    .includes(busca.toLowerCase());

            const correspondeCategoria =
                categoriaSelecionada === "" ||
                Number(produto.categoriaId) ===
                    Number(categoriaSelecionada);

            return correspondeBusca && correspondeCategoria;
        });
    }, [produtos, busca, categoriaSelecionada]);

    const totalProdutos = produtos.length;

    const totalEstoque = produtos.reduce(
        (total, produto) =>
            total + Number(produto.quantidadeDisponivel || 0),
        0
    );

    const produtosEstoqueBaixo = produtos.filter(
        (produto) =>
            Number(produto.quantidadeDisponivel) > 0 &&
            Number(produto.quantidadeDisponivel) <= 3
    ).length;

    function abrirModalNovoProduto() {
        setProdutoSelecionado(null);

        reset({
            nome: "",
            descricao: "",
            preco: 0,
            material: "Semijoia",
            tipoBanho: "Ouro 18K",
            quantidadeDisponivel: 0,
            imagem: "",
            categoriaId: categorias.length > 0
                ? Number(categorias[0].id)
                : 0,
            tag: ""
        });

        setModalAberto(true);
    }

    function abrirModalEditarProduto(produto) {
        setProdutoSelecionado(produto);

        reset({
            nome: produto.nome || "",
            descricao: produto.descricao || "",
            preco: Number(produto.preco) || 0,
            material: produto.material || "Semijoia",
            tipoBanho: produto.tipoBanho || "Ouro 18K",
            quantidadeDisponivel:
                Number(produto.quantidadeDisponivel) || 0,
            imagem: produto.imagem || "",
            categoriaId: Number(produto.categoriaId) || 0,
            tag: produto.tag || ""
        });

        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
        setProdutoSelecionado(null);
        reset();
    }

    async function salvarProduto(dados) {
        const produto = {
            nome: dados.nome,
            descricao: dados.descricao,
            preco: Number(dados.preco),
            material: dados.material,
            tipoBanho: dados.tipoBanho,
            quantidadeDisponivel:
                Number(dados.quantidadeDisponivel),
            imagem: dados.imagem,
            categoriaId: Number(dados.categoriaId)
        };

        if (dados.tag && dados.tag.trim() !== "") {
            produto.tag = dados.tag.trim();
        }

        if (produtoSelecionado) {
            await atualizarProdutoMutation.mutateAsync({
                id: produtoSelecionado.id,
                produto
            });
        } else {
            await criarProdutoMutation.mutateAsync(produto);
        }

        fecharModal();
    }

    async function alterarEstoque(produto, novaQuantidade) {
        if (novaQuantidade < 0) {
            return;
        }

        await atualizarProdutoMutation.mutateAsync({
            id: produto.id,
            produto: {
                quantidadeDisponivel: novaQuantidade
            }
        });
    }

    async function removerProduto(produto) {
        const confirmou = window.confirm(
            `Deseja realmente excluir o produto "${produto.nome}"?`
        );

        if (!confirmou) {
            return;
        }

        await excluirProdutoMutation.mutateAsync(produto.id);
    }

    function obterNomeCategoria(categoriaId) {
        const categoria = categorias.find(
            (item) =>
                Number(item.id) === Number(categoriaId)
        );

        return categoria?.nome || "Sem categoria";
    }

    function obterStatusEstoque(quantidade) {
        const estoque = Number(quantidade);

        if (estoque <= 0) {
            return {
                texto: "Sem estoque",
                classe: "bg-danger-subtle text-danger"
            };
        }

        if (estoque <= 3) {
            return {
                texto: "Estoque baixo",
                classe: "bg-warning-subtle text-warning-emphasis"
            };
        }

        return {
            texto: "Em estoque",
            classe: "bg-success-subtle text-success"
        };
    }

    function sair() {
        logout();
        navigate("/login");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg border-bottom bg-white">
                <div className="container">
                    <a
                        href="/admin"
                        className="navbar-brand display-font"
                        onClick={(evento) => {
                            evento.preventDefault();
                            navigate("/admin");
                        }}
                    >
                        ADORNATTA
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#adminNavbar"
                        aria-controls="adminNavbar"
                        aria-expanded="false"
                        aria-label="Alternar navegação"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="adminNavbar"
                    >
                        <ul className="navbar-nav ms-auto align-items-lg-center">
                            <li className="nav-item">
                                <a
                                    href="/admin"
                                    className="nav-link"
                                    onClick={(evento) => {
                                        evento.preventDefault();
                                        navigate("/admin");
                                    }}
                                >
                                    Painel
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/estoque"
                                    className="nav-link active"
                                    onClick={(evento) => {
                                        evento.preventDefault();
                                        navigate("/admin/estoque");
                                    }}
                                >
                                    Estoque
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/pedidos"
                                    className="nav-link"
                                    onClick={(evento) => {
                                        evento.preventDefault();
                                        navigate("/admin/pedidos");
                                    }}
                                >
                                    Pedidos
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    href="/admin/vendas"
                                    className="nav-link"
                                    onClick={(evento) => {
                                        evento.preventDefault();
                                        navigate("/admin/vendas");
                                    }}
                                >
                                    Vendas
                                </a>
                            </li>

                            <li className="nav-item ms-lg-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={sair}
                                >
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="container py-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <div className="section-label mb-2">
                            Área administrativa
                        </div>

                        <h1 className="display-font mb-2">
                            Estoque
                        </h1>

                        <p className="text-muted mb-0">
                            Gerencie os produtos e a quantidade
                            disponível na loja.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-dark"
                        onClick={abrirModalNovoProduto}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Novo produto
                    </button>
                </div>

                {mensagem && (
                    <div
                        className="alert alert-success"
                        role="alert"
                    >
                        {mensagem}
                    </div>
                )}

                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="admin-summary-card h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="admin-summary-icon">
                                    <i className="bi bi-box-seam"></i>
                                </div>

                                <div>
                                    <div className="text-muted small">
                                        Produtos cadastrados
                                    </div>

                                    <div className="fs-3 fw-semibold">
                                        {totalProdutos}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="admin-summary-card h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="admin-summary-icon">
                                    <i className="bi bi-stack"></i>
                                </div>

                                <div>
                                    <div className="text-muted small">
                                        Itens em estoque
                                    </div>

                                    <div className="fs-3 fw-semibold">
                                        {totalEstoque}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="admin-summary-card h-100">
                            <div className="d-flex align-items-center gap-3">
                                <div className="admin-summary-icon">
                                    <i className="bi bi-exclamation-triangle"></i>
                                </div>

                                <div>
                                    <div className="text-muted small">
                                        Estoque baixo
                                    </div>

                                    <div className="fs-3 fw-semibold">
                                        {produtosEstoqueBaixo}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border bg-white p-3 p-md-4 mb-4">
                    <div className="row g-3">
                        <div className="col-md-7">
                            <label
                                htmlFor="buscaProduto"
                                className="form-label"
                            >
                                Buscar produto
                            </label>

                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>

                                <input
                                    id="buscaProduto"
                                    type="text"
                                    className="form-control"
                                    placeholder="Digite o nome do produto..."
                                    value={busca}
                                    onChange={(evento) =>
                                        setBusca(
                                            evento.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-md-5">
                            <label
                                htmlFor="filtroCategoria"
                                className="form-label"
                            >
                                Categoria
                            </label>

                            <select
                                id="filtroCategoria"
                                className="form-select"
                                value={categoriaSelecionada}
                                onChange={(evento) =>
                                    setCategoriaSelecionada(
                                        evento.target.value
                                    )
                                }
                                disabled={carregandoCategorias}
                            >
                                <option value="">
                                    Todas as categorias
                                </option>

                                {categorias.map((categoria) => (
                                    <option
                                        key={categoria.id}
                                        value={categoria.id}
                                    >
                                        {categoria.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {carregandoProdutos && (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Carregando...
                            </span>
                        </div>

                        <p className="text-muted mt-3 mb-0">
                            Carregando produtos...
                        </p>
                    </div>
                )}

                {erroProdutos && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        Não foi possível carregar os produtos.
                    </div>
                )}

                {!carregandoProdutos &&
                    !erroProdutos && (
                        <div className="border bg-white">
                            <div className="p-3 p-md-4 border-bottom">
                                <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                                    <div>
                                        <div className="section-label mb-1">
                                            Produtos
                                        </div>

                                        <h2 className="section-title mb-0">
                                            Controle de estoque
                                        </h2>
                                    </div>

                                    <div className="text-muted">
                                        {produtosFiltrados.length} produto(s)
                                    </div>
                                </div>
                            </div>

                            {produtosFiltrados.length === 0 ? (
                                <div className="text-center py-5 px-3">
                                    <i className="bi bi-search display-5 text-muted"></i>

                                    <h3 className="h5 mt-3">
                                        Nenhum produto encontrado
                                    </h3>

                                    <p className="text-muted mb-0">
                                        Tente alterar a busca ou
                                        o filtro de categoria.
                                    </p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle mb-0">
                                        <thead>
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="ps-3 ps-md-4"
                                                >
                                                    Produto
                                                </th>

                                                <th scope="col">
                                                    Categoria
                                                </th>

                                                <th scope="col">
                                                    Preço
                                                </th>

                                                <th scope="col">
                                                    Estoque
                                                </th>

                                                <th scope="col">
                                                    Status
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="text-end pe-3 pe-md-4"
                                                >
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {produtosFiltrados.map(
                                                (produto) => {
                                                    const status =
                                                        obterStatusEstoque(
                                                            produto.quantidadeDisponivel
                                                        );

                                                    return (
                                                        <tr
                                                            key={
                                                                produto.id
                                                            }
                                                        >
                                                            <td className="ps-3 ps-md-4">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <img
                                                                        src={
                                                                            produto.imagem
                                                                        }
                                                                        alt={
                                                                            produto.nome
                                                                        }
                                                                        className="admin-product-image rounded"
                                                                        style={{
                                                                            width: "56px",
                                                                            height: "56px",
                                                                            objectFit: "cover"
                                                                        }}
                                                                    />

                                                                    <div>
                                                                        <div className="fw-semibold">
                                                                            {
                                                                                produto.nome
                                                                            }
                                                                        </div>

                                                                        {produto.tag && (
                                                                            <small className="text-muted">
                                                                                {
                                                                                    produto.tag
                                                                                }
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                {
                                                                    obterNomeCategoria(
                                                                        produto.categoriaId
                                                                    )
                                                                }
                                                            </td>

                                                            <td>
                                                                R${" "}
                                                                {Number(
                                                                    produto.preco
                                                                ).toFixed(
                                                                    2
                                                                ).replace(
                                                                    ".",
                                                                    ","
                                                                )}
                                                            </td>

                                                            <td>
                                                                <div className="d-inline-flex align-items-center">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-dark"
                                                                        onClick={() =>
                                                                            alterarEstoque(
                                                                                produto,
                                                                                Number(
                                                                                    produto.quantidadeDisponivel
                                                                                ) -
                                                                                    1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            Number(
                                                                                produto.quantidadeDisponivel
                                                                            ) <=
                                                                            0 ||
                                                                            atualizarProdutoMutation.isPending
                                                                        }
                                                                        aria-label={`Diminuir estoque de ${produto.nome}`}
                                                                    >
                                                                        <i className="bi bi-dash"></i>
                                                                    </button>

                                                                    <span className="mx-3 fw-semibold">
                                                                        {
                                                                            produto.quantidadeDisponivel
                                                                        }
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-dark"
                                                                        onClick={() =>
                                                                            alterarEstoque(
                                                                                produto,
                                                                                Number(
                                                                                    produto.quantidadeDisponivel
                                                                                ) +
                                                                                    1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            atualizarProdutoMutation.isPending
                                                                        }
                                                                        aria-label={`Aumentar estoque de ${produto.nome}`}
                                                                    >
                                                                        <i className="bi bi-plus"></i>
                                                                    </button>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={`badge rounded-pill ${status.classe}`}
                                                                >
                                                                    {
                                                                        status.texto
                                                                    }
                                                                </span>
                                                            </td>

                                                            <td className="text-end pe-3 pe-md-4">
                                                                <div className="d-inline-flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-dark"
                                                                        onClick={() =>
                                                                            abrirModalEditarProduto(
                                                                                produto
                                                                            )
                                                                        }
                                                                        aria-label={`Editar ${produto.nome}`}
                                                                    >
                                                                        <i className="bi bi-pencil"></i>
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() =>
                                                                            removerProduto(
                                                                                produto
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            excluirProdutoMutation.isPending
                                                                        }
                                                                        aria-label={`Excluir ${produto.nome}`}
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
            </main>

            {modalAberto && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    style={{
                        backgroundColor:
                            "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div>
                                    <div className="section-label mb-1">
                                        {produtoSelecionado
                                            ? "Editar produto"
                                            : "Novo produto"}
                                    </div>

                                    <h2 className="modal-title h4 mb-0">
                                        {produtoSelecionado
                                            ? produtoSelecionado.nome
                                            : "Cadastrar produto"}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={fecharModal}
                                    aria-label="Fechar"
                                ></button>
                            </div>

                            <form
                                onSubmit={handleSubmit(
                                    salvarProduto
                                )}
                            >
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-8">
                                            <label
                                                htmlFor="nome"
                                                className="form-label"
                                            >
                                                Nome
                                            </label>

                                            <input
                                                id="nome"
                                                type="text"
                                                className={`form-control ${
                                                    errors.nome
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                {...register("nome")}
                                            />

                                            {errors.nome && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.nome
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-4">
                                            <label
                                                htmlFor="preco"
                                                className="form-label"
                                            >
                                                Preço
                                            </label>

                                            <input
                                                id="preco"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className={`form-control ${
                                                    errors.preco
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                {...register(
                                                    "preco",
                                                    {
                                                        valueAsNumber: true
                                                    }
                                                )}
                                            />

                                            {errors.preco && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.preco
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-12">
                                            <label
                                                htmlFor="descricao"
                                                className="form-label"
                                            >
                                                Descrição
                                            </label>

                                            <textarea
                                                id="descricao"
                                                rows="3"
                                                className={`form-control ${
                                                    errors.descricao
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                {...register(
                                                    "descricao"
                                                )}
                                            ></textarea>

                                            {errors.descricao && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors
                                                            .descricao
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="material"
                                                className="form-label"
                                            >
                                                Material
                                            </label>

                                            <input
                                                id="material"
                                                type="text"
                                                className={`form-control ${
                                                    errors.material
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                {...register(
                                                    "material"
                                                )}
                                            />

                                            {errors.material && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors
                                                            .material
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="tipoBanho"
                                                className="form-label"
                                            >
                                                Tipo de banho
                                            </label>

                                            <input
                                                id="tipoBanho"
                                                type="text"
                                                className={`form-control ${
                                                    errors.tipoBanho
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                {...register(
                                                    "tipoBanho"
                                                )}
                                            />

                                            {errors.tipoBanho && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors
                                                            .tipoBanho
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-4">
                                            <label
                                                htmlFor="quantidadeDisponivel"
                                                className="form-label"
                                            >
                                                Quantidade disponível
                                            </label>

                                            <input
                                                id="quantidadeDisponivel"
                                                type="number"
                                                min="0"
                                                step="1"
                                                className={`form-control ${
                                                    errors.quantidadeDisponivel
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                {...register(
                                                    "quantidadeDisponivel",
                                                    {
                                                        valueAsNumber: true
                                                    }
                                                )}
                                            />

                                            {errors.quantidadeDisponivel && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors
                                                            .quantidadeDisponivel
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-8">
                                            <label
                                                htmlFor="categoriaId"
                                                className="form-label"
                                            >
                                                Categoria
                                            </label>

                                            <select
                                                id="categoriaId"
                                                className={`form-select ${
                                                    errors.categoriaId
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                {...register(
                                                    "categoriaId",
                                                    {
                                                        valueAsNumber: true
                                                    }
                                                )}
                                            >
                                                <option value="0">
                                                    Selecione uma categoria
                                                </option>

                                                {categorias.map(
                                                    (
                                                        categoria
                                                    ) => (
                                                        <option
                                                            key={
                                                                categoria.id
                                                            }
                                                            value={
                                                                categoria.id
                                                            }
                                                        >
                                                            {
                                                                categoria.nome
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            {errors.categoriaId && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors
                                                            .categoriaId
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-8">
                                            <label
                                                htmlFor="imagem"
                                                className="form-label"
                                            >
                                                Caminho da imagem
                                            </label>

                                            <input
                                                id="imagem"
                                                type="text"
                                                className={`form-control ${
                                                    errors.imagem
                                                        ? "is-invalid"
                                                        : ""
                                                }`}
                                                placeholder="/assets/images/produto.jpeg"
                                                {...register(
                                                    "imagem"
                                                )}
                                            />

                                            {errors.imagem && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.imagem
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-4">
                                            <label
                                                htmlFor="tag"
                                                className="form-label"
                                            >
                                                Tag
                                            </label>

                                            <input
                                                id="tag"
                                                type="text"
                                                className="form-control"
                                                placeholder="Destaque"
                                                {...register("tag")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={fecharModal}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-dark"
                                        disabled={
                                            criarProdutoMutation.isPending ||
                                            atualizarProdutoMutation.isPending
                                        }
                                    >
                                        {criarProdutoMutation.isPending ||
                                        atualizarProdutoMutation.isPending
                                            ? "Salvando..."
                                            : "Salvar produto"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Estoque;