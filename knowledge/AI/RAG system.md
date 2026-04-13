# 🚀 RAG System

---

## 1. What is a RAG system?

**Retrieval-Augmented Generation (RAG)** combines:

* **Retrieval system (search)**
* **LLM (generation)**

### End-to-end pipeline:

```
User Query
   ↓
Embedding Model
   ↓
Vector Search (Top-K docs)
   ↓
(Optional) Re-ranking
   ↓
Prompt Construction
   ↓
LLM Generation
   ↓
Post-processing (citations, validation)
```

### Key idea:

> “Don’t rely on model memory → fetch ground truth from external data”

---

## 2. Design a RAG system for a customer support chatbot

### High-level architecture:

```
Frontend (Chat UI)
   ↓
API Gateway
   ↓
Orchestrator Service
   ├── Query Rewriter
   ├── Retriever (Vector DB + BM25)
   ├── Re-ranker
   ├── LLM Generator
   ├── Guardrails
   ↓
Response + Citations
```

---

### 🔹 Data pipeline (offline)

1. Ingest documents (FAQs, manuals, tickets)
2. Clean + normalize
3. Chunk documents
4. Generate embeddings
5. Store in vector DB

---

### 🔹 Online query flow

1. Query rewrite (optional)
2. Embed query
3. Retrieve top-k chunks
4. Re-rank
5. Construct prompt
6. Generate answer
7. Add citations

---

### 🔹 Evaluation

* Retrieval: Recall@k, MRR, NDCG
* Generation: factual accuracy, groundedness
* UX: latency, satisfaction, deflection rate

---

## 3. Enterprise Search System Design

### Requirements:

* Multi-source (Slack, Docs, DBs)
* Low latency (<500ms)
* Access control

### Key additions:

* **Metadata filtering (ACLs)**
* Hybrid search
* Index sharding
* Query routing

---

## 4. Handling Large Documents (PDFs problem)

### Problem:

LLMs can’t handle entire documents.

### Solutions:

* Chunking (semantic > fixed)
* Overlapping windows
* Hierarchical retrieval:

  * Section → paragraph → sentence

---

## 5. Embedding Storage Strategy

### Options:

* Precompute embeddings (recommended)
* Store in vector DB (FAISS, Pinecone, Weaviate)

### Optimization:

* Batch embedding generation
* Deduplicate content
* Cache frequent queries

---

## 6. Hallucination when no context found

### Critical interview question

### Solutions:

* Confidence threshold
* Fallback:

  ```
  "I couldn't find relevant information"
  ```
* Retrieval validation
* Add “answer only from context” constraint

---

## 7. Sparse vs Dense Retrieval

| Type   | Example    | Strength      |
| ------ | ---------- | ------------- |
| Sparse | BM25       | Exact keyword |
| Dense  | Embeddings | Semantic      |

### Use:

* Sparse → legal, exact match
* Dense → natural language

👉 Best practice: **Hybrid search**

---

## 8. Hybrid Search

Combine:

```
Score = α * BM25 + β * Embedding similarity
```

### Why:

* Fix embedding failures (numbers, keywords)

---

## 9. Re-ranking

### Why needed:

Vector search ≠ perfect ranking

### Types:

* **Bi-encoder** → fast, less accurate
* **Cross-encoder** → slow, very accurate

### Flow:

```
Top 50 docs → Cross-encoder → Top 5
```

---

## 10. Common RAG Failure Points

### 🔴 Retrieval issues:

* Wrong chunks
* Missing context
* Poor embeddings

### 🔴 Generation issues:

* Hallucination
* Ignoring context

### 🔴 Data issues:

* Outdated docs
* Noise

---

### Debugging strategy:

1. Check retrieved docs
2. Inspect embeddings
3. Evaluate chunk quality
4. Log prompts + outputs

---

## 11. Protecting Sensitive Data

### Techniques:

* PII masking
* Access control filters
* Encryption
* On-prem vector DB

---

## 12. Vector Databases

Common:

* FAISS → local
* Pinecone → managed
* Weaviate → hybrid
* Milvus → scalable

### Tradeoffs:

* Latency vs control vs cost

---

## 13. Document-wide Context Problem

Example:

> Page 1: “All values in thousands”

### Solution:

* Add metadata to chunks
* Inject global context in prompt
* Use hierarchical chunking

---

## 14. ANN Search & HNSW

### Problem:

Exact nearest neighbor = slow

### Solution:

Approximate search

### HNSW:

* Graph-based index
* Fast lookup
* Trade accuracy for speed

---

## 15. Where Embeddings Fail

### Key cases:

* Negation (“not good”)
* Numbers (“$5M vs $5B”)
* Time (“2020 vs 2024”)

### Fix:

* Hybrid search
* Rule-based filters

---

## 16. Semantic Caching

Cache based on meaning:

```
"What is refund policy?"
"What’s your return policy?"
```

→ Same embedding → reuse answer

### Benefit:

* Reduce cost
* Reduce latency

---

## 17. Multi-turn RAG (Conversation Memory)

### Problem:

Context lost across turns

### Solutions:

* Maintain chat history
* Summarize past turns
* Store conversation embeddings

---

## 18. Tradeoffs in RAG Design

| Tradeoff             | Example                          |
| -------------------- | -------------------------------- |
| Latency vs Accuracy  | Re-ranking                       |
| Chunk size vs Recall | Small = precise, Large = context |
| Cost vs Quality      | GPT-4 vs small models            |

---

## 19. Scaling to 10M+ Documents

### Techniques:

* Sharding vector DB
* Distributed indexing
* Caching hot queries
* Async retrieval

---

## 20. Turning Search → Answer Engine

### Problem:

Search returns docs, not answers

### Solution:

* Summarization layer
* Answer synthesis
* Highlight key spans

---

## 21. RAG Evaluation Metrics

### Retrieval:

* Precision@k
* Recall@k
* MRR
* NDCG

### Generation:

* Faithfulness
* Answer correctness
* Groundedness

---

## 22. Citations & Attribution

### Techniques:

* Return source chunks
* Inline citations:

  ```
  "According to policy doc [1]"
  ```
* Highlight spans

---

## 23. Semantic vs Keyword Failures

Always ask:

> “Is this a retrieval problem or generation problem?”

---

## 24. Latency Optimization in RAG

### Biggest wins:

* Reduce top-k
* Cache embeddings
* Use smaller models for retrieval
* Parallelize retrieval + generation

---

# 🔥 PRODUCTION-READY RAG ARCHITECTURE

```
User
 ↓
API Layer
 ↓
Query Rewriter
 ↓
Retriever (Hybrid)
 ↓
Re-ranker
 ↓
Context Builder
 ↓
LLM (Generation)
 ↓
Guardrails + Validation
 ↓
Response + Citations
```

---

# 🧠 Senior-Level Insights (What Interviewers Love)

### 1. RAG is mostly a **data problem, not model problem**

Bad docs → bad system

---

### 2. Retrieval quality > LLM quality

---

### 3. Observability is critical:

* Log queries
* Track failures
* Store embeddings

---

### 4. Always design fallback:

* No answer
* Escalate to human
