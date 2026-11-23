# Manual do Banco de Dados

Este manual prepara o banco PostgreSQL do Adornatta na primeira vez que o
projeto é executado em uma máquina. Depois de concluído, siga o
[Manual de Instalação](MANUAL_INSTALACAO.md) para ligar o backend e o
frontend.

Os comandos são para **Ubuntu/Debian**. As diferenças para o Windows estão
indicadas onde existem.

## 1. Visão geral

O backend não conecta ao banco com uma conta só. Ele usa duas contas de login
e duas roles de permissão, para que o site nunca tenha mais poder do que
precisa:

| Nome | Tipo | Para que serve |
|---|---|---|
| `adornatta_app` | role (sem login) | Conjunto de permissões da aplicação: ler e gravar só as colunas necessárias |
| `adornatta_owner` | role (sem login) | Dona da função `excluir_dados_usuario` |
| `adornatta_login` | conta de login | Usada pelo site no dia a dia (`DB_USER`). Assume a role `adornatta_app` |
| `adornatta_migr` | conta de login | Dona do banco. Cria tabelas, aplica migrations e carrega o catálogo (`DB_MIGRATION_USER`) |

Com essa separação, a conta usada pelo site não consegue, por exemplo, criar
um administrador nem alterar a estrutura das tabelas.

A montagem do banco tem quatro etapas, nesta ordem:

```text
1. Contas e banco   →  2. Esquema-base   →  3. Migrations   →  4. Catálogo (seed)
   (psql, uma vez)       (cria as tabelas)    (npm run          (npm run
                                               db:migrate)       db:seed)
```

## 2. Instalar o PostgreSQL

```bash
sudo apt update
sudo apt install postgresql
sudo systemctl enable --now postgresql
psql --version
```

O `enable --now` liga o PostgreSQL agora e a cada inicialização do
computador. O projeto funciona com o PostgreSQL 14 ou superior.

No Windows, use o instalador de <https://www.postgresql.org/download/windows/>
e abra o console pelo programa **SQL Shell (psql)**.

## 3. Criar as contas e o banco

Abra o console do PostgreSQL como administrador:

```bash
sudo -u postgres psql
```

O prompt muda para `postgres=#`. Cole o bloco abaixo. Em desenvolvimento as
senhas podem ser mantidas; em qualquer outro ambiente, troque-as.

```sql
CREATE ROLE adornatta_app NOLOGIN;
CREATE ROLE adornatta_owner NOLOGIN;

CREATE USER adornatta_login WITH PASSWORD 'senha_app_dev';
GRANT adornatta_app TO adornatta_login;

CREATE USER adornatta_migr WITH PASSWORD 'senha_migr_dev';
GRANT adornatta_owner TO adornatta_migr;

CREATE DATABASE adornatta OWNER adornatta_migr;
```

Resposta esperada:

```text
CREATE ROLE
CREATE ROLE
CREATE ROLE
GRANT ROLE
CREATE ROLE
GRANT ROLE
CREATE DATABASE
```

Saia com `\q`.

## 4. Criar as tabelas (esquema-base)

As migrations do projeto apenas **ajustam** tabelas que já existem. As
tabelas são criadas pelo esquema-base:

- `BancoDadosAdornatta.sql`: o script original, se a equipe o tiver;
- `backend/src/database/esquema_base_reconstruido.sql`: versão reconstruída
  a partir das consultas do backend, que acompanha o repositório.

Na pasta raiz do projeto:

```bash
psql -h localhost -U adornatta_migr -d adornatta \
  -f backend/src/database/esquema_base_reconstruido.sql
```

Informe a senha da conta de migração (`senha_migr_dev`). O terminal não mostra
o que é digitado. Resposta esperada:

```text
CREATE TABLE   (9 vezes)
GRANT
CREATE FUNCTION
```

Execute **uma única vez**, em banco vazio. Rodar de novo gera erros
`already exists`.

Tabelas criadas:

| Tabela | Conteúdo |
|---|---|
| `usuario` | Clientes e administradores (`perfil`) |
| `telefone_usuario` | Telefones de cada usuário |
| `endereco_usuario` | Endereços cadastrados |
| `categoria` | Categorias do catálogo |
| `produto` | Produtos e quantidade em estoque |
| `imagem_produto` | Imagens de cada produto |
| `pedido` | Pedidos, status e cópia do endereço de entrega |
| `produto_pedido` | Itens de cada pedido, com preço e quantidade reservada |
| `pagamento` | Pagamentos e dados do checkout do Mercado Pago |
| `forma_pagamento_usuario` | Formas de pagamento salvas pelo cliente |

## 5. Configurar o acesso do backend

Na pasta `backend/`, crie o arquivo `.env` a partir do modelo
(`cp .env.example .env`) com estes valores de banco:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adornatta
DB_USER=adornatta_login
DB_PASSWORD=senha_app_dev
DB_ROLE=adornatta_app
DB_MIGRATION_USER=adornatta_migr
DB_MIGRATION_PASSWORD=senha_migr_dev
```

As demais variáveis estão no [Manual de Instalação](MANUAL_INSTALACAO.md),
item 5. O arquivo `.env` contém senhas e **não deve ser versionado** (já está
no `.gitignore`).

## 6. Aplicar as migrations

Na pasta `backend/` (requer `npm install` já executado):

```bash
npm run db:migrate
```

Resposta esperada:

```text
Migration aplicada: 001_app_role_privileges
Migration aplicada: 002_mercado_pago_orders
Migration aplicada: 003_checkout_expiration
```

| Migration | O que faz |
|---|---|
| `001_app_role_privileges` | Concede à role `adornatta_app` somente as permissões necessárias, cria o índice que impede nome de produto repetido na mesma categoria e o gatilho que impede o site de criar administradores |
| `002_mercado_pago_orders` | Acrescenta o identificador da ordem do Mercado Pago ao pagamento |
| `003_checkout_expiration` | Acrescenta o prazo de validade do checkout |

O comando registra as migrations aplicadas na tabela `schema_migrations` e pode
ser executado de novo sem efeito colateral: só aplica as que faltam.

**Regra:** nunca edite uma migration já aplicada. Para alterar a estrutura,
crie um novo arquivo, por exemplo
`backend/src/database/migrations/004_descricao.sql`. O `db:migrate` interrompe
a execução se uma migration aplicada tiver sido modificada.

## 7. Carregar o catálogo inicial

```bash
npm run db:seed
```

Resposta esperada:

```text
Seeds do catálogo aplicados: 4 categorias e 11 produtos.
```

O seed só grava em um catálogo vazio ou idêntico ao oficial; se encontrar
produtos diferentes, ele para sem alterar nada.

## 8. Criar o primeiro administrador

O site só cria contas de **cliente**, e o banco impede que a conta do site
crie administradores. Para ter um administrador:

1. com o backend e o frontend ligados, cadastre-se em `/cadastro`;
2. promova a conta com a conta de migração:

```bash
psql -h localhost -U adornatta_migr -d adornatta \
  -c "UPDATE usuario SET perfil = 'administrador' WHERE email = 'seu-email@exemplo.com';"
```

3. saia do site e entre de novo, para que a nova sessão carregue o perfil.

## 9. Consultas úteis

Abra o console do banco com a conta de migração:

```bash
psql -h localhost -U adornatta_migr -d adornatta
```

| Objetivo | Comando |
|---|---|
| Listar as tabelas | `\dt` |
| Ver as colunas de uma tabela | `\d pedido` |
| Ver os usuários e perfis | `SELECT idusuario, nome, email, perfil FROM usuario;` |
| Ver os pedidos e status | `SELECT idpedido, status, valor_total FROM pedido ORDER BY idpedido;` |
| Ver as migrations aplicadas | `SELECT version, applied_at FROM schema_migrations;` |
| Sair | `\q` |

## 10. Recomeçar o banco do zero

Apaga **todos os dados** (usuários, pedidos e produtos). Use apenas em
desenvolvimento.

```bash
sudo -u postgres psql -c "DROP DATABASE adornatta;"
sudo -u postgres psql -c "CREATE DATABASE adornatta OWNER adornatta_migr;"
```

Depois repita os itens 4, 6, 7 e 8. As contas e roles do item 3 continuam
existindo e não precisam ser recriadas.

## 11. Problemas comuns

| Mensagem | Causa e solução |
|---|---|
| `Comando 'psql' não encontrado` | PostgreSQL não instalado (item 2) |
| `connection refused` / `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL desligado: `sudo systemctl start postgresql` |
| `password authentication failed for user ...` | Senha digitada diferente da criada no item 3, ou diferente da que está no `.env` |
| `database "adornatta" does not exist` | Faltou o `CREATE DATABASE` do item 3 |
| `role "adornatta_owner" does not exist` ou `Roles adornatta_app e adornatta_owner sao necessarias` | Faltou criar uma das roles do item 3 |
| `Schema Adornatta nao instalado; aplique BancoDadosAdornatta.sql primeiro` | O esquema-base do item 4 não foi executado |
| `permission denied for schema public` nas migrations | Faltou `GRANT adornatta_owner TO adornatta_migr` (item 3), ou o esquema não foi criado com a conta `adornatta_migr` |
| `relation "..." already exists` | O esquema-base foi executado duas vezes. Recomece pelo item 10 |
| `A migration aplicada ... foi alterada` | Uma migration já aplicada foi editada. Desfaça a edição e crie uma migration nova |
| `Aplique as migrations antes de carregar os seeds` | Rode o item 6 antes do item 7 |
| `O catálogo existente não corresponde ao seed oficial` | O catálogo já foi alterado; o seed não sobrescreve. Se quiser o catálogo original, recomece pelo item 10 |
| Backend: `O login PostgreSQL "..." é superusuário` | `DB_USER` aponta para uma conta superusuário (ex.: `postgres`). Use `adornatta_login` |
| Backend: `DB_ROLE deve ser adornatta_app` | Valor diferente em `DB_ROLE` no `.env` |