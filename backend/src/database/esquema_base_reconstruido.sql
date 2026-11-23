-- =====================================================================
-- ESQUEMA-BASE RECONSTRUÍDO (somente para desenvolvimento local)
--
-- A migration 001 exige o script original "BancoDadosAdornatta.sql",
-- que não está no repositório. Este arquivo foi reconstruído a partir
-- das consultas SQL do backend (services, migrations e seed) para que
-- o projeto rode na máquina de qualquer integrante.
--
-- Se o grupo tiver o BancoDadosAdornatta.sql original, use o original.
--
-- Execute com a conta de MIGRAÇÃO (dona do banco), ANTES do db:migrate:
--   psql -h localhost -U adornatta_migr -d adornatta -f esquema_base_reconstruido.sql
-- =====================================================================

CREATE TABLE public.usuario (
    idusuario   SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    cpf         CHAR(11)     NOT NULL,
    perfil      VARCHAR(20)  NOT NULL DEFAULT 'cliente'
                CHECK (perfil IN ('cliente', 'administrador')),
    email       VARCHAR(120) NOT NULL,
    senha       VARCHAR(255) NOT NULL,
    -- os nomes das constraints são usados no usuarioService.js
    CONSTRAINT usuario_cpf_key   UNIQUE (cpf),
    CONSTRAINT usuario_email_key UNIQUE (email)
);

CREATE TABLE public.telefone_usuario (
    idtelefone  SERIAL PRIMARY KEY,
    idusuario   INTEGER     NOT NULL
                REFERENCES public.usuario (idusuario) ON DELETE CASCADE,
    numero      VARCHAR(20) NOT NULL
);

CREATE TABLE public.endereco_usuario (
    idendereco  SERIAL PRIMARY KEY,
    idusuario   INTEGER      NOT NULL
                REFERENCES public.usuario (idusuario) ON DELETE CASCADE,
    logradouro  VARCHAR(120) NOT NULL,
    numero      VARCHAR(20)  NOT NULL,
    complemento VARCHAR(60),
    bairro      VARCHAR(60)  NOT NULL,
    cidade      VARCHAR(60)  NOT NULL,
    uf          CHAR(2)      NOT NULL,
    cep         VARCHAR(9)   NOT NULL
);

CREATE TABLE public.categoria (
    idcategoria SERIAL PRIMARY KEY,
    nome        VARCHAR(60) NOT NULL
);

CREATE TABLE public.produto (
    idproduto      SERIAL PRIMARY KEY,
    nome           VARCHAR(80)   NOT NULL,
    descricao      TEXT          NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario > 0),
    material       VARCHAR(60),
    tipo_banho     VARCHAR(60),
    quantidade     INTEGER       NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
    idcategoria    INTEGER       NOT NULL
                   REFERENCES public.categoria (idcategoria)
);

CREATE TABLE public.imagem_produto (
    idimagem   SERIAL PRIMARY KEY,
    idproduto  INTEGER      NOT NULL
               REFERENCES public.produto (idproduto) ON DELETE CASCADE,
    url        VARCHAR(255) NOT NULL,
    UNIQUE (idproduto, url)
);

CREATE TABLE public.forma_pagamento_usuario (
    idformapagamento SERIAL PRIMARY KEY,
    idusuario        INTEGER     NOT NULL
                     REFERENCES public.usuario (idusuario) ON DELETE CASCADE,
    tipo             VARCHAR(20) NOT NULL,
    identificador    VARCHAR(100),
    bandeira         VARCHAR(20),
    ultimos_digitos  CHAR(4),
    nome_titular     VARCHAR(40),
    validade_mes     SMALLINT,
    validade_ano     SMALLINT,
    provedor         VARCHAR(30) NOT NULL DEFAULT 'local',
    ativo            BOOLEAN     NOT NULL DEFAULT TRUE,
    data_cadastro    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.pedido (
    idpedido            SERIAL PRIMARY KEY,
    data                TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_total         NUMERIC(10,2) NOT NULL CHECK (valor_total >= 0),
    -- pendente, confirmado, em_preparacao, enviado, entregue, cancelado
    status              VARCHAR(20)   NOT NULL DEFAULT 'pendente',
    idusuario           INTEGER       NOT NULL
                        REFERENCES public.usuario (idusuario),
    idendereco          INTEGER
                        REFERENCES public.endereco_usuario (idendereco)
                        ON DELETE SET NULL,
    -- cópia do endereço no momento da compra
    logradouro_entrega  VARCHAR(120),
    numero_entrega      VARCHAR(20),
    complemento_entrega VARCHAR(60),
    bairro_entrega      VARCHAR(60),
    cidade_entrega      VARCHAR(60),
    uf_entrega          CHAR(2),
    cep_entrega         VARCHAR(9),
    transportadora      VARCHAR(60),
    codigo_rastreio     VARCHAR(60)
);

CREATE TABLE public.produto_pedido (
    idproduto            INTEGER       NOT NULL
                         REFERENCES public.produto (idproduto),
    idpedido             INTEGER       NOT NULL
                         REFERENCES public.pedido (idpedido) ON DELETE CASCADE,
    quantidade           INTEGER       NOT NULL CHECK (quantidade > 0),
    quantidade_reservada INTEGER       NOT NULL DEFAULT 0
                         CHECK (quantidade_reservada >= 0),
    preco_unitario       NUMERIC(10,2) NOT NULL,
    PRIMARY KEY (idproduto, idpedido)
);

CREATE TABLE public.pagamento (
    idpagamento           SERIAL PRIMARY KEY,
    idpedido              INTEGER       NOT NULL
                          REFERENCES public.pedido (idpedido) ON DELETE CASCADE,
    idformapagamento      INTEGER
                          REFERENCES public.forma_pagamento_usuario (idformapagamento),
    valor                 NUMERIC(10,2) NOT NULL,
    -- pendente, aprovado, recusado, cancelado, estornado...
    status                VARCHAR(20)   NOT NULL DEFAULT 'pendente',
    forma_pagamento       VARCHAR(30),
    provedor              VARCHAR(30),
    identificador_externo VARCHAR(100),
    idpreferencia         VARCHAR(100),
    url_checkout          TEXT,
    data_pagamento        TIMESTAMPTZ
);

-- A migration 001 transfere a função abaixo para adornatta_owner, e o
-- novo dono precisa poder criar objetos no schema public.
GRANT CREATE ON SCHEMA public TO adornatta_owner;

-- Exigida pela migration 001 (que muda o dono para adornatta_owner).
-- Remove os dados pessoais de um usuário, mantendo o histórico de pedidos
-- anonimizado.
CREATE FUNCTION public.excluir_dados_usuario(p_idusuario INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
    UPDATE public.pedido
    SET idendereco = NULL,
        logradouro_entrega = NULL, numero_entrega = NULL,
        complemento_entrega = NULL, bairro_entrega = NULL,
        cidade_entrega = NULL, uf_entrega = NULL, cep_entrega = NULL
    WHERE idusuario = p_idusuario;

    -- só exclui o usuário se ele não tiver pedidos (FK de pedido)
    IF NOT EXISTS (
        SELECT 1 FROM public.pedido WHERE idusuario = p_idusuario
    ) THEN
        DELETE FROM public.usuario WHERE idusuario = p_idusuario;
    END IF;
END;
$$;
