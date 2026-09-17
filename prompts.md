# prompts.md
## Staged Build Prompts — Domino's Franchise Owner Analytics Dashboard

Use these as sequential prompts inside Antigravity (or any agentic coding assistant) if you'd rather build in stages than hand it the single `master_prompt.md` in one shot. Run them in order, in the same workspace/conversation, so context carries forward. Each prompt assumes `PRD.md`, `design.md`, `TRD.md`, and `/assets` (screenshots, logo, CSV) are already in the project root.

---

### Prompt 0 — Project bootstrap
```
Read PRD.md, design.md, and TRD.md in this repo before doing anything else.
Then scaffold a new React + TypeScript + Vite project using Tailwind CSS,
following the folder structure in TRD.md Section 2 exactly. Install
recharts and lucide-react. Copy assets/logo-dominos.png and the four
reference screenshots into /design-reference. Create /src/styles/tokens.css
with CSS variables matching design.md Section 2 (colors) and Section 3
(typography scale). Do not build any pages yet — just scaffold, install
dependencies, and confirm the dev server runs.
```

### Prompt 1 — Data layer
```
Implement the data layer described in TRD.md Sections 3 and 5:
1. /src/data/types.ts — all interfaces from TRD Section 3.1, 3.4, and the
   DashboardApi interface from Section 5.
2. Load assets/mock_dominos_dataset.csv, parse it, and extend it into a
   full 7-day mock dataset (Mon–Sun) as described in TRD Section 3.2,
   option 2: keep the CSV as the source for pizza/revenue/category data,
   and generate a deterministic (seeded) companion mock table for
   customer_name, order_status (Delivered/Preparing/Out for
   Delivery/Cancelled), discount_amount, is_new_customer, and a 4-value
   order_type (Dine-in/Takeaway/Delivery/Online Order) keyed by order_id.
3. /src/data/aggregations.ts — implement every function listed in
   TRD Section 3.3 as pure, unit-tested functions (Vitest). Include edge
   cases: empty dataset, single order, ties in top-selling pizzas.
4. /src/data/MockDashboardApi.ts implementing DashboardApi, simulating
   ~200ms latency.
Do not build any UI yet. Show me the test results when done.
```

### Prompt 2 — Shell, navigation, and design tokens
```
Build the app shell per design.md Sections 4 and 5:
- Sidebar component (240px, navy background, 4 nav items: Overview,
  Total Orders, Sales Report, Settings, with icons from lucide-react,
  active state = filled blue rounded rect).
- Header component with the Domino's logo (design-reference/logo-dominos.png)
  top-left, and a right-aligned cluster: avatar icon + "Founder"/name,
  divider, location pin + store name — matching design-reference/screenshot-overview.png.
- PageShell component combining Sidebar + Header + content slot, with a
  page title/subtitle row and an optional date-range dropdown slot
  (default "Last 7 Days", per design.md Section 5 item 3).
- Wire up React Router with 4 routes: / (Overview), /orders (Total Orders),
  /sales-report (Sales Report), /settings (Settings) — placeholder empty
  pages for now.
Visually compare your shell against all four screenshots in
/design-reference and adjust spacing/colors until it matches.
```

### Prompt 3 — Reusable components
```
Build the reusable component library described in design.md Section 5
and TRD.md Section 7:
- KpiCard (icon badge, value, label, delta row with colored arrow) —
  fully prop-driven, used by all KPI cards on all 3 data pages.
- TrendAreaChart and GroupedBarChart (recharts wrappers) matching
  design.md Section 5 items 5 and 7.
- DonutChart with a centered total/caption and a side legend list
  (design.md Section 5 item 6).
- DataTable, StatusChip, CategoryChip (design.md Section 5 items 8–9,
  and Section 2's chip color table).
- SettingsCard, ToggleRow, CheckboxRow, FormField for the Settings page
  (design.md Section 5 items 10–12).
Add Storybook-style example usage (or a temporary /dev-preview route) so
each component can be visually checked in isolation before wiring real data.
```

### Prompt 4 — Overview page
```
Build the Overview page per PRD.md Section 7.1, using the data layer
from Prompt 1 and components from Prompt 3. Match
design-reference/screenshot-overview.png layout: welcome banner + date
filter, 4 KPI cards, Sales Overview area chart + Best Selling Pizzas
donut side by side, Recent Orders table (5 rows) with a "View All" link.
Wire every number through the aggregation functions — do not hardcode
any values from the screenshot.
```

### Prompt 5 — Total Orders page
```
Build the Total Orders page per PRD.md Section 7.2, matching
design-reference/screenshot-total-orders.png: 4 KPI cards (Total/
Completed/Pending/Cancelled), Orders Trend line chart + Order Type donut
with side count table, Recent Orders table with an Order Type column and
"View All Orders →" link. Reuse existing components; do not duplicate.
```

### Prompt 6 — Sales Report page
```
Build the Sales Report page per PRD.md Section 7.3, matching
design-reference/screenshot-sales-report.png: 4 KPI cards (Revenue/
Pizzas Sold/AOV/Discount), Sales Trend chart with a metric-selector
dropdown, Sales by Pizza Category donut, Top Selling Pizzas table (with
pizza thumbnail + category chip), and a dual-series Sales Summary bar
chart with legend. Reuse existing components; do not duplicate.
```

### Prompt 7 — Settings page
```
Build the Settings page per PRD.md Section 7.4, matching
design-reference/screenshot-settings.png: a responsive card grid with
Store Information, Account Settings, Business Hours (row 1) and
Notifications, Payment Settings, System Preferences (row 2). Bind all
fields to the StoreSettings model (TRD Section 3.4), persist changes to
localStorage via a thin settingsStore module, and implement Edit/Save
button states (view mode vs. editable form mode) for Store Information
and Account Settings.
```

### Prompt 8 — Polish pass
```
Do a full polish pass across all 4 pages:
1. Add empty/loading/error states to every chart and table
   (TRD Section 7).
2. Add responsive breakpoints per design.md Section 8 — verify sidebar
   collapses and KPI cards reflow correctly at 1280/900/600px.
3. Add hover/motion per design.md Section 9 (card lift, dropdown fade,
   chart entrance animation, toggle thumb animation).
4. Run an accessibility check (axe-core or equivalent) and fix all
   violations — labeled inputs, keyboard nav, non-color-only status
   indicators.
5. Do a final side-by-side visual QA against all 4 screenshots in
   /design-reference and list any remaining discrepancies.
```

---

## Tips for using these prompts
- Keep `PRD.md`, `design.md`, and `TRD.md` open/attached in every prompt — agentic tools reference files more reliably when they're explicitly told to re-read them.
- If Antigravity supports multi-file context or a repo-wide "spec" folder, drop all three docs + `/assets` there once and just refer to them by filename in each prompt, as done above.
- After Prompt 4 (first real page), stop and visually review before continuing — it's the template every other page reuses.
