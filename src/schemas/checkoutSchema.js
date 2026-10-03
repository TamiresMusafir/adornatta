import { z } from "zod";

const checkoutSchema = z.object({
    nome: z
        .string()
        .min(3, "Informe seu nome completo."),

    email: z
        .string()
        .email("Informe um e-mail válido."),

    telefone: z
        .string()
        .min(10, "Informe um telefone válido."),

    endereco: z
        .string()
        .min(5, "Informe seu endereço."),

    cidade: z
        .string()
        .min(2, "Informe sua cidade."),

    estado: z
        .string()
        .min(2, "Informe seu estado."),

    cep: z
        .string()
        .min(8, "Informe um CEP válido.")
});

export default checkoutSchema;