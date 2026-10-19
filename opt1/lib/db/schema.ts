import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export interface ShippingAddressData {
  recipientName: string;
  phone: string;
  addressLine: string;
  province: string;
  city: string;
  district?: string;
  postalCode: string;
  country: string;
}

export interface CartItemData {
  productId: string;
  quantity: number;
  variant?: string;
}

/**
 * 1. Products Table
 * Mendukung dual-currency (price_idr dan price_usd), inventaris stok,
 * dan metadata perhiasan Celuk (berat gram untuk ongkir, material, foto).
 */
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // Rings, Earrings, Pendants, Bracelets, Cuffs, Findings
  subcategory: text("subcategory"),
  description: text("description"),
  material: text("material").notNull().default("925 Sterling Silver"), // 925 Sterling Silver, 18k Gold Vermeil, Cast Brass, Bronze
  priceIdr: integer("price_idr").notNull(), // dalam rupiah utuh, misal: 750000
  priceUsd: real("price_usd").notNull(), // dalam USD, misal: 48.00
  weightGrams: real("weight_grams").notNull().default(15.0), // berat untuk kalkulasi logistik
  stockQuantity: integer("stock_quantity").notNull().default(10),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  images: text("images", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  specs: text("specs", { mode: "json" }).$type<Record<string, string>>(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 2. Orders Table
 * Mencatat lifecycle transaksi Midtrans Snap, currency pemesanan,
 * detail pengiriman, dan tracking number.
 */
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // Format: ORD-YYYYMMDD-XXXX
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  currency: text("currency").notNull().default("IDR"), // 'IDR' | 'USD'
  subtotal: real("subtotal").notNull(),
  shippingCost: real("shipping_cost").notNull().default(0),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, processing, shipped, delivered, cancelled, expired
  paymentMethod: text("payment_method"), // qris, gopay, bca_va, mandiri_va, bni_va, credit_card
  snapToken: text("snap_token"),
  snapRedirectUrl: text("snap_redirect_url"),
  midtransTransactionId: text("midtrans_transaction_id"),
  shippingCourier: text("shipping_courier"), // JNE Reguler, J&T Express, DHL Worldwide
  shippingTrackingNumber: text("shipping_tracking_number"),
  shippingAddress: text("shipping_address", { mode: "json" }).$type<ShippingAddressData>().notNull(),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 3. Order Items Table
 * Detail perhiasan dalam setiap pesanan beserta snapshot harga saat transaksi.
 */
export const orderItems = sqliteTable("orderItems", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  productName: text("product_name").notNull(),
  variantSelected: text("variant_selected"), // Contoh: 'Size 7 (US) / 925 Silver'
  quantity: integer("quantity").notNull().default(1),
  unitPrice: real("unit_price").notNull(),
  subtotal: real("subtotal").notNull(),
});

/**
 * 4. Saved Carts Table
 * Sinkronisasi keranjang belanja guest / user terautentikasi.
 */
export const savedCarts = sqliteTable("saved_carts", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  items: text("items", { mode: "json" }).$type<CartItemData[]>().notNull().default(sql`'[]'`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type SavedCart = typeof savedCarts.$inferSelect;
export type NewSavedCart = typeof savedCarts.$inferInsert;
