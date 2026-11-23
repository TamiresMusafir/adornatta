import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useLocation,
    useNavigate
} from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { buscarUsuarios } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const cadastroSchema = z
    .object({
        nome: z
            .string()
            .min(3, "Informe seu nome completo."),

        email: z
            .string()
            .email("Informe um e-mail válido."),

        senha: z
            .string()
            .min(
                6,
                "A senha deve ter pelo menos 6 caracteres."
            ),

        confirmarSenha: z
            .string()
            .min(
                1,
                "Confirme sua senha."
            )
    })
    .refine(
        (dados) =>
            dados.senha === dados.confirmarSenha,
        {
            message: "As senhas não coincidem.",
            path: ["confirmarSenha"]
        }
    );

function Cadastro() {
    const navigate = useNavigate();
    const location = useLocation();

    const { registrar } = useAuth();

    const [erroCadastro, setErroCadastro] =
        useState("");

    const [cadastrando, setCadastrando] =
        useState(false);

    const rotaAnterior =
        location.state?.from || null;

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(cadastroSchema),

        defaultValues: {
            nome: "",
            email: "",
            senha: "",
            confirmarSenha: ""
        }
    });

    async function realizarCadastro(dados) {
        setCadastrando(true);
        setErroCadastro("");

        try {
            const usuarios = await buscarUsuarios();

            const emailJaCadastrado =
                usuarios.some(
                    (usuario) =>
                        usuario.email.toLowerCase() ===
                        dados.email.toLowerCase()
                );

            if (emailJaCadastrado) {
                setErroCadastro(
                    "Este e-mail já está cadastrado."
                );

                return;
            }

            await registrar({
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha
            });

            /*
             * Se o cadastro começou a partir de
             * uma rota protegida, retorna para ela.
             *
             * Caso contrário, vai para a página inicial.
             */
            if (rotaAnterior?.pathname) {
                const busca =
                    rotaAnterior.search || "";

                const hash =
                    rotaAnterior.hash || "";

                navigate(
                    `${rotaAnterior.pathname}${busca}${hash}`,
                    {
                        replace: true
                    }
                );

                return;
            }

            navigate("/", {
                replace: true
            });
        } catch (erro) {
            setErroCadastro(
                erro.message ||
                    "Não foi possível criar sua conta."
            );
        } finally {
            setCadastrando(false);
        }
    }

    function irParaLogin() {
        navigate("/login", {
            state: {
                from: rotaAnterior
            }
        });
    }

    return (
        <>
            <Header />

            <main className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-sm-10 col-md-7 col-lg-5">
                        <div className="border bg-white p-4 p-md-5">
                            <div className="text-center mb-4">
                                <div className="section-label mb-2">
                                    Nova conta
                                </div>

                                <i className="bi bi-person-plus display-5"></i>

                                <h1 className="display-font mt-3 mb-2">
                                    Criar conta
                                </h1>

                                <p className="text-muted mb-0">
                                    Cadastre-se para
                                    acompanhar seus
                                    pedidos e facilitar
                                    suas compras.
                                </p>
                            </div>

                            {erroCadastro && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {erroCadastro}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit(
                                    realizarCadastro
                                )}
                            >
                                <div className="mb-3">
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

                                    {errors.nome && (
                                        <div className="invalid-feedback">
                                            {
                                                errors
                                                    .nome
                                                    .message
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
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

                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {
                                                errors
                                                    .email
                                                    .message
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="senha"
                                        className="form-label"
                                    >
                                        Senha
                                    </label>

                                    <input
                                        id="senha"
                                        type="password"
                                        className={`form-control ${
                                            errors.senha
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register(
                                            "senha"
                                        )}
                                    />

                                    {errors.senha && (
                                        <div className="invalid-feedback">
                                            {
                                                errors
                                                    .senha
                                                    .message
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="confirmarSenha"
                                        className="form-label"
                                    >
                                        Confirmar senha
                                    </label>

                                    <input
                                        id="confirmarSenha"
                                        type="password"
                                        className={`form-control ${
                                            errors.confirmarSenha
                                                ? "is-invalid"
                                                : ""
                                        }`}
                                        {...register(
                                            "confirmarSenha"
                                        )}
                                    />

                                    {errors.confirmarSenha && (
                                        <div className="invalid-feedback">
                                            {
                                                errors
                                                    .confirmarSenha
                                                    .message
                                            }
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100"
                                    disabled={
                                        cadastrando
                                    }
                                >
                                    {cadastrando
                                        ? "Criando conta..."
                                        : "Criar conta"}
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <span className="text-muted">
                                    Já possui uma conta?
                                </span>{" "}

                                <button
                                    type="button"
                                    className="btn btn-link p-0"
                                    onClick={
                                        irParaLogin
                                    }
                                >
                                    Entrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Cadastro;