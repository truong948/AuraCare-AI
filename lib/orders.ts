import { CartItem } from "@/lib/cart";
import { MockProduct, mockProducts } from "@/lib/mock-data/catalog";

export interface OrderItem {
  productSlug: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface OrderShipping {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: "pending" | "processing" | "completed";
  items: OrderItem[];
  subtotal: number;
  shipping: OrderShipping;
}

export const ORDERS_STORAGE_KEY = "auracare_orders";

export function loadOrders(): Order[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed)
      ? parsed.filter((order) => typeof order.id === "string" && Array.isArray(order.items))
      : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function createOrder(cartItems: CartItem[], shipping: OrderShipping): Order {
  const orderItems: OrderItem[] = cartItems
    .map((item) => {
      const product = mockProducts.find((product) => product.slug === item.productSlug);
      if (!product) return null;
      return {
        productSlug: product.slug,
        quantity: item.quantity,
        name: product.name,
        price: product.price,
        image: product.image,
      };
    })
    .filter((item): item is OrderItem => item !== null);

  const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const id = `order-${Date.now()}`;

  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    status: "pending",
    items: orderItems,
    subtotal,
    shipping,
  };

  const existing = loadOrders();
  saveOrders([order, ...existing]);
  return order;
}

export function getOrderById(id: string): Order | undefined {
  return loadOrders().find((order) => order.id === id);
}
