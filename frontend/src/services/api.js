const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

async function request(path, options = {}) {
    const {
        allowUnauthorized = false,
        ...fetchOptions
    } = options;
    const headers = new Headers(fetchOptions.headers);

    if (fetchOptions.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...fetchOptions,
        headers,
        credentials: "include"
    });

    if (response.status === 401 && allowUnauthorized) {
        return null;
    }

    let data = null;
    const contentType = response.headers.get("content-type") || "";
    const respostaJson = contentType.includes("application/json");
    if (response.status !== 204) {
        data = respostaJson
            ? await response.json()
            : await response.text();
    }

    if (!response.ok) {
        const error = new Error(
            data?.message || `A API respondeu com status ${response.status}.`
        );
        error.status = response.status;
        throw error;
    }

    // Toda resposta da API Adornatta (exceto 204) é JSON. Se chegou outra
    // coisa (ex.: uma página HTML), o VITE_API_URL aponta para o servidor
    // errado; o erro evita que a tela quebre ao tratar texto como lista.
    if (response.status !== 204 && !respostaJson) {
        throw new Error(
            `A API em ${API_URL} não respondeu em JSON. ` +
            "Confira se o backend está ligado e se VITE_API_URL aponta para ele."
        );
    }

    return data;
}

function enviar(path, method, data) {
    return request(path, {
        method,
        body: JSON.stringify(data)
    });
}

function buscarProdutos() {
    return request("/produtos");
}

async function buscarProdutoPorId(id) {
    try {
        return await request(`/produtos/${encodeURIComponent(id)}`);
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        throw error;
    }
}

function buscarCategorias() {
    return request("/categorias");
}

function loginUsuario(email, senha) {
    return enviar("/usuarios/login", "POST", { email, senha });
}

function buscarSessao() {
    return request("/usuarios/sessao", { allowUnauthorized: true });
}

function encerrarSessao() {
    return request("/usuarios/logout", { method: "POST" });
}

async function buscarUsuarioPorId(id) {
    try {
        return await request(`/usuarios/${encodeURIComponent(id)}`);
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        throw error;
    }
}

function buscarUsuarios() {
    return request("/usuarios");
}

function criarUsuario(usuario) {
    return enviar("/usuarios", "POST", usuario);
}

function atualizarUsuario(id, dados) {
    return enviar(`/usuarios/${encodeURIComponent(id)}`, "PATCH", dados);
}

function criarPedido(pedido) {
    return enviar("/pedidos", "POST", pedido);
}

function criarCheckout(pedidoId) {
    return enviar(
        `/pedidos/${encodeURIComponent(pedidoId)}/checkout`,
        "POST",
        {}
    );
}

function criarItemPedido(itemPedido) {
    return enviar("/itensPedido", "POST", itemPedido);
}

async function buscarPedidoPorId(id) {
    try {
        return await request(`/pedidos/${encodeURIComponent(id)}`);
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        throw error;
    }
}

function buscarPedidos() {
    return request("/pedidos");
}

function buscarPedidosPorUsuario(usuarioId) {
    return request(`/pedidos?usuarioId=${encodeURIComponent(usuarioId)}`);
}

function buscarItensPedido(pedidoId) {
    return request(`/itensPedido?pedidoId=${encodeURIComponent(pedidoId)}`);
}

function atualizarPedido(id, dados) {
    return enviar(`/pedidos/${encodeURIComponent(id)}`, "PATCH", dados);
}

function buscarFormasPagamentoPorUsuario(usuarioId) {
    return request(
        `/formasPagamento?usuarioId=${encodeURIComponent(usuarioId)}`
    );
}

function criarFormaPagamento(formaPagamento) {
    return enviar("/formasPagamento", "POST", formaPagamento);
}

function atualizarFormaPagamento(id, dados) {
    return enviar(
        `/formasPagamento/${encodeURIComponent(id)}`,
        "PATCH",
        dados
    );
}

async function excluirFormaPagamento(id) {
    await request(`/formasPagamento/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
    return true;
}

function atualizarProduto(id, produto) {
    return enviar(`/produtos/${encodeURIComponent(id)}`, "PATCH", produto);
}

function criarProduto(produto) {
    return enviar("/produtos", "POST", produto);
}

async function excluirProduto(id) {
    await request(`/produtos/${encodeURIComponent(id)}`, {
        method: "DELETE"
    });
    return true;
}

function buscarVendas() {
    return request("/vendas");
}

export {
    buscarProdutos,
    buscarProdutoPorId,
    buscarCategorias,

    loginUsuario,
    buscarSessao,
    encerrarSessao,
    buscarUsuarioPorId,
    buscarUsuarios,
    criarUsuario,
    atualizarUsuario,

    criarPedido,
    criarCheckout,
    criarItemPedido,
    buscarPedidoPorId,
    buscarPedidos,
    buscarPedidosPorUsuario,
    buscarItensPedido,
    atualizarPedido,

    buscarFormasPagamentoPorUsuario,
    criarFormaPagamento,
    atualizarFormaPagamento,
    excluirFormaPagamento,

    atualizarProduto,
    criarProduto,
    excluirProduto,

    buscarVendas,
};