# Technical Requirements Document (TRD)
## Domino's Franchise Owner Analytics Dashboard

Companion to `PRD.md` (product scope) and `design.md` (visual spec). This document defines architecture, data model, and implementation requirements for an engineering agent (e.g., Antigravity) to build the product.

---

## 1. Recommended Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 18 + Vite (or Next.js if SSR/routing-per-page is preferred) | Component-driven, matches 4-screen IA |
| Language | TypeScript | Type-safe data models for orders/KPIs |
| Styling | Tailwind CSS + a small design-token file (`tokens.css`) for the palette in `design.md` §2 | Keep utility classes; avoid ad-hoc hex values |
| Charts | Recharts (line/area, donut/pie, grouped bar) | Matches the four chart types used: area trend, donut w/ legend, line trend, dual bar |
| Icons | lucide-react | Matches icon spec in `design.md` §7 |
| State/data | Local mock data layer now, swappable for a REST/GraphQL client later (see §5) | Do not hardcode numbers into components |
| Routing | React Router (4 routes: `/`, `/orders`, `/sales-report`, `/settings`) | `/` = Overview |
| Testing | Vitest + React Testing Library for logic; Playwright for visual/E2E smoke against reference screenshots | |

---

## 2. Project Structure

```
/src
  /assets                → logo-dominos.png, favicon
  /components
    /layout               → Sidebar, Header, PageShell
    /kpi                  → KpiCard
    /charts               → TrendAreaChart, DonutChart, GroupedBarChart
    /tables               → DataTable, StatusChip, CategoryChip
    /settings              → SettingsCard, ToggleRow, CheckboxRow, FormField
  /pages
    Overview.tsx
    TotalOrders.tsx
    SalesReport.tsx
    Settings.tsx
  /data
    mockOrders.ts          → parsed/typed CSV data
    aggregations.ts        → derived-metric functions (see §4)
    types.ts                → Order, Kpi, ChartSeries, etc.
  /styles
    tokens.css              → CSS variables from design.md §2
  main.tsx / App.tsx
/design-reference           → copies of the 4 screenshots + logo (from design.md §10)
/public
  mock_dominos_dataset.csv
```

---

## 3. Data Model

### 3.1 Source CSV schema (`mock_dominos_dataset.csv`)

```ts
interface OrderLineItem {
  order_id: string;          // "D-1001"
  order_date: string;        // "2024-09-17" (YYYY-MM-DD)
  order_time: string;        // "12:15 PM" — NOTE: source data uses 24h-style hour
                              // values with a trailing "PM" for some rows
                              // (e.g. "13:10 PM"). Normalize to a real Date/Time
                              // on ingest — treat the numeric hour as 24h clock,
                              // ignore the literal AM/PM suffix when hour > 12.
  pizza_name: string;        // "Margherita", "BBQ Chicken", ...
  pizza_category: "Classic" | "Veg" | "Non-Veg" | "Gourmet";
  size: "Small" | "Medium" | "Large" | "XL";
  quantity: number;
  unit_price: number;
  total_price: number;
  store_location: "Downtown" | "Suburbs-West" | "Suburbs-East" | "City Center";
  delivery_type: "Delivery" | "Pickup";
}
```

### 3.2 Gap between source CSV and reference UI

The reference screens (`design.md`) show fields **not present** in the current 11-row CSV:
- `customer_name`, `order_status` (Delivered/Preparing/Out for Delivery/Cancelled), `discount_amount`, `new_customer` flag, and a 4-way `order_type` taxonomy (Dine-in/Takeaway/Delivery/Online Order) vs. the CSV's 2-way `delivery_type` (Delivery/Pickup).

**Required action before wiring real charts:** extend the mock dataset. Two acceptable approaches:
1. **Extend the CSV** to ~7 days of data (Mon–Sun) with added columns: `customer_name`, `order_status`, `discount_amount`, `is_new_customer`, and remap/extend `delivery_type` to the 4-value taxonomy used in the UI.
2. **Keep the CSV as the pizza/revenue source of truth** and layer a second small mock table (`mockOrdersMeta.ts`) purely for UI-only fields (status, customer, order type) keyed by `order_id`, generated deterministically (e.g., seeded random) so the app is demoable without a backend.

Either way, **do not hardcode the numbers seen in the screenshots** (e.g., "₹2,48,960", "1,320") — those are reference-only; the app must compute all KPI values from whatever mock/live dataset is wired in, so it stays correct if the dataset changes.

### 3.3 Derived metrics (`/src/data/aggregations.ts`)

Implement pure functions, unit-tested, e.g.:

```ts
getTotalRevenue(orders: OrderLineItem[]): number
getTotalPizzasSold(orders: OrderLineItem[]): number
getTotalOrders(orders: OrderLineItem[]): number           // distinct order_id
getAverageOrderValue(orders: OrderLineItem[]): number      // revenue / distinct orders
getCategoryBreakdown(orders: OrderLineItem[]): { category: string; revenue: number; pct: number }[]
getOrderTypeBreakdown(orders): { type: string; count: number; pct: number }[]
getTopSellingPizzas(orders, limit = 5): { name: string; category: string; unitsSold: number; revenue: number }[]
getDailySeries(orders, metric: 'revenue' | 'orders'): { day: string; value: number }[]
getWeekOverWeekDelta(current: number, previous: number): { pct: number; direction: 'up' | 'down' }
```

All KPI cards and charts must call these functions rather than embedding numbers — this is the primary "correctness" contract for the build.

---

## 4. Screen-to-Data Mapping

| Screen | KPI cards call | Charts call | Table calls |
|---|---|---|---|
| Overview | getTotalOrders, getTotalRevenue, newCustomers count, getTotalPizzasSold | getDailySeries('revenue'), getTopSellingPizzas donut view | recent 5 orders, sorted by time desc |
| Total Orders | getTotalOrders, status-filtered counts (Completed/Pending/Cancelled) | getDailySeries('orders'), getOrderTypeBreakdown | recent 5 orders w/ order type + status |
| Sales Report | getTotalRevenue, getTotalPizzasSold, getAverageOrderValue, sum(discount_amount) | getDailySeries('revenue') w/ metric selector, getCategoryBreakdown, dual-series (revenue vs "orders revenue") daily bars | getTopSellingPizzas(limit 5) |
| Settings | n/a (form-bound, not chart-bound) | n/a | n/a — reads/writes a `StoreSettings` object (see §3.4) |

### 3.4 Settings data model

```ts
interface StoreSettings {
  storeInfo: { storeName: string; founder: string; address: string; phone: string; email: string };
  account: { name: string; email: string; phone: string };
  businessHours: { day: 'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun'; open: string; close: string; enabled: boolean }[];
  notifications: { newOrder: boolean; orderStatusUpdates: boolean; lowStockAlerts: boolean; dailySalesSummary: boolean; systemNotifications: boolean };
  payment: { upi: boolean; card: boolean; cod: boolean };
  preferences: { language: string; dateFormat: string; timeFormat: '12 Hour' | '24 Hour'; currency: string };
}
```
Persist to local state / localStorage for the prototype; design the read/write functions so a future API swap only touches a thin persistence layer (`/src/data/settingsStore.ts`), not the components.

---

## 5. API Layer (Future-Ready, Mock-Backed Now)

Define an interface now so the UI never talks to raw CSV/localStorage directly:

```ts
interface DashboardApi {
  getOrders(range: DateRange): Promise<OrderLineItem[]>;
  getSettings(): Promise<StoreSettings>;
  updateSettings(patch: Partial<StoreSettings>): Promise<StoreSettings>;
}
```

- `MockDashboardApi` implementation reads the CSV/JSON mock data (§3.2) and simulates network latency.
- Swapping to a real backend later = writing a `RestDashboardApi` implementing the same interface — no component changes required.

---

## 6. Global Date Range Filter

- Dropdown on Overview / Total Orders / Sales Report headers. v1 must at minimum support "Last 7 Days" (default, matches reference) with the dropdown UI present for future ranges (Today, Last 30 Days, Custom).
- All KPI deltas ("vs. last week") are computed by comparing the selected range's aggregate to the immediately preceding equal-length range.

---

## 7. Non-Functional / Engineering Requirements

- **Type safety:** no `any` in `/src/data`; all chart/table components typed against `types.ts`.
- **Componentization:** KPI card, chip, chart wrappers must be generic/reusable (props-driven: icon, color, label, value, delta) — do not duplicate per screen.
- **Design-token fidelity:** colors/spacing/typography must pull from `tokens.css` (built from `design.md` §2–3), not inline hex/px values, so a future rebrand is a one-file change.
- **Accessibility:** all interactive controls keyboard-reachable; charts have an accessible text summary/table fallback; form inputs have associated `<label>`s; chips/status never rely on color alone (icon or text always present).
- **Performance budget:** aggregation functions must run client-side in <50ms for datasets up to ~5,000 rows (v1 mock scale); memoize derived metrics per date-range selection.
- **Testing:**
  - Unit tests for every function in `aggregations.ts` (edge cases: empty dataset, single order, tie-breaks in Top Selling Pizzas).
  - Component tests for KpiCard delta color/arrow logic.
  - Visual smoke test: render each of the 4 pages and diff against `design-reference/*.png` (structural/layout diff, not literal pixel-match, since data will differ).
- **Error/empty states:** every chart/table must define an empty-state (e.g., "No orders in this range") rather than rendering blank.

---

## 8. Build & Delivery Checklist

1. Scaffold project structure (§2).
2. Implement design tokens + `PageShell`/`Sidebar`/`Header` matching `design.md`.
3. Implement mock data layer + `aggregations.ts` with unit tests (§3–4).
4. Build Overview page end-to-end, visually diffed against `assets/screenshot-overview.png`.
5. Build Total Orders, Sales Report, Settings pages in the same pattern.
6. Wire the global date-range filter and re-run all aggregations reactively.
7. Add empty/loading/error states.
8. Add responsive breakpoints per `design.md` §8.
9. Run accessibility pass (axe or equivalent) + fix violations.
10. Final visual QA against all four reference screenshots in `assets/`.

---

## 9. Open Technical Decisions (flag to product before finishing)

- Confirm whether Settings changes need to persist server-side in v1 or localStorage-only is acceptable.
- Confirm the `order_status` and `order_type` taxonomies (§3.2) so mock data generation is deterministic and matches the reference UI exactly.
- Confirm whether "New Customers" needs a real identity/dedup definition or can remain a mock-generated KPI for v1.
