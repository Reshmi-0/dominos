# Design.md
## Domino's Franchise Owner Analytics Dashboard — Visual & UX Specification

This document is the single source of truth for look, feel, layout, and asset usage. It is meant to be read alongside `PRD.md` (what to build) and `TRD.md` (how to build it). All screenshots below are the approved reference design — match them pixel-for-pixel in spacing rhythm and color, not just "inspired by."

---

## 1. Brand Assets

**Logo** (extracted from reference UI, top-left of header on every screen):

![Domino's logo](assets/logo-dominos.png)

- Use as an `<img>`/SVG in the header, ~110–130px wide, vertically centered with the wordmark "Domino's".
- Do not stretch or recolor. Maintain clear space equal to the height of the "D" icon on all sides.
- If a vector/official SVG is available in the build environment, prefer it over the raster crop in `assets/logo-dominos.png`; otherwise use the provided PNG (transparent-safe, place on white/light backgrounds only).

**Favicon:** the Domino's pizza-box icon mark (the red/white diamond piece) alone, no wordmark.

---

## 2. Color System

| Token | Hex (approx.) | Usage |
|---|---|---|
| `--color-navy-900` | `#0B1F3A` | Sidebar background |
| `--color-navy-800` | `#0F2A4A` | Sidebar hover/active surface |
| `--color-primary-blue` | `#1E63D6` | Primary buttons, links, active nav highlight, chart primary line, icon badge (blue) |
| `--color-domino-red` | `#E31837` | Logo red, negative/cancelled/alert accents, "Delivery" chips |
| `--color-success-green` | `#1FAE6B` | Positive deltas (↑), "Delivered" / "Completed" chips, second chart series |
| `--color-warning-amber` | `#F5A524` | "Pending" / "Preparing" chips, combo-offer segment |
| `--color-purple` | `#7C5CFC` | "Others" segment, New Customers icon badge |
| `--color-bg-app` | `#F4F6FA` | Page background |
| `--color-surface-card` | `#FFFFFF` | Card/table backgrounds |
| `--color-border` | `#E6EAF0` | Card borders, table dividers |
| `--color-text-primary` | `#0F1B2D` | Headings, values |
| `--color-text-secondary` | `#6B7686` | Labels, captions, muted text |

**Delta color logic:** green + ↑ for good news (revenue, orders, completed, new customers); green + ↓ for good news where lower is better (discounts given, cancelled orders, pending orders); red for the inverse. Always pair the arrow glyph with the color — never color alone.

**Tag/chip colors** (soft-background + dark text pattern, ~15% opacity tint of the base color):
- Veg → green tint · Non-Veg → red tint
- Delivered/Completed → green tint · Preparing → amber tint · Out for Delivery → blue tint · Cancelled → red tint
- Dine-in → blue tint · Takeaway → purple tint · Delivery → red tint · Online Order → amber tint

---

## 3. Typography

- **Font family:** Inter, or system-ui fallback (`-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`).
- **Scale:**
  | Style | Size / Weight | Usage |
  |---|---|---|
  | Page Title | 24px / 700 | "Sales Report", "Total Orders", "Settings" |
  | Page Subtitle | 14px / 400, secondary color | One-line description under title |
  | Card KPI Value | 28–32px / 700 | "₹ 2,48,960" |
  | Card Label | 14px / 500, secondary color | "Total Sales Revenue" |
  | Delta text | 13px / 600 | "↑ 15% vs. last week" |
  | Section Heading | 18px / 600 | "Sales Trend", "Top Selling Pizzas" |
  | Table header | 12–13px / 600, uppercase-optional, secondary color | Column headers |
  | Table body | 14px / 400–500 | Row content |
  | Nav item | 14px / 500 | Sidebar links |

---

## 4. Layout System

- **Grid:** 12-column responsive grid, 24px gutter, 24px page padding.
- **Shell:** Fixed-width left sidebar (≈240px) + fluid main content area. Header bar (≈80px tall) spans the full width above the content area (sidebar logo sits in its own top-left slot, separate from the header's right-aligned identity block — see screenshots).
- **Cards:** White surface, 12–16px border-radius, 1px `--color-border`, subtle shadow (`0 1px 3px rgba(16,24,40,0.06)`), 20–24px internal padding.
- **KPI card row:** 4 equal-width cards, each with a colored circular icon badge (top-left inside card, ~44px), value, label, and delta line.
- **Chart row:** Two cards side by side on desktop — a wider trend chart (≈60%) + a donut/breakdown card (≈40%). Stacks vertically on tablet/mobile.
- **Table cards:** Full-width or paired two-up (as on Overview/Sales Report), rounded card wrapper, zebra-free rows with 1px bottom border dividers, comfortable 16px vertical row padding.
- **Spacing rhythm:** 24px between major sections vertically; 16–24px between cards horizontally.

---

## 5. Component Inventory

1. **Sidebar Nav** — Logo omitted here (lives in header only), 4 nav items (Overview / Total Orders / Sales Report / Settings) each with icon + label; active state = filled blue rounded rect with white text; inactive = light gray icon/text on navy.
2. **Header bar** — Logo (top-left), right-aligned cluster: circular avatar icon, "Founder" label + name stacked, divider, location pin icon + store name.
3. **Date Range Dropdown** — pill-shaped button, calendar icon + "Last 7 Days" + chevron, top-right of content area (Overview/Orders/Sales Report only).
4. **KPI Card** — icon badge (color-coded per metric), big number, small delta row (arrow + % + "vs. last week").
5. **Line/Area Chart** — single or dual series, soft gradient fill under the line, dot markers at data points, Mon–Sun x-axis.
6. **Donut Chart w/ Legend** — center label (bold total + caption), color dots + name + value/percentage list to the right.
7. **Dual Bar Chart** — two-series grouped bars per day, rounded bar tops, legend dots at top-right of card.
8. **Data Table** — header row (secondary color, medium weight), rows with optional thumbnail (pizza icon), status/category chips, right-aligned numeric columns.
9. **Status/Category Chip** — pill, soft tint background, matching darker text, no border.
10. **Settings Form Card** — icon + title + subtitle header, stacked labeled inputs, primary/secondary action button bottom-right of card.
11. **Toggle Switch** — iOS-style pill toggle, blue = on, gray = off.
12. **Checkbox row** — square checkbox + label, used in Notifications panel.

---

## 6. Reference Screens (Approved Visual Targets)

### 6.1 Overview
![Overview screen](assets/screenshot-overview.png)
Landing page. Welcome banner + date filter → 4 KPI cards → Sales Overview chart + Best Selling Pizzas donut → Recent Orders table.

### 6.2 Total Orders
![Total Orders screen](assets/screenshot-total-orders.png)
Operational view. 4 KPI cards (Total/Completed/Pending/Cancelled) → Orders Trend line chart + Order Type donut → Recent Orders table with Order Type column and "View All Orders" link.

### 6.3 Sales Report
![Sales Report screen](assets/screenshot-sales-report.png)
Analytical view. 4 KPI cards (Revenue/Pizzas Sold/AOV/Discount) → Sales Trend (with metric selector) + Sales by Category donut → Top Selling Pizzas table + Sales Summary dual-bar chart.

### 6.4 Settings
![Settings screen](assets/screenshot-settings.png)
Configuration view. Two/three-column card grid: Store Information, Account Settings, Business Hours (row 1); Notifications, Payment Settings, System Preferences (row 2).

---

## 7. Iconography

Use a consistent line/filled icon set (e.g., Lucide or Heroicons) at 20–24px, matched to badge tint:
- Home (Overview), Clipboard (Total Orders), Bar-chart (Sales Report), Gear (Settings) — sidebar
- ₹/Rupee (Revenue), Pizza slice (Pizzas Sold), People (New Customers), Percent (Discount), Checkmark-circle (Completed), Clock (Pending), X-circle (Cancelled), Receipt/clipboard (Total Orders)
- Bell (Notifications), Card (Payment), Clock (Business Hours), Sliders (System Preferences), Store/building (Store Information), User circle (Account)

Pizza thumbnails in the Top Selling Pizzas table are small (32–36px) circular/rounded-square photos or simple pizza-icon illustrations if photography isn't available.

---

## 8. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| ≥1280px (desktop) | Full layout as shown in reference screens |
| 900–1279px (tablet landscape) | KPI cards wrap to 2×2; chart pairs stack vertically; sidebar remains but narrows |
| 600–899px (tablet portrait) | Sidebar collapses to icon-only or hamburger drawer; tables become horizontally scrollable |
| <600px (mobile) | Single-column stack for everything; KPI cards full-width, swipeable or stacked; donut legends move below the chart |

---

## 9. Motion & Interaction

- Hover states: cards lift subtly (`translateY(-2px)` + shadow increase) on interactive elements only (buttons, table rows, dropdown, nav items) — static KPI/chart cards do not need hover-lift.
- Dropdowns (date range, metric selector, settings selects) open with a short 120–150ms fade+slide.
- Chart entrance: lines/bars animate in on first render (≈400–600ms ease-out).
- Toggle switches animate the thumb over ~150ms.
- Loading state: skeleton shimmer cards matching the KPI/table/chart shapes before data resolves.

---

## 10. Asset Manifest

| Asset | Path | Use |
|---|---|---|
| Domino's logo (cropped PNG) | `assets/logo-dominos.png` | Header logo, favicon source |
| Overview reference | `assets/screenshot-overview.png` | Visual QA target |
| Total Orders reference | `assets/screenshot-total-orders.png` | Visual QA target |
| Sales Report reference | `assets/screenshot-sales-report.png` | Visual QA target |
| Settings reference | `assets/screenshot-settings.png` | Visual QA target |
| Mock dataset | `assets/mock_dominos_dataset.csv` | Data source for charts/tables (see TRD for schema + extension notes) |

All four reference screenshots and the logo crop should be copied into the project's `/design-reference/` (or `/docs/assets/`) folder at project init so engineers and the agent building this in Antigravity can diff their output against them.
