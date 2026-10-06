import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import { CartProvider } from "./context/CartContext";

import {
    WishlistProvider
} from "./context/WishlistContext";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import ProtectedRoute
    from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import Sobre from "./pages/Sobre/Sobre";
import Produtos from "./pages/Produtos/Produtos";
import ProdutoDetalhes
    from "./pages/ProdutoDetalhes/ProdutoDetalhes";
import ListaDesejo
    from "./pages/ListaDesejo/ListaDesejo";
import Checkout
    from "./pages/Checkout/Checkout";
import Contato
    from "./pages/Contato/Contato";
import AcompanharPedido
    from "./pages/AcompanharPedido/AcompanharPedido";

import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import MinhaConta from "./pages/MinhaConta/MinhaConta";

import Dashboard
    from "./pages/Admin/Dashboard/Dashboard";
import Estoque
    from "./pages/Admin/Estoque/Estoque";
import Pedidos
    from "./pages/Admin/Pedidos/Pedidos";
import Vendas
    from "./pages/Admin/Vendas/Vendas";

function App() {
    return (
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    <BrowserRouter>

                        <ScrollToTop />

                        <Routes>

                            {/* =========================
                                LOJA
                            ========================= */}

                            <Route
                                path="/"
                                element={<Home />}
                            />

                            <Route
                                path="/sobre"
                                element={<Sobre />}
                            />

                            <Route
                                path="/produtos"
                                element={<Produtos />}
                            />

                            <Route
                                path="/produtos/:id"
                                element={
                                    <ProdutoDetalhes />
                                }
                            />

                            <Route
                                path="/listaDesejo"
                                element={
                                    <ListaDesejo />
                                }
                            />

                            <Route
                                path="/contato"
                                element={<Contato />}
                            />

                            {/* =========================
                                PEDIDOS
                            ========================= */}

                            <Route
                                path="/pedidos/:id"
                                element={
                                    <AcompanharPedido />
                                }
                            />

                            {/* =========================
                                AUTENTICAÇÃO
                            ========================= */}

                            <Route
                                path="/login"
                                element={<Login />}
                            />

                            <Route
                                path="/cadastro"
                                element={<Cadastro />}
                            />

                            {/* =========================
                                ÁREA DO CLIENTE
                            ========================= */}

                            <Route
                                path="/minha-conta"
                                element={
                                    <ProtectedRoute>
                                        <MinhaConta />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/checkout"
                                element={
                                    <ProtectedRoute>
                                        <Checkout />
                                    </ProtectedRoute>
                                }
                            />

                            {/* =========================
                                ÁREA ADMINISTRATIVA
                            ========================= */}

                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute admin>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/estoque"
                                element={
                                    <ProtectedRoute admin>
                                        <Estoque />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/pedidos"
                                element={
                                    <ProtectedRoute admin>
                                        <Pedidos />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/vendas"
                                element={
                                    <ProtectedRoute admin>
                                        <Vendas />
                                    </ProtectedRoute>
                                }
                            />

                        </Routes>

                    </BrowserRouter>
                </CartProvider>
            </WishlistProvider>
        </AuthProvider>
    );
}

export default App;