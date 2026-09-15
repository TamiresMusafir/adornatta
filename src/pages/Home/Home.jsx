import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import Hero from "./Hero";
import Categories from "./Categories";

function Home() {
    return (
        <>
            <Header />

            <main>
                <Hero />
                <Categories />
            </main>

            <Footer />
        </>
    );
}

export default Home;