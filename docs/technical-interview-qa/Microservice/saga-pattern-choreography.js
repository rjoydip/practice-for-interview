/**
 * @file    saga-pattern-choreography.js
 * @desc    SAGA Pattern (Choreography) in Node.js — no dependencies required
 *
 * Simulates a microservices order flow using an in-memory EventBus.
 * Each "service" is a plain class; in production each would be its own
 * deployable process connected via Kafka / RabbitMQ / SNS.
 *
 * Happy path:
 *   ORDER_CREATED → PAYMENT_SUCCESS → INVENTORY_RESERVED → SHIPPING_SCHEDULED ✅
 *
 * Compensation paths (automatic rollback):
 *   PAYMENT_FAILED   → cancel order
 *   INVENTORY_FAILED → refund payment → cancel order
 *
 * Run:  node saga-pattern-choreography.js
 */

"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// EventBus  (swap for Kafka / RabbitMQ in production)
// ─────────────────────────────────────────────────────────────────────────────
class EventBus {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, handler) {
    (this.subscribers[event] ??= []).push(handler);
  }

  async publish(event, data) {
    console.log(`\n  [EventBus] ▶ "${event}"  ${JSON.stringify(data)}`);
    for (const handler of this.subscribers[event] ?? []) {
      await handler(data);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OrderService
// ─────────────────────────────────────────────────────────────────────────────
class OrderService {
  constructor(bus) {
    this.bus = bus;
    this.orders = {};
    bus.subscribe("ORDER_CANCEL", this.cancelOrder.bind(this));
  }

  async createOrder(orderId, userId, amount) {
    console.log(`\n[OrderService] Creating order ${orderId}`);
    this.orders[orderId] = { orderId, userId, amount, status: "PENDING" };
    console.log(`[OrderService] ✓ Order ${orderId} PENDING`);
    await this.bus.publish("ORDER_CREATED", { orderId, userId, amount });
  }

  async cancelOrder({ orderId, reason }) {
    if (this.orders[orderId]) {
      this.orders[orderId].status = "CANCELLED";
      console.log(`[OrderService] ↩ Order ${orderId} CANCELLED — ${reason}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PaymentService
// ─────────────────────────────────────────────────────────────────────────────
class PaymentService {
  constructor(bus) {
    this.bus = bus;
    this.payments = {};
    this.balances = { user_1: 500, user_2: 50, user_3: 1000 };
    bus.subscribe("ORDER_CREATED", this.processPayment.bind(this));
    bus.subscribe("PAYMENT_REFUND", this.refundPayment.bind(this));
  }

  async processPayment({ orderId, userId, amount }) {
    console.log(`\n[PaymentService] Processing payment for ${orderId}`);
    const balance = this.balances[userId] ?? 0;

    if (balance < amount) {
      console.log(`[PaymentService] ✗ Insufficient funds ($${balance} < $${amount})`);
      await this.bus.publish("PAYMENT_FAILED", {
        orderId,
        userId,
        reason: "Insufficient funds",
      });
      return;
    }

    this.balances[userId] -= amount;
    this.payments[orderId] = { orderId, userId, amount, status: "PAID" };
    console.log(
      `[PaymentService] ✓ Charged $${amount} to ${userId} (balance: $${this.balances[userId]})`,
    );
    await this.bus.publish("PAYMENT_SUCCESS", { orderId, userId, amount });
  }

  async refundPayment({ orderId, reason }) {
    const p = this.payments[orderId];
    if (p?.status === "PAID") {
      this.balances[p.userId] += p.amount;
      p.status = "REFUNDED";
      console.log(`[PaymentService] ↩ Refunded $${p.amount} to ${p.userId} — ${reason}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// InventoryService
// ─────────────────────────────────────────────────────────────────────────────
class InventoryService {
  constructor(bus) {
    this.bus = bus;
    this.reservations = {};
    this.stock = { ITEM_A: 10, ITEM_B: 0 }; // ITEM_B intentionally out of stock
    bus.subscribe("PAYMENT_SUCCESS", this.reserveInventory.bind(this));
    bus.subscribe("INVENTORY_RELEASE", this.releaseInventory.bind(this));
  }

  async reserveInventory({ orderId, userId, amount }) {
    console.log(`\n[InventoryService] Reserving inventory for ${orderId}`);
    const item = orderId.includes("B") ? "ITEM_B" : "ITEM_A";

    if ((this.stock[item] ?? 0) <= 0) {
      console.log(`[InventoryService] ✗ Out of stock: ${item}`);
      await this.bus.publish("INVENTORY_FAILED", {
        orderId,
        userId,
        amount,
        reason: `Out of stock: ${item}`,
      });
      return;
    }

    this.stock[item]--;
    this.reservations[orderId] = { orderId, item, status: "RESERVED" };
    console.log(`[InventoryService] ✓ Reserved ${item} (stock left: ${this.stock[item]})`);
    await this.bus.publish("INVENTORY_RESERVED", { orderId, userId, amount });
  }

  async releaseInventory({ orderId, reason }) {
    const r = this.reservations[orderId];
    if (r?.status === "RESERVED") {
      this.stock[r.item]++;
      r.status = "RELEASED";
      console.log(`[InventoryService] ↩ Released ${r.item} — ${reason}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ShippingService
// ─────────────────────────────────────────────────────────────────────────────
class ShippingService {
  constructor(bus) {
    this.bus = bus;
    this.shipments = {};
    bus.subscribe("INVENTORY_RESERVED", this.scheduleShipment.bind(this));
    bus.subscribe("SHIPPING_CANCEL", this.cancelShipment.bind(this));
  }

  async scheduleShipment({ orderId, userId, amount }) {
    console.log(`\n[ShippingService] Scheduling shipment for ${orderId}`);
    const trackingId = `TRACK-${orderId.toUpperCase()}-${Date.now()}`;
    this.shipments[orderId] = { orderId, trackingId, status: "SCHEDULED" };
    console.log(`[ShippingService] ✓ Shipment scheduled — ${trackingId}`);
    await this.bus.publish("SHIPPING_SCHEDULED", {
      orderId,
      userId,
      amount,
      trackingId,
    });
  }

  async cancelShipment({ orderId, reason }) {
    const s = this.shipments[orderId];
    if (s) {
      s.status = "CANCELLED";
      console.log(`[ShippingService] ↩ Cancelled ${s.trackingId} — ${reason}`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OrderSaga  — listens for failures and fires compensating transactions
// ─────────────────────────────────────────────────────────────────────────────
class OrderSaga {
  constructor(bus) {
    this.bus = bus;
    bus.subscribe("SHIPPING_SCHEDULED", this.onCompleted.bind(this));
    bus.subscribe("PAYMENT_FAILED", this.onPaymentFailed.bind(this));
    bus.subscribe("INVENTORY_FAILED", this.onInventoryFailed.bind(this));
  }

  async onCompleted({ orderId, trackingId }) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`  ✅ SAGA COMPLETED  Order: ${orderId}  Tracking: ${trackingId}`);
    console.log(`${"=".repeat(60)}`);
  }

  async onPaymentFailed({ orderId, reason }) {
    console.log(`\n[Saga] ⚠ Payment failed — starting compensation for ${orderId}`);
    await this.bus.publish("ORDER_CANCEL", { orderId, reason });
    this._fail(orderId, reason);
  }

  async onInventoryFailed({ orderId, amount, reason }) {
    console.log(
      `\n[Saga] ⚠ Inventory failed — starting compensation for ${orderId} and amount ${amount}`,
    );
    await this.bus.publish("PAYMENT_REFUND", { orderId, reason });
    await this.bus.publish("ORDER_CANCEL", { orderId, reason });
    this._fail(orderId, reason);
  }

  _fail(orderId, reason) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`  ❌ SAGA FAILED  Order: ${orderId}`);
    console.log(`     Reason: ${reason}`);
    console.log(`     Compensating transactions applied.`);
    console.log(`${"=".repeat(60)}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Bootstrap — wire everything up
// ─────────────────────────────────────────────────────────────────────────────
const bus = new EventBus();

// Order of instantiation = order of listener registration (matters for pub order)
const orderService = new OrderService(bus);
new PaymentService(bus);
new InventoryService(bus);
new ShippingService(bus);
new OrderSaga(bus);

// ─────────────────────────────────────────────────────────────────────────────
// Demo scenarios
// ─────────────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function section(label) {
  console.log(`\n${"━".repeat(60)}\n  SCENARIO: ${label}\n${"━".repeat(60)}`);
}

(async () => {
  section("1 — Happy path  (user_1, $200, ITEM_A in stock)");
  await orderService.createOrder("order-001", "user_1", 200);
  await sleep(50);

  section("2 — Payment failure  (user_2 has $50, order is $300)");
  await orderService.createOrder("order-002", "user_2", 300);
  await sleep(50);

  section("3 — Inventory failure  (user_3, $100, ITEM_B out of stock)");
  await orderService.createOrder("order-B-003", "user_3", 100);
})();
