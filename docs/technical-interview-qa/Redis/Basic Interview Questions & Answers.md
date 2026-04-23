## Redis Data Types — JS + CLI Guide

---

## Setup

```js
const { createClient } = require("redis");

const client = createClient({ url: "redis://localhost:6379" });
client.on("error", (err) => console.error("Redis error:", err));
await client.connect();
```

---

## 1. 🔤 String

> Binary-safe. Used for caching, counters, sessions.

### JS

```js
// SET with expiry (10 seconds)
await client.set("username", "john_doe", { EX: 10 });

// GET
const value = await client.get("username");
console.log(value); // "john_doe"

// Increment counter
await client.set("visitors", 0);
await client.incr("visitors");
await client.incrBy("visitors", 5);
const count = await client.get("visitors");
console.log(count); // "6"
```

### CLI

```bash
SET username "john_doe" EX 10
GET username

SET visitors 0
INCR visitors
INCRBY visitors 5
GET visitors          # "6"

APPEND username "_admin"
GET username          # "john_doe_admin"

STRLEN username       # 16
TTL username          # remaining seconds
```

---

## 2. 📋 List

> Ordered, duplicates allowed. Great for queues, feeds, history.

```
HEAD ◄──[A]──[B]──[C]──[D]──► TAIL
       LPUSH               RPUSH
```

### JS

```js
// Push to list
await client.lPush("tasks", "task1"); // push to LEFT (head)
await client.rPush("tasks", "task2", "task3"); // push to RIGHT (tail)

// Get range (0 to -1 = all)
const all = await client.lRange("tasks", 0, -1);
console.log(all); // ["task1", "task2", "task3"]

// Pop from ends
const left = await client.lPop("tasks"); // "task1"
const right = await client.rPop("tasks"); // "task3"

// Length
const len = await client.lLen("tasks");
console.log(len); // 1
```

### CLI

```bash
LPUSH tasks "task1"
RPUSH tasks "task2" "task3"

LRANGE tasks 0 -1      # ["task1", "task2", "task3"]
LLEN tasks             # 3

LPOP tasks             # "task1"
RPOP tasks             # "task3"

LINDEX tasks 0         # get element at index 0
LSET tasks 0 "updated" # update element at index 0

# Blocking pop (waits until item available — great for queues)
BLPOP tasks 5          # blocks for 5 seconds
```

---

## 3. 🔵 Set

> Unordered, unique values. Great for tags, followers, unique IDs.

### JS

```js
// Add members
await client.sAdd("colors", "red", "green", "blue", "red"); // "red" ignored (duplicate)

// Get all members
const members = await client.sMembers("colors");
console.log(members); // ["red", "green", "blue"] (order may vary)

// Check membership
const exists = await client.sIsMember("colors", "red");
console.log(exists); // true

// Remove
await client.sRem("colors", "green");

// Set operations
await client.sAdd("setA", "a", "b", "c");
await client.sAdd("setB", "b", "c", "d");

const union = await client.sUnion(["setA", "setB"]); // [a,b,c,d]
const intersection = await client.sInter(["setA", "setB"]); // [b,c]
const difference = await client.sDiff(["setA", "setB"]); // [a]
```

### CLI

```bash
SADD colors "red" "green" "blue" "red"   # adds 3 (ignores duplicate)
SMEMBERS colors                           # all members
SCARD colors                              # count = 3

SISMEMBER colors "red"                    # 1 (true)
SREM colors "green"

SADD setA "a" "b" "c"
SADD setB "b" "c" "d"

SUNION setA setB                          # [a, b, c, d]
SINTER setA setB                          # [b, c]
SDIFF  setA setB                          # [a]

SPOP colors                               # remove & return random member
SRANDMEMBER colors 2                      # get 2 random members (no remove)
```

---

## 4. 🏆 Sorted Set

> Like a Set but each member has a **score** for ordering. Great for leaderboards, rankings.

### JS

```js
// Add with scores
await client.zAdd("leaderboard", [
  { score: 100, value: "Alice" },
  { score: 250, value: "Bob" },
  { score: 175, value: "Charlie" },
]);

// Get range by rank (low to high)
const asc = await client.zRange("leaderboard", 0, -1);
console.log(asc); // ["Alice", "Charlie", "Bob"]

// Get range with scores
const withScores = await client.zRangeWithScores("leaderboard", 0, -1);
// [{ value: 'Alice', score: 100 }, ...]

// Get rank of a member (0-indexed)
const rank = await client.zRank("leaderboard", "Bob");
console.log(rank); // 2 (last, highest score)

// Get score
const score = await client.zScore("leaderboard", "Charlie");
console.log(score); // 175

// Increment score
await client.zIncrBy("leaderboard", 50, "Alice"); // Alice = 150
```

### CLI

```bash
ZADD leaderboard 100 "Alice" 250 "Bob" 175 "Charlie"

ZRANGE leaderboard 0 -1                   # asc by score
ZRANGE leaderboard 0 -1 WITHSCORES        # with scores
ZREVRANGE leaderboard 0 -1 WITHSCORES     # desc (top first)

ZRANK leaderboard "Bob"                   # rank (0-indexed, asc)
ZREVRANK leaderboard "Bob"                # rank (0-indexed, desc)
ZSCORE leaderboard "Charlie"              # 175

ZINCRBY leaderboard 50 "Alice"            # Alice = 150
ZCARD leaderboard                         # count = 3
ZREM leaderboard "Alice"                  # remove member

ZRANGEBYSCORE leaderboard 100 200         # members with score 100-200
```

---

## 5. 🗂️ Hash

> Field-value pairs under one key. Perfect for user profiles, objects, sessions.

```
user:101
├── name  → "Alice"
├── email → "alice@email.com"
└── age   → "28"
```

### JS

```js
// Set multiple fields
await client.hSet("user:101", {
  name: "Alice",
  email: "alice@email.com",
  age: 28,
});

// Get one field
const name = await client.hGet("user:101", "name");
console.log(name); // "Alice"

// Get all fields
const user = await client.hGetAll("user:101");
console.log(user); // { name: 'Alice', email: 'alice@email.com', age: '28' }

// Check field existence
const exists = await client.hExists("user:101", "email"); // true

// Increment numeric field
await client.hIncrBy("user:101", "age", 1); // age = 29

// Delete a field
await client.hDel("user:101", "email");
```

### CLI

```bash
HSET user:101 name "Alice" email "alice@email.com" age 28

HGET    user:101 name              # "Alice"
HGETALL user:101                   # all fields + values
HKEYS   user:101                   # ["name", "email", "age"]
HVALS   user:101                   # ["Alice", "alice@...", "28"]

HEXISTS user:101 email             # 1 (true)
HLEN    user:101                   # 3 fields

HINCRBY user:101 age 1             # age = 29
HDEL    user:101 email             # delete field
```

---

## 6. 📊 HyperLogLog

> Approximates **unique element count** using very little memory (~12KB regardless of data size). ~0.81% error rate. You **cannot retrieve elements**, only count.

### JS

```js
// Add elements (duplicates are ignored in count)
await client.pfAdd("page:views", "user1", "user2", "user3", "user1");

// Count unique elements
const unique = await client.pfCount("page:views");
console.log(unique); // ≈ 3  (user1 counted once)

// Merge multiple HyperLogLogs
await client.pfAdd("page:home", "user1", "user2");
await client.pfAdd("page:contact", "user2", "user3", "user4");

await client.pfMerge("page:all", ["page:home", "page:contact"]);
const total = await client.pfCount("page:all");
console.log(total); // ≈ 4 unique users across both pages
```

### CLI

```bash
PFADD page:views "user1" "user2" "user3" "user1"
PFCOUNT page:views                  # ≈ 3

PFADD page:home    "user1" "user2"
PFADD page:contact "user2" "user3" "user4"

PFMERGE page:all page:home page:contact
PFCOUNT page:all                    # ≈ 4
```

> ✅ Best for: Counting unique visitors, searches, events at massive scale without storing each value.

---

## 7. 🌊 Streams

> Append-only log of entries (like Kafka). Each entry is a key-value map with a unique auto-generated ID.

```
Stream: "events"
┌──────────────────┬──────────────────────────────┐
│ ID               │ Fields                       │
├──────────────────┼──────────────────────────────┤
│ 1700000000000-0  │ action=login  user=Alice     │
│ 1700000000100-0  │ action=click  user=Bob       │
│ 1700000000200-0  │ action=logout user=Alice     │
└──────────────────┴──────────────────────────────┘
```

### JS

```js
// Append entry (auto-generate ID with '*')
const id1 = await client.xAdd("events", "*", { action: "login", user: "Alice" });
const id2 = await client.xAdd("events", "*", { action: "click", user: "Bob" });
const id3 = await client.xAdd("events", "*", { action: "logout", user: "Alice" });

console.log(id1); // "1700000000000-0"

// Read range of entries
const entries = await client.xRange("events", "-", "+"); // - = start, + = end
entries.forEach(({ id, message }) => {
  console.log(id, message);
});

// Read latest N entries
const latest = await client.xRevRange("events", "+", "-", { COUNT: 2 });

// Stream length
const len = await client.xLen("events");
console.log(len); // 3

// Read new entries (blocking — like a real-time listener)
const newEntries = await client.xRead(
  [{ key: "events", id: "$" }], // '$' = only new entries from now
  { BLOCK: 5000, COUNT: 10 }, // block for 5s, max 10 entries
);
```

### CLI

```bash
XADD events * action "login"  user "Alice"
XADD events * action "click"  user "Bob"
XADD events * action "logout" user "Alice"

XRANGE  events - +             # all entries (oldest first)
XREVRANGE events + -           # all entries (newest first)
XRANGE  events - + COUNT 2     # first 2 entries

XLEN events                    # 3
XREAD COUNT 2 STREAMS events 0 # read from beginning

# Blocking read for new entries
XREAD COUNT 5 BLOCK 5000 STREAMS events $
```

---

## 8. 🔲 Bitmaps

> Bit-level operations on strings. Each bit = 1 or 0. Ultra memory-efficient for boolean flags at scale.

```
Key: "logins:2024-01-01"
Bit positions represent user IDs:
[0, 1, 0, 1, 1, 0, ...]
 ↑  ↑  ↑  ↑  ↑
ID0 ID1 ID2 ID3 ID4  ...
```

### JS

```js
// SETBIT: mark user as logged in (bit position = user ID)
await client.setBit("logins:2024-01-01", 101, 1); // user 101 logged in
await client.setBit("logins:2024-01-01", 202, 1); // user 202 logged in
await client.setBit("logins:2024-01-01", 303, 1); // user 303 logged in

// GETBIT: check if user logged in
const didLogin = await client.getBit("logins:2024-01-01", 101);
console.log(didLogin); // 1 (true)

const didLogin2 = await client.getBit("logins:2024-01-01", 999);
console.log(didLogin2); // 0 (false)

// BITCOUNT: count total logins that day
const totalLogins = await client.bitCount("logins:2024-01-01");
console.log(totalLogins); // 3

// BITOP: AND — users who logged in on BOTH days
await client.setBit("logins:2024-01-02", 101, 1);
await client.setBit("logins:2024-01-02", 404, 1);

await client.bitOp("AND", "logins:both", "logins:2024-01-01", "logins:2024-01-02");
const bothDays = await client.bitCount("logins:both");
console.log(bothDays); // 1 (only user 101)
```

### CLI

```bash
SETBIT logins:2024-01-01 101 1
SETBIT logins:2024-01-01 202 1
SETBIT logins:2024-01-01 303 1

GETBIT logins:2024-01-01 101        # 1 (logged in)
GETBIT logins:2024-01-01 999        # 0 (not logged in)

BITCOUNT logins:2024-01-01          # 3

SETBIT logins:2024-01-02 101 1
SETBIT logins:2024-01-02 404 1

# Bitwise operations across keys
BITOP AND logins:both logins:2024-01-01 logins:2024-01-02
BITCOUNT logins:both                # 1 (user 101 only)

BITOP OR  logins:either logins:2024-01-01 logins:2024-01-02
BITCOUNT logins:either              # 4
```

---

## Quick Reference

```
┌─────────────────┬──────────────────────────┬───────────────────────────────┐
│ Type            │ Best Used For            │ Key Commands                  │
├─────────────────┼──────────────────────────┼───────────────────────────────┤
│ String          │ Cache, counters, sessions│ GET, SET, INCR, APPEND        │
│ List            │ Queues, feeds, history   │ LPUSH, RPUSH, LRANGE, LPOP   │
│ Set             │ Tags, unique IDs         │ SADD, SMEMBERS, SINTER        │
│ Sorted Set      │ Leaderboards, rankings   │ ZADD, ZRANGE, ZRANK           │
│ Hash            │ Objects, user profiles   │ HSET, HGET, HGETALL           │
│ HyperLogLog     │ Unique count at scale    │ PFADD, PFCOUNT, PFMERGE       │
│ Streams         │ Event logs, messaging    │ XADD, XRANGE, XREAD           │
│ Bitmaps         │ Boolean flags, analytics │ SETBIT, GETBIT, BITCOUNT      │
└─────────────────┴──────────────────────────┴───────────────────────────────┘
```
