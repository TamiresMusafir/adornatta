import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import Hero from "./Hero";
import Categories from "./Categories";
import Products from "./Products";
import Highlight from "./Highlight";
import About from "./About";
import Services from "./Services";

function Home() {
    return (
        <>
            <Header />

            <main>
                <Hero />
                <Categories />
                <Products />
                <Highlight />
                <About />
                <Services />
            </main>

            <Footer />
        </>
    );
}

export default Home;