import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Slice, Users, Clock } from 'lucide-react';
import { KpiCard } from '../components/kpi/KpiCard';
import { TrendAreaChart } from '../components/charts/TrendAreaChart';
import { DonutChart } from '../components/charts/DonutChart';
import type { ColumnDef } from '../components/tables/DataTable';
import { DataTable } from '../components/tables/DataTable';
import { StatusChip } from '../components/tables/Chips';
import { api } from '../data/mockDashboardApi';
import type { OrderLineItem } from '../data/types';
import { 
  getTotalOrders, 
  getTotalRevenue, 
  getTotalPizzasSold, 
  getDailySeries, 
  getTopSellingPizzas,
  getWeekOverWeekDelta
} from '../data/aggregations';
import { useDateRange } from '../context/DateRangeContext';

const PIZZA_COLORS: Record<string, string> = {
  'Margherita': 'var(--color-domino-red)',
  'Farmhouse': 'var(--color-success-green)',
  'Peppy Paneer': 'var(--color-warning-amber)',
  'Veg Extravaganza': 'var(--color-purple)',
  'Others': 'var(--color-border)'
};

const FALLBACK_PALETTE = [
  'var(--color-primary-blue)',
  'var(--color-success-green)',
  'var(--color-warning-amber)',
  'var(--color-purple)',
  'var(--color-domino-red)',
  '#0EA5E9',
  '#F43F5E'
];

export function Overview() {
  const [orders, setOrders] = useState<OrderLineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // In a real app with global date filter, this range would come from context.
  // For now, we simulate grabbing the last 7 days vs previous 7 days.
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const allData = await api.getOrders(); // Simulating API fetch
      setOrders(allData);
      setLoading(false);
    };
    loadData();
  }, []);

  const { currentRange, previousRange, compareLabel } = useDateRange();

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-secondary">Loading dashboard...</div>;
  }

  // --- Aggregate Data ---
  
  const currentOrders = orders.filter(o => {
    const t = o.parsed_datetime.getTime();
    return t >= currentRange.start.getTime() && t <= currentRange.end.getTime();
  });
  const previousOrders = orders.filter(o => {
    const t = o.parsed_datetime.getTime();
    return t >= previousRange.start.getTime() && t <= previousRange.end.getTime();
  });

  // KPI calculations
  const currOrdersCount = getTotalOrders(currentOrders);
  const prevOrdersCount = getTotalOrders(previousOrders);
  const ordersDelta = getWeekOverWeekDelta(currOrdersCount, prevOrdersCount);

  const currRevenue = getTotalRevenue(currentOrders);
  const prevRevenue = getTotalRevenue(previousOrders);
  const revenueDelta = getWeekOverWeekDelta(currRevenue, prevRevenue);

  const currNewCustomers = new Set(currentOrders.filter(o => o.is_new_customer).map(o => o.customer_name)).size;
  const prevNewCustomers = new Set(previousOrders.filter(o => o.is_new_customer).map(o => o.customer_name)).size;
  const customersDelta = getWeekOverWeekDelta(currNewCustomers, prevNewCustomers);

  const currPizzas = getTotalPizzasSold(currentOrders);
  const prevPizzas = getTotalPizzasSold(previousOrders);
  const pizzasDelta = getWeekOverWeekDelta(currPizzas, prevPizzas);

  // Chart data
  const revenueSeries = getDailySeries(currentOrders, 'revenue');
  
  const topPizzas = getTopSellingPizzas(currentOrders, 4);
  const totalTopRevenue = topPizzas.reduce((sum, p) => sum + p.revenue, 0);
  const othersRevenue = currRevenue - totalTopRevenue;
  
  const donutData = topPizzas.map((p, index) => ({
    name: p.name,
    value: p.revenue,
    color: PIZZA_COLORS[p.name] || FALLBACK_PALETTE[index % FALLBACK_PALETTE.length],
    percentage: currRevenue === 0 ? 0 : (p.revenue / currRevenue) * 100
  }));
  if (othersRevenue > 0) {
    donutData.push({
      name: 'Others',
      value: othersRevenue,
      color: PIZZA_COLORS['Others'],
      percentage: currRevenue === 0 ? 0 : (othersRevenue / currRevenue) * 100
    });
  }

  // Table Data
  // We want recent 5 unique orders
  const uniqueOrders = Array.from(new Map(currentOrders.map(o => [o.order_id, o])).values())
    .sort((a, b) => b.parsed_datetime.getTime() - a.parsed_datetime.getTime())
    .slice(0, 5);

  const columns: ColumnDef<OrderLineItem>[] = [
    { header: 'Order ID', accessorKey: 'order_id' },
    { header: 'Customer Name', accessorKey: 'customer_name' },
    { header: 'Items', accessorKey: (row) => `${row.quantity}x ${row.pizza_name}` },
    { header: 'Amount', accessorKey: (row) => `₹${row.total_price.toFixed(2)}`, align: 'right' },
    { header: 'Status', accessorKey: (row) => <StatusChip status={row.order_status} />, align: 'center' },
    { header: 'Date & Time', accessorKey: (row) => row.parsed_datetime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }), align: 'right', className: 'text-text-secondary whitespace-nowrap' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-[24px] font-bold text-text-primary">Welcome, Reshmi!</h1>
        <p className="text-[14px] text-text-secondary mt-1">Here's how your Domino's store is performing today.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard 
          label="Total Orders"
          value={currOrdersCount.toLocaleString()}
          icon={<Clock size={20} />}
          iconBgColor="rgba(245, 165, 36, 0.15)"
          iconTextColor="var(--color-warning-amber)"
          deltaPct={ordersDelta.pct}
          deltaDirection={ordersDelta.direction}
          compareLabel={compareLabel}
        />
        <KpiCard 
          label="Total Revenue"
          value={`₹${currRevenue.toLocaleString()}`}
          icon={<IndianRupee size={20} />}
          iconBgColor="rgba(30, 99, 214, 0.15)"
          iconTextColor="var(--color-primary-blue)"
          deltaPct={revenueDelta.pct}
          deltaDirection={revenueDelta.direction}
          compareLabel={compareLabel}
        />
        <KpiCard 
          label="New Customers"
          value={currNewCustomers.toLocaleString()}
          icon={<Users size={20} />}
          iconBgColor="rgba(124, 92, 252, 0.15)"
          iconTextColor="var(--color-purple)"
          deltaPct={customersDelta.pct}
          deltaDirection={customersDelta.direction}
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
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-auto min-h-[400px]">
        <div className="xl:col-span-3 h-full">
          <TrendAreaChart 
            title="Sales Overview"
            data={revenueSeries}
            xKey="day"
            yKey="value"
            formatYAxis={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0) + 'K' : val}`}
          />
        </div>
        <div className="xl:col-span-2 h-full">
          <DonutChart 
            title="Best Selling Pizzas"
            data={donutData}
            centerLabel={currPizzas.toLocaleString()}
            centerSubLabel="Total Sold"
          />
        </div>
      </div>

      {/* Table Row */}
      <div className="h-full">
        <DataTable 
          title="Recent Orders"
          columns={columns}
          data={uniqueOrders}
          actionLabel="View All"
          onActionClick={() => navigate('/orders')}
        />
      </div>
    </div>
  );
}
