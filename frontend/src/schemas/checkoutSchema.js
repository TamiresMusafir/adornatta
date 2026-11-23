import { z } from "zod";

const checkoutSchema = z.object({
    nome: z.string().min(3, "Informe seu nome completo."),
    email: z.string().email("Informe um e-mail válido."),
    telefone: z
        .string()
        .refine(
            (telefone) => {
                const digitos = telefone.replace(/\D/g, "");
                return digitos.length >= 10 && digitos.length <= 15;
            },
            "Informe um telefone válido."
        ),
    endereco: z.string().min(3, "Informe o logradouro."),
    numero: z.string().min(1, "Informe o número do endereço."),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Informe seu bairro."),
    cidade: z.string().min(2, "Informe sua cidade."),
    estado: z.string().regex(/^[A-Za-z]{2}$/, "Informe a UF com duas letras."),
    cep: z
        .string()
        .regex(/^\d{5}-?\d{3}$/, "Informe um CEP válido.")
});

export default checkoutSchema;
