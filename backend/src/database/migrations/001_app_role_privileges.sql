DO $$
BEGIN
    IF to_regclass('public.usuario') IS NULL
       OR to_regclass('public.pedido') IS NULL
       OR to_regclass('public.pagamento') IS NULL
       OR to_regprocedure('public.excluir_dados_usuario(integer)') IS NULL THEN
        RAISE EXCEPTION
            'Schema Adornatta nao instalado; aplique BancoDadosAdornatta.sql primeiro.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'adornatta_app')
       OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'adornatta_owner') THEN
        RAISE EXCEPTION 'Roles adornatta_app e adornatta_owner sao necessarias.';
    END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_produto_categoria_nome_ci
    ON public.produto (idcategoria, lower(nome));

CREATE OR REPLACE FUNCTION public.impedir_promocao_administrador()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
    IF pg_has_role(current_user, 'adornatta_app', 'member')
       AND TG_OP = 'INSERT'
       AND NEW.perfil <> 'cliente' THEN
        RAISE EXCEPTION 'A role da aplicacao nao pode criar administradores.'
            USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_usuario_sem_promocao_app ON public.usuario;
CREATE TRIGGER trg_usuario_sem_promocao_app
    BEFORE INSERT ON public.usuario
    FOR EACH ROW
    EXECUTE FUNCTION public.impedir_promocao_administrador();

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO adornatta_app;
GRANT USAGE ON SCHEMA public TO adornatta_owner;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC, adornatta_app;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC, adornatta_app;

GRANT SELECT, INSERT, DELETE ON public.telefone_usuario TO adornatta_app;
GRANT SELECT, INSERT, UPDATE ON public.endereco_usuario TO adornatta_app;
GRANT SELECT, INSERT, DELETE ON public.imagem_produto TO adornatta_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produto_pedido TO adornatta_app;

GRANT SELECT ON public.forma_pagamento_usuario TO adornatta_app;
GRANT INSERT (
    idusuario, tipo, identificador, bandeira, ultimos_digitos,
    nome_titular, validade_mes, validade_ano, provedor
) ON public.forma_pagamento_usuario TO adornatta_app;
GRANT UPDATE (
    tipo, bandeira, ultimos_digitos, nome_titular,
    validade_mes, validade_ano, ativo
) ON public.forma_pagamento_usuario TO adornatta_app;

GRANT SELECT ON public.categoria TO adornatta_app;
GRANT SELECT, INSERT, DELETE ON public.produto TO adornatta_app;
GRANT UPDATE (
    nome, descricao, preco_unitario, material, tipo_banho,
    quantidade, idcategoria
) ON public.produto TO adornatta_app;

GRANT SELECT ON public.usuario TO adornatta_app;
GRANT INSERT (nome, cpf, perfil, email, senha),
    UPDATE (nome, cpf, email) ON public.usuario TO adornatta_app;

GRANT SELECT ON public.pedido TO adornatta_app;
GRANT INSERT (
    data, valor_total, status, idusuario, idendereco,
    logradouro_entrega, numero_entrega, complemento_entrega,
    bairro_entrega, cidade_entrega, uf_entrega, cep_entrega
) ON public.pedido TO adornatta_app;
GRANT UPDATE (valor_total, status) ON public.pedido TO adornatta_app;

GRANT SELECT ON public.pagamento TO adornatta_app;
GRANT INSERT (
    idpedido, idformapagamento, valor, status, forma_pagamento, provedor
) ON public.pagamento TO adornatta_app;
GRANT UPDATE (
    valor, status, identificador_externo, idpreferencia,
    url_checkout, data_pagamento
) ON public.pagamento TO adornatta_app;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO adornatta_app;

GRANT SELECT ON public.pedido, public.usuario TO adornatta_owner;
GRANT UPDATE (
    idendereco, logradouro_entrega, numero_entrega, complemento_entrega,
    bairro_entrega, cidade_entrega, uf_entrega, cep_entrega,
    transportadora, codigo_rastreio
) ON public.pedido TO adornatta_owner;
GRANT DELETE ON public.usuario TO adornatta_owner;
ALTER FUNCTION public.excluir_dados_usuario(INTEGER) OWNER TO adornatta_owner;
REVOKE ALL ON FUNCTION public.excluir_dados_usuario(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.excluir_dados_usuario(INTEGER)
    TO adornatta_app;

REVOKE ALL ON FUNCTION public.impedir_promocao_administrador() FROM PUBLIC;
