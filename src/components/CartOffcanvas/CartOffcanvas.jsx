function CartOffcanvas() {
  const produtos = [
    {
      id: 1,
      nome: "Anel Adornatta",
      preco: 89.90,
      quantidade: 1
    },
    {
      id: 2,
      nome: "Colar Elegance",
      preco: 119.90,
      quantidade: 1
    }
  ];

  const subtotal = produtos.reduce(
    (total, produto) =>
      total + produto.preco * produto.quantidade,
    0
  );

  return (
    <aside
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="cartOffcanvas"
      aria-labelledby="cartOffcanvasLabel"
    >
      <header className="offcanvas-header">
        <h2 className="offcanvas-title" id="cartOffcanvasLabel">
          Seu carrinho
        </h2>

        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Fechar"
        ></button>
      </header>

      <section className="offcanvas-body">

        {produtos.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <section>
            {produtos.map((produto) => (
              <article key={produto.id} className="mb-3">
                <h3 className="h6">
                  {produto.nome}
                </h3>

                <p>
                  Quantidade: {produto.quantidade}
                </p>

                <p>
                  R$ {produto.preco.toFixed(2)}
                </p>
              </article>
            ))}

            <hr />

            <p className="fw-bold">
              Subtotal: R$ {subtotal.toFixed(2)}
            </p>

            <button className="btn btn-dark w-100">
              Finalizar compra
            </button>
          </section>
        )}

      </section>
    </aside>
  );
}

export default CartOffcanvas;