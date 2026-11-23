ALTER TABLE public.pagamento
    ADD COLUMN checkout_expires_at TIMESTAMPTZ;

UPDATE public.pagamento pg
SET checkout_expires_at = COALESCE(p.data, CURRENT_TIMESTAMP) + INTERVAL '15 minutes'
FROM public.pedido p
WHERE p.idpedido = pg.idpedido
  AND pg.provedor = 'mercado_pago'
  AND pg.status = 'pendente'
  AND p.status = 'pendente'
  AND pg.idorder IS NOT NULL
  AND pg.idorder NOT LIKE 'pending-%';

CREATE INDEX idx_pagamento_checkout_expiracao
    ON public.pagamento (checkout_expires_at)
    WHERE provedor = 'mercado_pago'
      AND status = 'pendente'
      AND checkout_expires_at IS NOT NULL;

GRANT UPDATE (checkout_expires_at) ON public.pagamento TO adornatta_app;
