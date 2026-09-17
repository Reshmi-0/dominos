import Papa from 'papaparse';
import type { DashboardApi, DateRange, OrderLineItem, OrderLineItemCSV, StoreSettings, OrderStatus, OrderType } from './types';

// Deterministic random number generator based on a string seed
function seededRandom(seedStr: string) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 2654435761);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeInfo: {
    storeName: "Domino's Gola Road",
    founder: "Reshmi",
    address: "123 Gola Road, Patna, Bihar",
    phone: "+91 98765 43210",
    email: "golaroad@dominos.mock"
  },
  account: {
    name: "Reshmi",
    email: "reshmi@founder.dominos.mock",
    phone: "+91 98765 43210"
  },
  businessHours: [
    { day: 'Mon', open: '10:00', close: '23:00', enabled: true },
    { day: 'Tue', open: '10:00', close: '23:00', enabled: true },
    { day: 'Wed', open: '10:00', close: '23:00', enabled: true },
    { day: 'Thu', open: '10:00', close: '23:00', enabled: true },
    { day: 'Fri', open: '10:00', close: '23:59', enabled: true },
    { day: 'Sat', open: '10:00', close: '23:59', enabled: true },
    { day: 'Sun', open: '10:00', close: '23:00', enabled: true }
  ],
  notifications: {
    newOrder: true,
    orderStatusUpdates: true,
    lowStockAlerts: false,
    dailySalesSummary: true,
    systemNotifications: true
  },
  payment: {
    upi: true,
    card: true,
    cod: true
  },
  preferences: {
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12 Hour',
    currency: 'INR'
  }
};

export class MockDashboardApi implements DashboardApi {
  private allOrdersCache: OrderLineItem[] | null = null;

  async getOrders(range?: DateRange): Promise<OrderLineItem[]> {
    if (!this.allOrdersCache) {
      this.allOrdersCache = await this.loadAndEnrichData();
    }

    if (!range) return this.allOrdersCache;

    // Filter by date range
    return this.allOrdersCache.filter(o => {
      const time = o.parsed_datetime.getTime();
      return time >= range.start.getTime() && time <= range.end.getTime();
    });
  }

  async getSettings(): Promise<StoreSettings> {
    const saved = localStorage.getItem('dominos_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return DEFAULT_SETTINGS;
  }

  async updateSettings(patch: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...patch };
    localStorage.setItem('dominos_settings', JSON.stringify(updated));
    return updated;
  }

  private async loadAndEnrichData(): Promise<OrderLineItem[]> {
    const response = await fetch('/mock_dominos_dataset.csv');
    const csvText = await response.text();
    
    const parsed = Papa.parse<OrderLineItemCSV>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // converts numbers
    });

    const baseData = parsed.data;
    const enrichedData: OrderLineItem[] = [];

    // To make the dashboard useful (7-day filters, WoW comparisons),
    // we'll synthesize 14 days of data by duplicating the base rows and shifting their dates.
    const BASE_DATE = new Date();

    const statusOptions: OrderStatus[] = ["Delivered", "Preparing", "Out for Delivery", "Cancelled"];
    const names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Diya", "Sanya", "Kavya", "Myra", "Ananya", "Aarohi", "Riya", "Nisha"];

    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const targetDate = new Date(BASE_DATE);
      targetDate.setDate(targetDate.getDate() - dayOffset);
      const dateString = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD

      baseData.forEach((row, i) => {
        // Create deterministic seed for this specific synthetic row
        const seed = `synth-${dayOffset}-${row.order_id}-${i}`;
        const rand = seededRandom(seed);
        const nextRand = () => rand() / 4294967296; // 0 to 1

        // Randomly skip some orders to create variance between days so week-over-week deltas aren't 0%
        if (nextRand() > 0.8) return;

        // Parse time properly (handle >12 hours + PM suffix quirk)
        // e.g. "13:10 PM" -> 13:10
        let timeStr = row.order_time;
        timeStr = timeStr.replace(/\s*[AP]M\s*/i, ''); // Strip PM/AM for simplicity if it uses 24h anyway
        const [hourStr, minStr] = timeStr.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minStr, 10);
        
        const datetime = new Date(targetDate);
        datetime.setHours(hour, minute, 0, 0);

        // Map delivery_type (Delivery/Pickup) -> order_type (Dine-in/Takeaway/Delivery/Online Order)
        let orderType: OrderType;
        if (row.delivery_type === 'Pickup') {
          orderType = nextRand() > 0.5 ? 'Takeaway' : 'Dine-in';
        } else {
          orderType = nextRand() > 0.3 ? 'Delivery' : 'Online Order';
        }

        // Randomly assign other missing fields deterministically
        const status = statusOptions[Math.floor(nextRand() * statusOptions.length)];
        const customerName = names[Math.floor(nextRand() * names.length)];
        const isNewCustomer = nextRand() > 0.7; // 30% new customers
        
        // Add a fake discount to some orders
        const discountAmount = nextRand() > 0.8 ? (Math.floor(nextRand() * 50) + 10) : 0;

        enrichedData.push({
          ...row,
          order_id: `${row.order_id}-${dayOffset}`, // Unique ID for synth rows
          order_date: dateString,
          parsed_datetime: datetime,
          customer_name: customerName,
          order_status: status,
          is_new_customer: isNewCustomer,
          order_type: orderType,
          discount_amount: discountAmount,
          // Re-calculate total price just in case it's string in CSV
          total_price: Number(row.unit_price) * Number(row.quantity),
          unit_price: Number(row.unit_price),
          quantity: Number(row.quantity)
        });
      });
    }

    return enrichedData;
  }
}

export const api = new MockDashboardApi();
