import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import { apiStrapi } from "../../services/api";

import style from "./post.module.scss";

interface PostProps {
  post: {
    id: string;
    date: string;
    title: string;
    content: string;
  };
}

export default function Post({ post }: PostProps) {
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
          <ReactMarkdown className={style.content}>
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
}

//foi escolhido o SSR e detrimento do SSG pois o SSG permitiria acesso mesmo sem o usuários atender os requisitos de acesso
export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  console.log(session);

  //será executado se o user não tiver uma seção ativa
  if (!session.activeSubscription) {
    //no método getServerSideProps para redirecionar um user basta não retornar props e sim um redirect
    return {
      //argumento para redirecionar o cliente
      redirect: {
        //destino do redirecionamento
        destination: "/",
        //não é algo permanente se o usuário logar conseguira vim a pagina isso também dis ao buscador que a pagina não é só algo indefinido
        permanent: false,
      },
    };
  }

  const response = await apiStrapi.get(`/posts/${params.id}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });

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
    content: response.data.data.attributes.content,
  };

  return {
    props: {
      post,
    },
  };
};
