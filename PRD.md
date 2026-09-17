# Product Requirements Document (PRD)
## Domino's Franchise Owner Analytics Dashboard

| | |
|---|---|
| **Product Name** | Domino's Franchise Insights Dashboard |
| **Owner Persona** | Reshmi — Franchise Founder, Domino's Gola Road |
| **Document Version** | 1.0 |
| **Status** | Draft for build (source: reference screenshots + `mock_dominos_dataset.csv`) |

---

## 1. Overview

A web-based analytics dashboard that lets a Domino's **franchise owner** monitor store performance — orders, revenue, pizza sales, customer counts, and store configuration — in one place. It is a single-tenant, single-store admin panel (one store: "Domino's Gola Road", founder "Reshmi") reconstructed from four reference screens: **Overview, Total Orders, Sales Report, Settings**.

## 2. Problem Statement

Franchise owners currently check sales, order status, and top products across POS reports, phone calls, and spreadsheets. There is no single screen that answers, at a glance:
- "How is my store doing this week vs last week?"
- "What are people ordering, and what's selling out?"
- "Are orders being completed, delayed, or cancelled?"
- "Can I control notifications, payment methods, and business hours myself?"

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Give owner a fast performance snapshot | Dashboard loads all KPIs in a single view, no scrolling below the fold for headline numbers |
| Reduce time spent reconciling reports | Owner can find revenue, order count, and top pizza within 2 clicks of login |
| Enable self-service store config | Owner can edit store info, hours, payment methods, and notification preferences without support tickets |
| Surface trends, not just totals | Every KPI card shows a week-over-week % delta (up/down, color-coded) |

## 4. Target User

- **Primary persona:** Franchise Founder / Owner (e.g., Reshmi) — non-technical, wants clarity over complexity, checks the dashboard daily, typically on desktop but may check on mobile.
- **Secondary (future) persona:** Store Manager — same views, possibly read-only or scoped permissions (out of scope for v1).

## 5. Scope

### 5.1 In Scope (v1)
- 4 primary screens: **Overview, Total Orders, Sales Report, Settings**
- Global date-range filter ("Last 7 Days" dropdown, extensible to other ranges)
- KPI summary cards with week-over-week trend indicators
- Charts: line/area trend chart, donut/pie breakdown chart, dual-bar comparison chart
- Data tables: Recent Orders, Top Selling Pizzas
- Settings forms: Store Information, Account Settings, Business Hours, Notifications, Payment Settings, System Preferences
- Data sourced from `mock_dominos_dataset.csv` (or an equivalent orders dataset) — see TRD for schema mapping

### 5.2 Out of Scope (v1)
- Multi-store / multi-franchise switching
- Role-based access control / multi-user login
- Real-time order tracking / live kitchen display
- Payment processing (toggles are configuration only, not live payment gateway integration)
- Push notification delivery (UI toggles only; backend delivery is future work)
- Native mobile app (responsive web only)

## 6. Information Architecture

```
Domino's Dashboard (Header: Logo | Founder name + avatar | Store location)
├── Overview            (default landing page)
├── Total Orders
├── Sales Report
└── Settings
```

Left sidebar is the persistent primary navigation across all four screens. Header (logo, founder identity, store location, global date filter) persists across Overview / Total Orders / Sales Report; Settings replaces the date filter with page title only.

## 7. Feature Requirements by Screen

### 7.1 Overview (Home)
**Purpose:** One-glance daily health check.

| Element | Requirement |
|---|---|
| Welcome banner | "Welcome, {FounderName}!" + subtitle "Here's how your Domino's store is performing today." + global date-range dropdown (default: Last 7 Days) |
| KPI cards (4) | Total Orders, Total Revenue (₹), New Customers, Total Pizzas Sold — each with icon, big number, and a green ↑ / red ↓ percentage vs. last week |
| Sales Overview chart | Area/line chart, X-axis = Mon–Sun, Y-axis = revenue (0–100K), shows weekly trend |
| Best Selling Pizzas | Donut chart with center total ("1,320 Total Sold") + side legend listing pizza name and % share (Margherita, Farmhouse, Peppy Paneer, Veg Extravaganza, Others) |
| Recent Orders table | Columns: Order ID, Customer Name, Items, Amount, Status (chip: Delivered / Preparing / Out for Delivery), Time. Shows 5 most recent rows + "View All" link |

### 7.2 Total Orders
**Purpose:** Operational order-status monitoring.

| Element | Requirement |
|---|---|
| KPI cards (4) | Total Orders, Completed Orders, Pending Orders, Cancelled Orders — each with % vs last week (down is "good" for Pending/Cancelled, shown in green when improving) |
| Orders Trend chart | Line chart, Mon–Sun, 0–250 order count scale |
| Order Type breakdown | Donut chart (Dine-in, Takeaway, Delivery, Online Order) with center total ("1,248 Total Orders") + side table showing % and raw count per type |
| Recent Orders table | Columns: Order ID, Customer Name, Items, Order Type (chip), Amount, Status (chip), Order Time. "View All Orders →" link |

### 7.3 Sales Report
**Purpose:** Revenue and product-mix analysis.

| Element | Requirement |
|---|---|
| KPI cards (4) | Total Sales Revenue, Total Pizzas Sold, Average Order Value, Total Discount Given — each with % vs last week (discount decreasing shown in green) |
| Sales Trend chart | Area/line chart, Mon–Sun, with a metric-selector dropdown (default "Revenue") |
| Sales by Pizza Category | Donut chart with center total revenue + side list: Category name, ₹ revenue, % share (Veg Pizza, Non-Veg Pizza, Sides & Beverages, Combo Offers, Others) |
| Top Selling Pizzas table | Columns: Rank #, Pizza image + Name, Category tag (Veg/Non-Veg), Units Sold, Revenue — sorted by units sold, top 5 |
| Sales Summary chart | Dual-series bar chart (Total Sales vs Orders Revenue), Mon–Sun, with legend |

### 7.4 Settings
**Purpose:** Store self-service configuration.

| Panel | Fields / Controls |
|---|---|
| Store Information | Store Name, Founder, Address, Phone Number, Email (edit mode via "Edit" button) |
| Account Settings | Name, Email, Phone Number ("Edit Profile" button) |
| Business Hours | Per-day (Mon–Sun) open/close time + on/off toggle; "Edit Hours" button |
| Notifications | Checkboxes: New Order Notifications, Order Status Updates, Low Stock Alerts, Daily Sales Summary, System Notifications |
| Payment Settings | Toggle switches: UPI, Credit/Debit Card, Cash on Delivery + "All transactions are secure and encrypted" note |
| System Preferences | Dropdowns: Language, Date Format, Time Format, Currency; "Save Changes" button |

## 8. Data Requirements

Source dataset: `mock_dominos_dataset.csv` — one row per order line-item.

| Column | Type | Notes |
|---|---|---|
| order_id | string | e.g., `D-1001` |
| order_date | date | `YYYY-MM-DD` |
| order_time | string | `HH:MM AM/PM` (note: source data has a formatting quirk — hours >12 still suffixed "PM", normalize on ingest) |
| pizza_name | string | e.g., Margherita, Pepperoni, BBQ Chicken |
| pizza_category | enum | Classic, Veg, Non-Veg, Gourmet |
| size | enum | Small, Medium, Large, XL |
| quantity | integer | units in this line item |
| unit_price | decimal | price per unit |
| total_price | decimal | quantity × unit_price |
| store_location | string | e.g., Downtown, Suburbs-West, City Center, Suburbs-East |
| delivery_type | enum | Delivery, Pickup |

**Derived metrics needed by the UI:**
- Total Revenue = Σ total_price
- Total Pizzas Sold = Σ quantity
- Average Order Value = Total Revenue ÷ distinct order_id count
- Total Orders = distinct order_id count
- Category breakdown (for donuts) = group by pizza_category, sum total_price
- Order Type breakdown = group by delivery_type (mapped to Dine-in/Takeaway/Delivery/Online Order taxonomy used in the UI — see TRD for mapping note)
- Top Selling Pizzas = group by pizza_name, sum quantity, sum total_price, sort desc
- Week-over-week % deltas = compare current period aggregate vs prior period of equal length

> Note: The sample CSV has 11 rows on a single date (2024-09-17) and does not include customer name, order status, or discount fields shown in the mock UI. The TRD specifies how to either (a) extend the schema to a full mock dataset covering 7 days with these fields, or (b) synthesize the missing UI fields for prototype purposes. This must be resolved before wiring live data to the screens.

## 9. Non-Functional Requirements

- **Performance:** Initial dashboard paint < 2s on broadband; chart interactions < 200ms.
- **Responsiveness:** Must degrade gracefully to tablet width (sidebar collapses to icons or hamburger); mobile is a stretch goal for v1.
- **Accessibility:** Color is never the only signal (pair ↑/↓ arrows with color); minimum AA contrast; keyboard-navigable forms in Settings.
- **Localization-ready:** Currency (₹ INR default) and Date/Time formats are already exposed as Settings preferences — values must be read from these settings, not hardcoded.
- **Data freshness:** Dashboard should clearly indicate the active date range on every page.

## 10. Assumptions & Open Questions

1. Is this a **prototype with mock/static data** or does it need a **live backend**? (Assumed: prototype-first, wired to CSV/JSON mock data, with an API layer designed for future real data — see TRD.)
2. Are Order Status values fixed to {Delivered, Preparing, Out for Delivery, Cancelled} or configurable? (Assumed fixed enum for v1.)
3. Should "Order Type" (Dine-in/Takeaway/Delivery/Online Order) map 1:1 to the CSV's `delivery_type` (Delivery/Pickup), or is this a UI taxonomy mismatch to reconcile? (Flagged in Data Requirements — needs product decision.)
4. Multi-store support is explicitly deferred; confirm this is acceptable for launch.

## 11. Reference Screens

See `design.md` for annotated visuals of all four screens (Overview, Total Orders, Sales Report, Settings) and the extracted logo asset.
