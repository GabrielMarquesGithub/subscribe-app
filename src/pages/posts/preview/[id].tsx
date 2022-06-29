import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { apiStrapi } from "../../../services/api";

import style from "../post.module.scss";

interface PostPreviewProps {
  post: {
    id: string;
    date: string;
    title: string;
    content: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.id}`);
    }
  }, [session, router, post.id]);

  return (
    <>
      <Head>
        <title>{post.title} | BestArticle</title>
      </Head>
      <main className={style.container}>
        <article className={style.post}>
          <h1>{post.title}</h1>
          <time>{post.date}</time>
          {/*ReactMarkdown para interpretar Markdown*/}
          <ReactMarkdown className={`${style.content} ${style.previewContent}`}>
            {post.content}
          </ReactMarkdown>
          <div className={style.continueReading}>
            Wanna continue reading?
            <Link href={"/"}>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
//essa é uma funcionalidade disponível apenas em paginas dinâmicas, possibilita a escolha de paginas preferenciais para carregamento durante a build
export const getStaticPaths: GetStaticPaths = () => {
  return {
    //o path recebe o array da paginas que devem se carregadas junto ao identificador da pagina como slug ou id
    //se for passado um array vazia todas as paginas serão carregadas
    paths: [{ params: { id: "1" } }],
    //o fallback apresenta opções para o load das demais paginas
    //fallback true fará o load das outras paginas ainda não carregadas pelo lado do cliente
    //fallback false é para quando já foram carregadas todas as paginas, e se o cliente tentar acessar outra não carregada recebera um erro 404 bad request
    //o fallback blocking fará o load da pagina com SSR
    fallback: "blocking",
  };
};
//para o preview é ideal utilizar o getStaticProps já que é uma pagina publica
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await apiStrapi.get(`/posts/${params.id}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });

  const paragraph = response.data.data.attributes.content.split(".");

  const post = {
    id: response.data.data.id,
    date: new Date(
      response.data.data.attributes.publishedAt
    ).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    title: response.data.data.attributes.title,
    content: paragraph[0] + paragraph[1],
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24, // 1 dia
  };
};
