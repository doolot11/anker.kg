export interface OrderItem {
  id?: string;
  title: string;
  quantity: number;
  price: number;
  unit?: string;
}

export interface OrderData {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  notes?: string;
  paymentMethod?: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  telegramStatus?: 'sent' | 'failed' | 'not_configured';
  telegramError?: string;
}

// In-memory order store across warm function invocations
let currentOrderId = 1025;
const orders: OrderData[] = [];

export function getOrders(): OrderData[] {
  return orders;
}

export function addOrder(order: OrderData): void {
  orders.unshift(order);
}

export function getNextOrderId(): number {
  return currentOrderId++;
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString("ru-RU").replace(/,/g, " ");
}

export function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
