import { pgTable, text, timestamp, uuid, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "cancelled", "completed"]);

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  nameFa: text("name_fa").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // minutes
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceName: text("service_name").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  status: appointmentStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  totalPrice: integer("total_price").notNull(),
  smsSent: boolean("sms_sent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
