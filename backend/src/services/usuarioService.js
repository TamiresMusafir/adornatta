
const bcrypt = require('bcrypt');
const { pool } = require('../database/connection');
const { validarCepExistente } = require('./cepService');

function formatarUsuario(usuario) {
    const telefones = usuario.telefones || [];

    return {
        id: String(usuario.idusuario),
        nome: usuario.nome,
        cpf: usuario.cpf,
        perfil: usuario.perfil === 'administrador' ? 'admin' : usuario.perfil,
        email: usuario.email,
        telefone: telefones[0] || '',
        telefones,
        endereco: usuario.endereco || null,
    };
}

function criarErro(mensagem, statusCode = 400) {
    const erro = new Error(mensagem);
    erro.statusCode = statusCode;
    return erro;
}

async function rollback(client) {
    try {
        await client.query('ROLLBACK');
    } catch (error) {
        console.error('Erro ao desfazer transação do usuário:', error);
    }
}

function validarIdUsuario(id) {
    if (
        !['number', 'string'].includes(typeof id) ||
        (typeof id === 'string' && !/^[0-9]+$/.test(id))
    ) {
        throw criarErro('Identificador de usuário inválido.');
    }

    const idusuario = Number(id);
    if (!Number.isSafeInteger(idusuario) || idusuario < 1) {
        throw criarErro('Identificador de usuário inválido.');
    }

    return idusuario;
}

function normalizarTelefones(telefones) {
    if (!Array.isArray(telefones)) {
        throw criarErro('Lista de telefones inválida.');
    }

    const resultado = telefones.map((telefone) => {
        if (typeof telefone !== 'string') {
            throw criarErro('Telefone inválido.');
        }

        const numero = telefone.replace(/[\s().-]/g, '');
        if (!/^\+?[0-9]{10,15}$/.test(numero)) {
            throw criarErro(`Telefone inválido: ${telefone}`);
        }

        return numero.replace(/^\+/, '');
    });

    if (new Set(resultado).size !== resultado.length) {
        throw criarErro('Não é permitido cadastrar telefones repetidos.');
    }

    return resultado;
}

function validarEndereco(endereco) {
    if (!endereco || typeof endereco !== 'object' || Array.isArray(endereco)) {
        throw criarErro('Endereço inválido.');
    }

    const ufInformada = endereco.uf || endereco.estado;
    if (
        typeof endereco.logradouro !== 'string' ||
        typeof endereco.numero !== 'string' ||
        typeof endereco.bairro !== 'string' ||
        typeof endereco.cidade !== 'string' ||
        typeof ufInformada !== 'string' ||
        typeof endereco.cep !== 'string' ||
        (
            endereco.complemento !== undefined &&
            endereco.complemento !== null &&
            typeof endereco.complemento !== 'string'
        )
    ) {
        throw criarErro('Endereço inválido.');
    }

    const uf = ufInformada.trim().toUpperCase();
    const cep = endereco.cep.trim().replace('-', '');
    const resultado = {
        logradouro: String(endereco.logradouro || '').trim(),
        numero: String(endereco.numero || '').trim(),
        complemento: endereco.complemento
            ? String(endereco.complemento).trim()
            : null,
        bairro: String(endereco.bairro || '').trim(),
        cidade: String(endereco.cidade || '').trim(),
        uf,
        cep,
    };

    if (
        !resultado.logradouro ||
        resultado.logradouro.length > 100 ||
        !resultado.numero ||
        resultado.numero.length > 10 ||
        (resultado.complemento && resultado.complemento.length > 50) ||
        !resultado.bairro ||
        resultado.bairro.length > 60 ||
        !resultado.cidade ||
        resultado.cidade.length > 60 ||
        !/^[A-Z]{2}$/.test(uf) ||
        !/^\d{5}-?\d{3}$/.test(endereco.cep.trim())
    ) {
        throw criarErro('Endereço inválido ou fora dos limites permitidos.');
    }

    return resultado;
}

const consultaUsuario = `
    SELECT u.idusuario, u.nome, u.cpf, u.perfil, u.email,
           COALESCE(t.telefones, '[]'::json) AS telefones,
           e.endereco
    FROM usuario u
    LEFT JOIN LATERAL (
        SELECT json_agg(tu.numero ORDER BY tu.numero) AS telefones
        FROM telefone_usuario tu
        WHERE tu.idusuario = u.idusuario
    ) t ON TRUE
    LEFT JOIN LATERAL (
        SELECT json_build_object(
            'cep', eu.cep,
            'logradouro', eu.logradouro,
            'numero', eu.numero,
            'complemento', eu.complemento,
            'bairro', eu.bairro,
            'cidade', eu.cidade,
            'uf', eu.uf,
            'estado', eu.uf
        ) AS endereco
        FROM endereco_usuario eu
        WHERE eu.idusuario = u.idusuario
        ORDER BY eu.idendereco DESC
        LIMIT 1
    ) e ON TRUE
`;

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
        senha.length < 6 ||
        Buffer.byteLength(senha, 'utf8') > 72
    ) {
        const erro = new Error(
            'A senha deve ter ao menos 6 caracteres e no máximo 72 bytes.'
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

    const telefonesLimpos = normalizarTelefones(telefones);

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

        return formatarUsuario({
            ...usuario,
            telefones: telefonesLimpos,
        });

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

async function autenticarUsuario(dados) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        const erro = new Error('Dados de autenticação inválidos.');
        erro.statusCode = 400;
        throw erro;
    }

    const { email, senha } = dados;

    if (
        typeof email !== 'string' ||
        !email.trim() ||
        email.trim().length > 254 ||
        typeof senha !== 'string' ||
        senha.length === 0
    ) {
        const erro = new Error('E-mail e senha são obrigatórios.');
        erro.statusCode = 400;
        throw erro;
    }

    const emailNormalizado = email.trim().toLowerCase();
    const resultado = await pool.query(
        `SELECT idusuario, nome, cpf, perfil, email, senha
         FROM usuario
         WHERE LOWER(email) = $1
         LIMIT 1`,
        [emailNormalizado]
    );

    const usuario = resultado.rows[0];

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return null;
    }

    const resultadoTelefones = await pool.query(
        `SELECT COALESCE(
            json_agg(numero ORDER BY numero),
            '[]'::json
         ) AS telefones
         FROM telefone_usuario
         WHERE idusuario = $1`,
        [usuario.idusuario]
    );

    return formatarUsuario({
        ...usuario,
        telefones: resultadoTelefones.rows[0].telefones,
    });
}

async function buscarUsuarioPorId(id) {
    const idusuario = validarIdUsuario(id);
    const resultado = await pool.query(
        `${consultaUsuario} WHERE u.idusuario = $1`,
        [idusuario]
    );

    return resultado.rows[0] ? formatarUsuario(resultado.rows[0]) : null;
}

async function listarUsuarios() {
    const resultado = await pool.query(
        `${consultaUsuario} ORDER BY u.nome, u.idusuario`
    );

    return resultado.rows.map(formatarUsuario);
}

async function atualizarUsuario(id, dados) {
    const idusuario = validarIdUsuario(id);
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw criarErro('Dados do usuário inválidos.');
    }

    const permitidos = ['nome', 'cpf', 'email', 'telefone', 'telefones', 'endereco'];
    if (!Object.keys(dados).some((chave) => permitidos.includes(chave))) {
        throw criarErro('Nenhum campo permitido foi informado.');
    }

    const enderecoValidado = dados.endereco === undefined
        ? null
        : validarEndereco(dados.endereco);
    if (enderecoValidado) {
        await validarCepExistente(enderecoValidado.cep);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const atual = await client.query(
            `SELECT idusuario, nome, cpf, perfil, email
             FROM usuario
             WHERE idusuario = $1
             FOR UPDATE`,
            [idusuario]
        );
        if (!atual.rows[0]) {
            await client.query('ROLLBACK');
            return null;
        }

        const usuario = atual.rows[0];
        if (dados.nome !== undefined && typeof dados.nome !== 'string') {
            throw criarErro('Nome inválido.');
        }
        if (dados.email !== undefined && typeof dados.email !== 'string') {
            throw criarErro('E-mail inválido.');
        }
        if (dados.cpf !== undefined && typeof dados.cpf !== 'string') {
            throw criarErro('CPF inválido.');
        }

        const nome = dados.nome === undefined ? usuario.nome : dados.nome.trim();
        const cpf = dados.cpf === undefined
            ? usuario.cpf
            : dados.cpf.replace(/\D/g, '');
        const email = dados.email === undefined
            ? usuario.email
            : dados.email.trim().toLowerCase();

        if (typeof nome !== 'string' || !nome || nome.length > 40) {
            throw criarErro('Nome inválido ou maior que 40 caracteres.');
        }
        if (!/^[0-9]{11}$/.test(cpf)) {
            throw criarErro('CPF deve possuir 11 dígitos.');
        }
        if (
            typeof email !== 'string' ||
            email.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            throw criarErro('E-mail inválido.');
        }

        await client.query(
            `UPDATE usuario
             SET nome = $1, cpf = $2, email = $3
             WHERE idusuario = $4`,
            [nome, cpf, email, idusuario]
        );

        let telefones = null;
        if (dados.telefones !== undefined) {
            telefones = normalizarTelefones(dados.telefones);
        } else if (dados.telefone !== undefined) {
            if (typeof dados.telefone !== 'string') {
                throw criarErro('Telefone inválido.');
            }
            telefones = dados.telefone.trim()
                ? normalizarTelefones([dados.telefone])
                : [];
        }

        if (telefones) {
            await client.query(
                'DELETE FROM telefone_usuario WHERE idusuario = $1',
                [idusuario]
            );
            for (const telefone of telefones) {
                await client.query(
                    `INSERT INTO telefone_usuario (idusuario, numero)
                     VALUES ($1, $2)`,
                    [idusuario, telefone]
                );
            }
        }

        if (dados.endereco !== undefined) {
            const endereco = enderecoValidado;
            const enderecoExistente = await client.query(
                `SELECT idendereco
                 FROM endereco_usuario
                 WHERE idusuario = $1
                 ORDER BY idendereco DESC
                 LIMIT 1
                 FOR UPDATE`,
                [idusuario]
            );

            if (enderecoExistente.rows[0]) {
                await client.query(
                    `UPDATE endereco_usuario
                     SET logradouro = $1, numero = $2, complemento = $3,
                         bairro = $4, cidade = $5, uf = $6, cep = $7
                     WHERE idendereco = $8`,
                    [
                        endereco.logradouro,
                        endereco.numero,
                        endereco.complemento,
                        endereco.bairro,
                        endereco.cidade,
                        endereco.uf,
                        endereco.cep,
                        enderecoExistente.rows[0].idendereco,
                    ]
                );
            } else {
                await client.query(
                    `INSERT INTO endereco_usuario
                        (idusuario, logradouro, numero, complemento,
                         bairro, cidade, uf, cep)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        idusuario,
                        endereco.logradouro,
                        endereco.numero,
                        endereco.complemento,
                        endereco.bairro,
                        endereco.cidade,
                        endereco.uf,
                        endereco.cep,
                    ]
                );
            }
        }
        await client.query('COMMIT');
        await client.query('COMMIT');
    } catch (error) {
        await rollback(client);
        if (error.code === '23505') {
            if (error.constraint === 'usuario_cpf_key') {
                throw criarErro('CPF já cadastrado.', 409);
            }
            if (error.constraint === 'usuario_email_key') {
                throw criarErro('E-mail já cadastrado.', 409);
            }
        }
        throw error;
    } finally {
        client.release();
    }

    return buscarUsuarioPorId(idusuario);
}

module.exports = {
    cadastrarUsuario,
    autenticarUsuario,
    buscarUsuarioPorId,
    listarUsuarios,
    atualizarUsuario,
};
