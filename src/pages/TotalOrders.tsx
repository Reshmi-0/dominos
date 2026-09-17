import { useEffect, useState } from 'react';
import { ClipboardList, CircleCheck, Clock, CircleX } from 'lucide-react';
import { KpiCard } from '../components/kpi/KpiCard';
import { TrendAreaChart } from '../components/charts/TrendAreaChart';
import { DonutChart } from '../components/charts/DonutChart';
import type { ColumnDef } from '../components/tables/DataTable';
import { DataTable } from '../components/tables/DataTable';
import { StatusChip, CategoryChip } from '../components/tables/Chips';
import { api } from '../data/mockDashboardApi';
import type { OrderLineItem } from '../data/types';
import { 
  getDailySeries, 
  getOrderTypeBreakdown,
  getWeekOverWeekDelta
} from '../data/aggregations';
import { useDateRange } from '../context/DateRangeContext';

const TYPE_COLORS = {
  'Delivery': '#E31837', // domino-red
  'Dine-in': '#1E63D6', // primary-blue
  'Takeaway': '#7C5CFC', // purple
  'Online Order': '#F5A524', // warning-amber
};

export function TotalOrders() {
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

  // Helper to get unique orders for status counting
  const getUnique = (arr: OrderLineItem[]) => Array.from(new Map(arr.map(o => [o.order_id, o])).values());
  const currUnique = getUnique(currentOrders);
  const prevUnique = getUnique(previousOrders);

  // KPIs
  const currTotal = currUnique.length;
  const prevTotal = prevUnique.length;
  
  const currCompleted = currUnique.filter(o => o.order_status === 'Delivered').length;
  const prevCompleted = prevUnique.filter(o => o.order_status === 'Delivered').length;
  
  const currPending = currUnique.filter(o => o.order_status === 'Preparing' || o.order_status === 'Out for Delivery').length;
  const prevPending = prevUnique.filter(o => o.order_status === 'Preparing' || o.order_status === 'Out for Delivery').length;

  const currCancelled = currUnique.filter(o => o.order_status === 'Cancelled').length;
  const prevCancelled = prevUnique.filter(o => o.order_status === 'Cancelled').length;

  const totalDelta = getWeekOverWeekDelta(currTotal, prevTotal);
  const completedDelta = getWeekOverWeekDelta(currCompleted, prevCompleted);
  const pendingDelta = getWeekOverWeekDelta(currPending, prevPending);
  const cancelledDelta = getWeekOverWeekDelta(currCancelled, prevCancelled);

  const orderSeries = getDailySeries(currentOrders, 'orders');
  
  const typeBreakdown = getOrderTypeBreakdown(currentOrders);
  const donutData = typeBreakdown.map(t => ({
    name: t.type,
    value: t.count,
    color: (TYPE_COLORS as any)[t.type] || '#1E63D6',
    percentage: t.pct
  }));

  const tableData = currUnique.sort((a, b) => b.parsed_datetime.getTime() - a.parsed_datetime.getTime());
  
  const columns: ColumnDef<OrderLineItem>[] = [
    { header: 'Order ID', accessorKey: 'order_id' },
    { header: 'Customer Name', accessorKey: 'customer_name' },
    { header: 'Items', accessorKey: (row) => `${row.quantity}x ${row.pizza_name}` },
    { header: 'Order Type', accessorKey: (row) => <CategoryChip category={row.order_type} />, align: 'center' },
    { header: 'Amount', accessorKey: (row) => `₹${row.total_price.toFixed(2)}`, align: 'right' },
    { header: 'Status', accessorKey: (row) => <StatusChip status={row.order_status} />, align: 'center' },
    { header: 'Date & Time', accessorKey: (row) => row.parsed_datetime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }), align: 'right', className: 'text-text-secondary whitespace-nowrap' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-[24px] font-bold text-text-primary">Total Orders</h1>
        <p className="text-[14px] text-text-secondary mt-1">Monitor operational order status and throughput.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard 
          label="Total Orders"
          value={currTotal.toLocaleString()}
          icon={<ClipboardList size={20} />}
          iconBgColor="rgba(30, 99, 214, 0.15)"
          iconTextColor="var(--color-primary-blue)"
          deltaPct={totalDelta.pct}
          deltaDirection={totalDelta.direction}
          compareLabel={compareLabel}
        />
        <KpiCard 
          label="Completed Orders"
          value={currCompleted.toLocaleString()}
          icon={<CircleCheck size={20} />}
          iconBgColor="rgba(31, 174, 107, 0.15)"
          iconTextColor="var(--color-success-green)"
          deltaPct={completedDelta.pct}
          deltaDirection={completedDelta.direction}
          compareLabel={compareLabel}
        />
        <KpiCard 
          label="Pending Orders"
          value={currPending.toLocaleString()}
          icon={<Clock size={20} />}
          iconBgColor="rgba(245, 165, 36, 0.15)"
          iconTextColor="var(--color-warning-amber)"
          deltaPct={pendingDelta.pct}
          deltaDirection={pendingDelta.direction}
          compareLabel={compareLabel}
          inverseColors={true}
        />
        <KpiCard 
          label="Cancelled Orders"
          value={currCancelled.toLocaleString()}
          icon={<CircleX size={20} />}
          iconBgColor="rgba(227, 24, 55, 0.15)"
          iconTextColor="var(--color-domino-red)"
          deltaPct={cancelledDelta.pct}
          deltaDirection={cancelledDelta.direction}
          compareLabel={compareLabel}
          inverseColors
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-auto min-h-[400px]">
        <div className="xl:col-span-3 h-full">
          <TrendAreaChart 
            title="Orders Trend"
            data={orderSeries}
            xKey="day"
            yKey="value"
            color="var(--color-warning-amber)"
            formatYAxis={(val) => (val != null ? val.toString() : '')}
          />
        </div>
        <div className="xl:col-span-2 h-full">
          <DonutChart 
            title="Order Type Breakdown"
            data={donutData}
            centerLabel={currTotal.toLocaleString()}
            centerSubLabel="Total Orders"
          />
        </div>
      </div>

      <div className="h-full">
        <DataTable 
          title="Recent Orders"
          columns={columns}
          data={tableData}
        />
      </div>
    </div>
  );
}
