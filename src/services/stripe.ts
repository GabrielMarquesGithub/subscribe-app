import Stripe from "stripe";
//import do package.json
import { version } from "../../package.json";

//instanciando Stripe
//como primeiro parâmetro deve ser passada a key salva no .env
export const stripe = new Stripe(
  process.env.STRIPE_API_KEY,

  //agora devem ser passadas informações obrigatórias
  {
    //versão da API
    apiVersion: "2020-08-27",
    //recebe informações
    appInfo: {
      //o nome da aplicação para no Dashboard do stripe sabermos a aplicação que esta requisitando a API
      name: "BestArticle",
      //passando a versão do package
      version: version,
    },
  }
);
