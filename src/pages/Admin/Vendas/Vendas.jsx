import { useMemo, useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    useForm
} from "react-hook-form";

import {
    z
} from "zod";

import {
    zodResolver
} from "@hookform/resolvers/zod";

import {
    Link
} from "react-router-dom";

import Header from "../../../components/Header/Header";

import {
    buscarProdutos,
    buscarVendas,
    criarVenda,
    atualizarProduto
} from "../../../services/api";

import { useAuth } from "../../../context/AuthContext";


const vendaSchema = z.object({
    cliente: z
        .string()
        .min(3, "Informe o nome do cliente."),

    data: z
        .string()
        .min(1, "Informe a data da venda."),

    produtoId: z
        .string()
        .min(1, "Selecione um produto."),

    quantidade: z.coerce
        .number()
        .int("Informe uma quantidade inteira.")
        .min(1, "A quantidade deve ser maior que zero."),

    formaPagamento: z
        .string()
        .min(1, "Selecione a forma de pagamento."),

    observacoes: z
        .string()
        .optional()
});


function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function formatarData(data) {
    if (!data) {
        return "-";
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return "-";
    }

    return dataObj.toLocaleDateString(
        "pt-BR"
    );
}


function obterDataAtual() {
    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


function Vendas() {

    const {
        usuario,
        logout
    } = useAuth();

    const queryClient = useQueryClient();

    const [busca, setBusca] = useState("");

    const [vendaSelecionada, setVendaSelecionada] =
        useState(null);


    const {
        data: vendas = [],
        isLoading: carregandoVendas,
        isError: erroVendas
    } = useQuery({
        queryKey: ["vendas"],
        queryFn: buscarVendas
    });


    const {
        data: produtos = [],
        isLoading: carregandoProdutos
    } = useQuery({
        queryKey: ["produtos"],
        queryFn: buscarProdutos
    });


    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(vendaSchema),
        defaultValues: {
            cliente: "",
            data: obterDataAtual(),
            produtoId: "",
            quantidade: 1,
            formaPagamento: "",
            observacoes: ""
        }
    });


    const produtoSelecionadoId =
        watch("produtoId");

    const quantidadeSelecionada =
        watch("quantidade");


    const produtoSelecionado =
        produtos.find(
            (produto) =>
                String(produto.id) ===
                String(produtoSelecionadoId)
        );


    const valorTotal = produtoSelecionado
        ? Number(produtoSelecionado.preco) *
          Number(quantidadeSelecionada || 0)
        : 0;


    const vendasFiltradas = useMemo(() => {

        const termo =
            busca
                .trim()
                .toLowerCase();

        if (!termo) {
            return vendas;
        }

        return vendas.filter(
            (venda) => {

                const numero =
                    String(
                        venda.id || ""
                    ).toLowerCase();

                const cliente =
                    String(
                        venda.cliente || ""
                    ).toLowerCase();

                const pagamento =
                    String(
                        venda.formaPagamento || ""
                    ).toLowerCase();

                return (
                    numero.includes(termo) ||
                    cliente.includes(termo) ||
                    pagamento.includes(termo)
                );
            }
        );

    }, [vendas, busca]);


    const vendasDoMes = useMemo(() => {

        const hoje = new Date();

        const mesAtual =
            hoje.getMonth();

        const anoAtual =
            hoje.getFullYear();

        return vendas.filter(
            (venda) => {

                const data =
                    new Date(venda.data);

                return (
                    data.getMonth() === mesAtual &&
                    data.getFullYear() === anoAtual
                );
            }
        );

    }, [vendas]);


    const faturamentoDoMes =
        useMemo(() => {

            return vendasDoMes.reduce(
                (total, venda) =>
                    total +
                    Number(
                        venda.valorTotal || 0
                    ),
                0
            );

        },
        [vendasDoMes]
    );


    const registrarVendaMutation =
        useMutation({

            mutationFn: async (dados) => {

                const produto =
                    produtos.find(
                        (item) =>
                            String(item.id) ===
                            String(dados.produtoId)
                    );

                if (!produto) {
                    throw new Error(
                        "Produto não encontrado."
                    );
                }

                const estoqueAtual =
                    Number(
                        produto.quantidadeDisponivel || 0
                    );

                const quantidade =
                    Number(
                        dados.quantidade
                    );

                if (
                    quantidade >
                    estoqueAtual
                ) {
                    throw new Error(
                        `Estoque insuficiente. Disponível: ${estoqueAtual}.`
                    );
                }

                const novoEstoque =
                    estoqueAtual -
                    quantidade;

                await atualizarProduto(
                    produto.id,
                    {
                        quantidadeDisponivel:
                            novoEstoque
                    }
                );

                try {

                    const venda =
                        await criarVenda({

                            cliente:
                                dados.cliente,

                            data:
                                dados.data,

                            produtoId:
                                produto.id,

                            quantidade,

                            formaPagamento:
                                dados.formaPagamento,

                            valorUnitario:
                                Number(
                                    produto.preco
                                ),

                            valorTotal:
                                Number(
                                    produto.preco
                                ) *
                                quantidade,

                            observacoes:
                                dados.observacoes ||
                                ""
                        });

                    return venda;

                } catch (erro) {

                    await atualizarProduto(
                        produto.id,
                        {
                            quantidadeDisponivel:
                                estoqueAtual
                        }
                    );

                    throw erro;
                }
            },

            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey: ["vendas"]
                });

                queryClient.invalidateQueries({
                    queryKey: ["produtos"]
                });

                reset({
                    cliente: "",
                    data: obterDataAtual(),
                    produtoId: "",
                    quantidade: 1,
                    formaPagamento: "",
                    observacoes: ""
                });

                const modal =
                    document.getElementById(
                        "vendaModal"
                    );

                if (modal) {

                    const modalInstance =
                        window.bootstrap?.Modal
                            .getInstance(modal);

                    modalInstance?.hide();
                }
            }
        });


    function onSubmit(dados) {

        const produto =
            produtos.find(
                (item) =>
                    String(item.id) ===
                    String(dados.produtoId)
            );

        if (!produto) {
            return;
        }

        const estoque =
            Number(
                produto.quantidadeDisponivel || 0
            );

        if (
            Number(dados.quantidade) >
            estoque
        ) {

            setError(
                "quantidade",
                {
                    type: "manual",
                    message:
                        `Quantidade indisponível. Estoque atual: ${estoque}.`
                }
            );

            return;
        }

        registrarVendaMutation.mutate(
            dados
        );
    }


    function sair() {
        logout();
    }


    return (
        <>
            <Header />

            <main>

                <section className="section pb-4">

                    <div className="container">

                        <div
                            className="
                                d-flex
                                flex-column
                                flex-lg-row
                                justify-content-between
                                align-items-lg-end
                                gap-4
                            "
                        >

                            <div>

                                <div className="section-label">
                                    Área da loja
                                </div>

                                <h1 className="section-title mb-3">
                                    Vendas
                                </h1>

                                <p className="section-text mb-0">
                                    Registre vendas realizadas
                                    na loja e consulte o
                                    histórico de vendas.
                                </p>

                            </div>


                            <div>

                                <button
                                    type="button"
                                    className="btn btn-gold"
                                    data-bs-toggle="modal"
                                    data-bs-target="#vendaModal"
                                >
                                    <i className="bi bi-plus-lg me-2"></i>

                                    Registrar venda
                                </button>

                            </div>

                        </div>

                    </div>

                </section>


                <section className="pb-5">

                    <div className="container">

                        <div className="row g-3">

                            <div className="col-md-4">

                                <div className="admin-summary-card">

                                    <div className="admin-summary-icon">
                                        <i className="bi bi-cart-check"></i>
                                    </div>

                                    <div>

                                        <span className="text-muted small">
                                            Vendas realizadas
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {vendas.length}
                                        </h3>

                                    </div>

                                </div>

                            </div>


                            <div className="col-md-4">

                                <div className="admin-summary-card">

                                    <div className="admin-summary-icon">
                                        <i className="bi bi-calendar3"></i>
                                    </div>

                                    <div>

                                        <span className="text-muted small">
                                            Vendas este mês
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {vendasDoMes.length}
                                        </h3>

                                    </div>

                                </div>

                            </div>


                            <div className="col-md-4">

                                <div className="admin-summary-card">

                                    <div className="admin-summary-icon">
                                        <i className="bi bi-currency-dollar"></i>
                                    </div>

                                    <div>

                                        <span className="text-muted small">
                                            Faturamento do mês
                                        </span>

                                        <h3 className="mb-0 mt-1">
                                            {formatarMoeda(
                                                faturamentoDoMes
                                            )}
                                        </h3>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                <section className="section-soft py-5">

                    <div className="container">

                        <div
                            className="
                                d-flex
                                flex-column
                                flex-md-row
                                justify-content-between
                                align-items-md-center
                                gap-3
                                mb-4
                            "
                        >

                            <div>

                                <div className="section-label">
                                    Histórico
                                </div>

                                <h2 className="display-font mb-0">
                                    Vendas realizadas
                                </h2>

                            </div>


                            <div className="admin-search">

                                <i className="bi bi-search"></i>

                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Pesquisar venda..."
                                    value={busca}
                                    onChange={(evento) =>
                                        setBusca(
                                            evento.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {carregandoVendas ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Carregando...
                                    </span>
                                </div>

                            </div>

                        ) : erroVendas ? (

                            <div className="alert alert-danger">
                                Não foi possível carregar
                                as vendas.
                            </div>

                        ) : vendasFiltradas.length === 0 ? (

                            <div className="text-center py-5">

                                <i className="bi bi-cart-x fs-1"></i>

                                <h5 className="mt-3">
                                    Nenhuma venda encontrada.
                                </h5>

                                <p className="text-muted mb-0">
                                    Registre uma venda ou
                                    altere os termos da pesquisa.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive bg-white">

                                <table className="table admin-table align-middle mb-0">

                                    <thead>

                                        <tr>

                                            <th>
                                                Venda
                                            </th>

                                            <th>
                                                Cliente
                                            </th>

                                            <th>
                                                Data
                                            </th>

                                            <th>
                                                Forma de pagamento
                                            </th>

                                            <th>
                                                Total
                                            </th>

                                            <th className="text-end">
                                                Ações
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {vendasFiltradas.map(
                                            (venda) => {

                                                const produto =
                                                    produtos.find(
                                                        (item) =>
                                                            String(
                                                                item.id
                                                            ) ===
                                                            String(
                                                                venda.produtoId
                                                            )
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            venda.id
                                                        }
                                                    >

                                                        <td>
                                                            <strong>
                                                                #{venda.id}
                                                            </strong>
                                                        </td>


                                                        <td>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        venda.cliente
                                                                    }
                                                                </strong>

                                                                <small className="d-block text-muted">

                                                                    {
                                                                        produto?.nome ||
                                                                        "Produto não encontrado"
                                                                    }

                                                                    {" x"}

                                                                    {
                                                                        venda.quantidade
                                                                    }

                                                                </small>

                                                            </div>

                                                        </td>


                                                        <td>
                                                            {
                                                                formatarData(
                                                                    venda.data
                                                                )
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                venda.formaPagamento
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                formatarMoeda(
                                                                    venda.valorTotal
                                                                )
                                                            }
                                                        </td>


                                                        <td className="text-end">

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-dark"
                                                                title="Ver detalhes"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#detalhesVendaModal"
                                                                onClick={() =>
                                                                    setVendaSelecionada(
                                                                        venda
                                                                    )
                                                                }
                                                            >

                                                                <i className="bi bi-eye"></i>

                                                            </button>

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

                </section>

            </main>


            <div
                className="modal fade"
                id="vendaModal"
                tabIndex="-1"
                aria-labelledby="vendaModalLabel"
                aria-hidden="true"
            >

                <div
                    className="
                        modal-dialog
                        modal-lg
                        modal-dialog-centered
                    "
                >

                    <div
                        className="
                            modal-content
                            rounded-0
                            border-0
                        "
                    >

                        <div className="modal-header border-bottom">

                            <div>

                                <div className="section-label mb-1">
                                    Vendas
                                </div>

                                <h5
                                    className="
                                        modal-title
                                        display-font
                                    "
                                    id="vendaModalLabel"
                                >
                                    Registrar venda
                                </h5>

                            </div>

                            <button
                                type="button"
                                className="btn-close shadow-none"
                                data-bs-dismiss="modal"
                                aria-label="Fechar"
                            ></button>

                        </div>


                        <form
                            onSubmit={handleSubmit(
                                onSubmit
                            )}
                        >

                            <div className="modal-body p-4">

                                {registrarVendaMutation.isError && (

                                    <div className="alert alert-danger">

                                        {registrarVendaMutation.error?.message ||
                                            "Não foi possível registrar a venda."}

                                    </div>

                                )}

                                <div className="row g-4">

                                    <div className="col-md-6">

                                        <label
                                            className="form-label"
                                            htmlFor="cliente"
                                        >
                                            Cliente
                                        </label>

                                        <input
                                            id="cliente"
                                            type="text"
                                            className={`form-control ${
                                                errors.cliente
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            placeholder="Nome do cliente"
                                            {...register(
                                                "cliente"
                                            )}
                                        />

                                        {errors.cliente && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.cliente.message
                                                }
                                            </div>
                                        )}

                                    </div>


                                    <div className="col-md-6">

                                        <label
                                            className="form-label"
                                            htmlFor="data"
                                        >
                                            Data da venda
                                        </label>

                                        <input
                                            id="data"
                                            type="date"
                                            className={`form-control ${
                                                errors.data
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "data"
                                            )}
                                        />

                                        {errors.data && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.data.message
                                                }
                                            </div>
                                        )}

                                    </div>


                                    <div className="col-md-6">

                                        <label
                                            className="form-label"
                                            htmlFor="produtoId"
                                        >
                                            Joia
                                        </label>

                                        <select
                                            id="produtoId"
                                            className={`form-select ${
                                                errors.produtoId
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "produtoId"
                                            )}
                                        >

                                            <option value="">
                                                Selecione uma joia
                                            </option>

                                            {produtos.map(
                                                (produto) => (

                                                    <option
                                                        key={
                                                            produto.id
                                                        }
                                                        value={
                                                            produto.id
                                                        }
                                                        disabled={
                                                            Number(
                                                                produto.quantidadeDisponivel
                                                            ) <= 0
                                                        }
                                                    >
                                                        {
                                                            produto.nome
                                                        }
                                                        {" — "}
                                                        {
                                                            formatarMoeda(
                                                                produto.preco
                                                            )
                                                        }
                                                        {" — estoque: "}
                                                        {
                                                            produto.quantidadeDisponivel
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {errors.produtoId && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.produtoId.message
                                                }
                                            </div>
                                        )}

                                    </div>


                                    <div className="col-md-6">

                                        <label
                                            className="form-label"
                                            htmlFor="quantidade"
                                        >
                                            Quantidade
                                        </label>

                                        <input
                                            id="quantidade"
                                            type="number"
                                            min="1"
                                            className={`form-control ${
                                                errors.quantidade
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "quantidade"
                                            )}
                                        />

                                        {errors.quantidade && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.quantidade.message
                                                }
                                            </div>
                                        )}

                                    </div>


                                    <div className="col-md-6">

                                        <label
                                            className="form-label"
                                            htmlFor="formaPagamento"
                                        >
                                            Forma de pagamento
                                        </label>

                                        <select
                                            id="formaPagamento"
                                            className={`form-select ${
                                                errors.formaPagamento
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "formaPagamento"
                                            )}
                                        >

                                            <option value="">
                                                Selecione
                                            </option>

                                            <option value="Pix">
                                                Pix
                                            </option>

                                            <option value="Cartão de crédito">
                                                Cartão de crédito
                                            </option>

                                            <option value="Cartão de débito">
                                                Cartão de débito
                                            </option>

                                            <option value="Dinheiro">
                                                Dinheiro
                                            </option>

                                        </select>

                                        {errors.formaPagamento && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.formaPagamento.message
                                                }
                                            </div>
                                        )}

                                    </div>


                                    <div className="col-md-6">

                                        <label
                                            className="form-label"
                                            htmlFor="valorTotal"
                                        >
                                            Valor total
                                        </label>

                                        <input
                                            id="valorTotal"
                                            type="text"
                                            className="form-control"
                                            value={formatarMoeda(
                                                valorTotal
                                            )}
                                            readOnly
                                        />

                                        <small className="text-muted">
                                            Calculado automaticamente
                                            com base no produto e
                                            na quantidade.
                                        </small>

                                    </div>


                                    <div className="col-12">

                                        <label
                                            className="form-label"
                                            htmlFor="observacoes"
                                        >
                                            Observações
                                        </label>

                                        <textarea
                                            id="observacoes"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Observações sobre a venda..."
                                            {...register(
                                                "observacoes"
                                            )}
                                        ></textarea>

                                    </div>

                                </div>

                            </div>


                            <div className="modal-footer border-top">

                                <button
                                    type="button"
                                    className="
                                        btn
                                        btn-outline-dark
                                        rounded-0
                                    "
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-gold"
                                    disabled={
                                        registrarVendaMutation.isPending ||
                                        carregandoProdutos
                                    }
                                >

                                    {registrarVendaMutation.isPending ? (

                                        <>
                                            <span
                                                className="
                                                    spinner-border
                                                    spinner-border-sm
                                                    me-2
                                                "
                                                aria-hidden="true"
                                            ></span>

                                            Registrando...
                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-check2 me-1"></i>
                                            Registrar venda
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>


            <div
                className="modal fade"
                id="detalhesVendaModal"
                tabIndex="-1"
                aria-labelledby="detalhesVendaModalLabel"
                aria-hidden="true"
            >

                <div
                    className="
                        modal-dialog
                        modal-dialog-centered
                    "
                >

                    <div
                        className="
                            modal-content
                            rounded-0
                            border-0
                        "
                    >

                        <div className="modal-header border-bottom">

                            <div>

                                <div className="section-label mb-1">
                                    Histórico
                                </div>

                                <h5
                                    className="
                                        modal-title
                                        display-font
                                    "
                                    id="detalhesVendaModalLabel"
                                >
                                    Detalhes da venda
                                </h5>

                            </div>

                            <button
                                type="button"
                                className="btn-close shadow-none"
                                data-bs-dismiss="modal"
                                aria-label="Fechar"
                            ></button>

                        </div>


                        <div className="modal-body p-4">

                            {vendaSelecionada && (

                                <div className="row g-4">

                                    <div className="col-6">

                                        <span className="text-muted small">
                                            Número
                                        </span>

                                        <strong className="d-block mt-1">
                                            #{vendaSelecionada.id}
                                        </strong>

                                    </div>


                                    <div className="col-6">

                                        <span className="text-muted small">
                                            Data
                                        </span>

                                        <strong className="d-block mt-1">
                                            {formatarData(
                                                vendaSelecionada.data
                                            )}
                                        </strong>

                                    </div>


                                    <div className="col-12">

                                        <span className="text-muted small">
                                            Cliente
                                        </span>

                                        <strong className="d-block mt-1">
                                            {
                                                vendaSelecionada.cliente
                                            }
                                        </strong>

                                    </div>


                                    <div className="col-12">

                                        <span className="text-muted small">
                                            Produto
                                        </span>

                                        <strong className="d-block mt-1">

                                            {
                                                produtos.find(
                                                    (produto) =>
                                                        String(
                                                            produto.id
                                                        ) ===
                                                        String(
                                                            vendaSelecionada.produtoId
                                                        )
                                                )?.nome ||
                                                "Produto não encontrado"
                                            }

                                            {" x"}

                                            {
                                                vendaSelecionada.quantidade
                                            }

                                        </strong>

                                    </div>


                                    <div className="col-6">

                                        <span className="text-muted small">
                                            Pagamento
                                        </span>

                                        <strong className="d-block mt-1">
                                            {
                                                vendaSelecionada.formaPagamento
                                            }
                                        </strong>

                                    </div>


                                    <div className="col-6">

                                        <span className="text-muted small">
                                            Total
                                        </span>

                                        <strong className="d-block mt-1">
                                            {
                                                formatarMoeda(
                                                    vendaSelecionada.valorTotal
                                                )
                                            }
                                        </strong>

                                    </div>


                                    {vendaSelecionada.observacoes && (

                                        <div className="col-12">

                                            <span className="text-muted small">
                                                Observações
                                            </span>

                                            <p className="mb-0 mt-1">
                                                {
                                                    vendaSelecionada.observacoes
                                                }
                                            </p>

                                        </div>

                                    )}

                                </div>

                            )}

                        </div>


                        <div className="modal-footer border-top">

                            <button
                                type="button"
                                className="
                                    btn
                                    btn-outline-dark
                                    rounded-0
                                "
                                data-bs-dismiss="modal"
                            >
                                Fechar
                            </button>

                        </div>

                    </div>

                </div>

            </div>


            <footer className="footer">

                <div className="container">

                    <div className="row g-5">

                        <div className="col-lg-5">

                            <div className="brand mb-3">
                                ADORNATTA
                            </div>

                            <p className="text-muted mb-0">
                                Área administrativa da loja
                                Adornatta. Registre e acompanhe
                                as vendas realizadas.
                            </p>

                        </div>


                        <div className="col-6 col-lg-3">

                            <h6>
                                Área da loja
                            </h6>

                            <ul className="list-unstyled">

                                <li>
                                    <Link to="/admin">
                                        Painel
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/estoque">
                                        Estoque
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/pedidos">
                                        Pedidos
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/admin/vendas">
                                        Vendas
                                    </Link>
                                </li>

                            </ul>

                        </div>


                        <div className="col-6 col-lg-4">

                            <h6>
                                Conta
                            </h6>

                            <ul className="list-unstyled">

                                <li>
                                    <span className="text-muted">
                                        {usuario?.nome}
                                    </span>
                                </li>

                                <li>

                                    <button
                                        type="button"
                                        className="
                                            btn
                                            btn-link
                                            p-0
                                            text-decoration-none
                                        "
                                        onClick={sair}
                                    >
                                        Sair
                                    </button>

                                </li>

                            </ul>

                        </div>

                    </div>


                    <div className="footer-bottom mt-5 pt-4 border-top">

                        <small className="text-muted">
                            © 2026 Adornatta.
                            Todos os direitos reservados.
                        </small>

                    </div>

                </div>

            </footer>
        </>
    );
}

export default Vendas;