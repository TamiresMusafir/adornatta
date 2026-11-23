# Manual de Operação

## 1. Objetivo

Este manual apresenta como executar, operar e manter a aplicação Adornatta
em ambiente de desenvolvimento. A instalação está descrita no
[Manual de Instalação](MANUAL_INSTALACAO.md) e a preparação do banco no
[Manual do Banco de Dados](MANUAL_BANCO_DADOS.md).

A aplicação é composta por:

- **frontend** em React, executado pelo Vite (`frontend/`);
- **backend** em Node.js com Express (`backend/`), que expõe a API REST;
- **banco de dados PostgreSQL**;
- integração de pagamento com o **Mercado Pago**.

## 2. Iniciar a aplicação

Terminal 1, na pasta `backend/`:

```bash
npm run dev
```

O comando usa `node --watch`, que reinicia a API sempre que um arquivo do
backend é salvo. A API fica em `http://localhost:3000/api`.

Terminal 2, na pasta `frontend/`:

```bash
npm run dev
```

O Vite informa o endereço da aplicação, normalmente
`http://localhost:5173`, e recarrega a página a cada arquivo salvo.

Os dois terminais devem permanecer abertos enquanto a aplicação estiver em
uso.

## 3. Parar a aplicação

Em cada terminal, pressione `CTRL + C`.

## 4. Comandos disponíveis

### Backend (`backend/`)

| Comando | Função |
|---|---|
| `npm run dev` | Inicia a API e reinicia ao salvar arquivos |
| `npm start` | Inicia a API sem reinício automático |
| `npm run db:migrate` | Aplica as migrations pendentes |
| `npm run db:seed` | Carrega o catálogo inicial (categorias e produtos) |

### Frontend (`frontend/`)

| Comando | Função |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção em `frontend/dist` |
| `npm run preview` | Exibe localmente a versão gerada pelo `build` |

## 5. Rotas da API

Todas as rotas começam com `/api`. A coluna **Acesso** indica quem pode
usá-las: público, usuário autenticado ou administrador.

| Método e rota | Acesso | Função |
|---|---|---|
| `GET /health` | público | Verifica se a API está no ar |
| `POST /usuarios` | público | Cadastra cliente e já inicia a sessão |
| `POST /usuarios/login` | público | Inicia a sessão |
| `POST /usuarios/logout` | público | Encerra a sessão |
| `GET /usuarios/sessao` | autenticado | Retorna o usuário da sessão |
| `GET /usuarios` | administrador | Lista usuários |
| `GET`/`PATCH /usuarios/:id` | o próprio usuário ou administrador | Consulta/atualiza dados pessoais |
| `GET /categorias` | público | Lista categorias |
| `GET /produtos`, `GET /produtos/:id` | público | Consulta o catálogo |
| `POST`/`PATCH`/`DELETE /produtos[/:id]` | administrador | Mantém o catálogo e o estoque |
| `GET /pedidos`, `GET /pedidos/:id` | autenticado | Cliente vê os próprios pedidos; administrador vê todos |
| `POST /pedidos` | autenticado | Cria o pedido e reserva o estoque |
| `PATCH /pedidos/:id` | administrador | Altera o status do pedido |
| `GET`/`POST /itensPedido`, `DELETE /itensPedido/:pedidoId/:produtoId` | autenticado | Itens do pedido (só antes do pagamento) |
| `POST /pedidos/:id/checkout` | autenticado | Gera o link de pagamento no Mercado Pago |
| `POST /pagamentos/mercado-pago/webhook` | Mercado Pago | Recebe a confirmação do pagamento |
| `GET /vendas` | administrador | Lista pedidos com pagamento aprovado |
| `GET`/`POST`/`PATCH`/`DELETE /formasPagamento` | autenticado | Formas de pagamento salvas do usuário |

## 6. Autenticação e perfis

- Ao entrar, o backend grava um cookie `token` (JWT, `httpOnly`) válido por
  **1 hora**. O navegador o envia automaticamente; o frontend não guarda
  senha nem token.
- Existem dois perfis: **cliente** e **administrador**. O site só cria
  clientes; a promoção a administrador é feita no banco (Manual do
  Banco de Dados, item 8).
- O perfil fica gravado no token. Se o perfil de um usuário mudar, ele
  precisa sair e entrar de novo.
- No frontend, as páginas *Minha conta*, *Checkout* e *Acompanhar pedido*
  exigem login; as páginas `/admin` exigem perfil administrador. O backend
  repete essas verificações em todas as rotas protegidas.

## 7. Ciclo de vida do pedido

```text
Em análise ──(pagamento aprovado no Mercado Pago)──► Confirmado
     │                                                   │
     │                                                   ▼
     │                                           Em preparação ──► Enviado ──► Entregue
     │                                                   │
     └──────────────► Cancelado ◄────────────────────────┘
```

Regras aplicadas pelo backend:

1. Todo pedido nasce **Em análise**, com o estoque dos itens já
   **reservado** (descontado do produto).
2. Quando o Mercado Pago aprova o pagamento, o webhook muda o pedido para
   **Confirmado**.
3. O administrador só consegue avançar para *Em preparação*, *Enviado* e
   *Entregue* se o pagamento estiver **aprovado**.
4. Só é possível cancelar um pedido **sem** pagamento aprovado e **sem**
   checkout em andamento. Ao cancelar, o estoque reservado volta ao produto.
5. Pedidos com checkout pendente expiram automaticamente; o backend
   verifica isso enquanto está em execução.
6. Não é possível excluir um produto que já faz parte de algum pedido.

## 8. Área administrativa

| Rota | Conteúdo |
|---|---|
| `/admin` | Dashboard: total de produtos, unidades em estoque, estoque baixo (1 a 3 unidades), produtos zerados e atalhos |
| `/admin/estoque` | Cadastro, edição, exclusão e ajuste de quantidade dos produtos |
| `/admin/pedidos` | Lista, busca (número, nome ou e-mail do cliente), detalhes e alteração de status |
| `/admin/vendas` | Pedidos com pagamento aprovado: total, vendas e faturamento do mês e detalhes de cada venda |

A tela de vendas é **somente consulta**: uma venda passa a existir quando o
Mercado Pago aprova o pagamento de um pedido.

## 9. Gerenciamento de estado e formulários no frontend

- **TanStack Query** faz as consultas à API e atualiza as telas depois de
  cada alteração (catálogo, pedidos, estoque e vendas).
- **React Hook Form** com **Zod** valida os formulários de cadastro,
  login, checkout e estoque antes do envio. O backend valida de novo todos
  os dados recebidos.
- Carrinho e lista de desejos ficam apenas na memória da página: são
  perdidos ao recarregar a página ou fechar a aba.

## 10. Banco de dados

- Novas alterações de estrutura devem ser feitas em **uma nova migration**
  (`backend/src/database/migrations/004_descricao.sql`). Nunca edite uma
  migration já aplicada: o `db:migrate` confere o conteúdo e interrompe a
  execução se ela tiver sido alterada.
- O backend recusa iniciar se a conta de `DB_USER` for superusuário ou se
  não assumir a role `adornatta_app`.

## 11. Build para produção

Na pasta `frontend/`:

```bash
npm run build
npm run preview   # opcional, para conferir a build localmente
```

Em produção, defina `NODE_ENV=production` no backend (o cookie de sessão
passa a exigir HTTPS) e ajuste `FRONTEND_URL` e `VITE_API_URL` para os
endereços reais.

## 12. Encerramento

Para conhecer cada recurso pelo ponto de vista de quem usa o site,
consulte o [Manual do Usuário](MANUAL_USUARIO.md).