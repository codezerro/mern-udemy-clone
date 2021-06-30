import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";

import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Navbar />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
