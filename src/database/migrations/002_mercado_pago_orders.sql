ALTER TABLE public.pagamento
    ADD COLUMN idorder VARCHAR(100);

CREATE UNIQUE INDEX uq_pagamento_mercado_pago_idorder
    ON public.pagamento (idorder)
    WHERE provedor = 'mercado_pago' AND idorder IS NOT NULL;

GRANT UPDATE (idorder) ON public.pagamento TO adornatta_app;
