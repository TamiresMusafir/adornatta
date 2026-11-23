const crypto = require('node:crypto');
const { pool } = require('../database/connection');

function criarErro(mensagem, statusCode = 400) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

function validarId(id, nome = 'Identificador') {
    if (
        !['number', 'string'].includes(typeof id) ||
        (typeof id === 'string' && !/^[0-9]+$/.test(id))
    ) {
        throw criarErro(`${nome} inválido.`);
    }

    const valor = Number(id);
    if (!Number.isSafeInteger(valor) || valor < 1) {
        throw criarErro(`${nome} inválido.`);
    }

    return valor;
}

function formatarFormaPagamento(forma) {
    return {
        id: String(forma.idformapagamento),
        usuarioId: String(forma.idusuario),
        tipo: forma.tipo,
        bandeira: forma.bandeira,
        ultimosDigitos: forma.ultimos_digitos,
        nomeCartao: forma.nome_titular,
    };
}

function validarCampos(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados da forma de pagamento inválidos.');
    }

    const tipo = dados.tipo;
    const bandeira = dados.bandeira || null;
    const ultimosDigitos = dados.ultimosDigitos || null;
    const nomeCartao = dados.nomeCartao || null;

    if (typeof tipo !== 'string' || !tipo.trim() || tipo.trim().length > 20) {
        throw criarErro('Tipo de pagamento inválido.');
    }
    if (
        bandeira !== null &&
        (typeof bandeira !== 'string' || bandeira.length > 20)
    ) {
        throw criarErro('Bandeira inválida.');
    }
    if (
        ultimosDigitos !== null &&
        !/^[0-9]{4}$/.test(String(ultimosDigitos))
    ) {
        throw criarErro('Informe somente os quatro últimos dígitos.');
    }
    if (
        nomeCartao !== null &&
        (typeof nomeCartao !== 'string' || nomeCartao.length > 40)
    ) {
        throw criarErro('Nome do titular inválido.');
    }

    return {
        tipo: tipo.trim(),
        bandeira,
        ultimosDigitos: ultimosDigitos
            ? String(ultimosDigitos)
            : null,
        nomeCartao,
    };
}

function obterUsuarioAlvo(usuarioAutenticado, usuarioId) {
    if (
        usuarioAutenticado.perfil !== 'administrador' &&
        usuarioId !== undefined &&
        Number(usuarioId) !== usuarioAutenticado.idusuario
    ) {
        throw criarErro('Você não tem permissão para acessar estes dados.', 403);
    }

    return usuarioAutenticado.perfil === 'administrador' &&
        usuarioId !== undefined
        ? validarId(usuarioId, 'Usuário')
        : usuarioAutenticado.idusuario;
}

async function listarFormasPagamento(usuarioAutenticado, usuarioId) {
    const idusuario = obterUsuarioAlvo(usuarioAutenticado, usuarioId);
    const resultado = await pool.query(
        `SELECT idformapagamento, idusuario, tipo, bandeira,
                ultimos_digitos, nome_titular
         FROM forma_pagamento_usuario
         WHERE idusuario = $1 AND ativo = TRUE
         ORDER BY data_cadastro DESC, idformapagamento DESC`,
        [idusuario]
    );

    return resultado.rows.map(formatarFormaPagamento);
}

async function criarFormaPagamento(dados, usuarioAutenticado) {
    const campos = validarCampos(dados);
    const idusuario = obterUsuarioAlvo(
        usuarioAutenticado,
        dados.usuarioId
    );
    const usuario = await pool.query(
        'SELECT idusuario FROM usuario WHERE idusuario = $1',
        [idusuario]
    );
    if (!usuario.rows[0]) {
        throw criarErro('Usuário não encontrado.', 404);
    }

    const resultado = await pool.query(
        `INSERT INTO forma_pagamento_usuario
            (idusuario, tipo, identificador, bandeira, ultimos_digitos,
             nome_titular, provedor)
         VALUES ($1, $2, $3, $4, $5, $6, 'local')
         RETURNING idformapagamento, idusuario, tipo, bandeira,
                   ultimos_digitos, nome_titular`,
        [
            idusuario,
            campos.tipo,
            crypto.randomUUID(),
            campos.bandeira,
            campos.ultimosDigitos,
            campos.nomeCartao,
        ]
    );

    return formatarFormaPagamento(resultado.rows[0]);
}

async function atualizarFormaPagamento(
    id,
    dados,
    usuarioAutenticado
) {
    const pagamentoId = validarId(id, 'Forma de pagamento');
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados da forma de pagamento inválidos.');
    }

    const parametrosBusca = [pagamentoId];
    let filtroUsuario = '';
    if (usuarioAutenticado.perfil !== 'administrador') {
        parametrosBusca.push(usuarioAutenticado.idusuario);
        filtroUsuario = 'AND idusuario = $2';
    }

    const existente = await pool.query(
        `SELECT tipo, bandeira, ultimos_digitos, nome_titular
         FROM forma_pagamento_usuario
         WHERE idformapagamento = $1 AND ativo = TRUE ${filtroUsuario}`,
        parametrosBusca
    );
    if (!existente.rows[0]) {
        return null;
    }

    const anterior = existente.rows[0];
    const campos = validarCampos({
        tipo: dados.tipo === undefined ? anterior.tipo : dados.tipo,
        bandeira: dados.bandeira === undefined
            ? anterior.bandeira
            : dados.bandeira,
        ultimosDigitos: dados.ultimosDigitos === undefined
            ? anterior.ultimos_digitos
            : dados.ultimosDigitos,
        nomeCartao: dados.nomeCartao === undefined
            ? anterior.nome_titular
            : dados.nomeCartao,
    });
    const valores = [
        campos.tipo,
        campos.bandeira,
        campos.ultimosDigitos,
        campos.nomeCartao,
        pagamentoId,
    ];
    filtroUsuario = '';

    if (usuarioAutenticado.perfil !== 'administrador') {
        valores.push(usuarioAutenticado.idusuario);
        filtroUsuario = 'AND idusuario = $6';
    }

    const resultado = await pool.query(
        `UPDATE forma_pagamento_usuario
         SET tipo = $1, bandeira = $2, ultimos_digitos = $3,
             nome_titular = $4
         WHERE idformapagamento = $5 AND ativo = TRUE ${filtroUsuario}
         RETURNING idformapagamento, idusuario, tipo, bandeira,
                   ultimos_digitos, nome_titular`,
        valores
    );

    return resultado.rows[0]
        ? formatarFormaPagamento(resultado.rows[0])
        : null;
}

async function excluirFormaPagamento(id, usuarioAutenticado) {
    const pagamentoId = validarId(id, 'Forma de pagamento');
    const valores = [pagamentoId];
    let filtroUsuario = '';

    if (usuarioAutenticado.perfil !== 'administrador') {
        valores.push(usuarioAutenticado.idusuario);
        filtroUsuario = 'AND idusuario = $2';
    }

    const resultado = await pool.query(
        `UPDATE forma_pagamento_usuario
         SET ativo = FALSE
         WHERE idformapagamento = $1 AND ativo = TRUE ${filtroUsuario}
         RETURNING idformapagamento`,
        valores
    );

    return resultado.rowCount > 0;
}

module.exports = {
    listarFormasPagamento,
    criarFormaPagamento,
    atualizarFormaPagamento,
    excluirFormaPagamento,
};
