import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { SubscribeButton } from "../components/subscribeButton";

//import para utilizar API do stripe
import { stripe } from "../services/stripe";

import manIcon from "../../public/images/man.svg";

import style from "./home.module.scss";

interface IHomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

//props vem do 'getServerSideProps'
export default function Home({ product }: IHomeProps) {
  return (
    <>
      <Head>
        <title>Home | BestArticle</title>
      </Head>
      <main className={style["content-container"]}>
        <section className={style.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>
            News about the <br />
            <span>Technology</span> world.
          </h1>
          <p>
            Get access to all the publication <br />
            <span>{product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <span className={style.imgFather}>
          <Image
            src={manIcon}
            alt="Man coding"
            layout="responsive"
            priority={true}
          />
        </span>
      </main>
    </>
  );
}
//função para obtenção de props do lado do servidor
//essas funções são executadas na camada do Next e não no Browser
//essa função é algo padrão deve sempre ter esse nome e sempre ser 'async'
export const getStaticProps: GetStaticProps = async () => {
  //buscando no stripe por preço, o método 'retrieve' indica a busca por um único elemento
  const price = await stripe.prices.retrieve(
    "price_1LDpsEHRduut5G5eX8utq4va",
    // o elemento foi identificado com id do price, usando o expand é possível receber as demais informações do produto
    //com o expand ia ser possível buscar nome, img e outras informações para utilizar sobre o produto
    { expand: ["product"] }
  );

  const product = {
    priceId: price.id,
    //correção o preço está em centavos
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    //ao se usar SSG deve passar o tempo para ocorrer um atualização sobre o HTML
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
