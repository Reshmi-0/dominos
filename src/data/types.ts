export interface OrderLineItemCSV {
  order_id: string;
  order_date: string; // YYYY-MM-DD
  order_time: string; // E.g. "12:15 PM" or "13:10 PM"
  pizza_name: string;
  pizza_category: "Classic" | "Veg" | "Non-Veg" | "Gourmet";
  size: "Small" | "Medium" | "Large" | "XL";
  quantity: number;
  unit_price: number;
  total_price: number;
  store_location: "Downtown" | "Suburbs-West" | "Suburbs-East" | "City Center";
  delivery_type: "Delivery" | "Pickup";
}

export type OrderStatus = "Delivered" | "Preparing" | "Out for Delivery" | "Cancelled";
export type OrderType = "Dine-in" | "Takeaway" | "Delivery" | "Online Order";

// The full enriched order model used by the UI
export interface OrderLineItem extends OrderLineItemCSV {
  // Extracted Date object for easier sorting/filtering
  parsed_datetime: Date;
  
  // Enriched fields from mockOrdersMeta
  customer_name: string;
  order_status: OrderStatus;
  discount_amount: number;
  is_new_customer: boolean;
  order_type: OrderType;
}

export interface StoreSettings {
  storeInfo: { storeName: string; founder: string; address: string; phone: string; email: string };
  account: { name: string; email: string; phone: string };
  businessHours: { day: 'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun'; open: string; close: string; enabled: boolean }[];
  notifications: { newOrder: boolean; orderStatusUpdates: boolean; lowStockAlerts: boolean; dailySalesSummary: boolean; systemNotifications: boolean };
  payment: { upi: boolean; card: boolean; cod: boolean };
  preferences: { language: string; dateFormat: string; timeFormat: '12 Hour' | '24 Hour'; currency: string };
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DashboardApi {
  getOrders(range?: DateRange): Promise<OrderLineItem[]>;
  getSettings(): Promise<StoreSettings>;
  updateSettings(patch: Partial<StoreSettings>): Promise<StoreSettings>;
}

export interface KpiMetric {
  value: number;
  previousValue: number;
  deltaPct: number;
  direction: 'up' | 'down';
}
