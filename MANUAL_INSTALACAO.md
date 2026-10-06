# Manual de Instalação 

## 1. Sobre o projeto

A **Loja Virtual Adornatta** é uma aplicação web desenvolvida com React
para a comercialização de semijoias. O projeto possui uma área de loja
para os clientes e uma área administrativa para gerenciamento dos
produtos, estoque, pedidos e vendas.

A aplicação utiliza um backend simulado com **json-server**, permitindo
que os dados sejam armazenados no arquivo `db.json` durante o
desenvolvimento.

## 2. Pré-requisitos

Para instalar e executar o projeto, é necessário ter instalado:

-   Git;
-   Node.js;
-   npm.

Recomenda-se utilizar uma versão recente e estável do Node.js.

## 3. Clonar o projeto

Clone o repositório utilizando a branch principal:

``` bash
git clone -b main https://github.com/TamiresMusafir/adornatta
```

Depois, entre na pasta do projeto:

``` bash
cd front-end-2
```

## 4. Instalar as dependências

Com o terminal aberto na pasta do projeto, execute:

``` bash
npm install
```

O comando instala as dependências definidas no `package.json`.

Entre as principais tecnologias e bibliotecas utilizadas estão:

-   **React** --- construção da interface da aplicação;
-   **React DOM** --- integração do React com o DOM;
-   **React Router DOM** --- gerenciamento das rotas;
-   **Vite** --- ambiente de desenvolvimento e build da aplicação;
-   **Bootstrap** --- estrutura responsiva e componentes visuais;
-   **Bootstrap Icons** --- ícones utilizados na interface;
-   **TanStack Query** --- gerenciamento das consultas e mutações de
    dados;
-   **React Hook Form** --- gerenciamento dos formulários;
-   **Zod** --- validação dos dados dos formulários;
-   **@hookform/resolvers** --- integração entre React Hook Form e Zod;
-   **json-server** --- backend simulado para desenvolvimento.

O projeto utiliza `json-server` na versão `1.0.0-beta.15`.

## 5. Configuração do banco de dados

Os dados iniciais da aplicação ficam no arquivo:

``` text
db.json
```

Esse arquivo contém as coleções utilizadas pela aplicação, incluindo:

-   `categorias`;
-   `produtos`;
-   `pedidos`;
-   `itensPedido`;
-   `usuarios`;
-   `vendas`.

O arquivo deve permanecer na raiz do projeto.

## 6. Inicialização do backend

O projeto possui um servidor personalizado para executar o json-server
por meio do arquivo:

``` text
server.js
```

Em um terminal, na pasta do projeto, execute:

``` bash
npm run server
```

O backend ficará disponível em:

``` text
http://localhost:3000
```

## 7. Inicialização do frontend

Abra um segundo terminal na pasta do projeto e execute:

``` bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente:

``` text
http://localhost:5173
```

Acesse esse endereço pelo navegador.

## 8. Execução completa

Para utilizar a aplicação corretamente durante o desenvolvimento, os
dois processos devem permanecer em execução:

**Terminal 1 --- backend:**

``` bash
npm run server
```

**Terminal 2 --- frontend:**

``` bash
npm run dev
```

O frontend realiza as requisições para o backend em
`http://localhost:3000`.

## 9. Estrutura principal

A aplicação está organizada, entre outras, nas seguintes áreas:

``` text
src/
├── components/
├── context/
├── pages/
│   ├── Home/
│   ├── Sobre/
│   ├── Produtos/
│   ├── ProdutoDetalhes/
│   ├── ListaDesejo/
│   ├── Checkout/
│   ├── Contato/
│   ├── AcompanharPedido/
│   ├── Login/
│   ├── Cadastro/
│   └── Admin/
│       ├── Dashboard/
│       ├── Estoque/
│       ├── Pedidos/
│       └── Vendas/
├── schemas/
├── services/
└── styles/
```

## 10. Encerramento

Depois de instalar as dependências e iniciar o backend e o frontend, a
aplicação estará pronta para uso em ambiente de desenvolvimento.

As instruções de funcionamento da aplicação estão disponíveis no [Manual
de Operação](MANUAL_OPERACAO.md), enquanto as funcionalidades destinadas
aos usuários estão descritas no [Manual do Usuário](MANUAL_USUARIO.md).
