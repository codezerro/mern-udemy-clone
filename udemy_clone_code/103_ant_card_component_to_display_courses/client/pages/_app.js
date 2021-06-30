import { Provider } from "../context";
import NProgress from "nprogress";
import Router from "next/router";
import { ToastContainer } from "react-toastify";
import TopNav from "../components/nav/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
// import "antd/dist/antd.dark.css";
import "react-toastify/dist/ReactToastify.css";
import "../public/css/styles.css";
import "../public/css/ant-dark.css";
import "nprogress/nprogress.css";
import Footer from "../components/nav/Footer";
import ScrollToTop from "react-scroll-up";
import { UpCircleOutlined } from "@ant-design/icons";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <TopNav />
      <ToastContainer position="top-center" />
      <Component {...pageProps} />
      <Footer />
      <ScrollToTop showUnder={160}>
        <UpCircleOutlined className="h2" />
      </ScrollToTop>
    </Provider>
  );
}

export default MyApp;
