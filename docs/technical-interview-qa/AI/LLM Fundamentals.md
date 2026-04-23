# LLM FUNDAMENTALS

---

## 1. How do LLMs work?

LLMs (Large Language Models) are **probabilistic next-token predictors** trained on massive text datasets.

### Core idea:

Given a sequence of tokens:

```
"I love programming in"
```

Model predicts probability distribution:

```
Python: 0.42
JavaScript: 0.30
Rust: 0.10
...
```

### Training process:

1. Tokenize text
2. Feed into Transformer
3. Predict next token
4. Compute loss (cross-entropy)
5. Backpropagate

### Key insight:

LLMs **don’t “understand” language like humans**—they learn statistical patterns.

---

## 2. How do Transformers work?

Transformers replaced RNNs/CNNs by using **attention instead of recurrence**.

### Pipeline:

```
Input → Tokenization → Embedding → Positional Encoding →
Multi-head Attention → Feed Forward → Output
```

### Why they work:

- Capture **long-range dependencies**
- Fully parallelizable
- Scales efficiently

---

## 3. What is tokenization?

Tokenization = converting text into smaller units (tokens).

Example:

```
"ChatGPT is great"
→ ["Chat", "G", "PT", " is", " great"]
```

### Impact:

- Affects **cost (tokens billed)**
- Affects **performance (rare tokens = worse understanding)**
- Affects **context window usage**

---

## 4. Pre-training vs Fine-tuning

| Aspect | Pre-training   | Fine-tuning     |
| ------ | -------------- | --------------- |
| Data   | Huge corpus    | Domain-specific |
| Goal   | Learn language | Specialize      |
| Cost   | Very high      | Moderate        |

### Example:

- Pre-training → general knowledge
- Fine-tuning → medical chatbot

---

## 5. Context Window

The **max tokens model can process at once**

### Limitation:

- Older tokens get truncated
- Cannot "remember" beyond window

### Workarounds:

- Chunking
- RAG
- Summarization

---

## 6. Scaling Laws

Scaling laws show:

```
Performance ∝ (model size, data size, compute)
```

### Why it matters:

- Bigger models → better generalization
- Predict performance improvements before training

---

## 7. Temperature & Top-p

### Temperature:

Controls randomness

- 0 → deterministic
- 1 → balanced
- > 1 → creative

### Top-p (nucleus sampling):

Pick smallest set of tokens whose cumulative prob ≥ p

---

## 8. Few-shot & Chain-of-Thought

### Few-shot:

Provide examples:

```
Q: 2+2 → 4
Q: 3+3 → 6
Q: 5+5 → ?
```

### Chain-of-thought:

Encourage reasoning:

```
"Let's think step by step"
```

---

## 9. KV Cache

Stores attention keys/values from previous tokens.

### Benefit:

- Avoid recomputing attention
- Speeds up inference significantly

---

## 10. GenAI vs Traditional Programming

| Traditional   | GenAI         |
| ------------- | ------------- |
| Deterministic | Probabilistic |
| Rule-based    | Data-driven   |
| Exact outputs | Approximate   |

### Example:

- Traditional: regex parser
- GenAI: extract entities from messy text

---

## 11. Ensuring Accuracy in LLM Workflows

### Techniques:

- RAG
- Validation layers
- Structured outputs (JSON schema)
- Multi-step pipelines
- Guardrails

---

## 12. What is RAG?

**Retrieval-Augmented Generation**

### Pipeline:

```
Query → Embed → Retrieve docs → Inject context → LLM generates answer
```

---

## 13. Embeddings

Vector representation of text:

```
"dog" → [0.21, -0.33, 0.89...]
```

### Use:

- Semantic search
- Clustering
- Similarity

---

## 14. Chunking

Split large documents into smaller pieces.

### Strategies:

- Fixed size
- Semantic chunking
- Sliding window

---

## 15. Discriminative vs Generative Models

| Type           | Example             | Task           |
| -------------- | ------------------- | -------------- |
| Discriminative | Logistic Regression | Classification |
| Generative     | GPT                 | Generate data  |

---

## 16. Graph RAG

Uses **knowledge graphs** instead of flat chunks.

### Benefit:

- Better reasoning
- Handles relationships

---

## 17. Reflection in Agents

Agent evaluates its own output:

```
Step 1 → Generate
Step 2 → Critique
Step 3 → Improve
```

---

## 18. KL Divergence

Measures difference between distributions:

```
KL(P || Q)
```

Used in:

- Model training
- RLHF

---

## 19. Symbolic vs Connectionist AI

| Symbolic    | Connectionist   |
| ----------- | --------------- |
| Rules       | Neural networks |
| Logic-based | Data-driven     |

---

## 20. Text Summarization Types

- Extractive → pick sentences
- Abstractive → generate summary

---

## 21. Memory Management in LLMs

- Short-term: context window
- Long-term: vector DB
- External memory: DB/cache

---

## 22. Self-Attention vs Multi-head

### Self-attention:

Single attention mechanism

### Multi-head:

Multiple attention heads → capture different patterns

---

## 23. Grouped Query Attention (GQA)

Reduces compute by sharing keys/values across heads.

---

## 24. Tokenization Methods

| Method     | Description          |
| ---------- | -------------------- |
| BPE        | Merge frequent pairs |
| WordPiece  | Probabilistic        |
| Char-level | Each char            |

---

## 25. Transformer Architectures

| Type            | Example | Use            |
| --------------- | ------- | -------------- |
| Encoder         | BERT    | Classification |
| Decoder         | GPT     | Generation     |
| Encoder-Decoder | T5      | Translation    |

---

## 26. Why Decoder-only dominates?

- Simpler
- Scales better
- Works for most tasks via prompting

---

## 27. Positional Encoding

Adds order information:

```
Token + Position vector
```

---

## 28. Benchmarks

| Benchmark | Measures  |
| --------- | --------- |
| MMLU      | Knowledge |
| BigBench  | Reasoning |
| HumanEval | Coding    |

---

## 29. RLHF vs DPO

| RLHF               | DPO                 |
| ------------------ | ------------------- |
| Complex            | Simpler             |
| Needs reward model | Direct optimization |

---

## 30. Mixture of Experts (MoE)

Only some model parts activated per input.

### Benefit:

- Huge model capacity
- Lower compute per request

---

## 31. Autoregressive Decoding

Generate token-by-token:

```
y₁ → y₂ → y₃ ...
```

---

## 32. Decoding Strategies

- Greedy
- Beam search
- Top-k
- Top-p

---

## 33. FlashAttention

Optimized attention:

- Reduces memory usage
- Faster GPU performance

---

## 34. Why inference is memory-bounded

- KV cache grows with sequence
- GPU memory limits throughput

---

## 35. Stop Sequences

Define when to stop generation:

```
["\n\n", "END"]
```

---

## 36. Long Context Handling

- Chunking
- RAG
- Sliding window

---

## 37. Tokenizer Risks in Domain Data

- Medical/legal terms split incorrectly
- Leads to:
  - Poor embeddings
  - Hallucinations
