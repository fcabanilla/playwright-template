/**
 * Selectors for extracting analytics data and prices from various pages.
 */
export const ANALYTICS_SELECTORS = {
  ticketSection: '.entradas, .entries, .tickets-section',
  productsSection: '.productos, .products, .food-beverage-section',
  
  ticketPrice: '.entradas .precio, .entries .price, .ticket-line .price, .entrada-precio',
  ticketPriceAlt: '[data-testid*="ticket"] .price, .ticket-item .amount',
  
  productPrice: '.productos .precio, .products .price, .product-line .price, .producto-precio',
  productPriceAlt: '[data-testid*="product"] .price, .product-item .amount',
  
  totalSection: '.total, .resumen, .summary, .totales',
  grandTotal: '.total-final, .precio-total, .grand-total, .total .precio',
  grandTotalAlt: '.total-amount, .final-amount, [data-testid*="total-amount"]',
  
  subtotal: '.subtotal .precio, .subtotal .amount',
  
  taxes: '.impuestos .precio, .taxes .amount, .iva .precio',
  taxesAlt: '[data-testid*="tax"] .amount, .tax-line .price',
  
  allPrices: '.precio, .price, .amount',
  euroSymbol: '[class*="euro"], [class*="€"]',
  
  ticketRows: '.entrada-row, .ticket-row, .entry-line',
  productRows: '.producto-row, .product-row, .product-line',
  
  paymentSummary: '.resumen-pago, .payment-summary, .order-summary',
  orderDetails: '.detalle-pedido, .order-details, .purchase-details',

  ticketPriceSelectors: [
    '.entradas .precio',
    '.tickets .price', 
    '.entrada .precio'
  ],

  productPriceSelectors: [
    '.productos .precio',
    '.products .price',
    '.producto .precio'
  ],

  totalPriceSelectors: [
    '.total .precio',
    '.total-amount',
    '.precio-total'
  ],

  taxSelectors: [
    '.impuestos .precio',
    '.tax-amount'
  ],

  contextKeywords: {
    ticket: ['entrada', 'ticket', 'butaca'],
    foodBeverage: ['menu', 'producto', 'comida', 'bebida'],
    total: ['total', 'final'],
    tax: ['impuesto', 'iva', 'tax']
  }
};
