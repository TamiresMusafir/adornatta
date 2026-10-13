# Correção da AV1 — PSW — Adornatta

Repositório: https://github.com/TamiresMusafir/adornatta

A nota de cada aluno é a parte comum do grupo mais a qualidade individual. Sem autoria efetiva na própria parte, a AV1 fica 0. A parte comum vale 60 pontos: stack da disciplina (30) e escopo funcionando (30). Os 40 restantes avaliam a qualidade do que o próprio aluno fez.

| Aluno | Nota |
| --- | ---: |
| Vinicius da Silva Mendes | 66 |
| Pedro Pimentel Nunes | 40 |
| Tamires Barbosa dos Santos | 0 |
| João Henrique Lima Gualberto | 0 |

## Parte comum — 30/60

A stack vale 30/30. O projeto usa React com rotas, React Hook Form, Zod, TanStack Query 5 com mutations, JSON Server e Bootstrap 5. O `src/services/api.js` só segue em frente quando a resposta vem com sucesso. O servidor sobe com `npm run server` em http://localhost:3000.

O escopo vale 0/30. O frontend não abre. `npm run dev` sobe o Vite, e tanto `/` quanto `/login` ficam em branco. O motivo está em `src/components/ProductCard/ProductCard.jsx`: o arquivo importa `gsap`, e `gsap` não está no `package.json`. A página inicial importa esse componente, e o `App.jsx` importa a página inicial, então a aplicação inteira deixa de montar.

Sem a tela, não foi possível percorrer catálogo, cadastro, carrinho, checkout, pedidos nem o painel. No código, o carrinho e a lista de desejos ficam só na memória da página: um recarregamento apaga os dois. Não há página de política de privacidade, de trocas e devoluções, nem frete por região, pedidos no dicionário da EAP em 1.3.7.

## Vinicius da Silva Mendes — 66

A maior parte de `src/` está nos commits dele, inclusive autenticação, checkout, estoque, pedidos e vendas. A nota reúne os 30 pontos de stack e 36 de qualidade. O escopo não entra, porque a aplicação não abre.

Desconto na parte individual:

- 4 pontos. O manual de instalação manda entrar na pasta `front-end-2`. Essa pasta não existe neste repositório. Quem segue o manual ao pé da letra não chega no `npm install`.

O código que ele escreveu está organizado: serviços separados da tela, formulários com Zod, mutations que invalidam a lista e mensagens de erro quando a API falha.

## Pedro Pimentel Nunes — 40

Há commits dele em cabeçalho, rodapé, card de produto, lista de produtos e lista de desejos. A nota reúne os 30 pontos de stack e 10 de qualidade.

Desconto na parte individual:

- 30 pontos. O commit de estilização do card importa `gsap` sem declarar a dependência. Esse import impede a aplicação de abrir. A parte que ele alterou, na entrega atual, não chega a ser usada.

Os pacotes atribuídos a ele no dicionário são carrinho, checkout, acompanhamento do pedido e controle de pedidos. Esses arquivos estão no histórico de Vinicius da Silva Mendes. O que o Pedro entregou foi a apresentação do catálogo, e essa apresentação quebra a abertura do sistema.

## Tamires Barbosa dos Santos — 0

Os commits no nome dela são o HTML antigo, hoje em `legacy/`, o README inicial e uma atualização do README. Estoque e vendas, pacotes atribuídos a ela no dicionário, estão no histórico de Vinicius da Silva Mendes. Não há commit dela nesses arquivos. Sem autoria efetiva nessa parte, a AV1 fica 0.

## João Henrique Lima Gualberto — 0

Não há commit, e-mail nem arquivo com o nome dele no repositório. O dicionário atribui a ele a página inicial, o cadastro, o catálogo, a lista de desejos e o dashboard. Essas telas existem, no histórico dos outros integrantes. Sem commit próprio, a AV1 fica 0.
