import { CartItem } from "@/lib/cart";
import { MockProduct, mockProducts } from "@/lib/mock-data/catalog";
import { createClient } from "@/utils/supabase/client";

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
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: OrderShipping;
}

export type OrderStatus = "pending" | "processing" | "completed";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  completed: "Hoàn tất",
};

export const ORDERS_STORAGE_KEY = "auracare_orders";

export async function loadOrders(): Promise<Order[]> {
  if (typeof window === "undefined") {
    return [];
  }

  // 1. Try to load from Supabase if authenticated
  try {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if admin to fetch all orders
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const isAdmin = profile?.role === "admin";

      let query = supabase
        .from("orders")
        .select(`
          id,
          created_at,
          status,
          subtotal,
          shipping_name,
          shipping_email,
          shipping_phone,
          shipping_address,
          order_items (
            product_slug,
            product_name,
            product_image,
            unit_price,
            quantity
          )
        `);

      if (!isAdmin) {
        query = query.eq("user_id", user.id);
      }

      const { data: dbOrders, error } = await query.order("created_at", { ascending: false });

      if (!error && dbOrders && dbOrders.length > 0) {
        return dbOrders.map((ord: any) => ({
          id: ord.id,
          createdAt: ord.created_at,
          status: ord.status as OrderStatus,
          subtotal: ord.subtotal,
          shipping: {
            name: ord.shipping_name,
            email: ord.shipping_email,
            phone: ord.shipping_phone,
            address: ord.shipping_address,
          },
          items: (ord.order_items || []).map((item: any) => ({
            productSlug: item.product_slug,
            quantity: item.quantity,
            name: item.product_name,
            price: item.unit_price,
            image: item.product_image,
          })),
        }));
      }
    }
  } catch (err) {
    console.warn("Failed to load orders from Supabase, checking localStorage fallback:", err);
  }

  // 2. LocalStorage fallback
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

export async function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export async function createOrder(cartItems: CartItem[], shipping: OrderShipping): Promise<Order> {
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

  // 1. Try to save to Supabase if authenticated
  try {
    const supabase = createClient() as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: ordData, error: ordError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          subtotal: subtotal,
          shipping_fee: 0,
          shipping_name: shipping.name,
          shipping_email: shipping.email,
          shipping_phone: shipping.phone,
          shipping_address: shipping.address,
        })
        .select("id")
        .single();

      if (!ordError && ordData) {
        const dbOrderId = ordData.id;
        const itemsToInsert = orderItems.map((item) => ({
          order_id: dbOrderId,
          product_slug: item.productSlug,
          product_name: item.name,
          product_image: item.image,
          unit_price: item.price,
          quantity: item.quantity,
        }));

        await supabase.from("order_items").insert(itemsToInsert);
        order.id = dbOrderId; // Use real UUID
      }
    }
  } catch (err) {
    console.warn("Failed to create order in Supabase, using local fallback:", err);
  }

  // 2. Backup to localStorage anyway
  const existing = await loadOrders();
  const filtered = existing.filter((o) => o.id !== order.id);
  await saveOrders([order, ...filtered]);
  return order;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await loadOrders();
  return orders.find((order) => order.id === id);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order[]> {
  try {
    const supabase = createClient() as any;
    await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
  } catch (err) {
    console.warn(`Failed to update order status for ${id} in Supabase:`, err);
  }

  let localOrders: Order[] = [];
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      localOrders = JSON.parse(raw) as Order[];
    }
  } catch {}

  const next = localOrders.map((order) => (order.id === id ? { ...order, status } : order));
  await saveOrders(next);
  return loadOrders();
}

export function getOrdersSummary(orders: Order[]) {
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    processingOrders: orders.filter((order) => order.status === "processing").length,
    completedOrders: orders.filter((order) => order.status === "completed").length,
    revenue: orders.reduce((total, order) => total + order.subtotal, 0),
  };
}
