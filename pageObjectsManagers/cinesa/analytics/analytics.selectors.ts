/**
 * Selectors for extracting analytics data and prices from various pages.
 */
export const ANALYTICS_SELECTORS = {
  // Payment page - main price containers
  ticketSection: '.entradas, .entries, .tickets-section',
  productsSection: '.productos, .products, .food-beverage-section',
  
  // Individual price elements
  ticketPrice: '.entradas .precio, .entries .price, .ticket-line .price, .entrada-precio',
  ticketPriceAlt: '[data-testid*="ticket"] .price, .ticket-item .amount',
  
  productPrice: '.productos .precio, .products .price, .product-line .price, .producto-precio',
  productPriceAlt: '[data-testid*="product"] .price, .product-item .amount',
  
  // Total sections
  totalSection: '.total, .resumen, .summary, .totales',
  grandTotal: '.total-final, .precio-total, .grand-total, .total .precio',
  grandTotalAlt: '.total-amount, .final-amount, [data-testid*="total-amount"]',
  
  // Subtotals
  subtotal: '.subtotal .precio, .subtotal .amount',
  
  // Tax elements
  taxes: '.impuestos .precio, .taxes .amount, .iva .precio',
  taxesAlt: '[data-testid*="tax"] .amount, .tax-line .price',
  
  // Generic price patterns for fallback
  allPrices: '.precio, .price, .amount',
  euroSymbol: '[class*="euro"], [class*="€"]',
  
  // Table rows for detailed analysis
  ticketRows: '.entrada-row, .ticket-row, .entry-line',
  productRows: '.producto-row, .product-row, .product-line',
  
  // Payment summary containers
  paymentSummary: '.resumen-pago, .payment-summary, .order-summary',
  orderDetails: '.detalle-pedido, .order-details, .purchase-details'
};
