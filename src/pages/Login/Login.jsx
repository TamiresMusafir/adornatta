import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
    email: z
        .string()
        .email("Informe um e-mail válido."),

    senha: z
        .string()
        .min(1, "Informe sua senha.")
});

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [erroLogin, setErroLogin] = useState("");
    const [entrando, setEntrando] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    async function realizarLogin(dados) {
        setEntrando(true);
        setErroLogin("");

        try {
            const sucesso = await login(
                dados.email,
                dados.senha
            );

            if (!sucesso) {
                setErroLogin(
                    "E-mail ou senha inválidos."
                );
                return;
            }

            navigate("/admin");
        } catch (erro) {
            setErroLogin(
                erro.message ||
                "Não foi possível realizar o login."
            );
        } finally {
            setEntrando(false);
        }
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
                                    Área administrativa
                                </div>

                                <i className="bi bi-person-circle display-5"></i>

                                <h1 className="display-font mt-3 mb-2">
                                    Acesso à loja
                                </h1>

                                <p className="text-muted mb-0">
                                    Entre para acessar o painel administrativo da Adornatta.
                                </p>
                            </div>

                            {erroLogin && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    {erroLogin}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit(
                                    realizarLogin
                                )}
                            >
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
                                        {...register("email")}
                                    />

                                    {errors.email && (
                                        <div className="invalid-feedback">
                                            {
                                                errors.email
                                                    .message
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
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
                                        {...register("senha")}
                                    />

                                    {errors.senha && (
                                        <div className="invalid-feedback">
                                            {
                                                errors.senha
                                                    .message
                                            }
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-dark w-100"
                                    disabled={entrando}
                                >
                                    {entrando
                                        ? "Entrando..."
                                        : "Entrar"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Login;