import Head from "next/head";
import Image from "next/image";
import { SubscribeButton } from "../components/subscribeButton";

import manIcon from "../../public/images/man.svg";

import style from "./home.module.scss";

export default function Home() {
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
            <span>$9.90 month</span>
          </p>
          <SubscribeButton />
        </section>
        <span className={style.imgFather}>
          <Image src={manIcon} alt="Man coding" layout="responsive" />
        </span>
      </main>
    </>
  );
}
