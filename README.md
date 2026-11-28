# Adornatta

Loja virtual da Adornatta para consulta de semijoias, realização de pedidos,
pagamento e gerenciamento administrativo do catálogo, estoque e vendas.

## Integrantes

- João Henrique Lima Gualberto
- Pedro Pimentel Nunes
- Tamires Barbosa dos Santos
- Vinicius da Silva Mendes

## Repositório

<https://github.com/TamiresMusafir/adornatta>

## Tecnologias

- React 19 e React Router
- Vite
- TanStack Query
- React Hook Form e Zod
- Bootstrap e Bootstrap Icons
- Node.js e Express
- PostgreSQL
- JWT e bcrypt
- Mercado Pago

## Estrutura do projeto

```text
frontend/       Interface React da loja e área administrativa
backend/        API Express e integrações
backend/src/    Rotas, controladores, serviços e banco de dados
Manuais/        Instalação, operação e uso da aplicação
GPTI_docs/      Documentação acadêmica e critérios de aceite do projeto
```

## Funcionalidades

### Área do cliente

- Cadastro, login, logout e sessão
- Catálogo, categorias, busca e detalhes de produtos
- Lista de desejos
- Carrinho e checkout
- Acompanhamento de pedidos
- Área pessoal e dados do usuário

### Área administrativa

- Dashboard de produtos e estoque
- Cadastro, edição, exclusão e ajuste de produtos
- Consulta e alteração de status dos pedidos
- Consulta de vendas confirmadas pelo Mercado Pago
- Faturamento e vendas do mês

### Integrações

- API real em Express
- Persistência em PostgreSQL
- Autenticação por cookie JWT HTTP-only
- Controle de acesso no servidor
- Checkout e webhook do Mercado Pago

## Pré-requisitos

- Git
- Node.js 22.12 ou superior
- npm
- PostgreSQL
- Conta ou credenciais de homologação do Mercado Pago

## Instalação rápida

### Backend

```powershell
Set-Location .\backend
npm install
Copy-Item .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Configure `backend/.env` antes de iniciar o servidor. Consulte o
[Manual de Instalação](Manuais/MANUAL_INSTALACAO.md) para todas as variáveis
e as contas PostgreSQL necessárias.

A API usa, por padrão, `http://localhost:3000`. O health check está em
`http://localhost:3000/api/health`.

### Frontend

Em outro terminal:

```powershell
Set-Location .\frontend
npm install
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em `http://localhost:5173`.

## Comandos disponíveis

### Frontend

```powershell
npm run dev         # servidor de desenvolvimento
npm run build       # build de produção
npm run preview     # visualizar a build
npm run test:build  # gera a build de produção
```

### Backend

```powershell
npm run dev                  # servidor com recarga automática
npm start                    # servidor em modo normal
npm run db:migrate           # aplica migrations
npm run db:seed              # carga catálogo em desenvolvimento
npm run test:http            # verifica saúde e rotas HTTP
npm run test:security        # verifica configuração e segurança do banco
npm run test:mercado-pago    # verifica configuração da integração
npm run test:all             # executa os testes do backend em sequência
```

O backend deve estar iniciado antes dos testes HTTP.

## Documentação

- [Manual de Instalação](Manuais/MANUAL_INSTALACAO.md)
- [Manual de Operação](Manuais/MANUAL_OPERACAO.md)
- [Manual do Usuário](Manuais/MANUAL_USUARIO.md)

O Manual de Operação contém o roteiro de homologação destinado a IAs e
revisores humanos.

## Segurança e configuração

- Não versione `backend/.env` nem credenciais.
- Use `DB_ROLE=adornatta_app`.
- Use uma conta PostgreSQL própria e sem privilégios de superusuário.
- Use uma conta separada para aplicar migrations.
- Configure uma `JWT_SECRET` aleatória e forte.
- Em produção, configure HTTPS e `NODE_ENV=production`.
- Configure `DB_SSL=true` e validação de certificado para bancos remotos.
- Não registre números de cartão no banco ou nos logs da aplicação.
