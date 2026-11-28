# Manual de Operação 

## 1. Objetivo

Este manual apresenta os procedimentos necessários para executar e
utilizar a aplicação Adornatta.

A aplicação é composta por:

-   frontend desenvolvido em React e executado pelo Vite;
-   backend real desenvolvido em Express;
-   banco PostgreSQL com migrations incrementais;
-   integração de checkout com Mercado Pago.

## 2. Instalar e iniciar o backend

Na pasta `backend/`, instale as dependências e configure o arquivo `.env`
conforme o Manual de Instalação.

``` bash
npm install
npm run db:migrate
npm run dev
```

O servidor será iniciado, por padrão, em:

``` text
http://localhost:3000
```

O terminal deverá permanecer aberto enquanto a aplicação estiver sendo
utilizada.

## 3. Iniciar o frontend

Na pasta `frontend/`, abra um segundo terminal e execute:

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
-   consulta de vendas confirmadas por pagamento.

Os dados são persistidos no PostgreSQL.

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

-   visualizar vendas confirmadas pelo Mercado Pago;
-   pesquisar vendas;
-   consultar o total de vendas;
-   consultar as vendas do mês;
-   consultar o faturamento do mês;
-   consultar os detalhes de uma venda.

O registro da venda e a baixa do estoque ocorrem como parte do fluxo
confirmado do pedido e não devem ser feitos manualmente nesta versão.

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

## 13. Roteiro de testes para outras IAs

Este roteiro permite que uma IA ou pessoa verificadora execute uma
homologação reproduzível da Adornatta sem alterar o repositório durante a
validação. Leia os critérios da pasta `GPTI_docs` antes do julgamento.

### 13.1 Preparação

1. Copie `backend/.env.example` para `backend/.env`.
2. Configure PostgreSQL, `DB_ROLE=adornatta_app`, JWT, frontend e credenciais
   de homologação do Mercado Pago.
3. Execute `npm run db:migrate` na pasta `backend/`.
4. Execute `npm run db:seed` somente em ambiente de desenvolvimento.
5. Inicie o backend em `backend/`: `npm run dev`.
6. Inicie o frontend em `frontend/`: `npm run dev`.
7. Não registre tokens, senhas, dados de cartão ou credenciais no relatório.

### 13.2 Verificações automatizadas

Na pasta `backend/`:

```powershell
npm run test:security
npm run test:http
npm run test:mercado-pago
```

Na pasta `frontend/`:

```powershell
npm run test:build
```

`test:http` pressupõe que o backend esteja acessível em
`http://localhost:3000/api`, salvo configuração de `TEST_API_URL`.

### 13.3 Matriz funcional do catálogo

Verificar como usuário anônimo e como administrador:

| Cenário | Resultado esperado |
|---|---|
| Abrir catálogo | Lista produtos persistidos no PostgreSQL |
| Filtrar Brincos, Conjuntos, Pulseiras ou Cordões | Apenas produtos da categoria selecionada |
| Buscar por termo | Retorna correspondências pelo nome ou descrição |
| Abrir detalhes | Exibe nome, descrição, preço, imagem, categoria, material, tipo de banho e disponibilidade |
| Criar produto como cliente | HTTP 403 |
| Criar produto como administrador | HTTP 201 e produto aparece no catálogo |
| Editar estoque como administrador | Quantidade muda no catálogo |
| Excluir produto como administrador | Produto deixa de existir, conforme regra aplicada |

### 13.4 Matriz funcional de autenticação

1. Criar conta nova com e-mail válido.
2. Confirmar senha criptografada no banco; não deve aparecer em texto puro.
3. Entrar com senha correta.
4. Rejeitar senha incorreta.
5. Verificar sessão autenticada.
6. Fazer logout.
7. Confirmar que `/usuarios/sessao` e `/pedidos` exigem autenticação.
8. Confirmar que cliente comum não pode alterar produtos, pedidos administrativos
   ou acessar usuários administrativos.

Não use dados reais. Use contas e CPFs fictícios em ambiente de desenvolvimento.

### 13.5 Matriz funcional de pedidos

1. Criar carrinho com produtos disponíveis.
2. Criar pedido autenticado com endereço válido.
3. Consultar o pedido pelo proprietário.
4. Rejeitar consulta por outro cliente.
5. Alterar status somente como administrador.
6. Permitir apenas: Em análise, Em preparação, Enviado, Entregue e Cancelado.
7. Confirmar que uma transição inválida é recusada.
8. Confirmar que alteração no painel aparece no acompanhamento do cliente.
9. Confirmar que frete e prazo estão persistidos ou registrar como lacuna até
   serem implementados.

### 13.6 Homologação do pagamento

Esta etapa exige contas de homologação fornecidas pelo responsável do projeto.
Não aceite cartão real.

#### Pix

1. Criar pedido de teste.
2. Iniciar checkout.
3. Confirmar que a URL é HTTPS.
4. Efetuar pagamento de teste.
5. Confirmar webhook aprovado.
6. Confirmar pedido pago e baixa de estoque quando aplicável.

#### Cartão

1. Criar segundo pedido de teste.
2. Usar somente dados de cartão de teste do intermediador.
3. Confirmar aprovação.
4. Confirmar que o número do cartão não aparece no banco, logs ou frontend.

Registrar hora, ambiente, pedido de teste, resposta do webhook e evidência
sanitizada. Não incluir tokens ou números completos.

### 13.7 Segurança mínima

Confirmar:

- senha armazenada com hash bcrypt;
- cookie HTTP-only;
- cookie seguro em produção;
- JWT curto e segredo forte;
- CORS limitado à origem configurada;
- role PostgreSQL `adornatta_app`, não superusuário;
- conta de migrations diferente da conta da aplicação;
- administração bloqueada no servidor;
- usuário não consegue consultar dados de outro cliente;
- nenhuma credencial versionada.

### 13.8 Interface responsiva

Testar em desktop e celular com largura aproximada de 360 px e 1440 px:

- sem rolagem horizontal;
- menu utilizável;
- catálogo e filtros utilizáveis;
- carrinho utilizável;
- checkout utilizável;
- painel administrativo utilizável;
- feedbacks de erro visíveis;
- estados de carregamento presentes.

### 13.9 Critérios de aceite

Use os seguintes estados:

- **Passou**: evidência reproduzível encontrada.
- **Falhou**: resultado contradiz o critério.
- **Bloqueado**: falta credencial, serviço ou insumo externo.
- **Não executado**: a IA não teve ambiente para testar.

Não converta pendência em aprovado. Para cada falha, registre:

```text
Pacote:
Cenário:
Estado:
Evidência:
Passos para reproduzir:
Impacto:
Correção sugerida:
```
