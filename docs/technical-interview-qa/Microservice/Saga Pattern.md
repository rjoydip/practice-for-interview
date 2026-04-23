---

## Gist Details

**📄 Filename**
```
saga-pattern-choreography.js
```

**📝 Description**
```
SAGA Pattern (Choreography) in Node.js — zero dependencies. Covers happy path + automatic compensating transactions on payment/inventory failure.
```

---

## Notes

````markdown
# SAGA Pattern — Choreography (Node.js)

A self-contained, zero-dependency implementation of the **Choreography-based SAGA**
pattern, modelling a microservices e-commerce order flow.

## How to run

```bash
node saga-pattern-choreography.js
```
````

## What's inside (all in one file)

| Class              | Role                                                               |
| ------------------ | ------------------------------------------------------------------ |
| `EventBus`         | In-memory pub/sub — replace with Kafka/RabbitMQ in production      |
| `OrderService`     | Creates orders; listens for `ORDER_CANCEL` to roll back            |
| `PaymentService`   | Charges users; listens for `PAYMENT_REFUND` to roll back           |
| `InventoryService` | Reserves stock; listens for `INVENTORY_RELEASE` to roll back       |
| `ShippingService`  | Schedules shipments; listens for `SHIPPING_CANCEL` to roll back    |
| `OrderSaga`        | Detects failures; publishes compensating commands in reverse order |

## Event flow

```
Happy path:
  ORDER_CREATED → PAYMENT_SUCCESS → INVENTORY_RESERVED → SHIPPING_SCHEDULED ✅

Payment failure:
  PAYMENT_FAILED → ORDER_CANCEL ❌

Inventory failure:
  INVENTORY_FAILED → PAYMENT_REFUND → ORDER_CANCEL ❌
```

## Three demo scenarios

1. **Happy path** — `user_1` ($500 balance) orders $200, ITEM_A in stock → ✅
2. **Payment fails** — `user_2` ($50 balance) orders $300 → order cancelled
3. **Inventory fails** — `user_3` orders ITEM_B (out of stock) → payment refunded + order cancelled

## Production migration path

- Swap `EventBus` for **Kafka** / **RabbitMQ** / **AWS SNS+SQS**
- Split each class into its own Node.js microservice
- Persist state to a real database per service
- Add idempotency keys to prevent duplicate event processing

```

```
