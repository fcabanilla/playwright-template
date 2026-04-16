# BUG: Movie Schema JSON-LD Contains `undefined` Image URL

**Priority**: Medium
**Component**: Movies - Content Catalog (CMS Data)
**Environment**: Lab (`https://lab-web.ocgtest.es/`)
**Affects Tests**: `movies.spec.ts` — Films · Schema · Validate URLs · Bug detection
**Date**: 2026-03-25
**Reporter**: QA Automation Team

---

## Summary

The JSON-LD movie schema (`<script type="application/ld+json">`) for the film "Lightyear" on the Lab environment contains an `undefined` image URL. The schema's `image` property renders as `https://lab-web.ocgtest.esundefined` instead of a valid poster image URL. This indicates the movie's poster image path is missing or null in the CMS, and the frontend concatenates `baseUrl + undefined` without validation.

## Steps to Reproduce

1. Navigate to Cinemas → Select Oasiz
2. Select the film "Lightyear" and navigate to its detail page
3. Inspect the page source for `<script type="application/ld+json">`
4. Check the `image` property in the schema

**Expected**: `image` contains a valid URL like `https://lab-web.ocgtest.es/media/.../lightyear-poster.jpg`
**Actual**: `image` is `https://lab-web.ocgtest.esundefined`

## Technical Details

### Schema JSON-LD (Extracted from Page)

```json
{
  "@type": "Movie",
  "name": "Lightyear",
  "url": "https://lab-web.ocgtest.es/peliculas/lightyear/HO00000082/",
  "image": "https://lab-web.ocgtest.esundefined",
  ...
}
```

**Note**: The movie's `url` property is correct (`/peliculas/lightyear/HO00000082/`). Only the `image` property is affected.

### Evidence (Trace Analysis)

- **Trace file**: `.allure/playwright-artifacts/movies-movies-Cinesa-Movie-9589d-lidate-URLs-·-Bug-detection-Cinesa/trace.zip`
- **Error location**: `tests/cinesa/movies/movies.assertions.ts:60`
- **Assertion step sequence** (from trace action tree):
  1. ✅ Movie URL should not be empty
  2. ✅ Movie URL should not contain 'undefined': `https://lab-web.ocgtest.es/peliculas/lightyear/HO00000082/`
  3. ✅ Movie URL should not contain 'null'
  4. ✅ Movie URL should start with http/https
  5. ✅ Movie URL should not have malformed concatenation
  6. ✅ Movie image URL should not be empty
  7. ❌ **Movie image URL should not contain 'undefined': `https://lab-web.ocgtest.esundefined`**

### Error Message

```
Error: Movie image URL should not contain 'undefined': https://lab-web.ocgtest.esundefined

expect(received).not.toContain(expected) // indexOf
Expected substring: not "undefined"
Received string:    "https://lab-web.ocgtest.esundefined"
```

### URL Construction Issue

The frontend builds the image URL as:

```
baseUrl + movieSchema.imagePath
// "https://lab-web.ocgtest.es" + undefined → "https://lab-web.ocgtest.esundefined"
```

Note the missing `/` separator — this confirms the CMS returns `undefined`/`null` for the image path, not an empty string.

## Root Cause Analysis

The film "Lightyear" in the Lab CMS does not have a poster image configured. When the frontend constructs the JSON-LD schema, it concatenates `baseUrl` with the image path without null-checking, resulting in the literal string `"undefined"` being appended.

Two issues:

1. **CMS Data**: Lightyear movie missing poster image in Lab environment
2. **Frontend Defensive Coding**: No null/undefined check before URL concatenation in schema generation

## Impact

- **SEO**: Invalid JSON-LD schema damages search engine indexing for affected movies
- **Tests affected**: 1 test directly (`Films · Schema · Validate URLs · Bug detection`)
- **Scope**: May affect other movies with missing image data — test only validates one random movie per run

## Suggested Resolution

### CMS Fix (Immediate)

1. Upload poster image for "Lightyear" in Lab CMS
2. Audit other movies in Lab for missing poster images

### Frontend Fix (Defensive)

3. Add null/undefined guard before image URL concatenation in schema generation:
   ```typescript
   image: movieData.imagePath ? `${baseUrl}${movieData.imagePath}` : undefined;
   ```
4. Omit the `image` property from JSON-LD entirely if no image is available (preferred for SEO)

## Workaround (Test Suite)

The test is working as designed — it's a bug detection test that found a real CMS data issue. No test changes needed. The test should continue catching this type of issue across all movies.
