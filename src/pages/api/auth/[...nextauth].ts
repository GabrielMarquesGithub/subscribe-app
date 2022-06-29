import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

//import do banco de dados
import { fauna } from "../../../services/fauna";
//import para criação de query do faunaDB
import { query as q } from "faunadb";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  //funções de callback do next auth executam sobre algum evento
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_userId"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    //essa função de callback executa quando ocorrer um signIn
    async signIn({ user, account, profile, email, credentials }) {
      try {
        await fauna.query(
          //realizando uma condicional no fauna
          q.If(
            q.Not(
              //se o user não existir cria
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),
            q.Create(q.Collection("users"), { data: user }),
            //se existir retorna os dados
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
          )
        );
        //adição do try para se caso ocorrer um erro ao registrar o user na DB retornará false e ele não será autenticado
        return true;
      } catch {
        return false;
      }
    },
  },
});
