# Manual de Operação 

## 1. Objetivo

Este manual apresenta os procedimentos necessários para executar e
utilizar a aplicação Adornatta durante o desenvolvimento.

A aplicação é composta por:

-   frontend desenvolvido em React e executado pelo Vite;
-   backend simulado utilizando json-server;
-   banco de dados local armazenado em `db.json`.

## 2. Iniciar o backend

Abra um terminal na raiz do projeto e execute:

``` bash
npm run server
```

O servidor será iniciado em:

``` text
http://localhost:3000
```

O terminal deverá permanecer aberto enquanto a aplicação estiver sendo
utilizada.

## 3. Iniciar o frontend

Abra um segundo terminal na raiz do projeto e execute:

``` bash
npm run dev
```

O Vite informará o endereço da aplicação, normalmente:

``` text
http://localhost:5173
```

Abra esse endereço em um navegador.

## 4. Parar a aplicação

Para interromper qualquer um dos servidores, selecione o respectivo
terminal e pressione:

``` text
CTRL + C
```

Para utilizar novamente a aplicação, inicie o backend e o frontend
conforme as instruções anteriores.

## 5. Funcionamento dos dados

A comunicação entre a interface e o backend ocorre por meio de
requisições HTTP.

As principais operações realizadas pela aplicação incluem:

-   consulta de produtos;
-   consulta de categorias;
-   criação de pedidos;
-   criação dos itens dos pedidos;
-   consulta de pedidos;
-   atualização do status dos pedidos;
-   criação e consulta de usuários;
-   criação, alteração e exclusão de produtos;
-   atualização do estoque;
-   criação e consulta de vendas.

Os dados são armazenados no arquivo `db.json`.

## 6. Gerenciamento de estado e requisições

O projeto utiliza **TanStack Query** para realizar consultas e mutações
de dados e atualizar as informações apresentadas nas telas após
operações realizadas no backend.

Entre as operações que utilizam esse fluxo estão:

-   catálogo de produtos;
-   detalhes do produto;
-   acompanhamento de pedidos;
-   estoque;
-   pedidos administrativos;
-   vendas administrativas.

## 7. Formulários e validação

Os formulários utilizam:

-   **React Hook Form** para gerenciamento dos campos;
-   **Zod** para definição e validação das regras;
-   **@hookform/resolvers** para integração entre as duas bibliotecas.

Essa estrutura é utilizada em funcionalidades como cadastro, checkout e
operações administrativas que possuem formulários.

## 8. Autenticação

A aplicação possui:

-   tela de login;
-   tela de cadastro;
-   armazenamento da sessão do usuário no navegador;
-   logout;
-   identificação do perfil do usuário;
-   proteção das rotas administrativas para usuários autenticados.

O perfil administrativo possui acesso à área de gerenciamento da
aplicação.

## 9. Área administrativa

A área administrativa é composta por:

``` text
/admin
/admin/estoque
/admin/pedidos
/admin/vendas
```

### Dashboard

Apresenta informações resumidas sobre:

-   quantidade de produtos;
-   quantidade total em estoque;
-   produtos com estoque baixo;
-   produtos sem estoque;
-   acessos rápidos às áreas administrativas.

### Estoque

Permite:

-   consultar produtos;
-   pesquisar produtos;
-   cadastrar produtos;
-   editar produtos;
-   excluir produtos;
-   alterar quantidades disponíveis;
-   visualizar a situação do estoque.

### Pedidos

Permite:

-   consultar pedidos;
-   pesquisar pedidos;
-   visualizar os itens de um pedido;
-   consultar valores;
-   alterar o status do pedido.

Os status utilizados são:

-   Em análise;
-   Em preparação;
-   Enviado;
-   Entregue;
-   Cancelado.

### Vendas

A área de vendas permite:

-   visualizar vendas registradas;
-   pesquisar vendas;
-   consultar o total de vendas;
-   consultar as vendas do mês;
-   consultar o faturamento do mês;
-   registrar uma nova venda;
-   consultar os detalhes de uma venda.

Ao registrar uma venda, o sistema verifica a quantidade disponível do
produto e atualiza o estoque.

## 10. Desenvolvimento

Durante o desenvolvimento, o Vite permite atualizar a aplicação conforme
os arquivos são modificados.

Após alterações importantes no banco de dados ou na estrutura da
aplicação, recomenda-se verificar novamente o funcionamento do frontend
e do backend.

## 11. Build para produção

Para gerar a versão de produção do frontend, execute:

``` bash
npm run build
```

O Vite realizará o processo de build conforme a configuração do projeto.

Para visualizar a build localmente, pode ser utilizado:

``` bash
npm run preview
```

## 12. Encerramento

Ao finalizar o uso da aplicação, encerre os processos do frontend e do
backend com `CTRL + C`.

Para conhecer o funcionamento de cada recurso pelo ponto de vista do
usuário, consulte o [Manual do Usuário](MANUAL_USUARIO.md).
