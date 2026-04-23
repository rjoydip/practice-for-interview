# ML Fundamentals + Software + Infra

---

# 🧠 ML FUNDAMENTALS (What Interviewers Expect)

---

## 1. Data preprocessing & feature engineering

### Steps:

- Handle missing values
- Normalize/standardize
- Encode categorical variables
- Feature selection

### Insight:

> Better features > better models

---

## 2. SQL vs NoSQL for AI workloads

| SQL                | NoSQL             |
| ------------------ | ----------------- |
| Structured data    | Unstructured data |
| Strong consistency | Flexible schema   |

### Use:

- SQL → analytics, joins
- NoSQL → logs, embeddings, events

---

## 3. Diagnosing model performance issues

### Checklist:

- Data quality
- Feature issues
- Overfitting/underfitting
- Hyperparameters
- Training bugs

---

## 4. Latency vs Throughput

### For personal assistant:

👉 Optimize **latency**, not throughput

- User cares about response time
- Not batch processing

---

## 5. Data parallelism vs single request

🚫 Don’t use data parallelism for one request

👉 It’s useful for:

- Training
- Batch inference

---

## 6. Bias-Variance Tradeoff

- High bias → underfitting
- High variance → overfitting

👉 Goal:
Balance both

---

## 7. Why neural networks struggle with tabular data

- Tabular = structured relationships
- Tree-based models (XGBoost) often better

---

## 8. Handling imbalanced datasets

### Techniques:

- Oversampling
- Undersampling
- Class weights
- Synthetic data (SMOTE)

---

## 9. RNN vs LSTM

| RNN                 | LSTM                  |
| ------------------- | --------------------- |
| Short memory        | Long memory           |
| Vanishing gradients | Solves gradient issue |

---

## 10. Regularization

| Type    | Effect              |
| ------- | ------------------- |
| L1      | Sparsity            |
| L2      | Weight shrinkage    |
| Dropout | Prevent overfitting |

---

## 11. Feature scaling

- **Normalization** → [0,1]
- **Standardization** → mean=0, std=1

👉 Needed for:

- Gradient-based models

---

## 12. Cosine similarity (important for embeddings)

Formula:

\cos(\theta)=\frac{A \cdot B}{|A||B|}

Used in:

- Semantic search
- Vector DBs

---

# 🧑‍💻 SOFTWARE ENGINEERING (Very Practical)

---

## 13. Race conditions

### Problem:

Multiple threads modify shared state

### Fix:

- Locks
- Atomic operations
- Message queues

---

## 14. Python GIL

- Only one thread executes Python bytecode at a time

👉 Implication:

- Threads ≠ true parallelism (CPU-bound)

---

## 15. Async vs Threading vs Multiprocessing

| Type            | Use case                |
| --------------- | ----------------------- |
| Async           | I/O-bound               |
| Threading       | Lightweight concurrency |
| Multiprocessing | CPU-bound               |

---

## 16. Problems with async

- Deadlocks
- Hard debugging
- Callback hell

---

## 17. Docker

### Why:

- Consistent environments
- Easy deployment

---

## 18. Redis

Used for:

- Caching
- Rate limiting
- Session storage

---

## 19. JavaScript event loop

### Core idea:

- Single-threaded
- Handles async via queue

---

## 20. Calling LLM APIs (production)

### Must handle:

- Retries (exponential backoff)
- Timeouts
- Logging
- Rate limits

---

## 21. Debugging in production

### Tools:

- Logs
- Metrics
- Tracing (OpenTelemetry)

👉 You already use this → strong advantage

---

## 22. Memory leaks in Python

### Causes:

- Circular references
- Unreleased resources

---

# 🏗️ INFRASTRUCTURE & MLOPS

---

## 23. AI model deployment system

### Components:

```id="o2ch8o"
Model → API → Load balancer → Monitoring → Logging
```

---

## 24. Distributed training

### Types:

- Data parallelism
- Model parallelism

---

## 25. Data pipeline design

```id="m0twdq"
Ingestion → Processing → Storage → Training → Serving
```

---

## 26. Handling traffic spikes

### Strategies:

- Rate limiting
- Queueing
- Caching
- Autoscaling

---

## 27. Monitoring AI systems

Track:

- Latency
- Error rate
- Token usage
- Drift

---

## 28. Scaling challenges in LLM apps

### Biggest issues:

- Cost
- Latency
- Rate limits
- Context size

---

# 💰 COST & LATENCY OPTIMIZATION (VERY IMPORTANT)

---

## 29. 1M queries/day — cost optimization

### Techniques:

- Cache responses
- Use smaller models
- Reduce tokens
- Batch requests

---

## 30. Reducing token cost

- Short prompts
- Summarization
- Reuse context
- Compress history

---

## 31. Model tiering

```id="o6j0dx"
Simple query → small model
Complex query → large model
```

---

## 32. Multi-layer caching

- Retrieval cache
- Prompt cache
- Response cache

---

## 33. Latency vs Cost vs Quality

### Triangle:

- Low latency → small model
- High quality → big model
- Low cost → optimize tokens

👉 You balance all three

---

## 34. Reducing latency

- Streaming responses
- Parallel calls
- Smaller models
- KV cache

---

## 35. Throughput bottleneck

👉 Memory (KV cache)

---

## 36. Prompt compression

- Summarize context
- Remove redundancy

---

## 37. Benchmarking pipelines

Track:

- Time per step
- Bottlenecks
- Token usage

---

# 🔥 FINAL SENIOR-LEVEL INSIGHTS

---

## 1. Real-world AI systems look like this:

```id="u5f5jn"
Frontend
 ↓
API Layer
 ↓
Orchestrator
 ↓
RAG / Agent System
 ↓
LLM APIs
 ↓
Caching + Monitoring
```

---

## 2. Biggest mistakes candidates make:

❌ Over-focus on models
❌ Ignore evaluation
❌ Ignore cost
❌ Ignore system design

---

## 3. What interviewers REALLY want:

👉 Can you:

- Build reliable systems?
- Debug failures?
- Optimize cost?
- Scale to production?

---

## 4. Your advantage (based on your background)

You already have:

- Backend expertise
- Distributed systems knowledge
- Observability (OpenTelemetry)

👉 You’re closer to **AI Engineer (senior)** than most candidates
