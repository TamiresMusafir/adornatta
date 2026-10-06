# Projeto Adornatta – Loja Virtual de Semijoias

GERÊNCIA DE PROJETOS DE TECNOLOGIA DA INFORMAÇÃO

Prof: Diogo Mendonça

**AV1 – Termo de Abertura + Business Case**

**Grupo A**

Integrantes:

- Fernando Lira Barbosa
- Gabriel Felipe Martins da Silva
- Igor Roberto da Silva Tabelini
- Matheus Dinis Francellino

Outubro / 2026

---

## Sumário

- [Parte 1 – Termo de Abertura do Projeto](#parte-1--termo-de-abertura-do-projeto)
- [Parte 2 – Business Case](#parte-2--business-case)
  - [1. Sumário Executivo](#1-sumário-executivo)
  - [2. Contexto e Cenário Atual](#2-contexto-e-cenário-atual)
  - [3. Problemas Identificados e Oportunidade](#3-problemas-identificados-e-oportunidade)
  - [4. Objetivos de Negócio e Indicadores de Sucesso](#4-objetivos-de-negócio-e-indicadores-de-sucesso)
  - [5. Alternativas Analisadas](#5-alternativas-analisadas)
  - [6. Solução Proposta](#6-solução-proposta)
  - [7. Análise de Custos](#7-análise-de-custos)
  - [8. Análise de Benefícios e Viabilidade Financeira](#8-análise-de-benefícios-e-viabilidade-financeira)
  - [9. Análise de Riscos](#9-análise-de-riscos)
  - [10. Requisitos Legais e de Conformidade](#10-requisitos-legais-e-de-conformidade)
  - [11. Cronograma e Marcos](#11-cronograma-e-marcos)
  - [12. Partes Interessadas e Governança](#12-partes-interessadas-e-governança)
  - [13. Premissas e Restrições](#13-premissas-e-restrições)
  - [14. Plano de Medição de Benefícios](#14-plano-de-medição-de-benefícios)
  - [15. Conclusão e Recomendação](#15-conclusão-e-recomendação)
  - [16. Fontes dos Dados de Mercado](#16-fontes-dos-dados-de-mercado)

---

# Parte 1 – Termo de Abertura do Projeto

## TERMO DE ABERTURA DO PROJETO

### Nome do Projeto

Projeto Adornatta

### Finalidade

Centralizar o processo de venda e busca de semijoias em um único ambiente virtual. Ademais, melhorar a experiência de compra do cliente e o controle operacional da loja.

### Justificativa

O processo atual torna complexo verificar a disponibilidade de produtos, além de dificultar o controle, a atualização dos produtos e atendimento eficiente ao cliente.

#### Caso de Negócio (resumo)

Problema: Dificuldade de controlar os produtos (entrada/saída), e manter os clientes atualizados.

• Opção A: Reforçar o atendimento manual

• Opção B: desenvolver um sistema web próprio, integrado (catálogo, pedidos, estoque e vendas), sob medida para a loja.

• Opção C: contratar uma plataforma pronta de e-commerce (por exemplo, Nuvemshop).

Escolha: Opção B, já que o produto precisa de uma solução mais personalizada tendo em vista que o problema não engloba somente problemas com vendas, como também problemas com atualização de dados. A Opção C (contratar uma plataforma pronta de e-commerce, como a Nuvemshop) foi avaliada e não foi adotada por limitar a personalização do controle de estoque e criar dependência de fornecedor.

Custo, benefício e risco: o investimento é de R\$ 57.508 (4 desenvolvedores júnior durante 4 meses). Com dados de mercado de 2026, o cenário base gera benefício líquido de cerca de R\$ 522 por mês e não recupera o investimento em 36 meses; o cenário otimista tem payback de 24 meses. Os principais riscos são a baixa adesão dos clientes e o uso de um back-end ainda simulado.

Trade-off: a Opção C é mais barata e rápida de implantar. A Opção B custa mais e leva 4 meses, mas dá controle total do estoque e dos dados, sem mensalidade nem dependência de fornecedor.

Decisão de iniciação solicitada ao patrocinador: seguir com a Opção B.

### Objetivos

1.  Migração de 70% das vendas para a aplicação web nos primeiros 3 meses após o lançamento.

2.  Reduzir em 80% a ocorrência de erros de pedido e falhas de envio decorrentes de divergências operacionais.

3.  Garantir 100% de visibilidade em tempo real do catálogo de produtos e disponibilidade de estoque para os clientes.

### Critérios de Sucesso

- Pelo menos 60% dos pedidos do primeiro mês realizados diretamente pela nova plataforma.

- Redução comprovada nos registros de trocas e erros de envio.

- Aprovação e aceite formal da gestão/proprietários da Adornatta referente à usabilidade e ao controle de pedidos.

- A medição das metas do 1º e do 3º mês após o lançamento será feita pelo gerente da Adornatta, com apoio do patrocinador, e registrada no Termo de Aceite.

#### Como cada objetivo será medido

- Objetivo 1 (migração de vendas): pedidos feitos pelo site ÷ total de pedidos. Linha de base: 0%. Meta: 60% no 1º mês e 70% no 3º mês após o lançamento. Medição: gerente da Adornatta. Validação: proprietários.

- Objetivo 2 (erros de pedido): erros de pedido e falhas de envio ÷ total de pedidos. Linha de base: levantada nos 30 dias anteriores ao lançamento. Meta: redução de 80% no 3º mês. Fonte: registro de trocas, reenvios e reclamações. Validação: proprietários.

- Objetivo 3 (visibilidade do catálogo e do estoque): produtos ativos com estoque atualizado no painel ÷ total de produtos ativos. Linha de base: 0%. Meta: 100% no lançamento, mantida nos 3 primeiros meses. "Tempo real" significa atualizar o estoque a cada venda ou ajuste. Validação: gerente da loja.

### Escopo de Alto Nível

#### Dentro do escopo

- Implementar um sistema de CRUD para os produtos.

- Implementar um sistema de cadastro de usuário.

- Implementar sistema de compras (carrinho, checkout e pagamento por meio de intermediador de pagamentos, com Pix e cartão).

- Implementar sistema de acompanhamento do pedido (rastreamento por status: em análise, em preparação, enviado, entregue e cancelado).

- Implementar um sistema de controle de pedidos realizados.

- Criar uma documentação de uso do programa.

- Implementar funcionalidades complementares já previstas no sistema: busca de produtos, lista de desejos, dashboard administrativo e registro de vendas.

- Exibir as informações legais da loja virtual (política de privacidade, trocas e devoluções e dados da empresa) e o frete e prazo por tabela de regiões definida pela Adornatta.

#### Fora do escopo

- Transferir os dados dos clientes feitos por meio de outras plataformas para o site.

- Criar um aplicativo móvel de compras da loja.

- Atendimento automatizado via chatbot no WhatsApp/Instagram.

- Integração com sistemas complexos de ERP/fiscal de grande porte.

- Integração com transportadoras e emissão de códigos de rastreio (Correios e similares).

### Premissas

- A loja libera o gerente da loja para entrevistas.

- Disponibilidade dos conteúdos, fotos e descrições detalhadas das semijoias por parte da equipe Adornatta para inclusão no catálogo.

- Infraestrutura e serviços de hospedagem web disponíveis e operacionais com custos recorrentes suportados pela loja após o lançamento (durante o desenvolvimento, hospedagem e domínio são pagos pelo orçamento do projeto).

- Os clientes aceitarão ser direcionados do Instagram e do WhatsApp para a loja virtual.

- Engajamento da equipe interna para adotar a nova ferramenta na gestão diária de vendas e estoque.

- A Adornatta fornecerá dados reais de vendas, estoque e erros de pedido para calibrar os indicadores e a análise financeira.

- Um intermediador de pagamentos (Pix e cartão) estará disponível para a loja.

#### Premissa e risco associado (se a premissa falhar)

- Gerente liberado para entrevistas: indisponibilidade de usuário-chave, com atraso nos requisitos e na validação.

- Conteúdo, fotos e descrições disponíveis: atraso no cadastro e na homologação dos produtos.

- Hospedagem com custos recorrentes pagos pela loja após o lançamento: site fora do ar ou custo recorrente não coberto.

- Clientes aceitam migrar: baixa adesão e metas de migração não atingidas.

- Equipe interna engajada: estoque desatualizado e venda de itens esgotados.

- Dados reais fornecidos pela loja: metas e análise financeira apoiadas apenas em hipóteses.

- Intermediador de pagamentos disponível: falha ou atraso na integração do pagamento.

### Riscos

- Indisponibilidade de usuários-chave (gerente da loja).

- Baixa adesão inicial dos clientes, que podem continuar preferindo fechar pedidos via direct/WhatsApp.

- Falta de atualização do estoque no painel administrativo, gerando vendas de itens esgotados.

- Risco de vazamento de dados dos clientes, ou informações de funcionamento.

- Atrasos na homologação/cadastro dos produtos devido à falta de imagens ou especificações técnicas.

- Uso do back-end simulado (json-server) em produção, sem banco de dados e controle de acesso adequados.

- Falhas ou atraso na integração com o intermediador de pagamentos.

### Marcos

1.  Termo de Abertura aprovado e Levantamento de Requisitos concluído (agosto/2026).

2.  Protótipo da interface (UI/UX) validado pela gestão Adornatta (setembro/2026).

3.  Sistema integrado (Catálogo + Carrinho + Painel Administrativo) testado e homologado (outubro/2026).

4.  Implantação em produção e lançamento oficial da Loja Virtual (novembro/2026, até a data da AV2).

### Partes Interessadas

- Patrocinador.

- Clientes finais da Adornatta.

- Fornecedores.

- Funcionários.

- Equipe de Desenvolvimento do Projeto (4 desenvolvedores júnior: João Henrique Lima Gualberto, Pedro Pimentel Nunes, Tamires Barbosa dos Santos e Vinicius da Silva Mendes).

- Provedores de Infraestrutura/Hospedagem Web.

#### Registro inicial (interesse, influência, impacto e engajamento)

- Patrocinador (Diogo Silveira Mendonça): quer o valor previsto; influência alta, impacto baixo. Engajamento: reunião a cada marco e decisão sobre exceções.

- Proprietários e gerente da Adornatta: querem controle de pedidos e estoque; influência alta (aceite), impacto alto (passam a operar o sistema). Engajamento: validação do protótipo e da entrega, reunião semanal.

- Funcionários da loja (operam o sistema depois do projeto): querem uma ferramenta simples; influência média, impacto alto. Engajamento: treinamento e manual de operação.

- Clientes finais: querem achar produtos e comprar com segurança; influência média (a adesão define as metas), impacto alto. Engajamento: divulgação do lançamento e canal de feedback.

- Equipe de desenvolvimento (4 júnior): quer entregar no prazo; influência média, impacto alto. Engajamento: reunião semanal e quadro de tarefas.

- Fornecedores: querem informação de reposição; influência baixa, impacto baixo. Engajamento: manter informados.

- Provedores de hospedagem e de pagamento: influência média (disponibilidade e taxas), impacto baixo. Engajamento: monitorar.

O registro é inicial e será atualizado durante o projeto.

### Patrocinador

Diogo Silveira Mendonça.

Papel do patrocinador: defender o caso de negócio, autorizar este termo, liberar os recursos iniciais, designar os gerentes e decidir o que foge da alçada da equipe.

### Gerentes do Projeto

- Gerente 1 - Fernando Lira Barbosa

- Gerente 2 - Gabriel Felipe Martins da Silva

- Gerente 3 - Igor Roberto da Silva Tabelini

- Gerente 4 - Matheus Dinis Francellino

As decisões são feitas a partir da maioria dos votos, em caso de empate o Patrocinador irá ter a palavra final.

Autoridade dos gerentes: podem alocar a equipe de desenvolvimento, priorizar tarefas e usar o orçamento aprovado (salários, hospedagem e domínio). Dependem de autorização do patrocinador para usar a reserva de contingência, alterar o escopo, mudar o prazo ou ultrapassar o orçamento. Os gerentes prestam contas ao patrocinador a cada marco.

### Critérios de Encerramento

Encerramento normal

- Todas as Entregas Principais concluídas e os Requisitos para Aprovação atendidos (fluxos principais executados sem erro crítico).

- Termo de Aceite assinado pelos proprietários da Adornatta e aprovação final do patrocinador até a data de entrega da AV2 (final de novembro).

Cancelamento ou encerramento antecipado (decisão do patrocinador, com recomendação dos gerentes)

- Os proprietários da Adornatta desistem da loja virtual, ou ficam indisponíveis para validar por mais de 2 semanas seguidas.

- O custo projetado ultrapassa R\$ 57.508 (orçamento aprovado, já incluída a reserva de contingência), sem mudança aprovada pelo patrocinador.

- A equipe de desenvolvimento perde 2 ou mais dos 4 desenvolvedores sem reposição, de modo que o escopo principal não caiba no prazo.

- Há previsão de que a entrega passe da data da AV2 e o patrocinador não autoriza novo prazo.

- Premissa essencial deixa de valer sem alternativa (por exemplo, a loja não fornece fotos e descrições dos produtos a tempo de montar o catálogo).

<!-- -->

- Se a medição do 3º mês após o lançamento mostrar menos de 30% das vendas na plataforma (valor de referência proposto pelo grupo), o patrocinador decide entre ajustar o plano de adesão e encerrar a evolução do sistema.

### Prazo

Entrega final prevista para a data de entrega da AV2 (Final de Novembro).  
  
### Orçamento

Salário:

Considerando 4 programadores Júnior (João Henrique Lima Gualberto, Pedro Pimentel Nunes, Tamires Barbosa dos Santos e Vinicius da Silva Mendes), teríamos um gasto médio de:

R\$ 3.250,00 mensais por desenvolvedor Júnior (média de mercado em 2026: cerca de R\$ 3.200 a R\$ 3.500 por mês).

Custo Operacional:

Considerando os preços de mercado em 2026 para um site de pequeno porte: hospedagem em VPS com backup, cerca de R\$ 60,00 por mês (planos de entrada a partir de R\$ 38,99 por mês), e domínio .com.br, R\$ 40,00 por ano.

Cálculo Custo Final:

Como o projeto teve início no mês 8, e o fim previsto se dá no mês 11. Teríamos 4 meses de trabalho acarretando:

3250 x 4 x 4 = R\$ 52.000,00

60 x 4 = R\$ 240,00 (hospedagem)

40 x 1 = R\$ 40,00 (domínio .com.br, 1 ano)

52000 + 240 + 40 = R\$ 52.280,00

Valor com Reserva:

52280 x 1,1 = R\$ 57.508,00

**Custo Final: R\$ 57.508,00**

Recursos financeiros pré-aprovados: R\$ 57.508,00, sendo R\$ 52.280,00 liberados para uso dos gerentes e R\$ 5.228,00 de reserva de contingência, liberada apenas com autorização do patrocinador.

Observação: o cálculo considera o salário bruto mensal. Encargos e benefícios de uma contratação CLT, estimados em cerca de 87,5% sobre o salário, não estão incluídos; se forem considerados, o custo total sobe para aproximadamente R\$ 107.558,00.

### Entregas Principais

1.  Protótipo Interativo validado pela gestão da Adornatta.

2.  Módulo do Cliente com sistema de cadastro/login, sistema de rastreio da compra, catálogo de produtos, filtros por categoria, carrinho de compras e módulo de checkout/finalização de pedido.

3.  Painel Administrativo com módulo interno para cadastro de semijoias, atualização de estoque e alteração de status dos pedidos.

4.  Documentação técnica e de uso, com manual ou guia rápido de operação do painel administrativo para a equipe interna da Adornatta.

### Restrições Iniciais

- Custos compatíveis com o orçamento aprovado; a infraestrutura web (hospedagem e domínio) é contratada no projeto e mantida pela Adornatta após o lançamento.

- Criação e implementação do site dentro do prazo estabelecido.

- Utilização de tecnologias web padrão e de fácil manutenção sem dependência de licenças proprietárias pagas de alto valor.

### Requisitos para Aprovação do Projeto

- Validação das Funcionalidades: Execução com sucesso dos fluxos dos casos de uso principais (consultar catálogo, adicionar ao carrinho, cadastrar produto e atualizar status do pedido).

- Homologação Técnica e Sem Erros Críticos: Ausência de falhas graves no processo de simulação de compra e gestão de estoque.

- Aprovação do Patrocinador: Assinatura/confirmação do Termo de Aceite pelos proprietários da Adornatta com base na facilidade de uso e aderência ao negócio.

### Valor Esperado

Se o projeto terminar bem, os proprietários da Adornatta passam a vender e a controlar o estoque em um único ambiente, com 70% das vendas na loja virtual em até 3 meses e 80% menos erros de pedido, medidos pelo gerente da loja e validados pelos proprietários, enquanto os clientes passam a ver o que está disponível antes de comprar.

### Resumo do Business Case (versão do Termo)

Cenário Atual: Atualmente, as vendas da Adornatta são realizadas principalmente por meio do Instagram e do WhatsApp.

#### Problemas Identificados

- Complexidade no Atendimento e Pedidos**:** Com o crescimento do volume de vendas, o modelo atual torna o processo de atendimento e organização dos pedidos mais complexo. Isso aumenta o risco de confusões entre pedidos, falhas no envio de produtos e dificuldades no acompanhamento das vendas.

- Dificuldade na Verificação de Disponibilidade: Como as informações ficam distribuídas entre redes sociais e conversas, o cliente pode ter dificuldade para verificar se determinada semijoia está disponível.

- Dificuldade no Controle de Estoque: Para a loja, essa dinâmica fragmentada dificulta o controle do estoque e a atualização das informações dos produtos.

Solução Proposta: A Loja Virtual Adornatta busca centralizar o processo de venda em um único ambiente digital, abrangendo desde a consulta dos produtos até o acompanhamento dos pedidos.

Benefícios Esperados: Dessa forma, o sistema poderá proporcionar uma experiência de compra mais organizada para o cliente e, simultaneamente, melhorar o controle operacional da loja.

### Autoridade e Aprovação

Decisão do patrocinador: ( ) Seguir ( ) Adiar ( ) Comparar alternativas ( ) Rejeitar

A aprovação deste termo autoriza o início do planejamento detalhado, o levantamento de requisitos e o desenvolvimento do sistema dentro das premissas, do escopo, do prazo e do orçamento acima. O uso da reserva de contingência, as mudanças de escopo e de prazo e qualquer gasto acima do orçamento aprovado dependem de nova autorização do patrocinador. Assinaturas simbólicas, para fins da disciplina.

| Aprovação | Nome | Assinatura | Data |
|---|---|---|---|
| Patrocinador | Prof. Diogo Silveira Mendonça | | |
| Representante da equipe GPTI | | | |
| Representante da equipe PSW | | | |

---

# Parte 2 – Business Case

## 1. Sumário Executivo

A Adornatta é uma loja de semijoias que vende principalmente pelo Instagram e pelo WhatsApp. Com o crescimento do volume de vendas, esse modelo tornou-se difícil de controlar: pedidos se misturam em conversas, o cliente não consegue saber com facilidade o que está disponível e a loja não possui um registro único de estoque.

O Projeto Adornatta propõe uma loja virtual própria, que centraliza em um único ambiente a consulta ao catálogo, o carrinho, a finalização do pedido e o acompanhamento da compra, além de um painel administrativo para gestão de produtos, estoque, pedidos e vendas.

| **Item**                    | **Resumo**                                                                                                                                                                                                                                           |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Problema**                | Controle manual e fragmentado de pedidos, estoque e informações de produtos.                                                                                                                                                                         |
| **Solução recomendada**     | Opção B – sistema web próprio (React + Bootstrap), com área do cliente e painel administrativo.                                                                                                                                                      |
| **Investimento do projeto** | R\$ 57.508,00: 4 desenvolvedores júnior (R\$ 52.000), hospedagem e domínio (R\$ 280) e 10% de reserva de contingência (R\$ 5.228).                                                                                                                   |
| **Valor esperado**          | Os proprietários da Adornatta passam a vender e controlar o estoque em um único ambiente, com 70% das vendas na loja virtual em 3 meses e 80% menos erros de pedido, medidos pelo gerente da loja.                                                   |
| **Prazo**                   | 4 meses (agosto a novembro de 2026), com entrega final na data da AV2.                                                                                                                                                                               |
| **Metas principais**        | 70% das vendas na plataforma em até 3 meses após o lançamento; redução de 80% nos erros de pedido; 100% de visibilidade do catálogo e do estoque.                                                                                                    |
| **Viabilidade financeira**  | Com dados de mercado de 2026, o cenário base não recupera o investimento em 36 meses (VPL negativo); o retorno só ocorre em 24 meses no cenário otimista. O projeto se sustenta principalmente por benefícios estratégicos e operacionais (seção 8). |

## 2. Contexto e Cenário Atual

Atualmente, as vendas da Adornatta são realizadas principalmente por meio do Instagram e do WhatsApp. O Instagram funciona como vitrine e o WhatsApp como canal de fechamento: o cliente vê a peça, pergunta se há disponibilidade, combina pagamento e envio por mensagem, e a loja registra o pedido manualmente.

Esse modelo funciona bem em baixo volume, mas perde eficiência conforme a loja cresce. As informações ficam espalhadas em mensagens, publicações e anotações pessoais, sem um local confiável que mostre, ao mesmo tempo, o que existe em estoque, o que foi vendido e em que etapa cada pedido está.

## 3. Problemas Identificados e Oportunidade

| **Problema**                                             | **Causa provável**                                           | **Impacto no negócio**                                                                               |
|----------------------------------------------------------|--------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| **Complexidade no atendimento e nos pedidos**            | Pedidos recebidos em conversas, sem registro padronizado.    | Confusão entre pedidos, falhas de envio, retrabalho e insatisfação do cliente.                       |
| **Dificuldade em verificar a disponibilidade**           | Informações distribuídas entre redes sociais e mensagens.    | Atendimento repetitivo, demora na resposta e perda de vendas por falta de clareza.                   |
| **Dificuldade no controle de estoque**                   | Ausência de um registro único de entrada e saída.            | Venda de itens esgotados, reposição sem planejamento e dados de produtos desatualizados.             |
| **Dependência de plataformas de terceiros (adicionado)** | Toda a relação com o cliente ocorre dentro de redes sociais. | Risco de perder alcance, conta ou histórico de clientes; a loja não possui base própria de clientes. |
| **Falta de dados consolidados de vendas (adicionado)**   | Vendas não são registradas de forma estruturada.             | Decisões de compra e preço tomadas sem dados de faturamento, itens mais vendidos ou ticket médio.    |

A oportunidade é transformar esse processo informal em um canal de vendas organizado e mensurável, que mantenha o Instagram e o WhatsApp como canais de divulgação e atendimento, mas leve a compra, o estoque e o acompanhamento do pedido para um ambiente próprio.

## 4. Objetivos de Negócio e Indicadores de Sucesso

Os objetivos do Termo de Abertura foram mantidos e organizados como indicadores mensuráveis, com linha de base, meta e fonte de dados.

| **Objetivo**                              | **Indicador**                                        | **Linha de base**                         | **Meta e prazo**                                   | **Fonte de dados**                         | **Quem valida**              |
|-------------------------------------------|------------------------------------------------------|-------------------------------------------|----------------------------------------------------|--------------------------------------------|------------------------------|
| Migrar vendas para a plataforma           | % de pedidos feitos pelo site                        | 0% (hoje 100% via redes sociais)          | 60% no 1º mês e 70% até o 3º mês após o lançamento | Módulo de pedidos e vendas                 | Proprietários da Adornatta   |
| Reduzir erros operacionais                | Erros de pedido e falhas de envio ÷ total de pedidos | Levantada nos 30 dias antes do lançamento | Redução de 80% no 3º mês                           | Registro de trocas, reenvios e reclamações | Proprietários da Adornatta   |
| Dar visibilidade ao catálogo e ao estoque | % de produtos ativos com estoque atualizado          | 0%                                        | 100% no lançamento, mantido por 3 meses            | Módulo de estoque do painel                | Gerente da loja              |
| Aprovação da gestão (critério de aceite)  | Termo de Aceite assinado                             | —                                         | Aceite formal até a AV2                            | Termo de Aceite                            | Proprietários e patrocinador |

Indicadores complementares sugeridos para acompanhamento: taxa de conversão (visitas × pedidos), taxa de abandono de carrinho, tempo médio para atender um pedido e número de produtos com estoque baixo ou zerado.

As metas do 1º e do 3º mês são medidas depois do término do projeto (novembro). Por isso, a medição será feita pelo gerente da Adornatta, com apoio do patrocinador, e registrada no Termo de Aceite (ver seção 14).

## 5. Alternativas Analisadas

Foram comparadas quatro alternativas: reforçar o atendimento manual (A), desenvolver um sistema próprio (B), contratar uma plataforma pronta de e-commerce (C) e manter o cenário atual (D).

| **Critério**                      | **A – Reforçar atendimento manual** | **B – Sistema próprio (recomendada)**                                                   | **C – Plataforma pronta (ex.: Nuvemshop)**                                                                              | **D – Manter como está**                |
|-----------------------------------|-------------------------------------|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| **Custo inicial**                 | Baixo (horas da equipe)             | R\$ 57.508 (custo alocado do projeto)                                                   | Baixo (configuração e tema)                                                                                             | Nenhum                                  |
| **Custo recorrente**              | Cresce com o volume (mão de obra)   | Cerca de R\$ 368/mês (hospedagem, domínio e manutenção) mais taxas do meio de pagamento | Plano sem mensalidade e planos pagos a partir de cerca de R\$ 69/mês (valores de 2026), mais taxas do meio de pagamento | Nenhum direto, mas com perdas indiretas |
| **Prazo para operar**             | Imediato                            | Cerca de 4 meses                                                                        | Dias ou semanas                                                                                                         | —                                       |
| **Controle de estoque integrado** | Não                                 | Sim, sob medida                                                                         | Sim, módulo padrão (regras específicas da loja a verificar)                                                                                                      | Não                                     |
| **Personalização**                | Não se aplica                       | Total                                                                                   | Limitada à plataforma e aos aplicativos disponíveis                                                                     | Não se aplica                           |
| **Dependência**                   | Das pessoas que atendem             | Da equipe que mantém o código                                                           | Do fornecedor da plataforma                                                                                             | Das redes sociais                       |
| **Resolve a causa do problema?**  | Não, agrava com o crescimento       | Sim                                                                                     | Sim, em grande parte                                                                                                    | Não                                     |

### Justificativa da escolha (Opção B)

A Opção B foi escolhida porque o problema da Adornatta não se limita à venda: envolve a atualização de dados e o controle de entrada e saída de produtos. Um sistema próprio permite reunir catálogo, pedidos, registro de vendas e estoque no mesmo painel, com regras definidas pela loja, sem mensalidade de plataforma e com propriedade do código e dos dados dos clientes.

A Opção C é a alternativa de mercado mais barata e rápida, e seria a escolha natural de uma loja sem equipe de desenvolvimento. Ela foi descartada pela limitação de personalização do controle de estoque e pela dependência do fornecedor. Essa decisão tem um custo: o investimento e o prazo da Opção B são maiores, e isso aparece na análise financeira da seção 8.

**Limite desta análise:** a Opção C não foi modelada financeiramente, e a justificativa contra ela depende de regras de estoque específicas da Adornatta que ainda precisam ser levantadas nas entrevistas (pacote 1.2.1 do plano). Se a Opção C atender a todas essas regras, a decisão deve ser reavaliada pelo patrocinador.

## 6. Solução Proposta

A solução é uma aplicação web composta por uma área do cliente e uma área administrativa. O desenvolvimento utiliza React, Vite, React Router, Bootstrap e Bootstrap Icons, com TanStack Query para consulta de dados e React Hook Form com Zod para validação de formulários. Na fase atual, o back-end é simulado com json-server e os dados ficam em um arquivo db.json. O código está versionado no GitHub (TamiresMusafir/adornatta).

| **Módulo**                 | **Funcionalidades**                                                                                                                                                                                                                                                                                                                                   |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Área do cliente**        | Página inicial; catálogo com nome, descrição, preço, imagem, categoria, material, tipo de banho e disponibilidade; categorias (Brincos, Conjuntos, Pulseiras e Cordões); busca; detalhes do produto; lista de desejos; carrinho; checkout com validação; acompanhamento do pedido; cadastro, login e logout.                                          |
| **Painel administrativo**  | Dashboard (total de produtos, itens em estoque, estoque baixo e sem estoque); estoque (cadastrar, editar, excluir, pesquisar e ajustar quantidades); pedidos (consultar, pesquisar e alterar status: Em análise, Em preparação, Enviado, Entregue, Cancelado); vendas (registrar venda com baixa automática de estoque, vendas e faturamento do mês). |
| **Páginas institucionais** | Sobre nós e Contato.                                                                                                                                                                                                                                                                                                                                  |
| **Documentação**           | Manual de Instalação, Manual de Operação e Manual do Usuário.                                                                                                                                                                                                                                                                                         |

### Limites do escopo

- **Dentro:** cadastro e controle de produtos e estoque; cadastro de clientes; carrinho, checkout e pagamento por intermediador (Pix e cartão); acompanhamento do pedido por status; controle de pedidos e registro de vendas; informações legais da loja e frete por tabela de regiões; documentação de uso.

- **Fora:** migração dos dados de clientes de outras plataformas; aplicativo móvel; chatbot no WhatsApp ou Instagram; integração com ERP ou sistemas fiscais de grande porte; integração com transportadoras e códigos de rastreio.

### Esclarecimentos de escopo

- **Rastreamento:** no sistema, corresponde ao acompanhamento do status do pedido. A integração com transportadoras e os códigos de rastreio dos Correios estão fora do escopo (evolução futura).

- **Pagamento:** o pagamento por intermediador (Pix e cartão) faz parte do escopo, conforme o Termo de Abertura. A documentação do repositório descreve hoje apenas o registro da forma de pagamento; a integração é entrega do pacote 1.5.6 do plano.

- **Funcionalidades além do Termo de Abertura (resolvido):** lista de desejos, busca, dashboard e módulo de vendas já constam do escopo do Termo.

- **Back-end simulado:** o json-server é adequado para desenvolvimento e homologação, mas não para produção. Antes do lançamento, é necessário um back-end e banco de dados reais, com senhas protegidas e controle de acesso no servidor.

## 7. Análise de Custos

### 7.1 Custo do projeto

A equipe de desenvolvimento é formada por quatro desenvolvedores júnior: João Henrique Lima Gualberto, Pedro Pimentel Nunes, Tamires Barbosa dos Santos e Vinicius da Silva Mendes. O salário de R\$ 3.250 por mês está alinhado à média de mercado em 2026, de cerca de R\$ 3.200 a R\$ 3.500 por mês para desenvolvedor júnior.

| **Item**                      | **Cálculo**                | **Valor**     |
|-------------------------------|----------------------------|---------------|
| 4 desenvolvedores júnior      | R\$ 3.250,00 × 4 × 4 meses | R\$ 52.000,00 |
| Hospedagem (VPS com backup)   | R\$ 60,00 × 4 meses        | R\$ 240,00    |
| Domínio .com.br               | R\$ 40,00 × 1 ano          | R\$ 40,00     |
| Subtotal                      |                            | R\$ 52.280,00 |
| Reserva de contingência (10%) | R\$ 52.280,00 × 0,10       | R\$ 5.228,00  |
| CUSTO TOTAL DO PROJETO        |                            | R\$ 57.508,00 |

Esse valor é o orçamento aprovado e o limite do critério de cancelamento do Termo de Abertura, que foi atualizado para ficar coerente com o orçamento.

- **Encargos não incluídos:** o cálculo considera o salário bruto mensal. Encargos e benefícios de uma contratação CLT elevam o custo em cerca de 87,5% sobre o salário (referência para salário de R\$ 3.000). Nesse caso, o custo total seria de aproximadamente R\$ 107.558. A sensibilidade a esse valor está na seção 8.4.

- **Outros itens:** ferramentas de design e teste e as horas de gestão do projeto não foram orçadas.

### 7.2 Custos recorrentes após o lançamento

| **Item**                    | **Valor**                        | **Base de cálculo**                                                                                              |
|-----------------------------|----------------------------------|------------------------------------------------------------------------------------------------------------------|
| Hospedagem (VPS com backup) | R\$ 60,00/mês                    | Planos de entrada de VPS a partir de R\$ 38,99/mês em 2026, acrescidos de backup.                                |
| Domínio .com.br             | R\$ 3,33/mês                     | R\$ 40,00 por ano (valor oficial do Registro.br).                                                                |
| Manutenção e suporte        | R\$ 304,69/mês                   | 15 horas por mês de um desenvolvedor júnior (R\$ 3.250 ÷ 160 h = R\$ 20,31/h).                                   |
| Subtotal fixo               | R\$ 368,02/mês                   |                                                                                                                  |
| Taxas do meio de pagamento  | Cerca de 2,29% das vendas online | Pix (50,3% dos pedidos) a partir de 0,99% e crédito (45% dos pedidos) a partir de 3,99%, tabela do Mercado Pago. |

## 8. Análise de Benefícios e Viabilidade Financeira

### 8.1 Benefícios

**Tangíveis:** menor custo com erros de pedido e reenvios; economia de tempo de atendimento; margem das vendas adicionais por maior alcance e facilidade de compra.

**Intangíveis:** melhor experiência de compra; imagem mais profissional da marca; base própria de clientes; dados para decisão (faturamento, itens mais vendidos); menor dependência das redes sociais; processos documentados.

### 8.2 Dados de mercado utilizados

Como a Adornatta é uma loja fictícia, os cenários usam dados reais do mercado brasileiro de e-commerce em 2026, de lojas com perfil compatível (pequenas lojas de venda direta ao consumidor, com semijoias e acessórios).

| **Dado**                                | **Valor**                                                           | **Fonte**                                                                      |
|-----------------------------------------|---------------------------------------------------------------------|--------------------------------------------------------------------------------|
| Ticket médio do e-commerce D2C          | R\$ 287,10                                                          | Nuvemshop, Radar do E-commerce D2C, julho/2026                                 |
| Faturamento médio mensal por loja ativa | R\$ 17.073 (2,64 milhões de pedidos × R\$ 287,10 ÷ 44.394 lojas)    | Cálculo a partir do Radar D2C da Nuvemshop, julho/2026                         |
| Pedidos médios por loja                 | 59 por mês                                                          | Mesmo cálculo                                                                  |
| Pix e cartão de crédito nos pedidos     | 50,3% e 45%                                                         | Nuvemshop, julho/2026                                                          |
| Crescimento de joias e semijoias        | Faturamento +75,1% em julho/2026 contra julho/2025 (e +48% em 2025) | Nuvemshop, Radar D2C e NuvemCommerce 2026                                      |
| Margem de semijoias                     | Markup de 100% a 250% sobre o custo (margem bruta de 50% a 71%)     | Nuvemshop, páginas do segmento de semijoias (dado de fornecedor de plataforma) |
| Limite de faturamento do MEI e da ME    | R\$ 81 mil/ano (R\$ 6.750/mês) e R\$ 360 mil/ano (R\$ 30.000/mês)   | Regras do Simples Nacional em 2026                                             |
| Trocas e devoluções no e-commerce       | Cerca de 10% dos pedidos no Brasil                                  | Nuvem Envios, Conselho de Logística Reversa                                    |
| Frete médio de referência               | R\$ 25 por envio ou devolução                                       | Referência de mercado de logística reversa                                     |
| Salário mínimo 2026 e valor da hora     | R\$ 1.621 e R\$ 7,37/h                                              | Decreto nº 12.797/2025                                                         |
| Encargos e benefícios CLT               | Cerca de 87,5% sobre o salário                                      | Estimativa de custo do empregado em 2026                                       |
| Taxa de desconto (Selic)                | 13,75% ao ano                                                       | Banco Central, Copom de 16/09/2026                                             |

### 8.3 Hipóteses e cenários financeiros

Os três cenários variam o faturamento mensal atual da loja: conservador (limite mensal do MEI), base (média das lojas da Nuvemshop em julho/2026) e otimista (limite mensal da ME). As demais hipóteses são estimativas de trabalho, definidas a partir dos dados acima, e devem ser substituídas pelos dados reais da loja quando disponíveis.

| **Hipótese / resultado**                        | **Conservador** | **Base**    | **Otimista** |
|-------------------------------------------------|-----------------|-------------|--------------|
| Faturamento mensal atual                        | R\$ 6.750       | R\$ 17.073  | R\$ 30.000   |
| Ticket médio por pedido                         | R\$ 287,10      | R\$ 287,10  | R\$ 287,10   |
| Pedidos por mês                                 | 24              | 59          | 104          |
| Pedidos com erro hoje (hipótese)                | 2%              | 3%          | 4%           |
| Custo de cada erro (reenvio e devolução)        | R\$ 50          | R\$ 50      | R\$ 50       |
| Tempo economizado por pedido migrado (hipótese) | 5 min           | 10 min      | 10 min       |
| Custo da hora de atendimento (R\$ 7,37 × 1,875) | R\$ 13,82       | R\$ 13,82   | R\$ 13,82    |
| Migração para a plataforma                      | 60%             | 70%         | 80%          |
| Aumento de vendas pelo novo canal (hipótese)    | 5%              | 10%         | 15%          |
| Margem bruta sobre as vendas extras             | 50%             | 60%         | 67%          |
| Benefício: menos erros (redução de 80%)         | R\$ 19          | R\$ 71      | R\$ 167      |
| Benefício: tempo economizado                    | R\$ 16          | R\$ 96      | R\$ 193      |
| Benefício: margem das vendas extras             | R\$ 169         | R\$ 1.024   | R\$ 3.015    |
| Total de benefícios mensais                     | R\$ 204         | R\$ 1.192   | R\$ 3.375    |
| Custos recorrentes mensais (fixos + taxas)      | R\$ 466         | R\$ 670     | R\$ 1.001    |
| Benefício líquido mensal                        | −R\$ 262        | R\$ 522     | R\$ 2.374    |
| Payback (R\$ 57.508 ÷ benefício líquido)        | Não recupera    | 110 meses   | 24 meses     |
| VPL em 36 meses (taxa de 13,75% a.a.)           | −R\$ 65.282     | −R\$ 42.002 | +R\$ 12.989  |
| ROI em 36 meses                                 | −116%           | −67%        | +49%         |
| TIR anual (36 meses)                            | Não existe      | −47%        | +32%         |
| Benefício-custo (B/C) em 36 meses               | Negativo        | 0,27        | 1,23         |

As taxas de pagamento foram consideradas integralmente como custo novo, o que é conservador, já que parte dos pedidos atuais por Instagram e WhatsApp também paga taxas de cartão ou link de pagamento.

Como cada métrica é lida: o VPL mostra o ganho líquido em reais de hoje; a TIR, o retorno percentual anual, que precisa superar a taxa de desconto de 13,75%; o payback, o tempo até o dinheiro voltar; e o B/C, o retorno por real investido (acima de 1,0 o projeto se paga). Neste caso as quatro métricas apontam o mesmo resultado: apenas o cenário otimista se paga.

### 8.4 Sensibilidade ao custo do projeto (cenário base)

| **Custo do projeto**                     | **Valor**   | **Payback** | **VPL em 36 meses** |
|------------------------------------------|-------------|-------------|---------------------|
| Orçamento aprovado                       | R\$ 57.508  | 110 meses   | −R\$ 42.002         |
| Estouro de 20%                           | R\$ 69.010  | 132 meses   | −R\$ 53.504         |
| Com encargos CLT (+87,5% sobre salários) | R\$ 107.558 | 206 meses   | −R\$ 92.052         |

### 8.5 Interpretação

Com dados reais de mercado, o retorno financeiro direto do projeto é limitado para uma loja do porte médio das lojas virtuais. No cenário base, o benefício líquido de cerca de R\$ 522 por mês não recupera o investimento de R\$ 57.508 em um horizonte razoável. Para recuperar o investimento em 36 meses, o benefício líquido precisa ser de cerca de R\$ 1.597 por mês, o que exige um faturamento mensal em torno de R\$ 37.700, acima do limite da microempresa; em 24 meses, cerca de R\$ 2.396 por mês.

O principal motor do resultado é o aumento de vendas, e não a economia operacional: no cenário base, a margem das vendas extras responde por cerca de 86% dos benefícios. O segmento de joias e semijoias cresce acima do mercado (faturamento de joias +75% em julho de 2026 na Nuvemshop), o que sustenta o cenário otimista, mas esse crescimento não foi atribuído integralmente ao projeto.

Isso não inviabiliza o projeto, mas muda a forma de justificá-lo. O investimento de R\$ 57.508 é um custo alocado de uma equipe de desenvolvimento; o desembolso efetivo da loja é bem menor. Além disso, o projeto entrega benefícios que não entram no cálculo: base própria de clientes, controle de estoque, dados de vendas e independência das redes sociais. A decisão deve ponderar esses fatores e acompanhar o faturamento real da loja após o lançamento.

## 9. Análise de Riscos

Os cinco riscos do Termo de Abertura foram mantidos (itens 1 a 5) e foram acrescentados os riscos identificados na análise do projeto e do código (itens 6 a 10). Dois deles (itens 6 e 7) também foram incluídos no Termo.

| **\#** | **Risco**                                                              | **Prob.** | **Impacto** | **Resposta proposta**                                                                                                                                     |
|--------|------------------------------------------------------------------------|-----------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | Indisponibilidade do gerente da loja                                   | Média     | Alto        | Agenda fixa semanal de validação e indicação de um substituto na Adornatta.                                                                               |
| 2      | Baixa adesão dos clientes, que continuam pedindo por direct e WhatsApp | Alta      | Alto        | Colocar o link da loja no perfil e nas respostas automáticas; divulgar o lançamento (um benefício na primeira compra, como cupom, só entra mediante mudança de escopo aprovada).                     |
| 3      | Estoque desatualizado, gerando venda de itens esgotados                | Alta      | Alto        | Baixa automática de estoque ao registrar venda; alerta de estoque baixo no dashboard; rotina diária de conferência.                                       |
| 4      | Vazamento de dados de clientes ou da loja                              | Média     | Alto        | Senhas criptografadas, HTTPS, coleta mínima de dados, política de privacidade e controle de acesso no servidor.                                           |
| 5      | Atraso no cadastro de produtos por falta de imagens e descrições       | Média     | Médio       | Checklist de fotos e descrições, padrão de imagem e prazo de entrega pela loja.                                                                           |
| 6      | Back-end simulado (json-server) usado em produção                      | Alta      | Alto        | Migrar para API e banco de dados reais antes do lançamento; usar a reserva de contingência se necessário.                                                 |
| 7      | Falhas ou ausência de integração de pagamento                          | Média     | Alto        | Definir o intermediador de pagamento no início do desenvolvimento e testar em ambiente de homologação.                                                    |
| 8      | Perda de integrantes da equipe ou sobrecarga                           | Média     | Alto        | Documentação do código, revisão entre pares e redistribuição de tarefas; critério de encerramento já previsto (perda de 2 ou mais dos 4 desenvolvedores). |
| 9      | Estouro de custo ou prazo                                              | Média     | Médio       | Reserva de 10%, acompanhamento semanal por marcos e limite de cancelamento alinhado ao orçamento aprovado (R\$ 57.508).                                   |
| 10     | Crescimento de escopo                                                  | Média     | Médio       | Controle de mudanças com decisão por maioria dos gerentes e voto final do patrocinador.                                                                   |

## 10. Requisitos Legais e de Conformidade

Por tratar dados pessoais e vender ao consumidor final, a loja deve observar, no mínimo, as normas abaixo. Recomenda-se validação jurídica antes do lançamento.

- **LGPD (Lei nº 13.709/2018):** informar a finalidade da coleta de dados, coletar apenas o necessário, ter política de privacidade, proteger os dados e atender aos direitos dos titulares.

- **Código de Defesa do Consumidor (Lei nº 8.078/1990):** inclui o direito de arrependimento em até 7 dias para compras feitas fora do estabelecimento (art. 49), o que afeta a política de trocas e devoluções.

- **Decreto nº 7.962/2013 (comércio eletrônico):** exige informações claras sobre a empresa, preço, frete e prazos, atendimento ao consumidor e confirmação do pedido.

- **Dados de cartão:** o uso de um intermediador de pagamento evita que o sistema armazene números de cartão.

## 11. Cronograma e Marcos

| **Marco**                                               | **Período de referência** | **Entregável**                                         |
|---------------------------------------------------------|---------------------------|--------------------------------------------------------|
| 1\. Termo de Abertura aprovado e requisitos levantados  | Agosto/2026               | Termo de Abertura e documento de requisitos            |
| 2\. Protótipo de interface (UI/UX) validado pela gestão | Setembro/2026             | Protótipo interativo aprovado                          |
| 3\. Sistema integrado testado e homologado              | Outubro/2026              | Catálogo, carrinho e painel administrativo funcionando |
| 4\. Implantação e lançamento oficial                    | Novembro/2026             | Loja em produção, documentação e Termo de Aceite (AV2) |

As datas por mês são referências a partir do início em agosto e da entrega no fim de novembro, e devem ser ajustadas ao cronograma detalhado do grupo.

## 12. Partes Interessadas e Governança

Registro inicial das partes interessadas. Ele será atualizado ao longo do projeto.

| **Parte interessada**                                                                                            | **Interesse**                                                   | **Influência** | **Impacto** | **Engajamento**                                       |
|------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|----------------|-------------|-------------------------------------------------------|
| **Patrocinador (Diogo Silveira Mendonça)**                                                                       | Obter o valor previsto; aprovar o projeto e decidir exceções    | Alta           | Baixo       | Reunião a cada marco                                  |
| **Proprietários e gerente da Adornatta**                                                                         | Controle de pedidos e estoque; facilidade de uso                | Alta           | Alto        | Validação do protótipo e da entrega; reunião semanal  |
| **Funcionários da loja (operam o sistema depois)**                                                               | Ferramenta simples para vendas, estoque e pedidos               | Média          | Alto        | Treinamento e manual de operação                      |
| **Clientes finais**                                                                                              | Encontrar produtos, comprar com segurança e acompanhar o pedido | Média          | Alto        | Divulgação do lançamento e canal de feedback          |
| **Equipe de gerenciamento (4 gerentes)**                                                                         | Entrega no prazo e no orçamento; decisões por maioria de votos  | Alta           | Alto        | Reunião semanal e prestação de contas ao patrocinador |
| **Equipe de desenvolvimento (João Henrique Lima Gualberto, Pedro Pimentel Nunes, Tamires Barbosa dos Santos e Vinicius da Silva Mendes)** | Construir e documentar o sistema no escopo e no prazo           | Média          | Alto        | Reunião semanal e quadro de tarefas                   |
| **Fornecedores**                                                                                                 | Informação de reposição mais clara                              | Baixa          | Baixo       | Manter informados                                     |
| **Provedores de hospedagem e de pagamento**                                                                      | Disponibilidade, segurança e taxas                              | Média          | Baixo       | Monitorar                                             |

### Papéis e autoridade

- **Patrocinador:** defende o caso de negócio, autoriza o Termo de Abertura, libera os recursos iniciais, designa os gerentes e decide o que foge da alçada da equipe.

- **Gerentes do projeto:** podem alocar a equipe, priorizar tarefas e usar o orçamento aprovado. Dependem do patrocinador para usar a reserva de contingência (R\$ 5.228), alterar escopo ou prazo e ultrapassar o orçamento, e prestam contas a cada marco.

## 13. Premissas e Restrições

Além das premissas e restrições do Termo de Abertura, este Business Case assume:

- A Adornatta fornecerá dados reais de vendas, estoque e erros para calibrar os indicadores e a análise financeira.

- Haverá um meio de pagamento online acessível à loja, com custos de transação suportados por ela.

- A loja manterá o Instagram e o WhatsApp como canais de divulgação, direcionando os clientes para o site.

- Existirá um responsável pós-projeto pela manutenção do sistema e pela medição dos indicadores.

- Itens fora do escopo do Termo continuam fora: aplicativo móvel, chatbot, migração de dados de outras plataformas e integração com ERP ou sistemas fiscais.

### Registro de premissas e risco associado

Cada premissa é tratada como verdadeira por enquanto e tem um risco ligado a ela, caso deixe de valer.

| **Premissa**                                                             | **Risco se a premissa falhar**                                                                   | **Risco nº** |
|--------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|--------------|
| Gerente da loja liberado para entrevistas e validações                   | Atraso nos requisitos e na validação                                                             | 1            |
| Clientes aceitam ser direcionados do Instagram e do WhatsApp para a loja | Baixa adesão e metas de migração não atingidas                                                   | 2            |
| Equipe interna atualiza o estoque no painel                              | Venda de itens esgotados                                                                         | 3            |
| Conteúdo, fotos e descrições entregues no prazo                          | Atraso no cadastro e na homologação                                                              | 5            |
| Intermediador de pagamentos disponível                                   | Falha ou atraso na integração do pagamento                                                       | 7            |
| Hospedagem paga pelo projeto até o lançamento e pela loja depois                                      | Site fora do ar ou custo recorrente não coberto                                                  | — (risco a acompanhar, fora da lista numerada) |
| Loja fornece dados reais de vendas, estoque e erros                      | Metas e análise financeira apoiadas só em hipóteses (risco a acompanhar, fora da lista numerada) | —            |

## 14. Plano de Medição de Benefícios

| **Quando**                  | **O que medir**                                                                        | **Responsável**                      |
|-----------------------------|----------------------------------------------------------------------------------------|--------------------------------------|
| 30 dias antes do lançamento | Linha de base: pedidos por mês, erros de pedido, tempo de atendimento e faturamento    | Gerente da loja, com apoio da equipe |
| No lançamento               | % de produtos cadastrados e com estoque atualizado                                     | Equipe do projeto e gerente da loja  |
| 1º mês após o lançamento    | % de pedidos pelo site (meta de 60%) e erros de pedido                                 | Gerente da loja                      |
| 3º mês após o lançamento    | % de vendas pelo site (meta de 70%), redução de 80% dos erros e benefício líquido real | Gerente da loja e patrocinador       |

### Responsáveis depois do projeto

- **Operação diária:** gerente e funcionários da Adornatta (pedidos, estoque e atendimento).

- **Manutenção:** equipe de desenvolvimento ou profissional contratado, a definir com a loja, com custo estimado de R\$ 305 por mês (15 horas de um desenvolvedor júnior).

- **Medição dos indicadores:** gerente da loja, com apoio do patrocinador.

## 15. Conclusão e Recomendação

O problema da Adornatta é real e cresce com o volume de vendas: pedidos e estoque são controlados de forma fragmentada em redes sociais. Uma loja virtual própria com painel administrativo ataca a causa do problema ao centralizar catálogo, pedidos, vendas e estoque.

**Decisão solicitada ao patrocinador: seguir.** As demais respostas possíveis na iniciação são adiar, comparar alternativas ou rejeitar o projeto.

Recomenda-se prosseguir com a Opção B, com o orçamento aprovado de R\$ 57.508 e prazo até a AV2, reconhecendo que, com dados de mercado de 2026, o retorno financeiro direto só se confirma no cenário otimista (payback de 24 meses). Para reduzir o risco, recomenda-se: (1) acompanhar o faturamento e os erros de pedido reais da loja e refazer a análise da seção 8; (2) preparar o back-end para produção; (3) executar o pagamento por intermediador conforme o escopo já formalizado e acompanhar o pedido apenas por status; e (4) atender aos requisitos de LGPD e de defesa do consumidor.

## 16. Fontes dos Dados de Mercado

- Nuvemshop – Radar do E-commerce D2C, julho/2026 (ticket médio, pedidos, lojas ativas, Pix e cartão, crescimento de joias) e NuvemCommerce 2026.

- Nuvemshop – páginas de segmento de semijoias e bijuterias (margem de 100% a 250% e faturamento do segmento; dados de fornecedor de plataforma) e página de preços (planos a partir de cerca de R\$ 69/mês).

- Confi e E-commerce Brasil – Panorama do e-commerce brasileiro no 1º semestre de 2026.

- Indeed e Glassdoor (2026) – média salarial de desenvolvedor júnior de cerca de R\$ 3.189 a R\$ 3.463 por mês.

- Decreto nº 12.797/2025 – salário mínimo de R\$ 1.621 em 2026. Banco Central – Selic de 13,75% ao ano (Copom de 16/09/2026).

- Registro.br – domínio .com.br a R\$ 40/ano. Planos de VPS de entrada a partir de R\$ 38,99/mês (Hostinger, 2026).

- Mercado Pago – tarifas de Pix e cartão de crédito. Nuvem Envios e Conselho de Logística Reversa Brasileiro – trocas e devoluções em torno de 10%.

- Regras do Simples Nacional – limites de R\$ 81 mil (MEI) e R\$ 360 mil (microempresa) por ano.

Os valores devem ser reconferidos nas fontes antes da entrega final, pois preços e taxas variam com o tempo.

**Conferência de 04/10/2026.** Confirmados nas fontes: Selic de 13,75% ao ano (Copom de 16/09/2026), salário mínimo de R$ 1.621 e R$ 7,37 por hora (Decreto nº 12.797/2025) e ticket médio de R$ 287,10 (Radar do E-commerce D2C, julho/2026). Ainda não conferidos: número de lojas ativas usado no faturamento médio (44.394), crescimento de joias e semijoias (+75,1%), margem de semijoias, tarifas do Mercado Pago, preço de VPS e taxa de trocas e devoluções.
