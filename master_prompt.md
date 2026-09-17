# master_prompt.md
## Single prompt for Antigravity — Domino's Franchise Owner Analytics Dashboard

Copy everything in the code block below into Antigravity as one prompt, with `PRD.md`, `design.md`, `TRD.md`, and the `/assets` folder (4 reference screenshots, `logo-dominos.png`, `mock_dominos_dataset.csv`) attached or present in the project root.

---

```
You are building a production-quality front-end prototype of a Domino's
franchise owner analytics dashboard. Three specification documents and an
assets folder are provided in this workspace — read all of them fully
before writing any code:

- PRD.md    — product scope, features, and data requirements
- design.md — visual/UX spec, with embedded reference screenshots and the
              brand logo
- TRD.md    — architecture, data model, and implementation requirements
- /assets   — logo-dominos.png, four reference screenshots
              (screenshot-overview.png, screenshot-total-orders.png,
              screenshot-sales-report.png, screenshot-settings.png), and
              mock_dominos_dataset.csv

GOAL
Build a 4-page responsive web dashboard (Overview, Total Orders, Sales
Report, Settings) for a single Domino's franchise store ("Domino's Gola
Road", founder "Reshmi") that visually matches the four reference
screenshots and is fully data-driven off the provided (and extended)
mock dataset — no hardcoded numbers from the screenshots.

STACK
React + TypeScript + Vite, Tailwind CSS, Recharts for charts, lucide-react
for icons, React Router for the 4 routes. Follow the exact folder
structure in TRD.md Section 2.

BUILD ORDER
1. Scaffold the project and install dependencies. Copy the logo and all
   four screenshots into /design-reference for ongoing visual QA.
2. Create /src/styles/tokens.css from design.md Section 2 (colors) and
   Section 3 (typography) — every component must consume these tokens,
   never inline hex/px values.
3. Build the data layer (TRD Section 3–5): types, CSV parsing, the
   deterministic mock-data extension needed to cover fields the raw CSV
   lacks (customer_name, order_status, discount_amount, is_new_customer,
   4-value order_type — see TRD Section 3.2), the aggregation functions
   in TRD Section 3.3, and a MockDashboardApi implementing the
   DashboardApi interface. Write unit tests for every aggregation
   function, including empty-dataset and tie-breaking edge cases.
4. Build the app shell: Sidebar (4 nav items, active-state highlight),
   Header (logo top-left; founder identity + store location top-right),
   PageShell wrapper, and the 4 routes.
5. Build the reusable component library: KpiCard, TrendAreaChart,
   DonutChart (with centered total + side legend), GroupedBarChart,
   DataTable, StatusChip, CategoryChip, SettingsCard, ToggleRow,
   CheckboxRow, FormField — all prop-driven and reused across pages, per
   design.md Section 5.
6. Build the Overview page per PRD.md 7.1, matching
   design-reference/screenshot-overview.png.
7. Build the Total Orders page per PRD.md 7.2, matching
   design-reference/screenshot-total-orders.png.
8. Build the Sales Report page per PRD.md 7.3, matching
   design-reference/screenshot-sales-report.png.
9. Build the Settings page per PRD.md 7.4, matching
   design-reference/screenshot-settings.png, with all fields bound to the
   StoreSettings model (TRD Section 3.4) and persisted to localStorage.
10. Wire the global "Last 7 Days" date-range dropdown on Overview / Total
    Orders / Sales Report so every KPI's week-over-week delta recomputes
    reactively against the selected range.
11. Polish pass: empty/loading/error states for every chart and table;
    responsive breakpoints at 1280/900/600px per design.md Section 8;
    hover/motion per design.md Section 9; an accessibility pass (labeled
    inputs, keyboard navigation, non-color-only status indicators).
12. Final visual QA: render all four pages and compare side-by-side
    against the four images in /design-reference. List any remaining
    layout, spacing, or color discrepancies and fix them.

HARD CONSTRAINTS
- Every number shown in the UI must come from the aggregation functions
  over the mock dataset — never copy literal values from the reference
  screenshots into code.
- Match design.md's color tokens, spacing, card style, and chart types
  exactly (area/line trend chart, donut with center label + side legend,
  grouped/dual bar chart, data tables with chips) — this is a pixel-close
  visual clone of the reference screens, not a loose reinterpretation.
- Use the provided logo asset (assets/logo-dominos.png) for the header
  logo and favicon; do not generate a new logo.
- Keep all components typed (no `any`) and reusable across the 3
  data-bearing pages — do not fork near-duplicate components per page.
- Flag, rather than silently guess, if you hit any of the open questions
  listed in PRD.md Section 10 or TRD.md Section 9.

Work through the build order above step by step. After each major step,
briefly summarize what you built and how it maps back to the relevant
PRD/design/TRD section before continuing to the next step.
```
