import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { apiStrapi } from "../../services/api";

import style from "./style.module.scss";

interface Posts {
  id: string;
  date: string;
  publishedAt: string;
  title: string;
  excerpt: string;
}
interface PostsProps {
  posts: Posts[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Home | BestArticle</title>
      </Head>
      <main className={style.container}>
        <div className={style.posts}>
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/preview/${post.id}`}>
              <a>
                <time>{post.date}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  const response = await apiStrapi.get("/posts", {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });

  //criando um array de posts
  const posts = response.data.data.map((post) => {
    //validações sobre o paragrafo exibido
    const paragraphs = post.attributes.content.split(".");
    const paragraph =
      paragraphs[0].length > 100 ? paragraphs[0] : paragraphs[1];
    return {
      id: post.id,
      date: new Date(post.attributes.publishedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      title: post.attributes.title,
      excerpt: paragraph,
    };
  });

  return {
    props: {
      posts,
    },
    //ao se usar SSG deve passar o tempo para ocorrer um atualização sobre o HTML
    revalidate: 60 * 60, // 24 horas
  };
};
