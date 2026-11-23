# Manual de Instalação

Este manual descreve como instalar e executar o Adornatta em ambiente de
desenvolvimento. Os comandos são para **Ubuntu/Debian**; as diferenças para o
Windows estão indicadas onde existem.

## 1. Visão geral

O projeto possui dois programas independentes, cada um executado em um
terminal próprio, e um banco de dados:

| Parte | Pasta | Tecnologia | Endereço padrão |
|---|---|---|---|
| Frontend (o site) | `frontend/` | React executado pelo Vite | <http://localhost:5173> |
| Backend (a API) | `backend/` | Node.js com Express | <http://localhost:3000/api> |
| Banco de dados | — | PostgreSQL | `localhost:5432` |

O site roda no navegador e busca os dados na API. O endereço da API que o
site usa é definido pela variável `VITE_API_URL` (item 7).

## 2. Ordem da primeira instalação

```text
1. Node.js (item 3)
2. Código e dependências (item 4)
3. Banco de dados → Manual do Banco de Dados (itens 2 a 7)
4. Arquivo .env do backend (item 5)
5. Ligar backend e frontend (item 6)
6. Criar o administrador → Manual do Banco de Dados (item 8)
```

Depois da primeira vez, no dia a dia basta o item 6.

## 3. Instalar o Node.js

O frontend exige **Node.js 22.12 ou superior**. O `npm`, usado em todos os
comandos do projeto, vem junto com o Node.js.

### Linux

A versão do `apt` costuma ser antiga. Use o **nvm**, que instala o Node.js na
pasta do usuário, sem `sudo`:

```bash
sudo apt install curl     # se o curl não estiver instalado
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
node -v    # deve exibir v22.12 ou superior
npm -v
```

### Windows

Baixe o instalador LTS (22.x ou superior) em <https://nodejs.org> e confira no
PowerShell com `node -v`.

## 4. Obter o código e instalar as dependências

```bash
git clone https://github.com/TamiresMusafir/adornatta.git
cd adornatta

cd backend
npm install
cd ../frontend
npm ci
cd ..
```

`npm ci` instala exatamente as versões registradas no `package-lock.json`.

Em seguida, prepare o banco seguindo o
[Manual do Banco de Dados](MANUAL_BANCO_DADOS.md), itens 2 a 7.

## 5. Configurar o backend (`backend/.env`)

```bash
cd backend
cp .env.example .env
```

Preencha o arquivo. Valores para desenvolvimento:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adornatta
DB_USER=adornatta_login
DB_PASSWORD=senha_app_dev
DB_ROLE=adornatta_app
DB_MIGRATION_USER=adornatta_migr
DB_MIGRATION_PASSWORD=senha_migr_dev
JWT_SECRET=troque-por-um-texto-aleatorio-bem-longo
MERCADO_PAGO_ACCESS_TOKEN=TEST-placeholder
MERCADO_PAGO_WEBHOOK_SECRET=placeholder
MERCADO_PAGO_WEBHOOK_URL=
```

| Variável | Observação |
|---|---|
| `PORT` | Porta da API. Se mudar, ajuste também o `VITE_API_URL` do frontend (item 7) |
| `NODE_ENV` | Em `production` o cookie de sessão passa a exigir HTTPS |
| `FRONTEND_URL` | Deve ser idêntica ao endereço aberto no navegador (CORS e cookies) |
| `DB_*` | Contas criadas no Manual do Banco de Dados. `DB_USER` **não** pode ser superusuário e `DB_ROLE` deve ser `adornatta_app` |
| `JWT_SECRET` | Assina o cookie de sessão. Gere um com `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `MERCADO_PAGO_ACCESS_TOKEN` | Sem ele o backend não cria pedidos. Para testar sem pagar, qualquer texto serve; só o link de pagamento falhará |
| `MERCADO_PAGO_WEBHOOK_SECRET` / `_URL` | Necessários apenas para receber as confirmações reais do Mercado Pago |

O `.env` contém senhas e **não deve ser versionado** (já está no `.gitignore`).

## 6. Executar

Terminal 1, na pasta `backend/`:

```bash
npm run dev
```

Saída esperada:

```text
Conexão com PostgreSQL estabelecida!
Login PostgreSQL: adornatta_login
Role ativa: adornatta_app
Servidor rodando em http://localhost:3000
```

Confira em <http://localhost:3000/api/health>: deve aparecer
`"Backend Adornatta funcionando!"`.

Terminal 2, na pasta `frontend/`:

```bash
npm run dev
```

Abra <http://localhost:5173>. O site deve exibir os produtos do catálogo.

Os dois terminais devem permanecer abertos. O backend reinicia e o site
recarrega sozinhos a cada arquivo salvo. Para desligar, use `Ctrl+C` em cada
terminal.

## 7. Portas e endereço da API

O frontend procura a API em `http://localhost:3000/api`, a menos que exista o
arquivo `frontend/.env.local` com outro endereço.

### Quando a porta 3000 já está ocupada

Outros programas costumam usar a porta 3000 (projetos Rails, containers Docker
como o Open WebUI etc.). Para descobrir quem está nela:

```bash
sudo ss -ltnp | grep :3000
```

Se aparecer outro programa, há duas saídas:

**a) Liberar a porta.** Encerre o outro programa. Se for um container Docker
(`docker-proxy` na saída acima), identifique-o com `docker ps` e pare-o com
`docker stop NOME`. Não use `kill` no `docker-proxy`.

**b) Mudar o Adornatta para a porta 3001.** Os dois lados precisam mudar
juntos:

```bash
# backend/.env
sed -i 's/^PORT=3000/PORT=3001/' backend/.env

# frontend/.env.local
echo "VITE_API_URL=http://localhost:3001/api" > frontend/.env.local
```

Reinicie **os dois** terminais. O Vite só lê o `.env.local` ao ligar.

> **Regra:** `PORT` no `backend/.env` e `VITE_API_URL` no
> `frontend/.env.local` precisam apontar para a mesma porta. O `.env.local` é
> configuração da máquina e não vai para o Git.

### Como conferir para onde o site está chamando

No navegador, pressione `F12`, aba **Rede** (Network), recarregue a página e
clique na requisição `produtos`: a "URL da requisição" mostra o endereço usado.
No terminal:

```bash
curl -s http://localhost:3000/api/produtos | head -c 100; echo
```

A resposta deve começar com `[{"id":"1",`. Se começar com `<!doctype html>`,
quem respondeu foi outro programa.

## 8. Validar a instalação

Gere a build de produção do frontend:

```bash
cd frontend
npm run build
```

Para os testes funcionais da área administrativa, siga o
[Roteiro de Teste do Administrador](ROTEIRO_TESTE_ADMIN.md).

## 9. Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| `Comando 'npm' não encontrado` | Node.js não instalado (item 3) |
| `npm run dev` do frontend reclama da versão do Node | Node.js abaixo de 22.12. Rode `nvm install 22` |
| Backend: `Não foi possível iniciar o backend.` | Banco desligado, dados errados no `.env` ou banco não preparado. Veja o Manual do Banco de Dados, item 11 |
| Backend: `EADDRINUSE: address already in use :::3000` | Outro programa na porta 3000 (item 7) |
| `localhost:3000` mostra outro sistema | Outro programa na porta 3000 (item 7) |
| Site pisca e fica todo branco | Erro de JavaScript. Abra `F12` → Console e leia a primeira linha em vermelho. Se for `... .map is not a function`, o site está chamando a API no endereço errado (item 7) |
| Site abre, mas aparece "Erro ao carregar" ou "não respondeu em JSON" | Backend desligado ou `VITE_API_URL` apontando para o lugar errado (item 7) |
| Login funciona, mas ao recarregar a página a sessão some | Endereço aberto diferente de `FRONTEND_URL` (ex.: `127.0.0.1` × `localhost`) |
| `Não foi possível validar o CEP agora` ao finalizar compra | O backend não alcança `viacep.com.br` (sem internet ou bloqueado por proxy) |
| `MERCADO_PAGO_ACCESS_TOKEN e FRONTEND_URL devem estar configurados` | Token do Mercado Pago vazio no `.env` (item 5) |