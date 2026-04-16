import { WebActions } from '../../../core/webactions/webActions';
import { allure } from 'allure-playwright';
import { ANALYTICS_SELECTORS } from './analytics.selectors';
import type { DataLayerEvent, PriceSummary } from './analytics.types';

// Extend window interface to include Google Analytics dataLayer and our custom properties
declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
    dataLayerEvents: DataLayerEvent[];
  }
}

export class AnalyticsPage {
  private readonly webActions: WebActions;

  constructor(webActions: WebActions) {
    this.webActions = webActions;
  }

  /**
   * Initializes dataLayer capture for the current page
   */
  async initializeDataLayerCapture(): Promise<void> {
    await allure.step('Initializing dataLayer capture', async () => {
      await this.webActions.addInitScript(() => {
        // Create array to store ALL events (existing + new)
        window.dataLayerEvents = [];

        // Capture existing dataLayer events if they exist
        if (window.dataLayer && Array.isArray(window.dataLayer)) {
          window.dataLayerEvents.push(...window.dataLayer);
        }

        // Store original dataLayer
        const originalDataLayer = window.dataLayer || [];

        // Create proxy to intercept NEW dataLayer.push calls
        window.dataLayer = new Proxy(originalDataLayer, {
          get(target, prop: PropertyKey) {
            if (prop === 'push') {
              return function (...args: any[]) {
                // Store new events in our custom array
                window.dataLayerEvents.push(...args);
                // Call original push
                return Array.prototype.push.apply(target, args);
              };
            }
            return target[prop as keyof typeof target];
          },
        });

        // Also monitor if dataLayer gets reassigned
        let currentDataLayer = window.dataLayer;
        Object.defineProperty(window, 'dataLayer', {
          get() {
            return currentDataLayer;
          },
          set(newValue) {
            if (Array.isArray(newValue)) {
              // If it's being set to a new array, capture existing content
              window.dataLayerEvents.push(...newValue);
            }
            currentDataLayer = newValue;
          },
          configurable: true,
        });
      });
    });
  }

  /**
   * Captures all dataLayer events that have been fired so far
   */
  async captureDataLayerEvents(): Promise<DataLayerEvent[]> {
    return await allure.step('Capturing dataLayer events', async () => {
      const events = await this.webActions.evaluate<DataLayerEvent[]>(() => {
        // Get both the original dataLayer content AND our captured events
        const originalEvents = window.dataLayer || [];
        const capturedEvents = window.dataLayerEvents || [];

        // Combine them, preferring our captured events but falling back to original
        const allEvents =
          capturedEvents.length > 0 ? capturedEvents : originalEvents;

        return allEvents;
      });

      // Filter to unique events to avoid duplicates
      return events.filter(
        (event, index, self) =>
          index ===
          self.findIndex((e) => JSON.stringify(e) === JSON.stringify(event))
      );
    });
  }

  /**
   * Extracts price information from the current page UI
   */
  async extractUIPrices(): Promise<PriceSummary> {
    return await allure.step('Extracting UI prices', async () => {
      return await this.webActions.evaluate<PriceSummary>((selectors: any) => {
        const summary: PriceSummary = {
          ticketPrice: 0,
          foodBeveragePrice: 0,
          totalPrice: 0,
          taxes: 0,
        };

        const extractPrice = (text: string): number => {
          if (!text) return 0;
          const patterns = [
            /(\d+[,.]?\d*)\s*€/, // 12.15€ or 12,15€
            /€\s*(\d+[,.]?\d*)/, // €12.15
            /(\d+[,.]?\d*)\s*EUR/i, // 12.15 EUR
            /(\d+[,.]?\d*)$/, // Just numbers at end
          ];
          for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
              return parseFloat(match[1].replace(',', '.'));
            }
          }
          return 0;
        };
        const trySelectors = (selectorList: string[]): number => {
          let total = 0;
          for (const selector of selectorList) {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
              const price = extractPrice(el.textContent || '');
              if (price > 0) total += price;
            });
          }
          return total;
        };
        const ticketSelectors = [
          selectors.ticketPrice,
          selectors.ticketPriceAlt,
          ...selectors.ticketPriceSelectors,
        ];
        summary.ticketPrice = trySelectors(ticketSelectors);
        const productSelectors = [
          selectors.productPrice,
          selectors.productPriceAlt,
          ...selectors.productPriceSelectors,
        ];
        summary.foodBeveragePrice = trySelectors(productSelectors);
        const totalSelectors = [
          selectors.grandTotal,
          selectors.grandTotalAlt,
          ...selectors.totalPriceSelectors,
        ];
        const extractedTotal = trySelectors(totalSelectors);
        if (extractedTotal > summary.totalPrice) {
          summary.totalPrice = extractedTotal;
        }
        const taxSelectors = [
          selectors.taxes,
          selectors.taxesAlt,
          ...selectors.taxSelectors,
        ];
        summary.taxes = trySelectors(taxSelectors);
        if (
          summary.ticketPrice === 0 &&
          summary.foodBeveragePrice === 0 &&
          summary.totalPrice === 0
        ) {
          console.log(
            'No prices found with specific selectors, trying general approach...'
          );
          const allElements = document.querySelectorAll('*');
          const pricesFound: {
            element: Element;
            price: number;
            text: string;
          }[] = [];

          allElements.forEach((el) => {
            const text = el.textContent || '';
            const price = extractPrice(text);
            if (price > 0 && text.includes('€')) {
              pricesFound.push({ element: el, price, text: text.trim() });
            }
          });
          console.log(
            'Prices found in DOM:',
            pricesFound.map((p) => ({ price: p.price, text: p.text }))
          );
          pricesFound.forEach(({ element, price, text }) => {
            const elementText = element.textContent?.toLowerCase() || '';
            const parentText =
              element.parentElement?.textContent?.toLowerCase() || '';
            const contextText = (elementText + ' ' + parentText).toLowerCase();
            if (
              selectors.contextKeywords.ticket.some((keyword: string) =>
                contextText.includes(keyword)
              )
            ) {
              summary.ticketPrice += price;
            } else if (
              selectors.contextKeywords.foodBeverage.some((keyword: string) =>
                contextText.includes(keyword)
              )
            ) {
              summary.foodBeveragePrice += price;
            } else if (
              selectors.contextKeywords.total.some((keyword: string) =>
                contextText.includes(keyword)
              )
            ) {
              if (price > summary.totalPrice) {
                summary.totalPrice = price;
              }
            } else if (
              selectors.contextKeywords.tax.some((keyword: string) =>
                contextText.includes(keyword)
              )
            ) {
              summary.taxes += price;
            }
          });
        }
        console.log('Final price summary:', summary);
        return summary;
      }, ANALYTICS_SELECTORS);
    });
  }

  /**
   * Filters events by type
   */
  filterEventsByType(
    events: DataLayerEvent[],
    eventType: string
  ): DataLayerEvent[] {
    return events.filter((event) => event.event === eventType);
  }

  /**
   * Calculates totals from analytics events
   */
  calculateAnalyticsTotals(beginCheckoutEvent: DataLayerEvent): {
    ticketPrice: number;
    foodBeveragePrice: number;
  } {
    const totals = {
      ticketPrice: 0,
      foodBeveragePrice: 0,
    };

    if (!beginCheckoutEvent.ecommerce?.items) {
      return totals;
    }

    beginCheckoutEvent.ecommerce.items.forEach((item) => {
      const price = (item.price || 0) * (item.quantity || 1);

      if (item.item_category === 'Movie') {
        totals.ticketPrice += price;
      } else if (item.item_category === 'F&B') {
        totals.foodBeveragePrice += price;
      }
    });

    return totals;
  }
}
