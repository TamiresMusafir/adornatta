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
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import Sobre from "./pages/Sobre/Sobre";
import Produtos from "./pages/Produtos/Produtos";
import ProdutoDetalhes from "./pages/ProdutoDetalhes/ProdutoDetalhes";
import ListaDesejo from "./pages/ListaDesejo/ListaDesejo";
import Checkout from "./pages/Checkout/Checkout";
import Contato from "./pages/Contato/Contato";
import AcompanharPedido from "./pages/AcompanharPedido/AcompanharPedido";

import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";

import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Estoque from "./pages/Admin/Estoque/Estoque";

function App() {
    return (
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    <BrowserRouter>
                        <ScrollToTop />

                        <Routes>
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
                                path="/checkout"
                                element={<Checkout />}
                            />

                            <Route
                                path="/contato"
                                element={<Contato />}
                            />

                            <Route
                                path="/pedidos/:id"
                                element={
                                    <AcompanharPedido />
                                }
                            />

                            <Route
                                path="/login"
                                element={<Login />}
                            />

                            <Route
                                path="/cadastro"
                                element={<Cadastro />}
                            />

                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/estoque"
                                element={
                                    <ProtectedRoute>
                                        <Estoque />
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