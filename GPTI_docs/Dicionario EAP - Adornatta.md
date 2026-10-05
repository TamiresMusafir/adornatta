# Dicionário da EAP — Loja Virtual Adornatta

**Data:** 04/10/2026  
**Linha de base do escopo:** este dicionário, a declaração do escopo e a EAP em [Plano de projeto - Adornatta.md](Plano%20de%20projeto%20-%20Adornatta.md)

Cada linha é um pacote de trabalho. **A** é quem presta contas do aceite. **R** é quem executa. O nível abaixo do pacote, quando existir, é atividade do cronograma e não tem aceite próprio.

O identificador do pacote é o código da EAP. Marco, recurso, custo, requisito e risco não se repetem aqui: estão no cronograma, no orçamento, na matriz de rastreabilidade (seção 4.3) e na análise de riscos (seção 6.3) do plano e podem ser acrescentados a este dicionário depois. As janelas, os marcos e as dependências por grupo de pacotes estão na seção 5.4 do plano.

**Equipes e pessoas.** GPTI-1 a GPTI-4 são Fernando Lira Barbosa, Gabriel Felipe Martins da Silva, Igor Roberto da Silva Tabelini e Matheus Dinis Francellino (Gerentes 1 a 4 no Termo de Abertura). PSW-1 a PSW-4 são João Henrique Lima Gualberto, Pedro Pimentel Nunes, Tamires Barbosa dos Santos e Vinicius da Silva Mendes, na ordem em que aparecem no Termo. A coluna Responsável nominal (A) é uma proposta de distribuição.

## 1.1 Gestão e coordenação

| Pacote | Entrega | A | R | Responsável nominal (A) | Aceite observável |
|---|---|---|---|---|---|
| 1.1.1 | Termo, business case e plano mantidos | GPTI | GPTI | GPTI-1 a GPTI-4 | A versão do plano citada em cada avaliação é a mesma usada no acompanhamento, ou a mudança está registrada com a decisão do patrocinador. |
| 1.1.2 | Decisões, riscos e mudanças | GPTI | GPTI | GPTI-1 a GPTI-4 | Cada mudança de escopo, prazo ou orçamento tem pedido por escrito, decisão (maioria dos gerentes; patrocinador no empate e nos casos de alçada dele) e efeito registrado nas linhas de base. O registro de riscos cobre os riscos 1 a 12 do plano. |
| 1.1.3 | Orçamento e reserva acompanhados | GPTI | GPTI | GPTI-2 | O gasto é comparado ao orçamento liberado aos gerentes (R$ 52.280,00) a cada marco, e todo uso da reserva de R$ 5.228,00 (total aprovado de R$ 57.508,00) tem autorização do patrocinador registrada. |
| 1.1.4 | Prestação de contas e aceites dos marcos | GPTI | GPTI | GPTI-2 | Há registro de reunião com o patrocinador a cada marco (Marcos 1 a 4, AV1 e back-end real) e da decisão de aceite ou recusa. |

## 1.2 Requisitos e protótipo (Entrega Principal 1)

| Pacote | Entrega | A | R | Responsável nominal (A) | Aceite observável |
|---|---|---|---|---|---|
| 1.2.1 | Requisitos levantados | GPTI | PSW propõe; GPTI valida | GPTI-3 | As entrevistas com o gerente da loja estão registradas, e cada requisito do plano (seção 3) tem origem e critério de aceite. |
| 1.2.2 | Escopo e limites registrados | GPTI | PSW propõe; GPTI valida | GPTI-3 | A declaração do escopo cabe em uma leitura e lista o que está fora: migração de clientes de outras plataformas, aplicativo móvel, chatbot, ERP ou sistema fiscal e integração com transportadoras. |
| 1.2.3 | Atores e fluxos | GPTI | PSW | GPTI-3 | Cliente e administrador da loja têm ações distintas; o cliente não executa ação do painel. |
| 1.2.4 | Protótipo interativo | GPTI | PSW | GPTI-3 | O protótipo percorre cadastro, catálogo, carrinho, checkout, acompanhamento do pedido e as telas do painel, sem passo oral não representado. |
| 1.2.5 | Validação do protótipo | GPTI | GPTI | GPTI-3 | A gestão da Adornatta valida o protótipo (Marco 2) e a validação fica registrada. |

## 1.3 Módulo do Cliente (Entrega Principal 2)

| Pacote | Entrega | A | R | Responsável nominal (A) | Aceite observável |
|---|---|---|---|---|---|
| 1.3.1 | Página inicial e páginas institucionais | PSW | PSW | PSW-1 | Início, Sobre nós e Contato abrem pela navegação e exibem conteúdo. |
| 1.3.2 | Cadastro, login e logout | PSW | PSW | PSW-1 | Um cliente novo cria a conta, entra e sai. Dado inválido ou campo obrigatório vazio não é aceito no cadastro. |
| 1.3.3 | Catálogo, categorias, busca e detalhes | PSW | PSW | PSW-1 | Cada produto exibe nome, descrição, preço, imagem, categoria, material, tipo de banho e disponibilidade. Cada filtro (Brincos, Conjuntos, Pulseiras, Cordões) retorna só a sua categoria. A busca retorna os produtos que correspondem ao termo. A página de detalhes abre. |
| 1.3.4 | Lista de desejos | PSW | PSW | PSW-1 | O cliente adiciona e remove produtos, e a lista mostra os itens salvos. |
| 1.3.5 | Carrinho e checkout | PSW | PSW | PSW-2 | O cliente adiciona produto ao carrinho, vê os itens e finaliza o pedido. O checkout recusa dados inválidos. O pedido finalizado aparece no painel (1.4.3). |
| 1.3.6 | Acompanhamento do pedido | PSW | PSW | PSW-2 | O cliente vê o status do pedido entre Em análise, Em preparação, Enviado, Entregue e Cancelado. A mudança feita no painel aparece para o cliente. Não há código de rastreio de transportadora. |
| 1.3.7 | Informações legais e frete | PSW | PSW implementa; GPTI redige os textos com a Adornatta | PSW-2 | A política de privacidade e a de trocas e devoluções (com o direito de arrependimento de 7 dias) abrem pela navegação, e os dados da empresa aparecem no rodapé ou em Contato. O checkout mostra frete e prazo por região, conforme a tabela definida pela Adornatta, antes de finalizar, e a confirmação do pedido mostra itens, preço, frete e prazo. Os textos legais são revisados pela Adornatta (validação jurídica recomendada). Não há cálculo por transportadora. |

1.3 aceita as telas. 1.5 aceita a API real. Um pacote não herda o aceite do outro.

## 1.4 Painel Administrativo (Entrega Principal 3)

| Pacote | Entrega | A | R | Responsável nominal (A) | Aceite observável |
|---|---|---|---|---|---|
| 1.4.1 | Dashboard | PSW | PSW | PSW-1 | O painel mostra total de produtos, itens em estoque, estoque baixo e sem estoque, e os números mudam quando o estoque é ajustado. |
| 1.4.2 | Estoque e cadastro de produtos | PSW | PSW | PSW-3 | O administrador cadastra, consulta, edita e exclui produto, pesquisa e ajusta a quantidade. O produto cadastrado aparece no catálogo do cliente. |
| 1.4.3 | Controle de pedidos | PSW | PSW | PSW-2 | O administrador lista, pesquisa e altera o status do pedido para um dos cinco status. A alteração aparece para o cliente em 1.3.6. |
| 1.4.4 | Registro de vendas | PSW | PSW | PSW-3 | Registrar uma venda reduz o estoque do item vendido. O painel mostra as vendas e o faturamento do mês. |

1.4 aceita as telas do painel. A baixa de estoque definitiva e a persistência dependem de 1.5.

## 1.5 Back-end

| Pacote | Entrega | A | R | Responsável nominal (A) | Aceite observável |
|---|---|---|---|---|---|
| 1.5.1 | API de produtos e estoque | PSW | PSW | PSW-3 | As operações de produto e a consulta por categoria funcionam no banco real. Ajustar o estoque altera a quantidade que o catálogo lê. |
| 1.5.2 | API de pedidos | PSW | PSW | PSW-4 | Criar, consultar e alterar status de pedido persistem, com frete e prazo gravados no pedido. Status fora dos cinco definidos é recusado. |
| 1.5.3 | API de vendas e baixa de estoque | PSW | PSW | PSW-3 | Registrar venda grava a venda e baixa o estoque na mesma operação. O faturamento do mês confere com as vendas registradas. |
| 1.5.4 | API da lista de desejos | PSW | PSW | PSW-4 | Adicionar, remover e consultar persistem por cliente. |
| 1.5.5 | Cadastro, autenticação e controle de acesso | PSW | PSW | PSW-4 | A API cria a conta do cliente e autentica login e logout. As senhas são criptografadas, a produção usa HTTPS, e as rotas do painel recusam chamada de cliente comum, no servidor. |
| 1.5.6 | Pagamento por intermediador | PSW | PSW | PSW-4 | Uma compra de teste com Pix e outra com cartão, em ambiente de homologação, terminam no fluxo de pedido, e o sistema não guarda número de cartão. |
 

## 1.6 Integração e homologação

| Pacote | Entrega | A | R | Responsável nominal (A) | Aceite observável |
|---|---|---|---|---|---|
| 1.6.1 | Fluxos principais | GPTI | PSW executa; GPTI verifica | GPTI-2 | Os quatro fluxos: consultar catálogo, adicionar ao carrinho, cadastrar produto e atualizar status do pedido terminam sem erro crítico, primeiro com o back-end simulado (Marco 3) e de novo com o back-end real antes do lançamento. |
| 1.6.2 | Compra e estoque | GPTI | PSW executa; GPTI verifica | GPTI-2 | O processo de compra e a gestão de estoque não apresentam falha grave. |
| 1.6.3 | Computador e celular | GPTI | PSW | GPTI-2 | Navegação, catálogo e filtros são utilizáveis nos dois formatos, sem rolagem horizontal. |
| 1.6.4 | Defeitos tratados | PSW | PSW | PSW-4 | Defeito que viola o aceite de um pacote está corrigido ou listado como limitação da homologação. |
| 1.6.5 | Homologação aceita | GPTI | GPTI | GPTI-2 | Há registro de aceite ou de recusa do Marco 3, com ciência do patrocinador. |


## 1.7 Documentação técnica e de uso (Entrega Principal 4)

| Pacote | Entrega | A | R | Responsável nominal (A) | Aceite observável |
|---|---|---|---|---|---|
| 1.7.1 | Manual de Instalação | GPTI | PSW | GPTI-4 | Um integrante que não escreveu o manual instala o sistema só com o texto. |
| 1.7.2 | Manual de Operação do painel | GPTI | GPTI | GPTI-3 | Alguém que não participou da escrita cadastra um produto, ajusta o estoque e altera o status de um pedido só com o guia. |
| 1.7.3 | Manual do Usuário | GPTI | GPTI | GPTI-3 | Alguém de fora do projeto faz cadastro, escolhe um produto e finaliza um pedido só com o manual. |
| 1.7.4 | Documentação técnica | GPTI | PSW | GPTI-4 | O texto descreve as tecnologias usadas, a estrutura da aplicação, a API e o banco, e aponta o repositório do código. |


## 1.8 Verificação e encerramento

| Pacote | Entrega | A | R | Responsável nominal (A) | Aceite observável |
|---|---|---|---|---|---|
| 1.8.1 | Carga inicial do catálogo e do estoque | GPTI | GPTI e PSW | GPTI-4 | 100% dos produtos ativos estão cadastrados com estoque atualizado no lançamento. Fotos, descrições e conteúdo vêm da Adornatta, entregues até 06/11/2026 (proposta). |
| 1.8.2 | Linha de base dos indicadores | GPTI | Gerente da Adornatta, com apoio da equipe | GPTI-1 | Pedidos por mês, erros de pedido, tempo de atendimento e faturamento dos 30 dias antes do lançamento (de 26/10 a 24/11/2026, para lançamento em 25/11) estão registrados. |
| 1.8.3 | Treinamento da equipe da loja | GPTI | GPTI e PSW | GPTI-4 | Os funcionários da loja cadastram um produto, ajustam o estoque e alteram um status com o manual. |
| 1.8.4 | Lançamento em produção | GPTI | PSW | GPTI-4 | A loja está em produção, acessível pelo domínio. O canal de feedback dos clientes está disponível. A divulgação do lançamento foi feita pela Adornatta nos canais da loja. |
| 1.8.5 | Termo de Aceite e encerramento | GPTI | GPTI | GPTI-1 | O Termo de Aceite está assinado pelos proprietários da Adornatta, com aprovação final do patrocinador até a data da AV2. O termo registra o que foi aceito, o que ficou de fora e como será feita a medição do 1º e do 3º mês. |

1.8.5 encerra o projeto. A medição do 1º e do 3º mês ocorre depois, pelo gerente da Adornatta com apoio do patrocinador, e não tem pacote nesta EAP.
