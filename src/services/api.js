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

async function buscarUsuarios() {
    const resposta = await fetch(`${API_URL}/usuarios`);

    if (!resposta.ok) {
        throw new Error(
            "Não foi possível carregar os usuários."
        );
    }

    return resposta.json();
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

async function atualizarProduto(id, produto) {
    const resposta = await fetch(`${API_URL}/produtos/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    });

    if (!resposta.ok) {
        throw new Error("Não foi possível atualizar o produto.");
    }

    return resposta.json();
}

async function criarProduto(produto) {
    const resposta = await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    });

    if (!resposta.ok) {
        throw new Error("Não foi possível cadastrar o produto.");
    }

    return resposta.json();
}

async function excluirProduto(id) {
    const resposta = await fetch(`${API_URL}/produtos/${id}`, {
        method: "DELETE"
    });

    if (!resposta.ok) {
        throw new Error("Não foi possível excluir o produto.");
    }

    return true;
}

async function criarUsuario(usuario) {
    const resposta = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });

    if (!resposta.ok) {
        throw new Error("Não foi possível criar a conta.");
    }

    return resposta.json();
}

async function buscarPedidos() {
    const resposta = await fetch(`${API_URL}/pedidos`);

    if (!resposta.ok) {
        throw new Error(
            "Não foi possível carregar os pedidos."
        );
    }

    return resposta.json();
}

async function atualizarPedido(id, dados) {
    const resposta = await fetch(
        `${API_URL}/pedidos/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }
    );

    if (!resposta.ok) {
        throw new Error(
            "Não foi possível atualizar o pedido."
        );
    }

    return resposta.json();
}

async function buscarVendas() {
    const resposta = await fetch(
        `${API_URL}/vendas`
    );

    if (!resposta.ok) {
        throw new Error(
            "Não foi possível carregar as vendas."
        );
    }

    return resposta.json();
}


async function criarVenda(venda) {
    const resposta = await fetch(
        `${API_URL}/vendas`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(venda)
        }
    );

    if (!resposta.ok) {
        throw new Error(
            "Não foi possível registrar a venda."
        );
    }

    return resposta.json();
}

export {
    buscarProdutos,
    buscarProdutoPorId,
    buscarCategorias,
    criarPedido,
    criarItemPedido,
    buscarPedidoPorId,
    buscarItensPedido,
    buscarUsuario,
    buscarUsuarios,
    criarUsuario,
    atualizarProduto,
    criarProduto,
    excluirProduto,
    buscarPedidos,
    atualizarPedido,
    buscarVendas,
    criarVenda
};