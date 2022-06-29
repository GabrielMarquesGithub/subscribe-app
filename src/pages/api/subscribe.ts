import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

const subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  //validando o método da chamada
  if (req.method === "POST") {
    //atribuindo a sessão so usuário cinda dos cookies
    const session = await getSession({ req });

    //buscando o user no DB pelo email retornado na session
    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    //definindo a let 'customerId' com o resultado retornado pela query
    let customerId = user.data.stripe_customer_id;

    //verificando o retorno do 'customerId'
    if (!customerId) {
      //se for falso outro será criado
      //construindo um customer do stripe
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      //e o customerId criado será atribuído por update ao DB
      await fauna.query(
        //update recebe a referencia de onde deve alterar, e o dado a ser inserido
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );
      //alterando o valor da let falsa para o customerId criado
      customerId = stripeCustomer.id;
    }

    //criando a sessão de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      //atribuindo o id do customer criado ou retornado pelo DB
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1LDpsEHRduut5G5eX8utq4va", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: "https://best-article.vercel.app/posts",
      cancel_url: "https://best-article.vercel.app/",
    });

    return res.status(200).json({ sessionId: checkoutSession.id });
  } else {
    //informando erro por método invalido
    res.setHeader("Allow", "POST");
    res.status(485).end("Method not allowed");
  }
};
export default subscribe;
