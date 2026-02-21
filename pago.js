function processPayment() {
  if (!selectedPaymentMethod) {
    alert("Por favor, selecciona un método de pago.");
    return;
  }

  if (selectedPaymentMethod === "mercadopago") {
    // REEMPLAZA ESTA URL CON TU LINK DE MERCADO PAGO REAL
    const mercadoPagoUrl = "link.mercadopago.com.ar/omnpag_pref_id=HistoComic";
    window.open(mercadoPagoUrl, "_blank");
  }
  // ... resto del código
}
