# Manual de Instalação

## Pré-requisitos

- Git;
- Node.js 22.12 ou superior e npm;
- PostgreSQL com o esquema-base do Adornatta já criado;
- credenciais de integração do Mercado Pago para testar pagamentos.

O projeto possui dois processos independentes: a aplicação React/Vite em
`frontend/` e a API Express em `backend/`. O `db.json` e o servidor simulado
não são usados pelo fluxo com o backend real.

## Instalar dependências

Na raiz do repositório, abra um terminal para cada pasta:

```powershell
Set-Location .\frontend
npm ci
```

```powershell
Set-Location .\backend
npm install
```

## Configurar o backend

Crie localmente `backend/.env` e preencha as configurações necessárias. Não
versione esse arquivo nem compartilhe seus valores.

```text
PORT=3000
FRONTEND_URL=http://localhost:5173
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
DB_USER=
DB_PASSWORD=
DB_ROLE=adornatta_app
DB_MIGRATION_USER=
DB_MIGRATION_PASSWORD=
JWT_SECRET=
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_SECRET=
```

O usuário de execução do backend deve ser restrito, não superusuário, e
`DB_ROLE` deve ser `adornatta_app`. A conta usada por `DB_MIGRATION_USER` deve
ser diferente da conta de aplicação e ter as permissões necessárias para
aplicar migrations.

As migrations do repositório são incrementais e pressupõem que o esquema-base
já exista. Depois de confirmar o banco e suas permissões, aplique-as na pasta
`backend/`:

```powershell
npm run db:migrate
```

Para carregar o catálogo inicial em um banco de desenvolvimento, use:

```powershell
npm run db:seed
```

O frontend usa `http://localhost:3000/api` por padrão. Para apontar para outra
API, configure `VITE_API_URL` no ambiente do Vite. `FRONTEND_URL` no backend
deve corresponder exatamente à origem do frontend para o CORS e os cookies.

## Executar localmente

Terminal 1, na pasta `backend/`:

```powershell
npm run dev
```

Terminal 2, na pasta `frontend/`:

```powershell
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente
`http://localhost:5173`. A API deve responder em
`http://localhost:3000/api/health`.

## Validar o frontend

Na pasta `frontend/`, gere a build de produção:

```powershell
npm run build
```

Para validar login, cadastro, pedidos e área administrativa, use contas do
banco de desenvolvimento. O pagamento é concluído no ambiente do Mercado Pago;
os dados de cartão não devem ser inseridos no site Adornatta.
