import { Order } from "../types/orders.types";

export interface TimelineEvent {
  label: string;
  timestamp: string;
  isHighlighted?: boolean;
}

export interface OrderAttribution {
  source: string;
  initial: string;
  campaign: string;
  roas: number;
}

export interface OrderDetail extends Order {
  stripeId: string;
  time: string;
  attribution: OrderAttribution;
  timeline: TimelineEvent[];
}