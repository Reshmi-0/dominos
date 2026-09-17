import { useEffect, useState } from 'react';
import { IndianRupee, Slice, Percent, TrendingUp } from 'lucide-react';
import { KpiCard } from '../components/kpi/KpiCard';
import { TrendAreaChart } from '../components/charts/TrendAreaChart';
import { DonutChart } from '../components/charts/DonutChart';
import { GroupedBarChart } from '../components/charts/GroupedBarChart';
import type { ColumnDef } from '../components/tables/DataTable';
import { DataTable } from '../components/tables/DataTable';
import { CategoryChip } from '../components/tables/Chips';
import { api } from '../data/mockDashboardApi';
import type { OrderLineItem } from '../data/types';
import { 
  getTotalRevenue, 
  getTotalPizzasSold, 
  getAverageOrderValue,
  getDailySeries, 
  getCategoryBreakdown,
  getTopSellingPizzas,
  getWeekOverWeekDelta
} from '../data/aggregations';
import { useDateRange } from '../context/DateRangeContext';

const CATEGORY_COLORS = {
  'Veg': '#1FAE6B',
  'Non-Veg': '#E31837',
  'Classic': '#1E63D6',
  'Gourmet': '#F5A524',
};

export function SalesReport() {
  const [orders, setOrders] = useState<OrderLineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const allData = await api.getOrders();
      setOrders(allData);
      setLoading(false);
    };
    loadData();
  }, []);

  const { currentRange, previousRange, compareLabel } = useDateRange();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-secondary">Loading dashboard...</div>;
  }
  
  const currentOrders = orders.filter(o => {
    const t = o.parsed_datetime.getTime();
    return t >= currentRange.start.getTime() && t <= currentRange.end.getTime();
  });
  const previousOrders = orders.filter(o => {
    const t = o.parsed_datetime.getTime();
    return t >= previousRange.start.getTime() && t <= previousRange.end.getTime();
  });

  // KPIs
  const currRevenue = getTotalRevenue(currentOrders);
  const prevRevenue = getTotalRevenue(previousOrders);
  
  const currPizzas = getTotalPizzasSold(currentOrders);
  const prevPizzas = getTotalPizzasSold(previousOrders);
  
  const currAOV = getAverageOrderValue(currentOrders);
  const prevAOV = getAverageOrderValue(previousOrders);

  // Unique orders to compute discount
  const getUnique = (arr: OrderLineItem[]) => Array.from(new Map(arr.map(o => [o.order_id, o])).values());
  const currUnique = getUnique(currentOrders);
  const prevUnique = getUnique(previousOrders);
  
  const currDiscount = currUnique.reduce((sum, o) => sum + (o.discount_amount || 0), 0);
  const prevDiscount = prevUnique.reduce((sum, o) => sum + (o.discount_amount || 0), 0);

  const revenueDelta = getWeekOverWeekDelta(currRevenue, prevRevenue);
  const pizzasDelta = getWeekOverWeekDelta(currPizzas, prevPizzas);
  const aovDelta = getWeekOverWeekDelta(currAOV, prevAOV);
  const discountDelta = getWeekOverWeekDelta(currDiscount, prevDiscount);

  // Chart Data
  const revenueSeries = getDailySeries(currentOrders, 'revenue');
  
  // Re-map grouped data to show Total Sales vs Orders Revenue (mock metric)
  const salesSummaryData = revenueSeries.map(r => ({
    day: r.day,
    totalSales: r.value,
    ordersRevenue: r.value * 0.8 // Simulated split
  }));

  const categoryBreakdown = getCategoryBreakdown(currentOrders);
  const donutData = categoryBreakdown.map(c => ({
    name: c.category,
    value: c.revenue,
    color: (CATEGORY_COLORS as any)[c.category] || '#7C5CFC',
    percentage: c.pct
  }));

  const topPizzas = getTopSellingPizzas(currentOrders, 5);
  
  const columns: ColumnDef<any>[] = [
    { header: 'Rank', accessorKey: (row) => `#${row.rank}`, align: 'center', className: 'font-semibold text-text-secondary' },
    { header: 'Pizza Name', accessorKey: 'name' },
    { header: 'Category', accessorKey: (row) => <CategoryChip category={row.category} />, align: 'center' },
    { header: 'Units Sold', accessorKey: 'unitsSold', align: 'right' },
    { header: 'Revenue', accessorKey: (row) => `₹${row.revenue.toFixed(2)}`, align: 'right' },
  ];

  const tableData = topPizzas.map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-[24px] font-bold text-text-primary">Sales Report</h1>
        <p className="text-[14px] text-text-secondary mt-1">Detailed breakdown of revenue, products, and performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard 
          label="Total Sales Revenue"
          value={`₹${currRevenue.toLocaleString()}`}
          icon={<IndianRupee size={20} />}
          iconBgColor="rgba(30, 99, 214, 0.15)"
          iconTextColor="var(--color-primary-blue)"
          deltaPct={revenueDelta.pct}
          deltaDirection={revenueDelta.direction}
          compareLabel={compareLabel}
        />
        <KpiCard 
          label="Total Pizzas Sold"
          value={currPizzas.toLocaleString()}
          icon={<Slice size={20} />}
          iconBgColor="rgba(31, 174, 107, 0.15)"
          iconTextColor="var(--color-success-green)"
          deltaPct={pizzasDelta.pct}
          deltaDirection={pizzasDelta.direction}
          compareLabel={compareLabel}
        />
        <KpiCard 
          label="Average Order Value"
          value={`₹${currAOV.toFixed(0)}`}
          icon={<TrendingUp size={20} />}
          iconBgColor="rgba(124, 92, 252, 0.15)"
          iconTextColor="var(--color-purple)"
          deltaPct={aovDelta.pct}
          deltaDirection={aovDelta.direction}
          compareLabel={compareLabel}
        />
        <KpiCard 
          label="Total Discount Given"
          value={`₹${currDiscount.toLocaleString()}`}
          icon={<Percent size={20} />}
          iconBgColor="rgba(245, 165, 36, 0.15)"
          iconTextColor="var(--color-warning-amber)"
          deltaPct={discountDelta.pct}
          deltaDirection={discountDelta.direction}
          inverseColors={true}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-auto min-h-[400px]">
        <div className="xl:col-span-3 h-full">
          <TrendAreaChart 
            title="Sales Trend"
            data={revenueSeries}
            xKey="day"
            yKey="value"
            color="var(--color-success-green)"
            formatYAxis={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'K' : val}`}
          />
        </div>
        <div className="xl:col-span-2 h-full">
          <DonutChart 
            title="Sales by Pizza Category"
            data={donutData}
            centerLabel={`₹${currRevenue >= 1000 ? (currRevenue/1000).toFixed(1) + 'K' : currRevenue}`}
            centerSubLabel="Total Revenue"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="h-full">
          <DataTable 
            title="Top Selling Pizzas"
            columns={columns}
            data={tableData}
          />
        </div>
        <div className="h-full">
          <GroupedBarChart 
            title="Sales Summary"
            data={salesSummaryData}
            xKey="day"
            series1Key="totalSales"
            series1Label="Total Sales"
            series2Key="ordersRevenue"
            series2Label="Orders Revenue"
            formatYAxis={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'K' : val}`}
          />
        </div>
      </div>
    </div>
  );
}
