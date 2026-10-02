# Manual de Instalação 

## 1. Pré-requisitos

Para instalar e executar o projeto, é necessário ter instalado:

-   Git
-   Node.js
-   npm

## 2. Clonar o projeto

Primeiramente, deve ser realizado o clone da branch principal do
projeto.

Substitua `URL_DO_REPOSITORIO` pela URL do repositório do projeto:

``` bash
git clone -b main URL_DO_REPOSITORIO
```

Depois, entre na pasta do projeto:

``` bash
cd pasta_projeto
```

## 3. Instalar as dependências

Com o terminal aberto na pasta do projeto, instale as dependências
utilizadas pela aplicação:

``` bash
npm install react react-dom react-router-dom vite bootstrap bootstrap-icons
```

As principais dependências utilizadas são:

-   **React** --- biblioteca utilizada para construção da interface.
-   **React DOM** --- responsável pela integração do React com o DOM da
    aplicação.
-   **React Router DOM** --- utilizado para criação e gerenciamento das
    rotas.
-   **Vite** --- ferramenta utilizada para desenvolvimento e execução do
    projeto.
-   **Bootstrap** --- framework utilizado para estrutura e componentes
    visuais.
-   **Bootstrap Icons** --- biblioteca de ícones utilizada na interface.

## 4. Conclusão da instalação

Após a instalação das dependências, o projeto estará preparado para ser
executado seguindo as instruções do [Manual de
Operação](MANUAL_OPERACAO.md).
