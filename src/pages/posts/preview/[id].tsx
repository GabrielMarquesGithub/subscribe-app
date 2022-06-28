import { GetStaticProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
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

//para o preview é ideal utilizar o getStaticProps já que é uma pagina publica
export const getStaticProps: GetStaticProps = async ({ params }) => {
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
