# Integração de pagamento

O checkout usa o Mercado Pago Checkout Pro. O cartão é informado diretamente no ambiente do Mercado Pago; o backend não recebe nem armazena número ou CVV.

## Banco de dados: migrations e seeds

Para uma instalação nova, execute `../BDadornatta/BancoDadosAdornatta.sql` uma
única vez em um banco vazio, usando uma conta administrativa. Depois configure
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD` no `.env`.

O processo da API sempre assume a role `adornatta_app` (`DB_ROLE` deve manter
esse valor), usando o login exclusivo da aplicação em `DB_USER` e
`DB_PASSWORD`. Essa conta precisa apenas das permissões necessárias para
assumir `adornatta_app`; não use `adornatta_app` como login direto.
Configure `DB_MIGRATION_USER` e `DB_MIGRATION_PASSWORD` com um login diferente,
autorizado a aplicar DDL. As credenciais de migration são obrigatórias e não
podem ser iguais às da aplicação. Não use uma conta superusuária como
credencial permanente do backend.

Com o diretório `Back-end` como diretório atual:

1. `npm run db:migrate` aplica migrations versionadas, com checksum e lock
   advisory. Não edite migrations já registradas; crie outra migration.
2. `npm run db:seed` insere o catálogo compatível com os IDs temporários do
   frontend. A execução é repetível e recusa um catálogo preexistente diferente.
   Ela não redefine as quantidades de estoque em reexecuções.
3. `npm run test:security` cria um banco temporário chamado
   `adornatta_security_test_*`, instala nele o schema, executa migrations e
   seeds duas vezes e valida a role da aplicação, permissões e entradas SQL-like.
   O teste requer PostgreSQL local, `DB_NAME=adornatta` e credenciais com
   permissão para criar e remover bancos; o banco `adornatta` não recebe
   migrations nem seeds pelo teste.
4. `npm run test:http` inicia a aplicação em uma porta local temporária e
   verifica rotas públicas e protegidas, respostas de autorização e que a
   conexão HTTP assume a role restrita com um login distinto de migration.
5. `npm run test:mercado-pago` valida localmente o payload de Checkout Pro
   Orders, o mapeamento de status e a assinatura dos webhooks; não cria orders
   reais nem substitui um teste de sandbox.

Organização dos arquivos de banco:

- `src/database/migrations/`: migrations versionadas do backend, executadas por
  `npm run db:migrate`.
- `../BDadornatta/migrations/legacy/`: scripts SQL históricos, preservados
  apenas para referência; não são aplicados automaticamente. Antes de usar um
  deles, confira o schema e o histórico do banco de destino.
- `src/database/seeds/`: seeds executáveis e parametrizados da aplicação.
- `src/database/`: conexão, pool administrativo, runner, migrations e seeds.

Migrations e seeds não são executados durante a inicialização da API.

## Configuração

1. Copie `.env.example` para `.env` e preencha as configurações do PostgreSQL e `JWT_SECRET`.
2. No painel do Mercado Pago, crie uma aplicação e configure credenciais de teste:
   - `MERCADO_PAGO_ACCESS_TOKEN`: access token de teste.
   O token sozinho permite criar a Order e testar o redirecionamento; a URL de
   retorno também deve estar definida em `FRONTEND_URL`.
3. Configure um endpoint público HTTPS para
   `/api/pagamentos/mercado-pago/webhook` em **Webhooks** no painel e habilite o
   tópico **Orders**. Copie a chave secreta de assinatura exibida nessa
   configuração para `MERCADO_PAGO_WEBHOOK_SECRET`. Em desenvolvimento local,
   exponha o backend por um túnel HTTPS e configure a URL do túnel no painel.
   Sem o segredo, o checkout funciona, mas o webhook responde erro e os pedidos
   não são atualizados automaticamente pelo pagamento.
4. Em bancos criados antes da versão atual do schema, revise e aplique apenas
   as migrations correspondentes ao schema existente. Não execute o script
   completo de instalação em um banco já utilizado.
5. No frontend, copie `../front-end-2/.env.example` para `../front-end-2/.env`.
   O backend usa `localhost:3000`; o JSON Server de dados ainda simulados usa
   `localhost:3001`.

Para produção, use credenciais de produção, HTTPS no frontend e um webhook
público HTTPS com o segredo configurado.

## Fluxo e testes

- `POST /api/pedidos` cria o pedido, calcula os preços no PostgreSQL e reserva
  estoque.
- `POST /api/pedidos/:id/checkout` cria ou reutiliza uma Order por
  `POST /v1/orders` e retorna `checkoutUrl` e `checkoutExpiresAt`. O checkout
  expira após 15 minutos.
- O webhook valida `x-signature`, recebe eventos do tópico `orders`, consulta
  a Order em `GET /v1/orders/:id` e atualiza pagamento/pedido de forma
  transacional e idempotente.
- Pagamento aprovado confirma o pedido; pagamento recusado ou cancelado cancela
  o pedido e libera somente as unidades reservadas.
- Enquanto a API estiver em execução, um processo periódico verifica checkouts
  vencidos a cada 30 segundos, consulta e cancela a Order no Mercado Pago e
  libera a reserva após confirmar o cancelamento. Isso também funciona sem
  `MERCADO_PAGO_WEBHOOK_SECRET`, mas requer o access token configurado.

Antes do primeiro checkout, cadastre no PostgreSQL os produtos cujos IDs são
usados pelo carrinho do frontend. O checkout ignora os preços do navegador e
recusa produtos ausentes ou sem estoque. A URL de retorno do navegador não é
considerada prova de pagamento; somente a notificação validada do Mercado Pago
altera o estado do pedido.
