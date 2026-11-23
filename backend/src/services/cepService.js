function criarErro(mensagem, statusCode) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

async function validarCepExistente(cep) {
    if (typeof cep !== 'string' || !/^\d{8}$/.test(cep)) {
        throw criarErro('CEP inválido.', 400);
    }

    let resposta;
    try {
        resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            { signal: AbortSignal.timeout(5000) }
        );
    } catch (error) {
        const falha = criarErro(
            'Não foi possível validar o CEP agora. Tente novamente.',
            503
        );
        falha.cause = error;
        throw falha;
    }

    if (!resposta.ok) {
        throw criarErro(
            'O serviço de validação de CEP está indisponível. Tente novamente.',
            503
        );
    }

    let endereco;
    try {
        endereco = await resposta.json();
    } catch (error) {
        const falha = criarErro(
            'O serviço de validação de CEP retornou uma resposta inválida.',
            503
        );
        falha.cause = error;
        throw falha;
    }

    if (endereco?.erro) {
        throw criarErro('CEP não encontrado.', 400);
    }

    if (
        !endereco ||
        typeof endereco.cep !== 'string' ||
        endereco.cep.replace(/\D/g, '') !== cep
    ) {
        throw criarErro(
            'O serviço de validação de CEP retornou uma resposta inválida.',
            503
        );
    }
}

module.exports = {
    validarCepExistente,
};
