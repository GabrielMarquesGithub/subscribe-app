import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { Stripe } from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/menageSubscription";

//basicamente uma função que irá ler dados passados por stream e ao final retornará dados em um formato convencional
async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

//definindo eventos importantes a serem escutados
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  //condicional para o método da requisição
  if (req.method === "POST") {
    //criação de um buffer com a requisição recebia como stream
    const buf = await buffer(req);

    //pegando o secret enviado pelo stripe no header para comparação
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      //construção do evento, que recebe o Buffer criado, o secret recebido e secret no env para confirmar a legitimidade da chamada
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }
    const { type } = event;

    if (relevantEvents.has(type.toString())) {
      try {
        //switch para tratar eventos diferentes
        switch (type) {
          //declarando todos em sequencia com um break vão cair na mesma logica
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              type === "customer.subscription.created"
            );

            break;

          case "checkout.session.completed":
            //tipando o evento especifico a ser trabalho nesse case, isso pois o tipo event do stripe é genérico
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            //passando para função criada na lib o necessário
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );

            break;
          default:
            //lançar um erro caso o evento não esteja presente no switch
            throw new Error("Unhandled event");
        }
      } catch (err) {
        //o erro não está sendo devolvido diretamente pois tal resposta seria dirigida ao stripe que ao receber um erro tentaria o reenvio novamente
        return res.json({ error: "Webhook handler filed" });
      }
    }
    // //status 200 desnecessário ao enviar json é algo redundante, pois o json ao ser retornado já envia um status 200
    return res.json({ receive: true });
  } else {
    //informando erro por método invalido
    res.setHeader("Allow", "POST");
    res.status(485).end("Method not allowed");
  }
};
export default webhook;
