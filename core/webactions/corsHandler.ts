import { Page } from '@playwright/test';

/**
 * CORS Handler for managing Cross-Origin Resource Sharing issues
 * in cinema platforms, particularly for film listing requests.
 * 
 * This handler should be initialized once per page context and will
 * automatically handle CORS issues for all subsequent requests.
 */
export class CorsHandler {
  private page: Page;
  private isInitialized = false;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Initializes CORS handling by setting up request/response interceptors
   * to bypass CORS restrictions on film data requests.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Listen to all responses to identify failing requests
    this.page.on('response', (response) => {
      if (response.status() >= 400 && this.isFilmDataRequest(response.url())) {
        // Log failed requests for debugging
      }
    });

    // Handle failed requests by intercepting and retrying with modified headers
    await this.page.route('**/*', async (route) => {
      const request = route.request();
      
      if (this.isFilmDataRequest(request.url())) {
        // Add CORS headers and modify request
        const modifiedHeaders = {
          ...request.headers(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Origin': new URL(this.page.url()).origin,
          'Referer': this.page.url(),
        };

        await route.continue({
          headers: modifiedHeaders,
        });
      } else {
        await route.continue();
      }
    });

    this.isInitialized = true;
  }

  /**
   * Determines if a request URL is for film/cinema data that commonly
   * experiences CORS issues.
   */
  private isFilmDataRequest(url: string): boolean {
    const corsPronePatterns = [
      '/api/films',
      '/api/movies',
      '/api/cinema',
      '/api/showtimes',
      '/films',
      '/movies',
      '/cartelera',
      'showtime',
      'v-showtime',
      'film',
      'movie',
      'cinema',
      '.json',
      '/api/',
      'ocgtest.es',
    ];

    return corsPronePatterns.some(pattern => 
      url.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Cleanup method to remove route handlers
   */
  async cleanup(): Promise<void> {
    if (this.isInitialized) {
      await this.page.unroute('**/*');
      this.isInitialized = false;
    }
  }
}