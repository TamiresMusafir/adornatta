# Correção da AV1 — GPTI — Adornatta

Repositório: https://github.com/TamiresMusafir/adornatta (artefatos em `GPTI_docs/` na branch principal).

Artefatos: `GPTI_docs/Termo de Abertura e Business Case  - Adornatta.md` (os dois documentos no mesmo arquivo), `GPTI_docs/Plano de projeto - Adornatta.md`, `GPTI_docs/Dicionario EAP - Adornatta.md`.

A nota é do Grupo A de GPTI e vale para cada aluno do grupo. Nesta etapa, a ausência de commit não zera ninguém. O nome na atividade do cronograma é o contrato da etapa seguinte. A especificação de referência é a loja da Adornatta corrigida na AV1 de PSW: catálogo com Brincos, Conjuntos, Pulseiras e Cordões, lista de desejos, carrinho, status do pedido em Em análise, Em preparação, Enviado, Entregue ou Cancelado, e painel de estoque e vendas, sobre `json-server`.

| Aluno | Nota |
| --- | ---: |
| Fernando Lira Barbosa | 68 |
| Matheus Dinis Francellino | 68 |
| Gabriel Felipe Martins da Silva | 68 |
| Igor Roberto da Silva Tabelini | 68 |

## Parte comum — 68/100

| Parte | Nota |
| --- | ---: |
| Business case | 10/10 |
| Termo de abertura | 13/15 |
| Escopo e EAP | 13/15 |
| Cronograma com nomes | 6/25 |
| Custo, partes e riscos | 11/15 |
| Dicionário da EAP | 11/15 |
| Um projeto só | 4/5 |

A diferença entre protótipo e implantação comercial atravessa os três arquivos. Ela é cobrada uma vez em cada lugar em que muda a linha de base: no termo, que autoriza a implantação; na EAP, que a inclui como pacotes; e em um projeto só, pela divergência entre os documentos. Os demais itens são avaliados pelo que trazem, sem repetir esse desconto.

### Business case — 10/10

O caso é o da loja de semijoias: contexto do Instagram e do WhatsApp, problema, oportunidade, objetivos com indicador e meta, alternativas e análise financeira com cenários. A linha de base de R$ 57.508 e os indicadores de benefício líquido e payback são os da operação comercial; a escolha pela implantação como objeto do caso entra no desconto do termo e de um projeto só.

### Termo de abertura — 13/15

O termo nomeia o patrocinador e os quatro gerentes, traz objetivos com meta e medição, escopo de alto nível, premissas, riscos, marcos, partes interessadas, critérios de encerramento, orçamento e aprovação. Caso e termo estão no mesmo arquivo, com um "Resumo do Business Case (versão do Termo)" dentro do termo; os dois documentos estão completos e separados por seção.

Desconto:

- 2 pontos. O que o termo autoriza é o lançamento da loja em produção até a AV2 (marco 4), com 70% das vendas migradas em três meses, medição pelo gerente da Adornatta e Termo de Aceite assinado pelos proprietários. A entrega desta disciplina é o protótipo; o termo autoriza uma implantação.

### Escopo e EAP — 13/15

Os pacotes 1.3 (módulo do cliente) e 1.4 (painel) são a loja da especificação: catálogo por categoria, lista de desejos, carrinho e checkout, acompanhamento do pedido pelos cinco status, dashboard, estoque e vendas. A rastreabilidade liga requisito e pacote. A frase da seção 5.3 sobre durações e datas ainda por estimar é do cronograma e está cobrada lá.

Desconto:

- 2 pontos. A EAP inclui 1.8.1 a 1.8.5: carga do catálogo real, linha de base dos indicadores da loja de 26/10 a 24/11, treinamento, lançamento e Termo de Aceite. São pacotes de uma implantação, fora do protótipo que a PSW especificou.

### Cronograma com nomes — 6/25

Há marcos (5.2), uma sequência de pacotes (5.3), esforço por pacote (5.4) e um caminho crítico no nível de pacote: 1.5 até 10/11, 1.6 rodada 2 de 11 a 17/11 e 1.8.1/1.8.4 até 25/11, com folga de 15 dias entre o fim do backend e o lançamento.

Descontos:

- 12 pontos. Não há lista de atividades com uma pessoa, uma predecessora e uma duração. O cronograma para no pacote, e a seção 5.3 diz que durações e datas ainda serão estimadas.
- 7 pontos. Não há tabela semanal com uma pessoa, uma tarefa e as horas. A seção 5.5 é a RAM, e nela a coluna A é a equipe: "GPTI" ou "PSW".

### Custo, partes e riscos — 11/15

O orçamento (6.2) tem R$ 52.280 de trabalho e R$ 5.228 de reserva de contingência (10%), liberada só com autorização do patrocinador. O esforço de 1.980 h de PSW e 520 h de GPTI é coerente com a implantação que o termo autoriza. Há doze riscos com probabilidade, impacto e resposta; o risco 6 é o `json-server` em produção, com migração antes do lançamento. Há plano de engajamento e cadência de comunicação.

Descontos:

- 2 pontos. A contingência é um percentual, 10%, sem ligação com um evento de risco deste plano, e não há reserva gerencial separada.
- 1 ponto. Os doze riscos são ameaças. Não há uma oportunidade registrada com resposta.
- 1 ponto. Os responsáveis por risco e por comunicação são a equipe ou o papel, não uma pessoa.

### Dicionário da EAP — 11/15

O aceite é observável e é o da loja: "Cada filtro (Brincos, Conjuntos, Pulseiras, Cordões) retorna só a sua categoria"; "O cliente vê o status do pedido entre Em análise, Em preparação, Enviado, Entregue e Cancelado"; "O pedido finalizado aparece no painel (1.4.3)". Os pacotes 1.8.1 a 1.8.5 têm aceite coerente com a EAP, e a inclusão deles está cobrada na EAP.

Descontos:

- 3 pontos. A coluna A é "GPTI" ou "PSW" em todos os pacotes. A coluna "Responsável nominal (A)" usa os códigos PSW-1 a PSW-4 e GPTI-1 a GPTI-4, e o preâmbulo diz que ela "é uma proposta de distribuição". Em 1.1.1 e 1.1.2 o nominal é "GPTI-1 a GPTI-4", ou seja, ninguém sozinho.
- 1 ponto. Em 1.3.7 o R é "PSW implementa; GPTI redige os textos com a Adornatta", sem a pessoa.

### Um projeto só — 4/5

O produto é o mesmo nos três arquivos e os códigos da EAP batem com o dicionário.

Desconto:

- 1 ponto. Caso e termo descrevem um lançamento comercial com 1.980 h e R$ 57.508; a especificação da PSW e o aceite de 1.3 e 1.4 descrevem o protótipo de 5 h semanais. Os documentos não falam da mesma linha de base.

## O que esta nota deixa para a etapa seguinte

A etapa seguinte não tem semana e tarefa no nome de cada pessoa. O que existe é a proposta de códigos do dicionário. Onde o nominal é um intervalo ("GPTI-1 a GPTI-4"), ninguém presta contas sozinho do pacote. Onde aparece um código único, como GPTI-1 em 1.8.2 e 1.8.5 e PSW-1 e PSW-2 em 1.3, a cobrança depende de aceitar a ordem da legenda: GPTI-1 Fernando Lira Barbosa, GPTI-2 Gabriel Felipe Martins da Silva, GPTI-3 Igor Roberto da Silva Tabelini, GPTI-4 Matheus Dinis Francellino; PSW-1 João, PSW-2 Pedro, PSW-3 Tamires, PSW-4 Vinicius.
