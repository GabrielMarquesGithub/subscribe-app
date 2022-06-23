import Document, { Html, Main, Head, NextScript } from "next/document";

//o ideal e não adição de css no Document e sim no app

//no document estou usando class por ser mais 'seguro'
export default class MyDocument extends Document {
  render() {
    //algumas tags como DOCTYPE e metas já são adicionadas por padrão pelo Next
    //NextScript é onde o next colocara o JS necessário para a execução de tudo
    return (
      <Html lang="pt-BR">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />

          <link rel="shortcut icon" href="favicon.svg" type="image/x-icon" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
