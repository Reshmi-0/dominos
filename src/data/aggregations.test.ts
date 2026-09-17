import { describe, it, expect } from 'vitest';
import { 
  getTotalRevenue, 
  getTotalPizzasSold, 
  getTotalOrders, 
  getAverageOrderValue, 
  getWeekOverWeekDelta,
  getTopSellingPizzas,
  getCategoryBreakdown,
  getOrderTypeBreakdown
} from './aggregations';
import type { OrderLineItem } from './types';

const mockOrders: OrderLineItem[] = [
  {
    order_id: '1',
    order_date: '2024-09-17',
    order_time: '12:00',
    parsed_datetime: new Date('2024-09-17T12:00:00Z'),
    pizza_name: 'Margherita',
    pizza_category: 'Classic',
    size: 'Medium',
    quantity: 2,
    unit_price: 10,
    total_price: 20,
    store_location: 'Downtown',
    delivery_type: 'Delivery',
    customer_name: 'Alice',
    order_status: 'Delivered',
    discount_amount: 0,
    is_new_customer: false,
    order_type: 'Delivery'
  },
  {
    order_id: '1',
    order_date: '2024-09-17',
    order_time: '12:00',
    parsed_datetime: new Date('2024-09-17T12:00:00Z'),
    pizza_name: 'Farmhouse',
    pizza_category: 'Veg',
    size: 'Large',
    quantity: 1,
    unit_price: 15,
    total_price: 15,
    store_location: 'Downtown',
    delivery_type: 'Delivery',
    customer_name: 'Alice',
    order_status: 'Delivered',
    discount_amount: 0,
    is_new_customer: false,
    order_type: 'Delivery'
  },
  {
    order_id: '2',
    order_date: '2024-09-17',
    order_time: '13:00',
    parsed_datetime: new Date('2024-09-17T13:00:00Z'),
    pizza_name: 'Margherita',
    pizza_category: 'Classic',
    size: 'Small',
    quantity: 1,
    unit_price: 8,
    total_price: 8,
    store_location: 'Downtown',
    delivery_type: 'Pickup',
    customer_name: 'Bob',
    order_status: 'Preparing',
    discount_amount: 0,
    is_new_customer: true,
    order_type: 'Takeaway'
  }
];

describe('Aggregations', () => {
  it('calculates total revenue correctly', () => {
    expect(getTotalRevenue(mockOrders)).toBe(43); // 20 + 15 + 8
    expect(getTotalRevenue([])).toBe(0);
  });

  it('calculates total pizzas sold correctly', () => {
    expect(getTotalPizzasSold(mockOrders)).toBe(4); // 2 + 1 + 1
    expect(getTotalPizzasSold([])).toBe(0);
  });

  it('calculates total unique orders correctly', () => {
    expect(getTotalOrders(mockOrders)).toBe(2); // Order ID 1 and 2
    expect(getTotalOrders([])).toBe(0);
  });

  it('calculates average order value', () => {
    expect(getAverageOrderValue(mockOrders)).toBe(21.5); // 43 / 2
    expect(getAverageOrderValue([])).toBe(0);
  });

  it('calculates week over week delta', () => {
    expect(getWeekOverWeekDelta(100, 50)).toEqual({ pct: 100, direction: 'up' });
    expect(getWeekOverWeekDelta(50, 100)).toEqual({ pct: 50, direction: 'down' });
    expect(getWeekOverWeekDelta(100, 0)).toEqual({ pct: 100, direction: 'up' });
    expect(getWeekOverWeekDelta(0, 0)).toEqual({ pct: 0, direction: 'up' });
  });

  it('calculates category breakdown', () => {
    const breakdown = getCategoryBreakdown(mockOrders);
    expect(breakdown).toHaveLength(2);
    expect(breakdown[0].category).toBe('Classic');
    expect(breakdown[0].revenue).toBe(28); // 20 + 8
    expect(breakdown[1].category).toBe('Veg');
    expect(breakdown[1].revenue).toBe(15);
  });

  it('calculates order type breakdown based on unique orders', () => {
    const breakdown = getOrderTypeBreakdown(mockOrders);
    expect(breakdown).toHaveLength(2);
    expect(breakdown.find(b => b.type === 'Delivery')?.count).toBe(1);
    expect(breakdown.find(b => b.type === 'Takeaway')?.count).toBe(1);
  });

  it('calculates top selling pizzas with tie-breakers', () => {
    const top = getTopSellingPizzas(mockOrders);
    expect(top[0].name).toBe('Margherita');
    expect(top[0].unitsSold).toBe(3);
    expect(top[0].revenue).toBe(28);
    expect(top[1].name).toBe('Farmhouse');
    expect(top[1].unitsSold).toBe(1);
    expect(top[1].revenue).toBe(15);
  });
});
