# Plano de Projeto — Adornatta
 
**Data:** 04/10/2026  
**Patrocinador:** Diogo Silveira Mendonça  


> **Convenções:** **TA** = Termo de Abertura · **BC** = Business Case · **GPTI** = equipe de gerência (4 gerentes) · **PSW** = equipe de desenvolvimento (4 desenvolvedores) · **AV1 (PSW)** = entrega do front-end em 05/10/2026 (na disciplina de Gerência, a AV1 é a entrega dos documentos TA, BC, plano e dicionário da EAP) · **AV2** = entrega final, fim de novembro/2026.



## Linha de base resumida

| Item | Valor aprovado ou situação | Referência |
|---|---|---|
| Solução escolhida | sistema web próprio e integrado (catálogo, pedidos, estoque e vendas) | TA, BC §5 |
| Início do projeto | 25/08/2026 | TA |
| AV1 (PSW) — Front-end da área do cliente e do painel administrativo | 05/10/2026 | Calendário da disciplina; escopo da AV1 confirmado pelo grupo |
| Orçamento simulado | R$ 57.508,00 (R$ 52.280,00 + reserva de 10% = R$ 5.228,00) | TA, BC §7 |
| Equipe de desenvolvimento | 4 desenvolvedores (equipe PSW) | TA |
| Gerência | 4 gerentes, decisão por maioria; patrocinador desempata (equipe GPTI) | TA |
| Tecnologia atual | React, Vite, React Router, Bootstrap; back-end simulado (json-server) | BC §6 |

## 1. Objetivo e justificativa

### 1.1 Objetivo

Centralizar a venda e a busca de semijoias em um único ambiente virtual, melhorando a experiência de compra do cliente e o controle operacional da loja. O sistema reúne catálogo, carrinho, checkout, acompanhamento do pedido e um painel administrativo de produtos, estoque, pedidos e vendas. 

### 1.2 Caso de negócio

A Adornatta vende principalmente pelo Instagram e pelo WhatsApp. Com o crescimento do volume, os pedidos se misturam em conversas, o cliente tem dificuldade de saber o que está disponível e a loja não tem um registro único de estoque. 

| Aspecto | Resumo |
|---|---|
| Alternativas | A: reforçar o atendimento manual · **B: sistema web próprio (escolhida)** · C: plataforma pronta (ex.: Nuvemshop) · D: manter como está  |
| Por que B | O problema envolve também atualização de dados e controle de entrada e saída de produtos. A Opção C foi descartada pela limitação de personalização do controle de estoque e pela dependência do fornecedor. Essa escolha depende de regras de estoque específicas da loja, a confirmar nas entrevistas (1.2.1); a Opção C não foi modelada financeiramente. |
| Trade-off | A Opção C é mais barata e rápida. A Opção B custa mais e leva 4 meses, mas dá controle total de estoque e dados, sem mensalidade de plataforma. |
| Custo | R$ 57.508,00 (custo alocado do projeto). Encargos CLT não incluídos; com eles o custo seria cerca de R$ 107.558,00. |
| Viabilidade | Com dados de mercado de 2026, o cenário base gera benefício líquido de cerca de R$ 522/mês e não recupera o investimento em 36 meses (VPL −R$ 42.002). O cenário otimista tem payback de 24 meses e VPL +R$ 12.989. O projeto se sustenta por benefícios estratégicos e operacionais. |
| Decisão solicitada | Seguir com a Opção B. |

### 1.3 Objetivos e indicadores de sucesso

| Objetivo | Indicador | Linha de base | Meta e prazo | Quem mede / valida |
|---|---|---|---|---|
| 1. Migrar vendas para a plataforma | Pedidos pelo site ÷ total de pedidos | 0% | 60% no 1º mês e 70% no 3º mês após o lançamento | Mede: gerente da Adornatta · Valida: proprietários |
| 2. Reduzir erros operacionais | Erros de pedido e falhas de envio ÷ total de pedidos | Levantada nos 30 dias antes do lançamento | Redução de 80% no 3º mês | Mede: gerente da Adornatta · Valida: proprietários |
| 3. Dar visibilidade ao catálogo e ao estoque | Produtos ativos com estoque atualizado ÷ total de produtos ativos | 0% | 100% no lançamento, mantido por 3 meses (estoque atualizado a cada venda ou ajuste) | Valida: gerente da loja |
| Aceite da gestão | Termo de Aceite assinado | — | Até a data da AV2 | Proprietários e patrocinador |

As metas do 1º e do 3º mês são medidas depois do término do projeto. A medição é feita pelo gerente da Adornatta, com apoio do patrocinador, e registrada no Termo de Aceite. 



## 2. EAP / WBS

A EAP decompõe as quatro Entregas Principais do TA e as atividades de projeto. Seus níveis representam hierarquia, não datas nem sequência. O dicionário completo, com entrega, responsáveis (A e R) e aceite observável de cada pacote, está no arquivo [Dicionário EAP - Adornatta.md](Dicionario%20EAP%20-%20Adornatta.md).

```text
1.0 Projeto Adornatta
  1.1 Gestão e coordenação
    1.1.1 Termo, business case e plano mantidos
    1.1.2 Decisões, riscos e mudanças
    1.1.3 Orçamento e reserva acompanhados
    1.1.4 Prestação de contas e aceites dos marcos
  1.2 Requisitos e protótipo                                 (Entrega Principal 1)
    1.2.1 Requisitos levantados
    1.2.2 Escopo e limites registrados
    1.2.3 Atores e fluxos
    1.2.4 Protótipo interativo
    1.2.5 Validação do protótipo
  1.3 Módulo do Cliente                                      (Entrega Principal 2)
    1.3.1 Página inicial e páginas institucionais
    1.3.2 Cadastro, login e logout
    1.3.3 Catálogo, categorias, busca e detalhes
    1.3.4 Lista de desejos
    1.3.5 Carrinho e checkout
    1.3.6 Acompanhamento do pedido
    1.3.7 Informações legais e frete
  1.4 Painel Administrativo                                  (Entrega Principal 3)
    1.4.1 Dashboard
    1.4.2 Estoque e cadastro de produtos
    1.4.3 Controle de pedidos
    1.4.4 Registro de vendas
  1.5 Back-end e banco de dados reais
    1.5.1 API de produtos e estoque
    1.5.2 API de pedidos
    1.5.3 API de vendas e baixa de estoque
    1.5.4 API da lista de desejos
    1.5.5 Cadastro, autenticação e controle de acesso
    1.5.6 Pagamento por intermediador
  1.6 Integração e homologação
    1.6.1 Fluxos principais
    1.6.2 Compra e estoque
    1.6.3 Computador e celular
    1.6.4 Defeitos tratados
    1.6.5 Homologação aceita
  1.7 Documentação técnica e de uso                          (Entrega Principal 4)
    1.7.1 Manual de Instalação
    1.7.2 Manual de Operação do painel
    1.7.3 Manual do Usuário
    1.7.4 Documentação técnica
  1.8 Verificação e encerramento
    1.8.1 Carga inicial do catálogo e do estoque
    1.8.2 Linha de base dos indicadores
    1.8.3 Treinamento da equipe da loja
    1.8.4 Lançamento em produção
    1.8.5 Termo de Aceite e encerramento
```

## 3. Requisitos e regras de negócio

### 3.1 Requisitos

| ID | Tipo | Requisito | Origem | EAP | Critério de aceite |
|---|---|---|---|---|---|
| RN-01 | Regra de negócio | Migrar vendas para a plataforma: 60% dos pedidos no 1º mês e 70% no 3º mês após o lançamento. | TA (Objetivo 1) | 1.0 | Medição pelo gerente da Adornatta; validação pelos proprietários. |
| RN-02 | Regra de negócio | Reduzir em 80% os erros de pedido e falhas de envio no 3º mês. | TA (Objetivo 2) | 1.0 | Redução de 80% em relação à linha de base dos 30 dias antes do lançamento; medição pelo gerente da Adornatta e validação pelos proprietários. |
| RN-03 | Regra de negócio | Manter 100% dos produtos ativos com estoque atualizado (a cada venda ou ajuste). | TA (Objetivo 3) | 1.4.2, 1.4.4, 1.5.1, 1.5.3, 1.8.1 | Validação pelo gerente da loja. |
| RF-01 | Funcional | Exibir página inicial e navegar entre as páginas do sistema. | BC §6 | 1.3.1 | Cada destino abre a página correspondente. |
| RF-02 | Funcional | Cadastro de usuário, login e logout. | TA (escopo); BC §6 | 1.3.2, 1.5.5 | Cliente cria conta, entra e sai. |
| RF-03 | Funcional | Exibir produtos com nome, descrição, preço, imagem, categoria, material, tipo de banho e disponibilidade; categorias Brincos, Conjuntos, Pulseiras e Cordões; filtro por categoria; busca; detalhes do produto. | TA; BC §6 | 1.3.3 | Catálogo consultável, filtrável e pesquisável. |
| RF-04 | Funcional | Lista de desejos. | TA; BC §6 | 1.3.4, 1.5.4 | Cliente adiciona e remove itens. |
| RF-05 | Funcional | Carrinho, checkout com validação e pagamento por intermediador (Pix e cartão). | TA | 1.3.5, 1.3.7, 1.5.6 | Compras de teste com Pix e cartão, em ambiente de homologação do intermediador, executadas sem erro crítico. |
| RF-06 | Funcional | Acompanhar o pedido por status (Em análise, Em preparação, Enviado, Entregue, Cancelado). | TA | 1.3.6, 1.4.3, 1.5.2 | Cliente vê o status; administrador o altera. |
| RF-07 | Funcional | Dashboard: total de produtos, itens em estoque, estoque baixo e sem estoque. | BC §6 | 1.4.1 | Indicadores exibidos corretamente. |
| RF-08 | Funcional | CRUD de produtos e controle de estoque: cadastrar, editar, excluir, pesquisar e ajustar quantidades. | TA; BC §6 | 1.4.2, 1.5.1 | Produto cadastrado aparece no catálogo. |
| RF-09 | Funcional | Controle de pedidos realizados: consultar, pesquisar e alterar status. | TA; BC §6 | 1.4.3, 1.5.2 | Status alterado é refletido ao cliente. |
| RF-10 | Funcional | Registrar venda com baixa automática de estoque; exibir vendas e faturamento do mês. | TA; BC §6 | 1.4.4, 1.5.3 | Estoque diminui ao registrar a venda. |
| RF-11 | Funcional | Páginas institucionais Sobre nós e Contato. | BC §6 | 1.3.1 | Conteúdo acessível pela navegação.  |
| RF-12 | Funcional | Documentação de uso: manual ou guia rápido do painel e manuais de Instalação, Operação e Usuário. | TA; BC §6 | 1.7 | Documentação entregue à equipe da Adornatta. |
| RF-13 | Funcional | Exibir política de privacidade, política de trocas e devoluções e dados da empresa; informar frete e prazo no checkout por tabela de regiões definida pela loja; confirmar o pedido com resumo. | BC §10; Decreto nº 7.962/2013 | 1.3.7, 1.5.2 | Textos acessíveis pela navegação; frete e prazo exibidos antes de finalizar; confirmação do pedido com itens, preço, frete e prazo. |
| RNF-01 | Não funcional | Uso do catálogo e dos filtros em computador e celular, sem rolagem horizontal. | Decisão da equipe de gerência | 1.3, 1.6 | Navegação e filtros utilizáveis nos dois formatos. |
| RNF-02 | Não funcional | Tecnologias web padrão, de fácil manutenção, sem licenças proprietárias pagas de alto valor. | TA (Restrições) | Todos | Tecnologias descritas na documentação técnica (1.7.4) são padrão, de fácil manutenção e sem licença proprietária paga de alto valor. |
| RNF-03 | Não funcional | Conformidade com LGPD, Código de Defesa do Consumidor e Decreto nº 7.962/2013 (BC §10; validação jurídica recomendada). | BC §10 | 1.3.7, 1.5.5, 1.6, 1.8 | Política de privacidade, informações de empresa, preço, frete e prazos, confirmação do pedido. |

### 3.2 Premissas e regras do produto

- O json-server é adequado para desenvolvimento e homologação, mas não para produção. Antes do lançamento é necessário back-end e banco de dados reais. 
- Premissas do TA: gerente da loja liberado para entrevistas; conteúdo, fotos e descrições fornecidos pela Adornatta; hospedagem disponível; clientes aceitam ser direcionados do Instagram e do WhatsApp; equipe interna engajada; dados reais fornecidos pela loja; intermediador de pagamentos disponível. A maioria tem risco associado (seção 6.3); as premissas de hospedagem paga pela loja e de dados reais fornecidos pela loja são acompanhadas fora da lista numerada.

## 4. Linha de base do escopo

### 4.1 Declaração

Entregar uma loja virtual de semijoias com área do cliente (cadastro/login, catálogo, busca, lista de desejos, carrinho, checkout com pagamento por intermediador e frete por região, acompanhamento do pedido, informações legais da loja) e painel administrativo (dashboard, produtos e estoque, pedidos, vendas), documentação de uso e lançamento em produção até a data da AV2. 

### 4.2 Dentro e fora

**Dentro:** CRUD de produtos; cadastro de usuário; sistema de compras (carrinho, checkout e pagamento por intermediador, com Pix e cartão); acompanhamento do pedido por status; controle de pedidos; documentação de uso; busca de produtos, lista de desejos, dashboard administrativo e registro de vendas; informações legais da loja (política de privacidade, trocas e devoluções e dados da empresa) e frete e prazo por tabela de regiões definida pela Adornatta, sem integração com transportadoras.

**Fora:** transferir dados de clientes de outras plataformas; aplicativo móvel; chatbot no WhatsApp/Instagram; integração com ERP ou sistemas fiscais de grande porte; integração com transportadoras e emissão de códigos de rastreio.

### 4.3 Rastreabilidade

| Requisito | Pacote EAP | Evidência de aceite |
|---|---|---|
| RN-01, RN-02 | 1.0 (medição pós-projeto) | Registro no Termo de Aceite. |
| RN-03 | 1.4.2, 1.4.4, 1.5.1, 1.5.3, 1.8.1 | Produtos ativos com estoque atualizado. |
| RF-01, RF-11 | 1.3.1 | Páginas abrem corretamente. |
| RF-02 | 1.3.2, 1.5.5 | Cadastro, login e logout funcionam. |
| RF-03 | 1.3.3 | Catálogo, filtros, busca e detalhes funcionam. |
| RF-04 | 1.3.4, 1.5.4 | Lista de desejos funciona. |
| RF-05 | 1.3.5, 1.3.7, 1.5.6 | Compra de teste com Pix e cartão, em homologação do intermediador, sem erro crítico. |
| RF-06 | 1.3.6, 1.4.3, 1.5.2 | Status exibido e alterado. |
| RF-07 | 1.4.1 | Dashboard exibe os indicadores. |
| RF-08 | 1.4.2, 1.5.1 | Cadastro de produto e ajuste de estoque. |
| RF-09 | 1.4.3, 1.5.2 | Consulta e alteração de status. |
| RF-10 | 1.4.4, 1.5.3 | Venda registrada com baixa de estoque. |
| RF-12 | 1.7 | Documentação entregue. |
| RF-13 | 1.3.7, 1.5.2 | Políticas e dados da empresa acessíveis; frete e prazo no checkout. |
| RNF-01 | 1.3, 1.6 | Uso em computador e celular sem rolagem horizontal. |
| RNF-02 | Todos | Revisão das tecnologias adotadas (documentação técnica, 1.7.4): padrão, de fácil manutenção e sem licença proprietária paga de alto valor. |
| RNF-03 | 1.3.7, 1.5.5, 1.6, 1.8 | Política de privacidade, informações da empresa, preço, frete e prazos e confirmação do pedido presentes; validação jurídica recomendada. |


## 5. Cronograma

### 5.1 Planejar o gerenciamento do cronograma

- Datas de referência: início em 25/08/2026; AV1 (PSW) em 05/10/2026 (calendário da disciplina); back-end real em 10/11/2026 e aceite/encerramento em 30/11/2026 (datas de referência, a confirmar com o patrocinador — risco 11).
- Prazo do TA: entrega final na data da AV2 (final de novembro). Duração prevista: 4 meses (agosto a novembro de 2026).
- Mudanças de escopo, prazo, orçamento ou uso da reserva de contingência exigem aprovação do patrocinador.

### 5.2 Marcos

| Marco | Período | Entregável | Fonte |
|---|---|---|---|
| 1. Termo de Abertura aprovado e requisitos levantados | Agosto/2026  | Termo de Abertura e requisitos | TA |
| 2. Protótipo de interface (UI/UX) validado pela gestão da Adornatta | Setembro/2026 | Protótipo interativo aprovado | TA |
| AV1 (PSW). Front-end | 05/10/2026 | Front-end da área do cliente (1.3) e do painel administrativo (1.4) entregue | Calendário da disciplina; escopo da AV1 confirmado pelo grupo |
| 3. Sistema integrado (catálogo + carrinho + painel) testado e homologado | Outubro/2026 | Sistema homologado, ainda com back-end simulado | TA; BC §6 |
| Back-end real | 10/11/2026 | API e banco de dados reais, entrega PSW | BC §6 |
| 4. Implantação em produção e lançamento oficial | Novembro/2026, até a AV2 | Loja em produção, documentação e Termo de Aceite | TA |
| Aceite/encerramento | 30/11/2026 | Termo de Aceite assinado pelos proprietários e aprovação final do patrocinador | TA |

As datas por mês vêm do TA e do BC; a data da AV1 (PSW) vem do calendário da disciplina; as do back-end real (10/11) e do aceite (30/11) são datas de referência a confirmar. O Marco 3 (outubro) homologa o sistema com back-end simulado; a integração com o back-end real é testada depois de 10/11, antes do lançamento.

### 5.3 Definir e sequenciar as atividades

Sequência lógica:

| Ordem | Atividade / saída | Predecessora |
|---:|---|---|
| 1 | Formação das equipes e início | 17/09 |
| 2 | Levantamento de requisitos (entrevistas com o gerente da loja) | 1 |
| 3 | Protótipo da interface, validação pela gestão da Adornatta (Marco 2) | 2 |
| 4 | Desenvolvimento do front-end (cliente e painel) | 3 |
| 5 | Testes e preparação da entrega da AV1 (**AV1 (PSW) — 05/10/2026**) | 4 |
| 6 | Definição de contrato da API e escolha do intermediador de pagamento | 2 |
| 7 | Implementação do back-end real e do banco de dados | 6 |
| 8 | Integração, testes e homologação com back-end simulado (Marco 3) | 5 |
| 9 | Documentação técnica e de uso | 8 |
| 10 | Integração com o back-end real, testes finais, implantação em produção e treinamento da equipe da loja | 7, 8, 9, 13 |
| 11 | Lançamento e Termo de Aceite (**Marco 4**) | 10, 12 |
| 12 | Linha de base dos indicadores (30 dias antes do lançamento, em paralelo às atividades 7 a 10) | 2 |
| 13 | Informações legais e frete (1.3.7), com os insumos da Adornatta | 3 |

A sequência é uma proposta do grupo; durações e datas detalhadas ainda serão estimadas. A atividade 6 antecipa a definição do pagamento, conforme a resposta ao risco 7 do BC.

### 5.4 Estimar recursos e durações

| Equipe | Composição | Papel |
|---|---:|---|
| PSW | 4 desenvolvedores | Desenvolvimento e impacto técnico. |
| GPTI | 4 gerentes | Gestão, acompanhamento, riscos, comunicação e documentação. |

**Janelas propostas por grupo de pacotes.** São uma proposta de planejamento. As horas por pacote estão logo abaixo da tabela.

| Pacotes | Janela proposta | Marco | Depende de |
|---|---|---|---|
| 1.1 Gestão | 25/08 a 30/11 (contínuo) | Todos | — |
| 1.2 Requisitos e protótipo | 25/08 a 30/09 | Marcos 1 e 2 | — |
| 1.3 (exceto 1.3.7) e 1.4 | Setembro a 05/10 | AV1 (PSW) | 1.2.4 |
| 1.3.7 Informações legais e frete | 06/10 a 06/11 | Marco 3 (telas) | Insumos da Adornatta |
| 1.5 Back-end e banco reais | 06/10 a 10/11 | Back-end real | Intermediador de pagamento definido até 16/10 |
| 1.6 Homologação | Rodada 1: 06/10 a 30/10 (back-end simulado). Rodada 2: 11/11 a 17/11 (back-end real) | Marco 3 | 1.3, 1.4; depois 1.5 |
| 1.7 Documentação | 26/10 a 20/11 | Marco 4 | 1.6 (rodada 1) e 1.5 |
| 1.8.1 Carga do catálogo e do estoque | 11/11 a 20/11 | Marco 4 | 1.5 e fotos e descrições da Adornatta até 06/11 |
| 1.8.2 Linha de base dos indicadores | 26/10 a 24/11 | — | Lançamento em 25/11 |
| 1.8.3 Treinamento da equipe da loja | 18/11 a 24/11 | Marco 4 | 1.7.2 e 1.8.1 |
| 1.8.4 Lançamento em produção | Até 25/11 | Marco 4 | 1.6 (rodada 2), 1.8.1 e 1.8.3 |
| 1.8.5 Termo de Aceite | 26/11 a 30/11 | Aceite | 1.8.4 |

**Esforço estimado por pacote (horas).** 

| Pacote | Entrega | PSW (h) | GPTI (h) |
|---|---|---:|---:|
| 1.1.1 | Termo, business case e plano mantidos | 0 | 30 |
| 1.1.2 | Decisões, riscos e mudanças | 84 | 60 |
| 1.1.3 | Orçamento e reserva acompanhados | 0 | 40 |
| 1.1.4 | Prestação de contas e aceites dos marcos | 0 | 50 |
| 1.2.1 | Requisitos levantados | 40 | 30 |
| 1.2.2 | Escopo e limites registrados | 0 | 16 |
| 1.2.3 | Atores e fluxos | 24 | 0 |
| 1.2.4 | Protótipo interativo | 120 | 0 |
| 1.2.5 | Validação do protótipo | 0 | 16 |
| 1.3.1 | Página inicial e páginas institucionais | 40 | 0 |
| 1.3.2 | Cadastro, login e logout | 60 | 0 |
| 1.3.3 | Catálogo, categorias, busca e detalhes | 160 | 0 |
| 1.3.4 | Lista de desejos | 40 | 0 |
| 1.3.5 | Carrinho e checkout | 120 | 0 |
| 1.3.6 | Acompanhamento do pedido | 60 | 0 |
| 1.3.7 | Informações legais e frete | 70 | 16 |
| 1.4.1 | Dashboard | 50 | 0 |
| 1.4.2 | Estoque e cadastro de produtos | 130 | 0 |
| 1.4.3 | Controle de pedidos | 80 | 0 |
| 1.4.4 | Registro de vendas | 80 | 0 |
| 1.5.1 | API de produtos e estoque | 80 | 0 |
| 1.5.2 | API de pedidos | 80 | 0 |
| 1.5.3 | API de vendas e baixa de estoque | 70 | 0 |
| 1.5.4 | API da lista de desejos | 40 | 0 |
| 1.5.5 | Cadastro, autenticação e controle de acesso | 110 | 0 |
| 1.5.6 | Pagamento por intermediador | 110 | 0 |
| 1.6.1 | Fluxos principais | 40 | 20 |
| 1.6.2 | Compra e estoque | 40 | 20 |
| 1.6.3 | Computador e celular | 30 | 10 |
| 1.6.4 | Defeitos tratados | 30 | 0 |
| 1.6.5 | Homologação aceita | 0 | 10 |
| 1.7.1 | Manual de Instalação | 24 | 6 |
| 1.7.2 | Manual de Operação do painel | 0 | 30 |
| 1.7.3 | Manual do Usuário | 0 | 40 |
| 1.7.4 | Documentação técnica | 60 | 6 |
| 1.8.1 | Carga inicial do catálogo e do estoque | 40 | 30 |
| 1.8.2 | Linha de base dos indicadores | 0 | 16 |
| 1.8.3 | Treinamento da equipe da loja | 8 | 20 |
| 1.8.4 | Lançamento em produção | 60 | 30 |
| 1.8.5 | Termo de Aceite e encerramento | 0 | 24 |
| | **Total** | **1980** | **520** |

**Capacidade.** O orçamento considera 160 h por mês por desenvolvedor: 4 × 160 h × 4 meses = 2.560 h. As 1.980 h estimadas para a PSW usam 77% dessa capacidade e deixam 580 h de folga para reuniões, retrabalho e imprevistos (risco 12). As 520 h da GPTI não estão no orçamento (horas de gestão não orçadas, seção 6.2).

Os insumos da Adornatta (fotos, descrições, dados da empresa, tabela de frete e revisão dos textos legais) são esperados até 06/11/2026. **Caminho crítico:** 1.5 (até 10/11), 1.6 rodada 2 (11 a 17/11) e 1.8.1/1.8.4 (até 25/11). A folga entre o fim do back-end e o lançamento é de 15 dias; atraso no back-end consome essa folga, e o instrumento previsto é a reserva de contingência (risco 6).

### 5.5 Matriz de responsabilidades e fazer-ou-comprar

**A** = equipe que responde pela aceitação do pacote; **R** = quem executa. O patrocinador aprova mudanças de escopo, prazo e orçamento e o uso da reserva.

| Pacote | A | R |
|---|---|---|
| 1.1 Gestão | GPTI | GPTI |
| 1.2 Requisitos e protótipo | GPTI | PSW (requisitos, atores e protótipo); GPTI (escopo e validação); validação final pela gestão da Adornatta |
| 1.3 Módulo do Cliente | PSW | PSW |
| 1.4 Painel Administrativo | PSW | PSW |
| 1.5 Back-end e banco reais | PSW | PSW |
| 1.6 Integração e homologação | GPTI | PSW (integração e testes); GPTI (verificação contra os requisitos) |
| 1.7 Documentação | GPTI | GPTI e PSW  |
| 1.8 Verificação e encerramento | GPTI | PSW (implantação técnica); GPTI (hospedagem, domínio e Termo de Aceite)  |

Os responsáveis nominais por pacote (proposta) estão no dicionário da EAP.

**Fazer-ou-comprar:** desenvolvimento interno (PSW e GPTI). Serviços contratados: hospedagem VPS com backup (cerca de R$ 60/mês), domínio .com.br (R$ 40/ano) e intermediador de pagamentos (taxas cerca de 2,29% das vendas online, pagas pela loja). Hospedagem e domínio são pagos pelo orçamento do projeto até o lançamento e, depois, pela Adornatta (custos recorrentes, seção 6.2). A plataforma pronta (Opção C) foi avaliada e descartada.


## 6. Qualidade, orçamento e riscos

### 6.1 Verificação e aceite

Requisitos para aprovação do projeto :

- **Validação das funcionalidades:** execução com sucesso dos fluxos principais (consultar catálogo, adicionar ao carrinho, cadastrar produto e atualizar status do pedido).
- **Homologação técnica sem erros críticos:** ausência de falhas graves na simulação de compra e na gestão de estoque.
- **Aprovação do patrocinador:** Termo de Aceite assinado pelos proprietários da Adornatta, com base na facilidade de uso e na aderência ao negócio.

Complementos: PSW executa e registra as verificações; GPTI compara com os requisitos. Falha em requisito aprovado impede o aceite do marco correspondente. Verificar uso em computador e celular sem rolagem horizontal (RNF-01). Não há metas de desempenho nem de acessibilidade além dos requisitos listados; a segurança é tratada no pacote 1.5.5.

### 6.2 Orçamento

| Item | Cálculo | Valor |
|---|---|---|
| 4 desenvolvedores | R$ 3.250,00 × 4 × 4 meses | R$ 52.000,00 |
| Hospedagem (VPS com backup) | R$ 60,00 × 4 meses | R$ 240,00 |
| Domínio .com.br | R$ 40,00 × 1 ano | R$ 40,00 |
| **Subtotal (liberado aos gerentes)** | | **R$ 52.280,00** |
| Reserva de contingência (10%) | R$ 52.280,00 × 0,10 | R$ 5.228,00 |
| **Custo total / orçamento aprovado** | | **R$ 57.508,00** |

- A reserva de contingência só é liberada com autorização do patrocinador.
- O cálculo usa salário bruto. Com encargos e benefícios CLT (cerca de 87,5%), o custo seria de aproximadamente R$ 107.558,00.
- Ferramentas de design e teste e horas de gestão não foram orçadas.
- O investimento é um custo alocado de uma equipe de desenvolvimento; o desembolso efetivo da loja é menor (BC §8.5).
- Custos recorrentes após o lançamento: R$ 368,02/mês (hospedagem R$ 60, domínio R$ 3,33 e manutenção R$ 304,69 correspondente a 15 h de um desenvolvedor júnior), mais taxas do meio de pagamento (cerca de 2,29% das vendas online). [BC §7.2]

### 6.3 Análise de riscos

Riscos 1 a 10 vêm do BC §9 (os cinco primeiros também estão no TA, bem como os riscos 6 e 7).

| # | Risco | Prob. | Impacto | Resposta proposta |
|---|---|---|---|---|
| 1 | Indisponibilidade do gerente da loja | Média | Alto | Agenda fixa semanal de validação e indicação de um substituto na Adornatta. |
| 2 | Baixa adesão dos clientes, que continuam pedindo por direct e WhatsApp | Alta | Alto | Link da loja no perfil e nas respostas automáticas; divulgação do lançamento; benefício na primeira compra (como cupom) só entra mediante mudança de escopo aprovada. |
| 3 | Estoque desatualizado, gerando venda de itens esgotados | Alta | Alto | Baixa automática de estoque; alerta de estoque baixo no dashboard; conferência diária. |
| 4 | Vazamento de dados de clientes ou da loja | Média | Alto | Senhas criptografadas, HTTPS, coleta mínima, política de privacidade e controle de acesso no servidor. |
| 5 | Atraso no cadastro de produtos por falta de imagens e descrições | Média | Médio | Checklist de fotos e descrições, padrão de imagem e prazo de entrega pela loja (proposta: 06/11/2026). |
| 6 | Back-end simulado (json-server) usado em produção | Alta | Alto | Migrar para API e banco reais antes do lançamento; usar a reserva de contingência se necessário. |
| 7 | Falhas ou ausência de integração de pagamento | Média | Alto | Definir o intermediador no início do desenvolvimento e testar em homologação. |
| 8 | Perda de integrantes da equipe ou sobrecarga | Média | Alto | Documentação do código, revisão entre pares, redistribuição de tarefas; critério de encerramento (perda de 2 ou mais dos 4 desenvolvedores). |
| 9 | Estouro de custo ou prazo | Média | Médio | Reserva de 10%, acompanhamento semanal por marcos e limite de cancelamento em R$ 57.508. |
| 10 | Crescimento de escopo | Média | Médio | Controle de mudanças por maioria dos gerentes e voto final do patrocinador. |
| 11 | Datas de referência do back-end real (10/11) e do aceite (30/11) ainda não confirmadas pelo patrocinador | Média | Médio | Confirmar datas com o patrocinador e atualizar as janelas do cronograma. |
| 12 | Disponibilidade real da equipe menor que a planejada | Média | Médio | Conferir disponibilidade semanal e ajustar prioridades. |

### 6.4 Requisitos legais e de conformidade

- **LGPD (Lei nº 13.709/2018):** informar a finalidade da coleta, coletar só o necessário, ter política de privacidade, proteger os dados e atender aos direitos dos titulares.
- **Código de Defesa do Consumidor (Lei nº 8.078/1990):** direito de arrependimento em até 7 dias (art. 49); afeta a política de trocas e devoluções.
- **Decreto nº 7.962/2013:** informações claras sobre empresa, preço, frete e prazos, atendimento ao consumidor e confirmação do pedido.
- **Dados de cartão:** o intermediador de pagamento evita que o sistema armazene números de cartão.
- Recomenda-se validação jurídica antes do lançamento.

## 7. Plano de engajamento das partes interessadas

Registro inicial; será atualizado durante o projeto. O nível atual de engajamento não foi avaliado.

| Parte interessada | Interesse | Influência | Impacto | Estratégia de engajamento |
|---|---|---|---|---|
| Patrocinador (Diogo Silveira Mendonça) | Valor previsto; aprovar e decidir exceções | Alta | Baixo | Reunião a cada marco; decisão sobre exceções. |
| Proprietários e gerente da Adornatta | Controle de pedidos e estoque; facilidade de uso | Alta (aceite) | Alto | Validação do protótipo e da entrega; reunião semanal. |
| Funcionários da loja | Ferramenta simples | Média | Alto | Treinamento e manual de operação. |
| Clientes finais | Achar produtos e comprar com segurança | Média | Alto | Divulgação do lançamento e canal de feedback. |
| Equipe de gerenciamento (GPTI, 4 gerentes) | Entrega no prazo e no orçamento | Alta | Alto | Reunião semanal e prestação de contas ao patrocinador. |
| Equipe de desenvolvimento (PSW, 4 desenvolvedores) | Entregar no prazo | Média | Alto | Reunião semanal e quadro de tarefas. |
| Fornecedores | Informação de reposição | Baixa | Baixo | Manter informados. |
| Provedores de hospedagem e de pagamento | Disponibilidade, segurança e taxas | Média | Baixo | Monitorar. |

## 8. Comunicações e controle do plano

### 8.1 Cadência de comunicação

| Público | Conteúdo | Canal | Frequência |
|---|---|---|---|
| Equipes PSW e GPTI | Andamento, impedimentos, horas, riscos e decisões | Reunião semanal; quadro de tarefas | Semanal |
| Proprietários e gerente da Adornatta | Validações, requisitos, demonstrações | Reunião | Semanal |
| Patrocinador | Prestação de contas, decisões e impactos de mudança | Reunião e registro escrito | A cada marco ou quando houver decisão necessária |
| Funcionários da loja | Treinamento e manual de operação | A definir | No lançamento |
| Clientes finais | Divulgação do lançamento e canal de feedback | Redes sociais da loja | No lançamento e depois |

### 8.2 Controle de mudanças e desempenho

- Registrar por escrito qualquer pedido que afete escopo, custo ou datas, com pacote afetado e impacto.
- Decisão por maioria de votos dos gerentes; em caso de empate, o patrocinador decide. Alterações de escopo, prazo, orçamento e uso da reserva dependem de autorização do patrocinador.
- Registrar semanalmente andamento, impedimentos e horas, e acompanhar o orçamento por marco. Comparar com as entregas e critérios de aceite, sem inventar percentual de conclusão.
- Atualizar escopo, cronograma e orçamento em conjunto quando uma mudança aprovada afetar mais de uma linha de base.

### 8.3 Plano de medição de benefícios

| Quando | O que medir | Responsável |
|---|---|---|
| 30 dias antes do lançamento | Linha de base: pedidos por mês, erros de pedido, tempo de atendimento e faturamento | Gerente da loja, com apoio da equipe |
| No lançamento | % de produtos cadastrados e com estoque atualizado | Equipe do projeto e gerente da loja |
| 1º mês após o lançamento | % de pedidos pelo site (meta 60%) e erros de pedido | Gerente da loja |
| 3º mês após o lançamento | % de vendas pelo site (meta 70%), redução de 80% dos erros e benefício líquido real | Gerente da loja e patrocinador |

Após o projeto: operação diária pelo gerente e funcionários da Adornatta; manutenção pela equipe de desenvolvimento ou profissional contratado (cerca de R$ 305/mês); medição pelo gerente da loja, com apoio do patrocinador.

## 9. Critérios de encerramento 

**Encerramento normal:** todas as Entregas Principais concluídas e os requisitos de aprovação atendidos; Termo de Aceite assinado pelos proprietários da Adornatta e aprovação final do patrocinador até a data de entrega da AV2 (final de novembro).

**Cancelamento ou encerramento antecipado** (decisão do patrocinador, com recomendação dos gerentes):

- Os proprietários desistem da loja virtual ou ficam indisponíveis para validar por mais de 2 semanas seguidas.
- O custo projetado ultrapassa R$ 57.508,00 sem mudança aprovada pelo patrocinador.
- A equipe perde 2 ou mais dos 4 desenvolvedores sem reposição, de modo que o escopo principal não caiba no prazo.
- Há previsão de entrega após a data da AV2 e o patrocinador não autoriza novo prazo.
- Premissa essencial deixa de valer sem alternativa (por exemplo, a loja não fornece fotos e descrições dos produtos a tempo).
- Se a medição do 3º mês mostrar menos de 30% das vendas na plataforma (valor de referência proposto pelo grupo), o patrocinador decide entre ajustar o plano de adesão e encerrar a evolução do sistema.

