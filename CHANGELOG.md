# Changelog

All notable changes to the Currency Converter project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-17

### Added

- Dynamic copyright notice in `PageFooter` component displaying `© {year} Example Technologies. All rights reserved.`, with the year automatically driven by `new Date().getFullYear()`
- Unit tests for `PageFooter` covering copyright rendering, dynamic year via fake timers, and `lastUpdated` display

## [1.0.0] - 2025-10-13

### Added

- Initial release of Currency Converter application
- Next.js 14 App Router implementation with TypeScript
- Tailwind CSS for responsive styling
- Real-time currency conversion for 10 popular currencies:
  - USD (US Dollar)
  - EUR (Euro)
  - GBP (British Pound)
  - JPY (Japanese Yen)
  - AUD (Australian Dollar)
  - CAD (Canadian Dollar)
  - CHF (Swiss Franc)
  - CNY (Chinese Yuan)
  - INR (Indian Rupee)
  - MXN (Mexican Peso)

#### Features

- **Automatic Conversion**: Real-time conversion without clicking a button
- **Multiple API Sources**: Fallback support for three exchange rate APIs
  - exchangerate.host
  - exchangerate-api.com
  - open.er-api.com
- **Smart Caching**: 1-hour cache for exchange rates
- **Currency Swap**: Quick swap between source and target currencies
- **Input Validation**: Real-time validation with user-friendly error messages
- **Conversion History**: Track last 10 conversions with timestamps
- **History Management**: View, reload, and clear conversion history
- **URL Persistence**: Share conversions via URL query parameters
- **Responsive Design**: Mobile-first design that works on all devices
- **Error Handling**: Graceful error handling with multiple fallbacks

#### Technical Implementation

- Server-side API endpoint for fetching exchange rates
- SSL certificate error handling with custom HTTPS agent
- 10-second timeout for API requests
- Client-side conversion logic with proper decimal handling
- LocalStorage integration for history persistence
- TypeScript interfaces for type safety
- Clean component architecture

#### User Interface

- Modern gradient background design
- Single-row layout for amount and currency inputs
- Inline validation error messages
- Loading states for async operations
- Formatted currency display with symbols
- Collapsible history section
- Clear visual feedback for all interactions

#### Documentation

- Comprehensive README.md with setup instructions
- Project structure documentation
- API endpoint documentation
- Troubleshooting guide
- Contributing guidelines

### Security

- Custom HTTPS agent to handle SSL certificate issues
- No API keys required (using free public APIs)
- No sensitive data stored in localStorage
- Input sanitization and validation

### Performance

- Optimized bundle size
- Efficient re-rendering with React hooks
- Minimal API calls with caching strategy
- Fast client-side conversions

---

## Future Enhancements (Planned)

### [1.2.0] - Future

- User accounts and sync across devices
- Favorite currency pairs
- Custom rate alerts
- API for third-party integrations
- Progressive Web App (PWA) features
- Multi-language support

---

## Notes

### Breaking Changes

None in this version.

### Deprecated Features

None in this version.

### Known Issues

- Some API sources may have rate limits on free tier
- LocalStorage history limited to browser/device
- Requires active internet connection for initial rate fetch

### Migration Guide

Not applicable for initial release.
