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
    if (response.status !== 204) {
        const contentType = response.headers.get("content-type") || "";
        data = contentType.includes("application/json")
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