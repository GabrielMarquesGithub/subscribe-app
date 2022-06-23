import { AppProps } from "next/app";
import { Header } from "../components/header";

import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Para o Header ser expost em todas as paginas basta adiciona-lo ao App */}
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
