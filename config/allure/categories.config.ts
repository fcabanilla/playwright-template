/**
 * Allure Defect Categories Configuration
 *
 * Defines custom categories for automatic test failure classification in Allure reports.
 * Categories are evaluated in order - first match wins.
 *
 * @see {@link https://allurereport.org/docs/categories/} Official Documentation
 * @see {@link ../../../docs/ALLURE_CATEGORIES.md} Internal Documentation
 */

export interface AllureCategory {
  name: string;
  description?: string;
  messageRegex?: string;
  traceRegex?: string;
  matchedStatuses?: ('failed' | 'broken' | 'passed' | 'skipped' | 'unknown')[];
  flaky?: boolean;
}

/**
 * Returns Allure category definitions for defect classification.
 *
 * Categories are prioritized by severity and frequency:
 * 1. Test Timeouts (🔴 Critical) - Infrastructure bottleneck
 * 2. Page Closed Errors (🔴 Critical) - Grancasa-specific stability
 * 3. D-BOX Availability (🟡 Medium) - Test data issue
 * 4. Promotional Codes (🟠 High) - Potential product defect
 * 5. Seat Selection Logic (🟠 High) - Algorithm edge cases
 * 6. Cookie Banner (🟢 Low) - Non-blocking, graceful degradation
 * 7. Strict Mode Violations (🟠 High) - Selector ambiguity
 * 8. Grancasa Cinema (🔴 Critical) - Catch-all for cinema issues
 * 9. Product Defects (🔴 Critical) - Genuine bugs
 * 10. Test Infrastructure (🟡 Medium) - Framework issues
 */
export function getAllureCategories(): AllureCategory[] {
  return [
    {
      name: 'Test Timeouts',
      description:
        'Tests that exceed the 90-second timeout limit, usually indicating infrastructure or performance issues',
      matchedStatuses: ['broken'],
      messageRegex: '.*Test timeout of 90000ms exceeded.*',
    },
    {
      name: 'Page Closed Errors',
      description:
        'Tests failing due to unexpected page/context/browser closure, indicating stability issues in Grancasa cinema',
      matchedStatuses: ['broken', 'failed'],
      messageRegex:
        '.*(Target page, context or browser has been closed|page.getAttribute: Target page, context or browser has been closed).*',
    },
    {
      name: 'D-BOX Availability Issues',
      description:
        'Tests failing because D-BOX format films are not available in the selected cinema',
      matchedStatuses: ['failed'],
      messageRegex: '.*No D-BOX films with showtimes found on the cinema detail page.*',
    },
    {
      name: 'Promotional Code Issues',
      description:
        'Tests failing due to promotional code validation problems or missing dropdown options',
      matchedStatuses: ['failed'],
      messageRegex:
        '.*(waiting for locator.*ABCD.*to be visible|No promotional code options available).*',
    },
    {
      name: 'Seat Selection Logic Errors',
      description:
        'Tests failing due to seat selection algorithm issues (no suitable seats found, empty space validation)',
      matchedStatuses: ['failed'],
      messageRegex: '.*(No suitable seats found for the group|No available seats matching criteria).*',
    },
    {
      name: 'Cookie Banner Handling',
      description:
        'Tests with intermittent cookie banner visibility issues (non-critical, continue execution)',
      matchedStatuses: ['failed'],
      messageRegex: '.*waiting for locator.*onetrust-banner-sdk.*to be visible.*',
    },
    {
      name: 'Strict Mode Violations',
      description: 'Tests failing due to selector ambiguity (multiple elements matched)',
      matchedStatuses: ['failed'],
      messageRegex: '.*strict mode violation.*resolved to \\d+ elements.*',
    },
    {
      name: 'Grancasa Cinema Issues',
      description: 'Persistent failures specific to Grancasa cinema infrastructure',
      matchedStatuses: ['broken', 'failed'],
      messageRegex: '.*',
      traceRegex: '.*Grancasa.*',
    },
    {
      name: 'Product Defects',
      description: 'Genuine product bugs requiring development team attention',
      matchedStatuses: ['failed'],
    },
    {
      name: 'Test Infrastructure Issues',
      description: 'Test framework or environment configuration problems',
      matchedStatuses: ['broken'],
    },
  ];
}
