import { z } from "zod";

const checkoutSchema = z
    .object({
        nome: z
            .string()
            .min(
                3,
                "Informe seu nome completo."
            ),

        email: z
            .string()
            .email(
                "Informe um e-mail válido."
            ),

        telefone: z
            .string()
            .min(
                8,
                "Informe um telefone válido."
            ),

        endereco: z
            .string()
            .min(
                3,
                "Informe seu endereço."
            ),

        cidade: z
            .string()
            .min(
                2,
                "Informe sua cidade."
            ),

        estado: z
            .string()
            .min(
                2,
                "Informe seu estado."
            ),

        cep: z
            .string()
            .min(
                8,
                "Informe um CEP válido."
            ),

        formaPagamento: z
            .string()
            .min(
                1,
                "Selecione uma forma de pagamento."
            ),

        numeroCartao: z
            .string()
            .optional(),

        nomeCartao: z
            .string()
            .optional(),

        validadeCartao: z
            .string()
            .optional(),

        cvvCartao: z
            .string()
            .optional(),

        bandeiraCartao: z
            .string()
            .optional(),

        salvarCartao: z
            .boolean()
            .optional()
    })
    .superRefine(
        (dados, contexto) => {

            const usandoCartaoNovo =
                dados.formaPagamento ===
                    "cartao-credito" ||
                dados.formaPagamento ===
                    "cartao-debito";

            if (!usandoCartaoNovo) {
                return;
            }

            if (
                !dados.numeroCartao ||
                dados.numeroCartao.replace(
                    /\s/g,
                    ""
                ).length < 13
            ) {
                contexto.addIssue({
                    code: "custom",
                    path: [
                        "numeroCartao"
                    ],
                    message:
                        "Informe um número de cartão válido."
                });
            }

            if (
                !dados.nomeCartao ||
                dados.nomeCartao.trim().length < 3
            ) {
                contexto.addIssue({
                    code: "custom",
                    path: [
                        "nomeCartao"
                    ],
                    message:
                        "Informe o nome impresso no cartão."
                });
            }

            if (
                !dados.validadeCartao ||
                !/^\d{2}\/\d{2}$/.test(
                    dados.validadeCartao
                )
            ) {
                contexto.addIssue({
                    code: "custom",
                    path: [
                        "validadeCartao"
                    ],
                    message:
                        "Informe a validade no formato MM/AA."
                });
            }

            if (
                !dados.cvvCartao ||
                !/^\d{3,4}$/.test(
                    dados.cvvCartao
                )
            ) {
                contexto.addIssue({
                    code: "custom",
                    path: [
                        "cvvCartao"
                    ],
                    message:
                        "Informe um CVV válido."
                });
            }

            if (!dados.bandeiraCartao) {
                contexto.addIssue({
                    code: "custom",
                    path: [
                        "bandeiraCartao"
                    ],
                    message:
                        "Selecione a bandeira do cartão."
                });
            }
        }
    );

export default checkoutSchema;