/**
 * Types for cinema detail page data extraction.
 *
 * These interfaces describe the structured movie/showtime data
 * that can be scraped from a cinema detail page for data-driven testing.
 */

export interface MovieShowtime {
  time: string;
  format?: string; // e.g., "IMAX", "ISENSE", "Standard"
  attributes?: string[]; // e.g., ["VOSE", "ATMOS"]
  screen?: string; // Optional: Screen name/number if available
  bookingUrl?: string; // Optional: Direct link if available
}

export interface MovieMetadata {
  title: string;
  duration?: string; // e.g., "1h 45m"
  rating?: string; // e.g., "PG-13"
  genre?: string; // e.g., "Action/Adventure"
  releaseDate?: string;
  posterUrl?: string;
  showtimes: MovieShowtime[];
  attributes: string[]; // General movie attributes available at this cinema
}
