import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  //valor para verificação se é uma ação de verificação
  createAction = false
) {
  //buscar a ref para referenciar o user na criação da collection subscription
  const userRef = await fauna.query(
    //o Select é usado para buscar apenas a informação desejada da collection no DB
    q.Select("ref", q.Get(q.Match(q.Index("user_by_customer_id"), customerId)))
  );

  //o stripe envia apenas o ID da subscription via webhook, devemos buscar mais detalhes
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  //dados escolhidos para serem armazenados sobre a subscription
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  };

  if (createAction) {
    await fauna.query(
      q.If(
        q.Not(
          //se o user não existir cria
          q.Exists(q.Match(q.Index("subscription_by_userId"), userRef))
        ),
        q.Create(
          //criando dados
          q.Collection("subscription"),
          { data: subscriptionData }
        ),
        q.Replace(
          q.Select(
            "ref",
            q.Get(q.Match(q.Index("subscription_by_userId"), userRef))
          ),
          {
            data: subscriptionData,
          }
        )
      )
    );
  } else {
    await fauna.query(
      //o replace diferente do update que atualiza um ou alguns dados, o replace substitui todos
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
        ),
        {
          data: subscriptionData,
        }
      )
    );
  }
}
