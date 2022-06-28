import { Client } from "faunadb";

export const fauna = new Client({
  //ligando o DB a aplicação com a key dentro do env
  secret: process.env.FAUNADB_KEY,
});
