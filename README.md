# [Subscribe-App](https://best-article.vercel.app/)
É um aplicativo focado no desenvolvimento de um Front-End para um site de assinatura mensal. O projeto tem como base a biblioteca React em seu framework Next com a implementação do TypeScript para a estilização foi utilizado o SASS
### Deploy
* O app recebeu deploy na Vercel com algumas limitações de funcionalidades: https://best-article.vercel.app/
* O back end montado com o template do Strapi recebeu deploy no Heroku

### Ferramentas 
Para a criação de funcionalidades do projeto foram utilizadas ferramentas disponibilizadas por terceiros em sua maioria APIs sendo elas
* **Stripe** - para o sistema de pagamentos 
* **FaunaDB** - como database
* **Strapi** - como CMS para a criação e alocação de posts
* **NextAuth** - para realização de autenticações 
#### Home do site
![imagem da home do projeto](https://github.com/NikisGabriel/Subscribe-App/blob/main/public/1.png)
#### Pagina de posts
![imagem da pagina de posts](https://github.com/NikisGabriel/Subscribe-App/blob/main/public/2.png)
#### Paginas responsivas

<img src="https://github.com/NikisGabriel/Subscribe-App/blob/main/public/1%20res.png" width="33%"></img>
<img src="https://github.com/NikisGabriel/Subscribe-App/blob/main/public/2%20res.png" width="33%"></img>
<img src="https://github.com/NikisGabriel/Subscribe-App/blob/main/public/3%20res.png" width="33%"></img>

#### Pagina de um post
![imagem de uma pagina de post](https://github.com/NikisGabriel/Subscribe-App/blob/main/public/3.png)
##### Observações 
Em seu deploy as funcionalidades referentes a integração com Stripe foram limitadas impossibilitando a liberação de posts a uma conta inscrita, isso se deve a necessidades da utilização de chaves para produção no Stripe e a necessidade da criação de um back-end  mais complexo para utilização dos Webhooks em produção algo que não está no escopo do projeto  
