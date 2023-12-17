import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "react-quill/dist/quill.snow.css";

const App = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default App;
