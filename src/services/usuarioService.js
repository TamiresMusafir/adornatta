
const bcrypt = require('bcrypt');
const { pool } = require('../database/connection');

// =====================================================
// CADASTRAR USUARIO
// =====================================================

async function cadastrarUsuario(dados) {

    // -------------------------------------------------
    // 1. Validar estrutura dos dados recebidos
    // -------------------------------------------------

    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        const erro = new Error('Dados do usuário inválidos.');
        erro.statusCode = 400;
        throw erro;
    }

    const {
        nome,
        cpf,
        email,
        senha,
        telefones,
    } = dados;

    // -------------------------------------------------
    // 2. Validar campos obrigatórios
    // -------------------------------------------------

    if (!nome || !cpf || !email || !senha) {
        const erro = new Error(
            'Nome, CPF, e-mail e senha são obrigatórios.'
        );
        erro.statusCode = 400;
        throw erro;
    }

    // Validar nome
    if (
        typeof nome !== 'string' ||
        !nome.trim() ||
        nome.trim().length > 40
    ) {
        const erro = new Error(
            'Nome inválido ou maior que 40 caracteres.'
        );
        erro.statusCode = 400;
        throw erro;
    }

    // Validar CPF
    if (typeof cpf !== 'string') {
        const erro = new Error('CPF inválido.');
        erro.statusCode = 400;
        throw erro;
    }

    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
        const erro = new Error('CPF deve possuir 11 dígitos.');
        erro.statusCode = 400;
        throw erro;
    }

    // Validar e-mail
    if (typeof email !== 'string') {
        const erro = new Error('E-mail inválido.');
        erro.statusCode = 400;
        throw erro;
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (
        emailNormalizado.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)
    ) {
        const erro = new Error('E-mail inválido.');
        erro.statusCode = 400;
        throw erro;
    }

    // Validar senha
    if (
        typeof senha !== 'string' ||
        senha.length === 0 ||
        Buffer.byteLength(senha, 'utf8') > 72
    ) {
        const erro = new Error(
            'Senha inválida. O limite para bcrypt é de 72 bytes.'
        );
        erro.statusCode = 400;
        throw erro;
    }

    // -------------------------------------------------
    // 3. Validar lista de telefones
    // -------------------------------------------------

    if (!Array.isArray(telefones) || telefones.length === 0) {
        const erro = new Error(
            'É obrigatório informar pelo menos um telefone.'
        );
        erro.statusCode = 400;
        throw erro;
    }

    // -------------------------------------------------
    // 4. Validar e normalizar telefones
    // -------------------------------------------------

    const telefonesLimpos = telefones.map((telefone) => {

        if (typeof telefone !== 'string') {
            const erro = new Error('Telefone inválido.');
            erro.statusCode = 400;
            throw erro;
        }

        const numero = telefone.replace(/[\s().-]/g, '');

        if (!/^\+?[0-9]{10,15}$/.test(numero)) {
            const erro = new Error(
                `Telefone inválido: ${telefone}`
            );
            erro.statusCode = 400;
            throw erro;
        }

        // Armazena somente os dígitos
        return numero.replace(/^\+/, '');

    });

    // Verificar telefones repetidos no mesmo cadastro
    if (new Set(telefonesLimpos).size !== telefonesLimpos.length) {
        const erro = new Error(
            'Não é permitido cadastrar telefones repetidos.'
        );
        erro.statusCode = 400;
        throw erro;
    }

    // -------------------------------------------------
    // 5. Gerar hash da senha
    // -------------------------------------------------

    const senhaHash = await bcrypt.hash(senha, 12);

    // -------------------------------------------------
    // 6. Iniciar transação com PostgreSQL
    // -------------------------------------------------

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        // Inserir usuário
        const resultadoUsuario = await client.query(
            `INSERT INTO usuario
                (nome, cpf, perfil, email, senha)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING idusuario, nome, cpf, perfil, email`,
            [
                nome.trim(),
                cpfLimpo,
                'cliente',
                emailNormalizado,
                senhaHash,
            ]
        );

        const usuario = resultadoUsuario.rows[0];

        // Inserir telefones do usuário
        for (const telefone of telefonesLimpos) {

            await client.query(
                `INSERT INTO telefone_usuario
                    (idusuario, numero)
                 VALUES ($1, $2)`,
                [usuario.idusuario, telefone]
            );

        }

        // Confirmar transação
        await client.query('COMMIT');

        return {
            ...usuario,
            telefones: telefonesLimpos,
        };

    } catch (error) {

        // Desfazer operações em caso de falha
        try {
            await client.query('ROLLBACK');
        } catch (erroRollback) {
            console.error('Erro ao executar ROLLBACK:', erroRollback);
        }

        // Identificar CPF ou e-mail duplicado
        if (error.code === '23505') {

            if (error.constraint === 'usuario_cpf_key') {
                const erro = new Error('CPF já cadastrado.');
                erro.statusCode = 409;
                throw erro;
            }

            if (error.constraint === 'usuario_email_key') {
                const erro = new Error('E-mail já cadastrado.');
                erro.statusCode = 409;
                throw erro;
            }

        }

        throw error;

    } finally {

        // Liberar conexão para reutilização
        client.release();

    }
}

module.exports = {
    cadastrarUsuario,
};
