# Order Tracker — Scope (v1)

> My goal: build a real product. Shop staff update an order's status, and customers watch it change live without refreshing.
> This is version 1. I'm keeping it small and adding more later.

## 1. Who logs in?
- **Shop staff**: they log in and manage orders.
- **Customers**: no login in v1. I'll give each customer a unique tracking link (like `/track/ABC123`) that they just open.

## 2. Order statuses (fixed list)
1. Placed
2. Packed
3. On the way
4. Delivered
- Plus a special one: **Cancelled** (can happen from any step).
- Status only moves forward. No going back for now.

## 3. What can staff do?
- See all active orders in one list.
- Create a new order (customer name, phone, items, address).
- Change an order's status (move it one step forward).
- Cancel an order.

## 4. What does a customer see?
- They open their tracking link.
- They see the current status plus a simple timeline (which steps are done).
- The page updates live when staff change the status (no refresh).
- No map in v1. Just status. I'll add a map later.

## 5. One shop or many?
- **One shop only** in v1.
- Multi-shop support comes in a later version.

## Out of scope for v1 (I will NOT build these yet)
- Payments
- Live map / GPS
- Customer accounts
- Multiple shops
- Notifications (SMS/email)
- Ratings/reviews

## Open questions (I'll decide later)
- How do I generate a tracking code?
- How long do delivered orders stay in the list?
