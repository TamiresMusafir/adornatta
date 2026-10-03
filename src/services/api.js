const API_URL = "http://localhost:3000";

async function buscarProdutos() {
    const resposta = await fetch(`${API_URL}/produtos`);

    if (!resposta.ok) {
        throw new Error("Não foi possível carregar os produtos.");
    }

    return resposta.json();
}

async function buscarProdutoPorId(id) {
    const resposta = await fetch(`${API_URL}/produtos/${id}`);

    if (resposta.status === 404) {
        return null;
    }

    if (!resposta.ok) {
        throw new Error("Não foi possível carregar o produto.");
    }

    return resposta.json();
}

async function buscarCategorias() {
    const resposta = await fetch(`${API_URL}/categorias`);

    if (!resposta.ok) {
        throw new Error("Não foi possível carregar as categorias.");
    }

    return resposta.json();
}

async function buscarUsuario(email, senha) {
    const resposta = await fetch(`${API_URL}/usuarios`);

    if (!resposta.ok) {
        throw new Error("Não foi possível realizar o login.");
    }

    const usuarios = await resposta.json();

    const usuarioEncontrado = usuarios.find(
        (usuario) =>
            usuario.email === email &&
            usuario.senha === senha
    );

    return usuarioEncontrado || null;
}

async function criarPedido(pedido) {
    const resposta = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    });

    if (!resposta.ok) {
        throw new Error("Não foi possível criar o pedido.");
    }

    return resposta.json();
}

async function criarItemPedido(itemPedido) {
    const resposta = await fetch(`${API_URL}/itensPedido`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(itemPedido)
    });

    if (!resposta.ok) {
        throw new Error("Não foi possível adicionar o item ao pedido.");
    }

    return resposta.json();
}

async function buscarPedidoPorId(id) {
    const resposta = await fetch(`${API_URL}/pedidos/${id}`);

    if (resposta.status === 404) {
        return null;
    }

    if (!resposta.ok) {
        throw new Error("Não foi possível carregar o pedido.");
    }

    return resposta.json();
}

async function buscarItensPedido(pedidoId) {
    const resposta = await fetch(
        `${API_URL}/itensPedido?pedidoId=${pedidoId}`
    );

    if (!resposta.ok) {
        throw new Error("Não foi possível carregar os itens do pedido.");
    }

    return resposta.json();
}

export {
    buscarProdutos,
    buscarProdutoPorId,
    buscarCategorias,
    buscarUsuario,
    criarPedido,
    criarItemPedido,
    buscarPedidoPorId,
    buscarItensPedido
};