import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Home from "./pages/Home/Home";
import Sobre from "./pages/Sobre/Sobre";
import Produtos from "./pages/Produtos/Produtos";
import ProdutoDetalhes from "./pages/ProdutoDetalhes/ProdutoDetalhes";
import ListaDesejo from "./pages/ListaDesejo/ListaDesejo";
import Checkout from "./pages/Checkout/Checkout";
import Contato from "./pages/Contato/Contato";
import AcompanharPedido from "./pages/AcompanharPedido/AcompanharPedido";

function App() {
    return (
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
                            element={<ProdutoDetalhes />}
                        />

                        <Route
                            path="/listaDesejo"
                            element={<ListaDesejo />}
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
                            element={<AcompanharPedido />}
                        />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </WishlistProvider>
    );
}

export default App;