# Roteiro de Teste do Administrador

Roteiro para validar a área administrativa do Adornatta em ambiente de
**desenvolvimento**. Marque cada item como OK ou anote o problema
encontrado na coluna **Resultado**.

## 0. Preparação

1. Backend e frontend em execução (Manual de Instalação, item 6).
2. Banco com migrations e seed aplicados (`npm run db:migrate` e
   `npm run db:seed`).
3. `MERCADO_PAGO_ACCESS_TOKEN` preenchido no `backend/.env`. Sem ele o
   backend não cria pedidos. Para testar só o painel, sem pagar, qualquer
   texto serve: o pedido é criado e apenas o link de pagamento falha.
4. Duas contas criadas pelo site (`/cadastro`):
   - **Cliente**: por exemplo `cliente.teste@exemplo.com`;
   - **Admin**: por exemplo `admin.teste@exemplo.com`, promovida no banco:

```bash
psql -h localhost -U adornatta_migr -d adornatta \
  -c "UPDATE usuario SET perfil = 'administrador' WHERE email = 'admin.teste@exemplo.com';"
```

Depois de promover, saia e entre de novo com a conta admin.

Dica: use uma janela anônima para o cliente e a janela normal para o admin,
assim as duas sessões ficam abertas ao mesmo tempo.

## 1. Controle de acesso

| # | Passo | Resultado esperado | Resultado |
|---|---|---|---|
| 1.1 | Sem login, abrir `/admin` | Redireciona para `/login` | |
| 1.2 | Logado como **cliente**, abrir `/admin`, `/admin/estoque`, `/admin/pedidos` e `/admin/vendas` | Redireciona para a página inicial | |
| 1.3 | Logado como cliente, ver a navegação | Ícone do painel administrativo **não** aparece | |
| 1.4 | Fazer login como **admin** | Vai direto para `/admin` | |
| 1.5 | Como admin, ver a navegação da loja | Ícone do painel aparece | |
| 1.6 | Como cliente, abrir no navegador `http://localhost:3000/api/usuarios` | Mensagem "Acesso restrito a administradores." | |
| 1.7 | Como admin, abrir `http://localhost:3000/api/usuarios` | Lista de usuários em JSON | |
| 1.8 | Sair (logout) e tentar voltar a `/admin` | Redireciona para `/login` | |

## 2. Dashboard (`/admin`)

| # | Passo | Resultado esperado | Resultado |
|---|---|---|---|
| 2.1 | Abrir o dashboard | Total de produtos igual ao número de produtos do seed | |
| 2.2 | Conferir "estoque baixo" | Conta produtos com 1 a 3 unidades | |
| 2.3 | Conferir "sem estoque" | Conta produtos com 0 unidades | |
| 2.4 | Clicar nos atalhos | Levam a Estoque, Pedidos e Vendas | |

## 3. Estoque (`/admin/estoque`)

| # | Passo | Resultado esperado | Resultado |
|---|---|---|---|
| 3.1 | Pesquisar um produto pelo nome | Lista filtrada | |
| 3.2 | Filtrar por categoria | Só aparecem produtos da categoria | |
| 3.3 | **Novo produto** com todos os campos válidos (imagem: `/assets/images/brinco_flores.jpeg`) | Mensagem verde de sucesso; produto aparece na lista e em `/produtos` | |
| 3.4 | Novo produto com preço 0 ou descrição com menos de 5 letras | Formulário mostra o erro e não envia | |
| 3.5 | Novo produto com o **mesmo nome** de outro da mesma categoria | O produto não é criado e aparece, no topo da página, a mensagem "Já existe um produto com este nome nesta categoria." | |
| 3.6 | Editar o produto criado (nome e preço) | Alteração aparece na lista e na loja | |
| 3.7 | Usar os botões + e − da quantidade | Quantidade muda; dashboard acompanha | |
| 3.8 | Tentar diminuir abaixo de 0 | Nada acontece | |
| 3.9 | Excluir o produto criado (sem pedidos) | Some da lista | |
| 3.10 | Excluir um produto que já esteja em algum pedido (fazer depois da seção 4) | Aparece a mensagem "Não é possível excluir um produto que já pertence a um pedido." | |

## 4. Pedidos (`/admin/pedidos`)

### 4.1 Criar pedidos de teste (como cliente)

1. Como **cliente**, adicione um produto com estoque ao carrinho e finalize
   a compra (checkout) informando um endereço com CEP real. O backend
   consulta o CEP no ViaCEP, então o computador precisa de internet.
2. Anote o número do pedido. Sem token real do Mercado Pago, a tela de
   acompanhamento mostrará um erro de pagamento; isso é esperado.
3. Repita para ter **dois** pedidos: **A** e **B**.

### 4.2 Testes como admin

| # | Passo | Resultado esperado | Resultado |
|---|---|---|---|
| 4.1 | Abrir `/admin/pedidos` | Pedidos A e B com status **Em análise** | |
| 4.2 | Pesquisar pelo número, nome e e-mail do cliente | Encontra o pedido nos três casos | |
| 4.3 | Abrir os detalhes do pedido A | Mostra cliente, **endereço de entrega** digitado no checkout, produtos, forma e **status do pagamento** ("pendente") | |
| 4.4 | Mudar o pedido A para **Em preparação** | Mensagem: o pedido só pode avançar após a confirmação do pagamento | |
| 4.5 | Mudar o pedido A para **Cancelado** | Status muda para Cancelado. Se houver checkout em andamento, aparece mensagem pedindo para aguardar o Mercado Pago | |
| 4.6 | Conferir o estoque do produto do pedido A | A quantidade voltou ao valor de antes da compra | |
| 4.7 | Abrir o pedido A cancelado e tentar outro status | Mensagem de que não é possível alterar a partir de "Cancelado" | |

### 4.3 Simular pagamento aprovado (somente em desenvolvimento)

Sem conta de teste do Mercado Pago, simule a aprovação do pedido **B**
diretamente no banco (troque `B` pelo número do pedido):

```bash
psql -h localhost -U adornatta_migr -d adornatta -c "
UPDATE pagamento SET status = 'aprovado' WHERE idpedido = B;
UPDATE pedido    SET status = 'confirmado' WHERE idpedido = B;"
```

Com credenciais de teste do Mercado Pago, prefira pagar pelo próprio fluxo
do site; nesse caso o webhook faz essa mudança sozinho.

| # | Passo | Resultado esperado | Resultado |
|---|---|---|---|
| 4.8 | Recarregar `/admin/pedidos` | Pedido B aparece como **Confirmado** | |
| 4.9 | Detalhes do B | Status do pagamento "aprovado"; a lista de status já vem marcada em "Confirmado" | |
| 4.10 | B → **Enviado** (pulando etapa) | Mensagem: não é possível alterar de "Confirmado" para "Enviado" | |
| 4.11 | B → **Em preparação** → **Enviado** → **Entregue** | Cada mudança é aceita | |
| 4.12 | B → **Cancelado** | Mensagem: não é possível alterar a partir de "Entregue" | |
| 4.13 | Como cliente, abrir **Minha conta > Meus pedidos** | Pedido A em cancelados e B em concluídos, com os mesmos status do painel | |

## 5. Vendas (`/admin/vendas`)

| # | Passo | Resultado esperado | Resultado |
|---|---|---|---|
| 5.1 | Abrir Vendas | Só aparece o pedido **B** (pagamento aprovado); o A não aparece | |
| 5.2 | Conferir "faturamento do mês" | Igual ao valor total do pedido B | |
| 5.3 | Abrir os detalhes da venda | Cliente, data, forma de pagamento, status "Entregue" e produtos | |
| 5.4 | Pesquisar a venda | Encontra o pedido B | |

## 6. Sessão

| # | Passo | Resultado esperado | Resultado |
|---|---|---|---|
| 6.1 | Com o admin logado, recarregar a página (F5) em `/admin/pedidos` | Continua logado | |
| 6.2 | Depois de 1 hora sem novo login, executar qualquer ação no painel | Pede login novamente | |

## Registro do teste

| Campo | Preenchimento |
|---|---|
| Data | |
| Responsável | |
| Navegador | |
| Itens com falha | |
| Observações | |