# Correção da AV1 — PSW — Adornatta

Repositório: https://github.com/TamiresMusafir/adornatta

A nota de cada aluno é a parte comum do grupo mais a qualidade individual. Quem não tem commit no aplicativo recebe a parte comum do grupo, sem a parte individual. A parte comum vale 60 pontos: stack da disciplina (30) e escopo funcionando (30). Os 40 restantes avaliam a qualidade do que o próprio aluno fez.

| Aluno | Nota |
| --- | ---: |
| Vinicius da Silva Mendes | 92 |
| Pedro Pimentel Nunes | 92 |
| Tamires Barbosa dos Santos | 56 |
| João Henrique Lima Gualberto | 56 |

## Parte comum — 56/60

A correção usa a branch `main` no fim de 06/10, data do M1 de PSW, o mesmo corte dos outros grupos. O último commit desse dia é `6fa4368`, de Pedro Pimentel Nunes, às 17h51. Nessa versão, `src/components/ProductCard/ProductCard.jsx` importa `gsap` desde o commit `d2cd494`, das 17h41, e o `package.json` não declara a dependência. O commit `cde4f42`, de 13/10, acrescenta `npm install gsap` ao manual. O `gsap` entra no `package.json` em 16/10, no commit `d282a36`, na branch `Mendes-Vinicius/Frontend`.

A stack vale 30/30. O projeto usa React com rotas, React Hook Form, Zod, TanStack Query 5 com mutations, JSON Server e Bootstrap 5. O `src/services/api.js` só segue em frente quando a resposta vem com sucesso. O servidor sobe com `npm run server` em http://localhost:3000.

O escopo vale 26/30. A régua é o refinamento da prototipagem, que o dicionário da EAP repete nos pacotes 1.3 e 1.4: seis entregas de 5 pontos. Com `npm install` e `npm run dev`, o Vite recusa o import de `gsap` e a página fica em branco. Instalei o `gsap` 3.15.0, a versão que o grupo declarou depois, sem gravar no `package.json`, e a loja abriu. A correção percorreu a aplicação com a cliente criada no teste e com a conta `admin@adornatta.com`.

- 5 pontos, cadastro, login e logout. O cadastro vazio mostrou o erro de cada campo, e o e-mail `emailinvalido` com senhas diferentes foi recusado. A conta "Cliente AV1 Recorrecao", `av1.recorrecao@teste.com`, ficou como usuário `SSOzlnbq6XQ` em `GET /usuarios`. A senha errada mostrou "E-mail ou senha inválidos.". "Sair da conta" limpou a sessão, e `/minha-conta` passou a levar ao login.
- 5 pontos, catálogo, categorias, busca e detalhes. Os filtros Brincos, Conjuntos, Pulseiras e Cordões mostraram só os produtos da categoria, conferidos contra `categoriaId` na API. A busca "Ponto de Luz" devolveu o conjunto e a pulseira. A ficha do Conjunto Cruz mostrou preço, descrição, material, banho e disponibilidade.
- 4 pontos, lista de desejos. O Conjunto Cruz e o Bracelete Fino entraram na lista, e a remoção do conjunto deixou só o bracelete. Um recarregamento da página esvaziou a lista, porque ela fica na memória do React.
- 4 pontos, carrinho e checkout. O carrinho somou R$ 119,97 por um Conjunto Cruz e dois Braceletes Finos. O checkout vazio recusou telefone, endereço, cidade, estado e CEP, e o CEP `123` foi recusado sem gravar pedido. Com os dados completos, o pedido `ZtVSEawUuOA` foi gravado `Em análise`, com Pix, e os dois itens apareceram em `GET /itensPedido`. O endereço digitado no checkout não fica no pedido: o painel mostra "Endereço não cadastrado".
- 5 pontos, acompanhamento e controle de pedidos. O painel achou o pedido pela busca "AV1 Recorrecao" e mudou o status para Enviado e depois para Entregue. `GET /pedidos/ZtVSEawUuOA` devolveu cada status. A cliente viu Enviado em `/pedidos/ZtVSEawUuOA` e em "Minha conta", e o filtro "Concluídos" mostrou o pedido Entregue.
- 5 pontos, painel, estoque e vendas. O produto "Cordão AV1 Recorrecao", R$ 45,50, 4 unidades, ficou como `qyyyBVGkg9o`, e o painel passou de 11 para 12 produtos e de 28 para 32 itens. O produto apareceu no filtro Cordões da loja. A edição gravou "Cordão AV1 Recorrecao Editado" e R$ 52,90. Dois aumentos e uma redução deixaram 5 unidades na API. Cada venda de 2 unidades baixou o estoque em 2, e o faturamento do mês somou as vendas. A exclusão devolveu 404 para `GET /produtos/qyyyBVGkg9o`.

Desconto no escopo:

- 2 pontos. O `gsap` falta no `package.json` da entrega. Seguindo o manual, a aplicação abre em branco, e um único `npm install gsap` resolve.

O dicionário pede em 1.3.7 a política de privacidade, a de trocas e devoluções e o frete por região. Essas páginas não existem nesta versão.

## Vinicius da Silva Mendes — 92

A maior parte de `src/` está nos commits dele, inclusive autenticação, checkout, estoque, pedidos e vendas. A nota reúne os 56 pontos do grupo e 36 de qualidade.

Desconto na parte individual:

- 4 pontos. Na versão de 06/10, o manual de instalação manda entrar na pasta `front-end-2`. Essa pasta não existe neste repositório. Quem segue o manual ao pé da letra não chega no `npm install`.

O código que ele escreveu está organizado: serviços separados da tela, formulários com Zod, mutations que invalidam a lista e mensagens de erro quando a API falha.

## Pedro Pimentel Nunes — 92

Há commits dele em cabeçalho, rodapé, card de produto, lista de produtos e lista de desejos, todos de 06/10. A nota reúne os 56 pontos do grupo e 36 de qualidade.

Desconto na parte individual:

- 4 pontos. O commit `d2cd494`, "estilização dos produtos", acrescenta o import de `gsap` ao `ProductCard.jsx` sem incluir a dependência no `package.json`.

Com o `gsap` instalado à parte, o card animado e a lista de produtos lida da API funcionaram na correção. Os pacotes atribuídos a ele no dicionário são carrinho, checkout, acompanhamento do pedido e controle de pedidos. Esses arquivos estão no histórico de Vinicius da Silva Mendes. O que o Pedro entregou foi a apresentação do catálogo.

## Tamires Barbosa dos Santos — 56

Os commits no nome dela são o HTML antigo, hoje em `legacy/`, o README inicial e uma atualização do README. Estoque e vendas, pacotes atribuídos a ela no dicionário, estão no histórico de Vinicius da Silva Mendes. Não há commit dela nesses arquivos. A nota é a parte comum do grupo, 56 pontos. Sem commit no aplicativo React, não há parte individual a avaliar.

## João Henrique Lima Gualberto — 56

Não há commit, e-mail nem arquivo com o nome dele no repositório. O dicionário atribui a ele a página inicial, o cadastro, o catálogo, a lista de desejos e o dashboard. Essas telas existem, no histórico dos outros integrantes. A nota é a parte comum do grupo, 56 pontos. Sem commit, não há parte individual a avaliar.
