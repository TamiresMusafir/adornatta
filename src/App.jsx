import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Sobre from "./pages/Sobre/Sobre";
import Produtos from "./pages/Produtos/Produtos";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/produtos" element={<Produtos />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;