import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useForm
} from "react-hook-form";

import {
    zodResolver
} from "@hookform/resolvers/zod";

import {
    useQuery
} from "@tanstack/react-query";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
    useCart
} from "../../context/CartContext";

import {
    useAuth
} from "../../context/AuthContext";

import {
    criarPedido,
    criarItemPedido,
    buscarFormasPagamentoPorUsuario,
    criarFormaPagamento
} from "../../services/api";

import checkoutSchema
    from "../../schemas/checkoutSchema";


function Checkout() {
    const navigate = useNavigate();

    const {
        carrinho,
        limparCarrinho
    } = useCart();

    const {
        usuario
    } = useAuth();

    const [
        enviandoPedido,
        setEnviandoPedido
    ] = useState(false);

    const [
        erroPedido,
        setErroPedido
    ] = useState("");


    const {
        data: formasPagamento = [],
        isLoading: carregandoPagamentos,
        isError: erroPagamentos
    } = useQuery({
        queryKey: [
            "formas-pagamento",
            usuario?.id
        ],

        queryFn: () =>
            buscarFormasPagamentoPorUsuario(
                usuario.id
            ),

        enabled: !!usuario?.id
    });


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(
            checkoutSchema
        ),

        defaultValues: {
            nome:
                usuario?.nome || "",

            email:
                usuario?.email || "",

            telefone:
                usuario?.telefone || "",

            endereco: "",

            cidade: "",

            estado: "",

            cep: "",

            formaPagamento: "pix",

            pagamentoSalvo: "",

            numeroCartao: "",

            nomeCartao: "",

            validadeCartao: "",

            cvvCartao: "",

            bandeiraCartao: "",

            salvarCartao: false
        }
    });


    const formaPagamento =
        watch("formaPagamento");


    const total =
        carrinho.reduce(
            (
                soma,
                produto
            ) =>
                soma +
                Number(produto.preco) *
                Number(produto.quantidade),

            0
        );


    useEffect(() => {
        if (!usuario) {
            return;
        }

        setValue(
            "nome",
            usuario.nome || ""
        );

        setValue(
            "email",
            usuario.email || ""
        );

        setValue(
            "telefone",
            usuario.telefone || ""
        );

        const endereco =
            usuario.endereco || {};

        const enderecoCompleto =
            endereco.logradouro
                ? `${endereco.logradouro}${endereco.numero ? `, ${endereco.numero}` : ""}${endereco.complemento ? ` - ${endereco.complemento}` : ""}`
                : "";

        setValue(
            "endereco",
            enderecoCompleto
        );

        setValue(
            "cidade",
            endereco.cidade || ""
        );

        setValue(
            "estado",
            endereco.estado || ""
        );

        setValue(
            "cep",
            endereco.cep || ""
        );
    }, [
        usuario,
        setValue
    ]);


    function formatarPreco(
        valor
    ) {
        return Number(
            valor
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    function formatarPagamento(
        pagamento
    ) {
        return `${pagamento.tipo} - ${pagamento.bandeira}`;
    }


    function formatarNumeroCartao(
        valor
    ) {
        return valor
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(
                /(\d{4})(?=\d)/g,
                "$1 "
            );
    }


    function formatarValidade(
        valor
    ) {
        const numeros =
            valor
                .replace(/\D/g, "")
                .slice(0, 4);

        if (
            numeros.length <= 2
        ) {
            return numeros;
        }

        return (
            numeros.slice(0, 2) +
            "/" +
            numeros.slice(2)
        );
    }


    async function finalizarPedido(
        dados
    ) {
        setErroPedido("");
        setEnviandoPedido(true);

        try {
            if (!usuario?.id) {
                throw new Error(
                    "É necessário estar logado para finalizar a compra."
                );
            }


            if (
                !carrinho ||
                carrinho.length === 0
            ) {
                throw new Error(
                    "Seu carrinho está vazio."
                );
            }


            let formaPagamentoId =
                null;

            let formaPagamentoNome =
                "";


            /*
             * PIX
             */
            if (
                dados.formaPagamento ===
                "pix"
            ) {
                formaPagamentoNome =
                    "Pix";
            }


            /*
             * CARTÃO SALVO
             */
            if (
                dados.formaPagamento ===
                "cartao-salvo"
            ) {
                const pagamento =
                    formasPagamento.find(
                        (
                            item
                        ) =>
                            String(
                                item.id
                            ) ===
                            String(
                                dados.pagamentoSalvo
                            )
                    );


                if (!pagamento) {
                    throw new Error(
                        "Selecione um cartão salvo."
                    );
                }


                formaPagamentoId =
                    pagamento.id;

                formaPagamentoNome =
                    formatarPagamento(
                        pagamento
                    );
            }


            /*
             * NOVO CARTÃO
             */
            if (
                dados.formaPagamento ===
                    "cartao-credito" ||
                dados.formaPagamento ===
                    "cartao-debito"
            ) {
                const numeroLimpo =
                    dados.numeroCartao.replace(
                        /\D/g,
                        ""
                    );


                const ultimosDigitos =
                    numeroLimpo.slice(-4);


                const tipo =
                    dados.formaPagamento ===
                    "cartao-credito"
                        ? "Cartão de crédito"
                        : "Cartão de débito";


                formaPagamentoNome =
                    `${tipo} - ${dados.bandeiraCartao}`;


                /*
                 * Só salva o cartão se
                 * o cliente marcar a opção.
                 *
                 * O número completo e o CVV
                 * nunca são armazenados.
                 */
                if (
                    dados.salvarCartao
                ) {
                    const novoPagamento =
                        await criarFormaPagamento({
                            usuarioId:
                                usuario.id,

                            tipo,

                            bandeira:
                                dados.bandeiraCartao,

                            ultimosDigitos,

                            nomeCartao:
                                dados.nomeCartao
                        });


                    formaPagamentoId =
                        novoPagamento.id;
                }
            }


            /*
             * Cria o pedido.
             */
            const pedido =
                await criarPedido({
                    usuarioId:
                        usuario.id,

                    data:
                        new Date().toISOString(),

                    valorTotal:
                        total,

                    status:
                        "Em análise",

                    formaPagamentoId,

                    formaPagamento:
                        formaPagamentoNome
                });


            /*
             * Cria os itens do pedido.
             */
            for (
                const produto
                of carrinho
            ) {
                await criarItemPedido({
                    pedidoId:
                        pedido.id,

                    produtoId:
                        produto.id,

                    quantidade:
                        produto.quantidade,

                    precoUnitario:
                        Number(
                            produto.preco
                        )
                });
            }


            /*
             * Limpa o carrinho somente
             * depois de tudo ter sido criado.
             */
            limparCarrinho();


            /*
             * Vai para o acompanhamento
             * do pedido.
             */
            navigate(
                `/pedidos/${pedido.id}`
            );

        } catch (erro) {
            console.error(
                "Erro ao finalizar pedido:",
                erro
            );

            setErroPedido(
                erro.message ||
                "Não foi possível finalizar o pedido."
            );

        } finally {
            setEnviandoPedido(false);
        }
    }


    /*
     * Carrinho vazio.
     */
    if (
        carrinho.length === 0
    ) {
        return (
            <>
                <Header />

                <main className="container py-5">

                    <div className="text-center py-5">

                        <i className="bi bi-cart-x display-4"></i>

                        <h1 className="mt-3">
                            Seu carrinho está vazio
                        </h1>

                        <p className="text-muted">
                            Adicione produtos ao
                            carrinho antes de
                            finalizar seu pedido.
                        </p>

                        <Link
                            to="/produtos"
                            className="btn btn-dark mt-3"
                        >
                            Ver produtos
                        </Link>

                    </div>

                </main>

                <Footer />
            </>
        );
    }


    return (
        <>
            <Header />

            <main className="container py-5">

                <div className="mb-5">

                    <p className="text-uppercase small text-muted mb-2">
                        Adornatta
                    </p>

                    <h1>
                        Finalizar pedido
                    </h1>

                    <p className="text-muted">
                        Confira seus dados e
                        escolha a forma de
                        pagamento.
                    </p>

                </div>


                {
                    erroPedido && (
                        <div
                            className="alert alert-danger"
                            role="alert"
                        >
                            {erroPedido}
                        </div>
                    )
                }


                <form
                    onSubmit={
                        handleSubmit(
                            finalizarPedido
                        )
                    }
                >

                    <div className="row g-4">


                        {/* DADOS DO CLIENTE */}

                        <div className="col-lg-7">

                            <section className="mb-5">

                                <h2 className="h4 mb-4">
                                    Dados para entrega
                                </h2>


                                <div className="row g-3">


                                    <div className="col-12">

                                        <label
                                            htmlFor="nome"
                                            className="form-label"
                                        >
                                            Nome completo
                                        </label>

                                        <input
                                            id="nome"
                                            type="text"
                                            className={`form-control ${
                                                errors.nome
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "nome"
                                            )}
                                        />

                                        {
                                            errors.nome && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.nome.message
                                                    }
                                                </div>
                                            )
                                        }

                                    </div>


                                    <div className="col-md-6">

                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            E-mail
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            className={`form-control ${
                                                errors.email
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "email"
                                            )}
                                        />

                                        {
                                            errors.email && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.email.message
                                                    }
                                                </div>
                                            )
                                        }

                                    </div>


                                    <div className="col-md-6">

                                        <label
                                            htmlFor="telefone"
                                            className="form-label"
                                        >
                                            Telefone
                                        </label>

                                        <input
                                            id="telefone"
                                            type="tel"
                                            className={`form-control ${
                                                errors.telefone
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "telefone"
                                            )}
                                        />

                                        {
                                            errors.telefone && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.telefone.message
                                                    }
                                                </div>
                                            )
                                        }

                                    </div>


                                    <div className="col-12">

                                        <label
                                            htmlFor="endereco"
                                            className="form-label"
                                        >
                                            Endereço
                                        </label>

                                        <input
                                            id="endereco"
                                            type="text"
                                            className={`form-control ${
                                                errors.endereco
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "endereco"
                                            )}
                                        />

                                        {
                                            errors.endereco && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.endereco.message
                                                    }
                                                </div>
                                            )
                                        }

                                    </div>


                                    <div className="col-md-5">

                                        <label
                                            htmlFor="cidade"
                                            className="form-label"
                                        >
                                            Cidade
                                        </label>

                                        <input
                                            id="cidade"
                                            type="text"
                                            className={`form-control ${
                                                errors.cidade
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "cidade"
                                            )}
                                        />

                                        {
                                            errors.cidade && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.cidade.message
                                                    }
                                                </div>
                                            )
                                        }

                                    </div>


                                    <div className="col-md-3">

                                        <label
                                            htmlFor="estado"
                                            className="form-label"
                                        >
                                            Estado
                                        </label>

                                        <input
                                            id="estado"
                                            type="text"
                                            maxLength="2"
                                            className={`form-control ${
                                                errors.estado
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "estado"
                                            )}
                                        />

                                        {
                                            errors.estado && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.estado.message
                                                    }
                                                </div>
                                            )
                                        }

                                    </div>


                                    <div className="col-md-4">

                                        <label
                                            htmlFor="cep"
                                            className="form-label"
                                        >
                                            CEP
                                        </label>

                                        <input
                                            id="cep"
                                            type="text"
                                            className={`form-control ${
                                                errors.cep
                                                    ? "is-invalid"
                                                    : ""
                                            }`}
                                            {...register(
                                                "cep"
                                            )}
                                        />

                                        {
                                            errors.cep && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.cep.message
                                                    }
                                                </div>
                                            )
                                        }

                                    </div>

                                </div>

                            </section>


                            {/* PAGAMENTO */}

                            <section>

                                <h2 className="h4 mb-4">
                                    Forma de pagamento
                                </h2>


                                {/* PIX */}

                                <label className="checkout-payment-option mb-3">

                                    <input
                                        type="radio"
                                        value="pix"
                                        {...register(
                                            "formaPagamento"
                                        )}
                                    />

                                    <span>

                                        <strong>
                                            Pix
                                        </strong>

                                        <small>
                                            Pagamento
                                            instantâneo
                                        </small>

                                    </span>

                                </label>


                                {/* CARTÃO SALVO */}

                                {
                                    formasPagamento.length >
                                        0 && (
                                        <div className="mb-3">

                                            <label className="checkout-payment-option">

                                                <input
                                                    type="radio"
                                                    value="cartao-salvo"
                                                    {...register(
                                                        "formaPagamento"
                                                    )}
                                                />

                                                <span>

                                                    <strong>
                                                        Usar cartão salvo
                                                    </strong>

                                                    <small>
                                                        Utilize um
                                                        cartão já
                                                        cadastrado
                                                    </small>

                                                </span>

                                            </label>


                                            {
                                                formaPagamento ===
                                                    "cartao-salvo" && (
                                                    <div className="mt-2">

                                                        <label
                                                            htmlFor="pagamentoSalvo"
                                                            className="form-label"
                                                        >
                                                            Selecione o cartão
                                                        </label>

                                                        <select
                                                            id="pagamentoSalvo"
                                                            className={`form-select ${
                                                                errors.pagamentoSalvo
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            {...register(
                                                                "pagamentoSalvo"
                                                            )}
                                                        >

                                                            <option value="">
                                                                Selecione
                                                            </option>

                                                            {
                                                                formasPagamento.map(
                                                                    (
                                                                        pagamento
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                pagamento.id
                                                                            }
                                                                            value={
                                                                                pagamento.id
                                                                            }
                                                                        >
                                                                            {
                                                                                formatarPagamento(
                                                                                    pagamento
                                                                                )
                                                                            }
                                                                            {" - "}
                                                                            ****
                                                                            {" "}
                                                                            {
                                                                                pagamento.ultimosDigitos
                                                                            }
                                                                        </option>
                                                                    )
                                                                )
                                                            }

                                                        </select>

                                                        {
                                                            errors.pagamentoSalvo && (
                                                                <div className="invalid-feedback">
                                                                    {
                                                                        errors.pagamentoSalvo.message
                                                                    }
                                                                </div>
                                                            )
                                                        }

                                                    </div>
                                                )
                                            }

                                        </div>
                                    )
                                }


                                {/* CARTÃO DE CRÉDITO */}

                                <label className="checkout-payment-option mb-3">

                                    <input
                                        type="radio"
                                        value="cartao-credito"
                                        {...register(
                                            "formaPagamento"
                                        )}
                                    />

                                    <span>

                                        <strong>
                                            Cartão de crédito
                                        </strong>

                                        <small>
                                            Pague com cartão
                                            de crédito
                                        </small>

                                    </span>

                                </label>


                                {/* CARTÃO DE DÉBITO */}

                                <label className="checkout-payment-option mb-3">

                                    <input
                                        type="radio"
                                        value="cartao-debito"
                                        {...register(
                                            "formaPagamento"
                                        )}
                                    />

                                    <span>

                                        <strong>
                                            Cartão de débito
                                        </strong>

                                        <small>
                                            Pague com cartão
                                            de débito
                                        </small>

                                    </span>

                                </label>


                                {/* FORMULÁRIO DO NOVO CARTÃO */}

                                {
                                    (
                                        formaPagamento ===
                                            "cartao-credito" ||
                                        formaPagamento ===
                                            "cartao-debito"
                                    ) && (
                                        <div className="border rounded p-4 mt-3">

                                            <h3 className="h5 mb-4">
                                                Dados do cartão
                                            </h3>


                                            <div className="row g-3">


                                                <div className="col-12">

                                                    <label
                                                        htmlFor="numeroCartao"
                                                        className="form-label"
                                                    >
                                                        Número do cartão
                                                    </label>

                                                    <input
                                                        id="numeroCartao"
                                                        type="text"
                                                        inputMode="numeric"
                                                        autoComplete="cc-number"
                                                        placeholder="0000 0000 0000 0000"
                                                        className={`form-control ${
                                                            errors.numeroCartao
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        {...register(
                                                            "numeroCartao",
                                                            {
                                                                onChange:
                                                                    (
                                                                        evento
                                                                    ) => {
                                                                        const valor =
                                                                            formatarNumeroCartao(
                                                                                evento.target.value
                                                                            );

                                                                        setValue(
                                                                            "numeroCartao",
                                                                            valor,
                                                                            {
                                                                                shouldValidate:
                                                                                    true
                                                                            }
                                                                        );
                                                                    }
                                                            }
                                                        )}
                                                    />

                                                    {
                                                        errors.numeroCartao && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.numeroCartao.message
                                                                }
                                                            </div>
                                                        )
                                                    }

                                                </div>


                                                <div className="col-md-8">

                                                    <label
                                                        htmlFor="nomeCartao"
                                                        className="form-label"
                                                    >
                                                        Nome no cartão
                                                    </label>

                                                    <input
                                                        id="nomeCartao"
                                                        type="text"
                                                        autoComplete="cc-name"
                                                        placeholder="Nome como está no cartão"
                                                        className={`form-control ${
                                                            errors.nomeCartao
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        {...register(
                                                            "nomeCartao"
                                                        )}
                                                    />

                                                    {
                                                        errors.nomeCartao && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.nomeCartao.message
                                                                }
                                                            </div>
                                                        )
                                                    }

                                                </div>


                                                <div className="col-md-4">

                                                    <label
                                                        htmlFor="bandeiraCartao"
                                                        className="form-label"
                                                    >
                                                        Bandeira
                                                    </label>

                                                    <select
                                                        id="bandeiraCartao"
                                                        className={`form-select ${
                                                            errors.bandeiraCartao
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        {...register(
                                                            "bandeiraCartao"
                                                        )}
                                                    >

                                                        <option value="">
                                                            Selecione
                                                        </option>

                                                        <option value="Visa">
                                                            Visa
                                                        </option>

                                                        <option value="Mastercard">
                                                            Mastercard
                                                        </option>

                                                        <option value="Elo">
                                                            Elo
                                                        </option>

                                                        <option value="American Express">
                                                            American Express
                                                        </option>

                                                        <option value="Hipercard">
                                                            Hipercard
                                                        </option>

                                                    </select>

                                                    {
                                                        errors.bandeiraCartao && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.bandeiraCartao.message
                                                                }
                                                            </div>
                                                        )
                                                    }

                                                </div>


                                                <div className="col-md-6">

                                                    <label
                                                        htmlFor="validadeCartao"
                                                        className="form-label"
                                                    >
                                                        Validade
                                                    </label>

                                                    <input
                                                        id="validadeCartao"
                                                        type="text"
                                                        inputMode="numeric"
                                                        autoComplete="cc-exp"
                                                        placeholder="MM/AA"
                                                        className={`form-control ${
                                                            errors.validadeCartao
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        {...register(
                                                            "validadeCartao",
                                                            {
                                                                onChange:
                                                                    (
                                                                        evento
                                                                    ) => {
                                                                        const valor =
                                                                            formatarValidade(
                                                                                evento.target.value
                                                                            );

                                                                        setValue(
                                                                            "validadeCartao",
                                                                            valor,
                                                                            {
                                                                                shouldValidate:
                                                                                    true
                                                                            }
                                                                        );
                                                                    }
                                                            }
                                                        )}
                                                    />

                                                    {
                                                        errors.validadeCartao && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.validadeCartao.message
                                                                }
                                                            </div>
                                                        )
                                                    }

                                                </div>


                                                <div className="col-md-6">

                                                    <label
                                                        htmlFor="cvvCartao"
                                                        className="form-label"
                                                    >
                                                        CVV
                                                    </label>

                                                    <input
                                                        id="cvvCartao"
                                                        type="password"
                                                        inputMode="numeric"
                                                        autoComplete="cc-csc"
                                                        maxLength="4"
                                                        placeholder="123"
                                                        className={`form-control ${
                                                            errors.cvvCartao
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                        {...register(
                                                            "cvvCartao"
                                                        )}
                                                    />

                                                    {
                                                        errors.cvvCartao && (
                                                            <div className="invalid-feedback">
                                                                {
                                                                    errors.cvvCartao.message
                                                                }
                                                            </div>
                                                        )
                                                    }

                                                </div>


                                                <div className="col-12">

                                                    <div className="form-check">

                                                        <input
                                                            id="salvarCartao"
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            {...register(
                                                                "salvarCartao"
                                                            )}
                                                        />

                                                        <label
                                                            htmlFor="salvarCartao"
                                                            className="form-check-label"
                                                        >
                                                            Salvar este cartão
                                                            para próximas compras
                                                        </label>

                                                    </div>

                                                </div>

                                            </div>


                                            <div className="alert alert-light border mt-4 mb-0">

                                                <small>
                                                    <i className="bi bi-shield-check me-2"></i>

                                                    Para sua segurança,
                                                    não armazenamos o
                                                    número completo do
                                                    cartão nem o CVV.
                                                </small>

                                            </div>

                                        </div>
                                    )
                                }


                                {
                                    carregandoPagamentos && (
                                        <p className="text-muted small mt-3">
                                            Carregando cartões salvos...
                                        </p>
                                    )
                                }


                                {
                                    erroPagamentos && (
                                        <p className="text-danger small mt-3">
                                            Não foi possível carregar
                                            seus cartões salvos.
                                        </p>
                                    )
                                }


                                {
                                    formasPagamento.length === 0 &&
                                    !carregandoPagamentos && (
                                        <p className="text-muted small mt-3">
                                            Você ainda não possui
                                            cartões salvos.
                                        </p>
                                    )
                                }

                            </section>

                        </div>


                        {/* RESUMO DO PEDIDO */}

                        <div className="col-lg-5">

                            <aside className="border p-4">

                                <h2 className="h4 mb-4">
                                    Resumo do pedido
                                </h2>


                                {
                                    carrinho.map(
                                        (
                                            produto
                                        ) => (
                                            <div
                                                key={
                                                    produto.id
                                                }
                                                className="d-flex justify-content-between gap-3 mb-3"
                                            >

                                                <div>

                                                    <strong>
                                                        {
                                                            produto.nome
                                                        }
                                                    </strong>

                                                    <div className="text-muted small">
                                                        Quantidade:
                                                        {" "}
                                                        {
                                                            produto.quantidade
                                                        }
                                                    </div>

                                                </div>


                                                <span>
                                                    {
                                                        formatarPreco(
                                                            Number(
                                                                produto.preco
                                                            ) *
                                                            Number(
                                                                produto.quantidade
                                                            )
                                                        )
                                                    }
                                                </span>

                                            </div>
                                        )
                                    )
                                }


                                <hr />


                                <div className="d-flex justify-content-between align-items-center">

                                    <strong>
                                        Total
                                    </strong>

                                    <strong className="fs-5">
                                        {
                                            formatarPreco(
                                                total
                                            )
                                        }
                                    </strong>

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-dark w-100 mt-4"
                                    disabled={
                                        enviandoPedido
                                    }
                                >

                                    {
                                        enviandoPedido
                                            ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        aria-hidden="true"
                                                    ></span>

                                                    Processando...
                                                </>
                                            )
                                            : "Confirmar pedido"
                                    }

                                </button>


                                <Link
                                    to="/produtos"
                                    className="btn btn-outline-secondary w-100 mt-2"
                                >
                                    Continuar comprando
                                </Link>


                                <p className="text-muted small mt-4 mb-0">
                                    Ao confirmar o pedido,
                                    seus dados serão utilizados
                                    para registrar a compra e
                                    permitir o acompanhamento
                                    do pedido.
                                </p>

                            </aside>

                        </div>

                    </div>

                </form>

            </main>

            <Footer />
        </>
    );
}


export default Checkout;