# SRS: Refresh Rate Button

## 1. Overview

Add a standalone icon-only **Refresh Rate** button to the currency converter that manually triggers a fresh fetch of all exchange rates from the API. The button is placed in the same row as the currency selectors, after the second (target) currency selector.

---

## 2. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | The button shall trigger a new fetch of all exchange rates from `/api/rates`. |
| FR-02 | The button shall be disabled for **1 second** after each click (cooldown). |
| FR-03 | The button shall display a **spinning/loading icon** while the fetch is in progress. |
| FR-04 | If the fetch fails, the application shall **silently fall back** to the previously cached rates — no error is surfaced to the user for a failed refresh. |
| FR-05 | The button shall render as **icon-only**, with no visible label text. |
| FR-06 | The button shall be positioned **after the second (target) currency selector** in the same flex row. |

---

## 3. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Button visual style (size, colour, shape, shadow) shall be similar to `SwapButton`. Minor deviations (e.g. icon colour or hover tint) are acceptable. |
| NFR-02 | The refresh icon shall animate (spin) during loading and revert to a static state when idle. |
| NFR-03 | The button shall have accessible `aria-label` and `title` attributes (`"Refresh rates"`). |
| NFR-04 | Cooldown must be enforced even if loading finishes in under 1 second. |

---

## 4. Acceptance Criteria

### AC-01 — Button renders
- Given the converter is loaded, the Refresh Rate button is visible in the currency row after the target currency selector.

### AC-02 — Click triggers fetch
- Given the button is idle, when the user clicks it, a new `GET /api/rates` request is made.

### AC-03 — Loading spinner
- Given a refresh is in progress, the button icon spins.

### AC-04 — Cooldown enforcement
- Given the user clicks the button, the button is disabled for at least 1 second regardless of how fast the fetch completes.
- Given the cooldown period has elapsed, the button becomes clickable again.

### AC-05 — Silent error fallback
- Given the fetch returns an error during refresh, the application continues displaying the previously fetched rates and no error message is shown.

### AC-06 — Similar styling to SwapButton
- The button uses the same general Tailwind structure as `SwapButton` (padding, border-radius, shadow, transition) but may differ in specific colour or hover tint.

### AC-07 — Accessibility
- The button has `aria-label="Refresh rates"` and `title="Refresh rates"`.

---

## 5. Files to Change

### New Files

| File | Purpose |
|------|---------|
| `components/RefreshButton.tsx` | New component: icon-only refresh button with loading/cooldown state. |
| `components/RefreshButton.test.tsx` | Unit tests for `RefreshButton`. |

### Modified Files

| File | Change |
|------|--------|
| `hooks/useExchangeRates.ts` | Expose a `refresh` callback that re-runs the fetch on demand. |
| `hooks/useExchangeRates.test.ts` | Add tests for the `refresh` function behaviour. |
| `components/ConverterForm.tsx` | Accept `onRefresh` prop; render `<RefreshButton>` after second `<CurrencySelect>`. |
| `components/ConverterForm.test.tsx` | Add tests for `RefreshButton` presence and `onRefresh` wiring. |
| `components/index.ts` | Export `RefreshButton`. |
| `app/page.tsx` | Destructure `refresh` from `useExchangeRates`; pass as `onRefresh` to `<ConverterForm>`. |

---

## 6. Component Specification: `RefreshButton`

### Props

```ts
interface RefreshButtonProps {
  onClick: () => void;
  loading: boolean;
}
```

### Behaviour
- When `loading` is `true`: button is **disabled** and the icon **spins** (CSS `animate-spin`).
- On click: calls `onClick`, then starts the 1-second cooldown internally — button is disabled until cooldown resolves.
- Cooldown is managed inside `RefreshButton` via `useState` + `useEffect` (not in the hook or parent).
- Icon: circular arrow (refresh) SVG, same `w-5 h-5` size as `SwapButton`.

### Tailwind Classes
Similar to `SwapButton` — base structure: `px-4 py-3 text-white rounded-lg transition-colors duration-200 flex items-center justify-center w-full sm:w-auto shadow-md hover:shadow-lg`. Colour and hover tint may vary from `SwapButton`.

Disabled state adds: `opacity-50 cursor-not-allowed`

---

## 7. Hook Specification: `useExchangeRates` changes

### Current return shape
```ts
{ exchangeRates, loading, error }
```

### New return shape
```ts
{ exchangeRates, loading, error, refresh }
```

Where `refresh` is a stable `useCallback` that:
1. Sets `loading` to `true`.
2. Fetches `/api/rates`.
3. On success: updates `exchangeRates`.
4. On failure: **does not update `error`** (silent fallback — keeps existing rates).
5. Sets `loading` to `false` in `finally`.

---

## 8. Test Requirements

### `RefreshButton.test.tsx`

| # | Test | Assertion |
|---|------|-----------|
| T-01 | Renders with a button accessible as "Refresh rates" | `getByRole('button', { name: /refresh rates/i })` is in the document |
| T-02 | Calls `onClick` when clicked (idle state) | `onClick` mock called once |
| T-03 | Does not call `onClick` when `loading=true` | button is disabled; click does nothing |
| T-04 | Button is disabled during 1-second cooldown after click | after click, button has `disabled` attribute; after 1s (fake timers), it does not |
| T-05 | Icon has `animate-spin` class when `loading=true` | icon element has class `animate-spin` |
| T-06 | Icon does not have `animate-spin` class when `loading=false` | icon element does not have class `animate-spin` |
| T-07 | Has correct `aria-label` and `title` attributes | `aria-label="Refresh rates"`, `title="Refresh rates"` |

### `useExchangeRates.test.ts` additions

| # | Test | Assertion |
|---|------|-----------|
| T-08 | `refresh` is exposed in the return value | `result.current.refresh` is a function |
| T-09 | Calling `refresh` triggers a new fetch | `global.fetch` called again after `refresh()` |
| T-10 | Successful refresh updates `exchangeRates` | new rates reflected in `result.current.exchangeRates` |
| T-11 | Failed refresh does not change `error` state | `result.current.error` remains `null` after failed refresh |
| T-12 | Failed refresh preserves existing `exchangeRates` | previously loaded rates are still present after failed refresh |

### `ConverterForm.test.tsx` additions

| # | Test | Assertion |
|---|------|-----------|
| T-13 | Renders `RefreshButton` in the form | `getByRole('button', { name: /refresh rates/i })` present |
| T-14 | Calls `onRefresh` when refresh button clicked | `onRefresh` mock called once |
