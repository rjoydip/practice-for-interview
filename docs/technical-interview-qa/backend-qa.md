# 🔹 1. Node.js + TypeScript

### Q1: How does Node.js handle concurrency?

**Answer:**
Node.js uses a **single-threaded event loop** with non-blocking I/O. Heavy operations are delegated to the **libuv thread pool** (like file system, DNS). This allows high throughput without thread overhead.

---

### Q2: Difference between `process.nextTick()` and `setImmediate()`?

**Answer:**

- `process.nextTick()` → runs **before next event loop phase**
- `setImmediate()` → runs in **check phase**
  👉 Overuse of `nextTick` can starve the event loop.

---

### Q3: How do you structure a scalable Node.js app?

**Answer:**

- Layered architecture (Controller → Service → Repository)
- Dependency injection
- Config isolation
- Logging + observability
- Use frameworks like NestJS or modular Koa setup (you already use Koa)

---

### Q4: Why TypeScript in backend?

**Answer:**

- Static typing → fewer runtime bugs
- Better refactoring
- Interfaces for contracts
- Works well with large teams

---

### Q5: Difference between `interface` and `type`?

**Answer:**

- `interface` → extendable, better for OOP
- `type` → more flexible (union, intersection)

---

### Q6: What is `unknown` vs `any`?

**Answer:**

- `any` → disables type checking
- `unknown` → must validate before use (safer)

---

# 🔹 2. Microservices Architecture

### Q7: Monolith vs Microservices?

**Answer:**

| Monolith       | Microservices      |
| -------------- | ------------------ |
| Single deploy  | Independent deploy |
| Tight coupling | Loose coupling     |
| Easier start   | Complex infra      |

---

### Q8: How do services communicate?

**Answer:**

- Sync → REST / gRPC
- Async → Kafka / RabbitMQ / Azure Queue

---

### Q9: What is service discovery?

**Answer:**
Mechanism to dynamically locate services (e.g., Kubernetes DNS, Consul).

---

### Q10: What is API Gateway?

**Answer:**
Single entry point handling:

- Auth
- Routing
- Rate limiting

---

### Q11: How do you handle distributed transactions?

**Answer:**
Use **Saga pattern**:

- Choreography (events)
- Orchestration (central coordinator)

---

# 🔹 3. REST API Design

### Q12: What makes a REST API “good”?

**Answer:**

- Resource-based URLs
- Proper HTTP methods
- Stateless
- Versioning

---

### Q13: Idempotent methods?

**Answer:**

- GET, PUT, DELETE → idempotent
- POST → not idempotent

---

### Q14: Pagination strategies?

**Answer:**

- Offset-based (simple, slow for large data)
- Cursor-based (better performance)

---

### Q15: How do you version APIs?

**Answer:**

- URL: `/v1/users`
- Header-based
- Prefer URL for simplicity

---

# 🔹 4. Docker

### Q16: What is Docker?

**Answer:**
Containerization platform that packages app + dependencies.

---

### Q17: Difference between image and container?

**Answer:**

- Image → blueprint
- Container → running instance

---

### Q18: Multi-stage builds?

**Answer:**
Reduce image size:

```dockerfile
FROM node:18 AS builder
RUN npm install

FROM node:18-alpine
COPY --from=builder /app /app
```

---

### Q19: How do you optimize Docker images?

**Answer:**

- Use alpine base
- Multi-stage builds
- `.dockerignore`

---

# 🔹 5. Kubernetes

### Q20: What is Kubernetes?

**Answer:**
Container orchestration platform managing deployment, scaling, networking.

---

### Q21: Pod vs Deployment?

**Answer:**

- Pod → smallest unit
- Deployment → manages pods

---

### Q22: What is a Service?

**Answer:**
Stable networking endpoint for pods.

---

### Q23: ConfigMap vs Secret?

**Answer:**

- ConfigMap → plain config
- Secret → sensitive (base64 encoded)

---

### Q24: Horizontal Pod Autoscaler?

**Answer:**
Scales pods based on CPU/memory.

---

# 🔹 6. Cloud (AWS / Azure / GCP)

### Q25: What is IaaS vs PaaS vs SaaS?

**Answer:**

- IaaS → infra control
- PaaS → platform managed
- SaaS → fully managed app

---

### Q26: AWS services mapping?

**Answer:**

- EC2 → compute
- S3 → storage
- RDS → DB
- Lambda → serverless

---

### Q27: What is serverless?

**Answer:**
No server management, auto scaling (e.g., AWS Lambda)

---

### Q28: How do you design a cloud-native app?

**Answer:**

- Stateless services
- Auto-scaling
- Observability
- Managed services

---

# 🔹 7. CI/CD

### Q29: What is CI/CD?

**Answer:**

- CI → build + test
- CD → deploy automatically

---

### Q30: Typical pipeline?

**Answer:**

- Code → Build → Test → Scan → Deploy

---

### Q31: Blue-green deployment?

**Answer:**
Two environments, switch traffic instantly.

---

### Q32: Canary deployment?

**Answer:**
Release to small % of users first.

---

# 🔹 8. Security (VERY IMPORTANT)

### Q33: Authentication vs Authorization?

**Answer:**

- Auth → who you are
- Authorization → what you can do

---

### Q34: JWT flow?

**Answer:**

1. Login → token issued
2. Client sends token
3. Server verifies signature

---

### Q35: How to secure APIs?

**Answer:**

- HTTPS
- Rate limiting
- Input validation
- OAuth/JWT

---

### Q36: Common vulnerabilities?

**Answer:**

- SQL injection
- XSS
- CSRF

---

# 🔹 9. System Design

### Q37: How do you design scalable systems?

**Answer:**

- Load balancing
- Caching (Redis)
- DB scaling (replica/sharding)
- Async processing

---

### Q38: Horizontal vs Vertical scaling?

**Answer:**

- Vertical → bigger machine
- Horizontal → more machines (preferred)

---

### Q39: CAP theorem?

**Answer:**
Choose 2:

- Consistency
- Availability
- Partition tolerance

---

### Q40: How to handle high traffic?

**Answer:**

- CDN
- Cache
- Queue
- Auto-scale

---

# 🔹 10. Scenario-Based (MOST IMPORTANT)

### Q41: Design a URL shortener

**Answer:**

- Hash generator
- DB mapping
- Cache for hot URLs

---

### Q42: How would you scale an API to 1M users?

**Answer:**

- Load balancer
- Stateless services
- Redis caching
- DB read replicas
- Queue (Kafka)

---

### Q43: Your service is slow. What do you do?

**Answer:**

- Profiling
- Check DB queries
- Add caching
- Optimize code

---

### Q44: How do you handle failures in microservices?

**Answer:**

- Retry
- Circuit breaker
- Fallback

---

### Q45: How do you ensure observability?

**Answer:**

- Logs (ELK)
- Metrics (Prometheus)
- Tracing (OpenTelemetry — relevant to your work)

---

# 🔹 11. Advanced Edge Questions

### Q46: Event loop phases?

**Answer:**
Timers → I/O → Idle → Poll → Check → Close

---

### Q47: Backpressure in Node.js?

**Answer:**
When producer is faster than consumer → handled using streams.

---

### Q48: Why eventual consistency?

**Answer:**
Improves availability in distributed systems.

---

### Q49: What is circuit breaker?

**Answer:**
Stops calling failing service to prevent cascading failures.

---

### Q50: What is idempotency key?

**Answer:**
Prevents duplicate operations (used in payments).

---

# 🧠 1. Core Microservices Concepts (Must-know)

### Q1. Monolith vs Microservices — when NOT to use microservices?

👉 Look for:

- Operational overhead (CI/CD, observability)
- Distributed system complexity
- Premature optimization

---

### Q2. How do services communicate in microservices architecture?

👉 Expect:

- Sync: REST, GraphQL, gRPC
- Async: Kafka, RabbitMQ, NATS
- Trade-offs (latency, coupling, reliability)

---

### Q3. How do you handle distributed transactions?

👉 Strong answer includes:

- Saga pattern (orchestration vs choreography)
- Eventual consistency
- Compensation logic

---

### Q4. What is service discovery and how is it implemented?

👉 Examples:

- Client-side discovery (e.g., Netflix Eureka)
- Server-side discovery (e.g., Kubernetes)

---

# ⚙️ 2. Node.js Specific Questions

### Q5. Why is Node.js a good (or bad) choice for microservices?

👉 Good:

- I/O bound workloads
- Fast startup, lightweight containers

👉 Bad:

- CPU-heavy tasks (needs worker threads)

---

### Q6. How do you structure a Node.js microservice?

👉 Expected structure:

```
src/
  controllers/
  services/
  repositories/
  events/
  middlewares/
  config/
```

---

### Q7. How do you handle inter-service communication in Node.js?

👉 Look for:

- Axios / fetch for REST
- gRPC clients
- Kafka libraries (kafkajs)
- Circuit breakers (opossum)

---

# 🔐 3. Security & Auth

### Q8. How do you implement authentication across services?

👉 Strong answer:

- Central Auth service
- JWT / OAuth2
- API Gateway validation

---

### Q9. How do you secure internal service-to-service communication?

👉 Expected:

- mTLS
- Service mesh (Istio)
- Network policies

---

# 📦 4. Data Management

### Q10. Database per service — why?

👉 Key points:

- Loose coupling
- Independent scaling
- Avoid shared DB anti-pattern

---

### Q11. How do you maintain data consistency?

👉 Answer:

- Event-driven architecture
- CDC (Change Data Capture)
- Idempotency

---

# 🚀 5. Scalability & Performance

### Q12. How do you scale Node.js microservices?

👉 Expected:

- Horizontal scaling (containers)
- Load balancer
- Stateless services

---

### Q13. How do you handle high traffic spikes?

👉 Look for:

- Rate limiting
- Queue buffering
- Auto-scaling (Kubernetes HPA)

---

# 🔄 6. Fault Tolerance & Resilience

### Q14. What is Circuit Breaker? How do you implement it?

👉 Node example:

- Library: `opossum`

---

### Q15. How do you handle retries and failures?

👉 Expected:

- Exponential backoff
- Dead letter queues
- Idempotent APIs

---

# 📊 7. Observability (Very Important for Senior Roles)

### Q16. How do you implement logging in microservices?

👉 Expected:

- Structured logging (pino, winston)
- Correlation ID

---

### Q17. How do you trace requests across services?

👉 Strong answer:

- Distributed tracing (OpenTelemetry)
- Tools: Jaeger, Zipkin

---

### Q18. What metrics do you monitor?

👉 Key metrics:

- Latency
- Throughput
- Error rate (Golden Signals)

---

# 🧪 8. Testing Strategy

### Q19. How do you test microservices?

👉 Answer:

- Unit tests (Vitest/Jest)
- Integration tests
- Contract testing (Pact)

---

### Q20. How do you mock external services?

👉 Expected:

- WireMock / MSW
- Test containers

---

# 🐳 9. DevOps & Deployment

### Q21. How do you deploy Node.js microservices?

👉 Expected:

- Docker + Kubernetes
- CI/CD pipelines (GitHub Actions, Jenkins)

---

### Q22. How do you manage configuration?

👉 Answer:

- Environment variables
- Config services (Vault, AWS SSM)

---

# 🧩 10. System Design Questions (High Signal)

### Q23. Design a URL Shortener using microservices

👉 Expect:

- API service
- Hashing service
- DB design
- Caching (Redis)

---

### Q24. Design an E-commerce system

👉 Services:

- User
- Order
- Payment
- Inventory

---

### Q25. How would you migrate a monolith Node.js app to microservices?

👉 Steps:

- Identify bounded contexts
- Strangle pattern
- Incremental migration

---

# 🔥 Bonus: Real-World Deep-Dive Questions

### Q26. How do you handle versioning of APIs?

- URI versioning (/v1)
- Header versioning

---

### Q27. What are common anti-patterns?

👉 Important:

- Shared DB
- Chatty services
- Over-splitting services

---

### Q28. How do you ensure idempotency?

👉 Example:

- Idempotency keys
- Safe retries
