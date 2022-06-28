import { AppProps } from "next/app";
import { Header } from "../components/header";

import { SessionProvider as NextAuthProvider } from "next-auth/react";

import "../styles/global.scss";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      {/* Para o Header ser exposto em todas as paginas basta adiciona-lo ao App */}
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default MyApp;
