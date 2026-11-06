# Integração de pagamento

O checkout usa o Mercado Pago Checkout Pro. O cartão é informado diretamente no ambiente do Mercado Pago; o backend não recebe nem armazena número ou CVV.

## Banco de dados: migrations e seeds

Para uma instalação nova, execute `../BDadornatta/BancoDadosAdornatta.sql` uma
única vez em um banco vazio, usando uma conta administrativa. Depois configure
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD` no `.env`.

O processo da API sempre assume a role `adornatta_app` (`DB_ROLE` deve manter
esse valor). A conta de conexão precisa ter permissão para assumir essa role.
Configure `DB_MIGRATION_USER` e `DB_MIGRATION_PASSWORD` com uma conta separada
que possa aplicar DDL; se omitidos, os scripts usam `DB_USER` e `DB_PASSWORD`.
Não use uma conta superusuária como credencial permanente do backend.

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
   - `MERCADO_PAGO_WEBHOOK_SECRET`: chave secreta das notificações Webhook.
   - `MERCADO_PAGO_USE_SANDBOX=true`.
3. Configure uma URL pública HTTPS para receber notificações em
   `/api/pagamentos/mercado-pago/webhook` e informe a URL completa em
   `MERCADO_PAGO_WEBHOOK_URL`. Em desenvolvimento local, use um túnel HTTPS e
   configure a mesma URL no painel do Mercado Pago, habilitando notificações de
   pagamentos.
4. Em bancos criados antes da versão atual do schema, revise e aplique apenas
   as migrations correspondentes ao schema existente. Não execute o script
   completo de instalação em um banco já utilizado.
5. No frontend, copie `../front-end-2/.env.example` para `../front-end-2/.env`.
   O backend usa `localhost:3000`; o JSON Server de dados ainda simulados usa
   `localhost:3001`.

Para produção, use credenciais de produção, defina
`MERCADO_PAGO_USE_SANDBOX=false`, HTTPS no frontend e uma URL pública HTTPS para
o webhook.

## Fluxo e testes

- `POST /api/pedidos` cria o pedido, calcula os preços no PostgreSQL e reserva
  estoque.
- `POST /api/pedidos/:id/checkout` cria ou reutiliza a preferência de pagamento
  e retorna `checkoutUrl`.
- O webhook valida `x-signature`, consulta o pagamento diretamente na API do
  Mercado Pago e atualiza pagamento/pedido de forma transacional e idempotente.
- Pagamento aprovado confirma o pedido; pagamento recusado ou cancelado cancela
  o pedido e libera somente as unidades reservadas.

Antes do primeiro checkout, cadastre no PostgreSQL os produtos cujos IDs são
usados pelo carrinho do frontend. O checkout ignora os preços do navegador e
recusa produtos ausentes ou sem estoque. A URL de retorno do navegador não é
considerada prova de pagamento; somente a notificação validada do Mercado Pago
altera o estado do pedido.
