import type { OrderLineItem } from './types';

export function getTotalRevenue(orders: OrderLineItem[]): number {
  return orders.reduce((sum, order) => sum + order.total_price, 0);
}

export function getTotalPizzasSold(orders: OrderLineItem[]): number {
  return orders.reduce((sum, order) => sum + order.quantity, 0);
}

export function getTotalOrders(orders: OrderLineItem[]): number {
  const uniqueIds = new Set(orders.map(o => o.order_id));
  return uniqueIds.size;
}

export function getAverageOrderValue(orders: OrderLineItem[]): number {
  const totalRev = getTotalRevenue(orders);
  const totalCount = getTotalOrders(orders);
  return totalCount === 0 ? 0 : totalRev / totalCount;
}

export function getCategoryBreakdown(orders: OrderLineItem[]) {
  const map = new Map<string, number>();
  let totalRevenue = 0;
  
  orders.forEach(o => {
    const rev = map.get(o.pizza_category) || 0;
    map.set(o.pizza_category, rev + o.total_price);
    totalRevenue += o.total_price;
  });

  const breakdown = Array.from(map.entries()).map(([category, revenue]) => ({
    category,
    revenue,
    pct: totalRevenue === 0 ? 0 : (revenue / totalRevenue) * 100
  }));
  
  return breakdown.sort((a, b) => b.revenue - a.revenue);
}

export function getOrderTypeBreakdown(orders: OrderLineItem[]) {
  const uniqueOrders = getUniqueOrders(orders);
  const map = new Map<string, number>();
  
  uniqueOrders.forEach(o => {
    const count = map.get(o.order_type) || 0;
    map.set(o.order_type, count + 1);
  });

  const total = uniqueOrders.length;
  const breakdown = Array.from(map.entries()).map(([type, count]) => ({
    type,
    count,
    pct: total === 0 ? 0 : (count / total) * 100
  }));
  
  return breakdown.sort((a, b) => b.count - a.count);
}

export function getTopSellingPizzas(orders: OrderLineItem[], limit = 5) {
  const map = new Map<string, { category: string, unitsSold: number, revenue: number }>();
  
  orders.forEach(o => {
    const current = map.get(o.pizza_name) || { category: o.pizza_category, unitsSold: 0, revenue: 0 };
    current.unitsSold += o.quantity;
    current.revenue += o.total_price;
    map.set(o.pizza_name, current);
  });

  const list = Array.from(map.entries()).map(([name, stats]) => ({
    name,
    ...stats
  }));

  // Sort by units sold desc, then revenue desc for ties
  list.sort((a, b) => {
    if (b.unitsSold !== a.unitsSold) return b.unitsSold - a.unitsSold;
    return b.revenue - a.revenue;
  });

  return list.slice(0, limit);
}

export function getDailySeries(orders: OrderLineItem[], metric: 'revenue' | 'orders') {
  if (orders.length === 0) return [];

  // Check if all orders are from the same day
  const uniqueDays = new Set(orders.map(o => o.order_date));
  const isSingleDay = uniqueDays.size === 1;

  const map = new Map<string, { label: string; value: number; timeValue: number }>();
  
  if (metric === 'revenue') {
    orders.forEach(o => {
      const key = isSingleDay 
        ? `${o.parsed_datetime.getHours()}:00` 
        : o.order_date;
      
      const label = isSingleDay
        ? o.parsed_datetime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
        : o.order_date;

      const current = map.get(key) || { label, value: 0, timeValue: o.parsed_datetime.getTime() };
      current.value += o.total_price;
      map.set(key, current);
    });
  } else {
    const uniqueOrders = getUniqueOrders(orders);
    uniqueOrders.forEach(o => {
      const key = isSingleDay 
        ? `${o.parsed_datetime.getHours()}:00` 
        : o.order_date;
        
      const label = isSingleDay
        ? o.parsed_datetime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
        : o.order_date;

      const current = map.get(key) || { label, value: 0, timeValue: o.parsed_datetime.getTime() };
      current.value += 1;
      map.set(key, current);
    });
  }

  // Ensure sorting chronologically
  const series = Array.from(map.values()).map(({ label, value, timeValue }) => ({ day: label, value, timeValue }));
  series.sort((a, b) => a.timeValue - b.timeValue);
  
  // Return just day and value to match expected output
  return series.map(({ day, value }) => ({ day, value }));
}

export function getWeekOverWeekDelta(current: number, previous: number): { pct: number; direction: 'up' | 'down' } {
  if (previous === 0) {
    return { pct: current > 0 ? 100 : 0, direction: current >= 0 ? 'up' : 'down' };
  }
  const diff = current - previous;
  const pct = (Math.abs(diff) / previous) * 100;
  return { pct, direction: diff >= 0 ? 'up' : 'down' };
}

// Helper to get exactly one line item per order (for order-level metrics)
export function getUniqueOrders(orders: OrderLineItem[]): OrderLineItem[] {
  const seen = new Set<string>();
  const unique: OrderLineItem[] = [];
  for (const o of orders) {
    if (!seen.has(o.order_id)) {
      seen.add(o.order_id);
      unique.push(o);
    }
  }
  return unique;
}
