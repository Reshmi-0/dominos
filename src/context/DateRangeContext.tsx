import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { DateRange } from '../data/types';

interface DateRangeContextType {
  dateRangeLabel: string;
  setDateRangeLabel: (label: string) => void;
  // Based on the label, we define the current and previous period dates
  currentRange: DateRange;
  previousRange: DateRange;
  compareLabel: string;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRangeLabel, setDateRangeLabel] = useState('Last 7 Days');

  // Use the actual current date so 'Today' correctly matches data
  const baseDate = new Date();
  
  let currentRange: DateRange;
  let previousRange: DateRange;
  let compareLabel = '';

  switch (dateRangeLabel) {
    case 'Today': {
      compareLabel = 'vs. yesterday';
      const start = new Date(baseDate);
      start.setHours(0,0,0,0);
      currentRange = { start, end: baseDate };
      const prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 1);
      const prevEnd = new Date(start);
      prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
      previousRange = { start: prevStart, end: prevEnd };
      break;
    }
    case 'Last 30 Days': {
      compareLabel = 'vs. last month';
      const start = new Date(baseDate);
      start.setDate(start.getDate() - 30);
      currentRange = { start, end: baseDate };
      
      const prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 30);
      const prevEnd = new Date(start);
      prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
      previousRange = { start: prevStart, end: prevEnd };
      break;
    }
    case 'Last 7 Days':
    default: {
      compareLabel = 'vs. last week';
      const start = new Date(baseDate);
      start.setDate(start.getDate() - 7);
      currentRange = { start, end: baseDate };
      
      const prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 7);
      const prevEnd = new Date(start);
      prevEnd.setMilliseconds(prevEnd.getMilliseconds() - 1);
      previousRange = { start: prevStart, end: prevEnd };
      break;
    }
  }

  return (
    <DateRangeContext.Provider value={{ dateRangeLabel, setDateRangeLabel, currentRange, previousRange, compareLabel }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
}
