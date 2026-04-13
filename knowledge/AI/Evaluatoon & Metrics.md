# Evaluatoon & Metrics

---

## 1. What metrics do you use to evaluate LLMs?

### 🔹 Three layers of evaluation:

#### 1. Model-level (offline)

* Perplexity
* BLEU / ROUGE
* Accuracy

#### 2. Task-level

* Exact match
* F1 score
* Retrieval metrics (RAG)

#### 3. Product-level

* User satisfaction
* Task success rate
* Latency

---

### 🔥 Interview insight:

> “Offline metrics ≠ real-world performance”

---

## 2. How do you evaluate a chatbot?

### Multi-dimensional approach:

#### ✅ Correctness

* Is the answer factually correct?

#### ✅ Relevance

* Does it answer the question?

#### ✅ Groundedness

* Is it based on retrieved data?

#### ✅ Safety

* No harmful output

#### ✅ UX

* Response time
* Clarity

---

### Methods:

* Human evaluation
* LLM-as-judge
* Golden datasets

---

## 3. How do you detect hallucinations?

### Techniques:

#### 1. Retrieval comparison

* Check if answer exists in context

#### 2. Self-consistency

* Generate multiple answers → compare

#### 3. Confidence scoring

* Probability-based or heuristic

#### 4. LLM judge

* Ask another model:

  > “Is this answer supported by context?”

---

## 4. How do you mitigate hallucinations?

### Key strategies:

* Use RAG
* Add constraints:

  ```
  "Answer only from provided context"
  ```
* Return “I don’t know” fallback
* Add citations
* Validate outputs

---

## 5. Preventing factual errors in summarization

### Techniques:

* Extractive + abstractive hybrid
* Faithfulness checks
* Compare summary with source

---

## 6. Debugging confident but wrong answers

### Step-by-step:

1. Check retrieved documents
2. Validate embeddings
3. Inspect prompt
4. Check model reasoning
5. Compare with ground truth

---

### Root causes:

* Bad retrieval
* Missing context
* Prompt ambiguity

---

## 7. Explain SHAP, LIME (interpretability)

### SHAP:

* Measures feature contribution using game theory

### LIME:

* Local approximation of model behavior

---

### In LLMs:

Used less directly, but concepts apply in:

* Feature attribution
* Explanation layers

---

## 8. Key evaluation metrics

### 🔹 Perplexity

Measures how well model predicts text

Lower = better

---

### 🔹 BLEU

* Measures overlap with reference
* Used in translation

---

### 🔹 ROUGE

* Measures recall overlap
* Used in summarization

---

### ⚠️ Pitfalls:

* Ignore semantics
* Penalize valid variations

---

## 9. Testing non-deterministic outputs

### Problem:

Same input ≠ same output

---

### Solutions:

* Run multiple times
* Evaluate distribution
* Use tolerance thresholds

---

## 10. Measuring accuracy in generative systems

### Instead of exact match:

* Semantic similarity
* Human evaluation
* Task success

---

## 11. Business metrics (very important)

### Examples:

* Deflection rate (support bots)
* Conversion rate
* Retention
* Cost per query

---

## 12. Monitoring models in production

### Track:

* Latency (p50, p95)
* Error rate
* Token usage
* Hallucination rate
* Drift

---

## 13. Bias & fairness

### Risks:

* Biased training data
* Harmful outputs

---

### Mitigation:

* Balanced datasets
* Bias evaluation sets
* Human review

---

## 14. Time to First Token (TTFT)

### Definition:

Time until first token is generated

---

### Why important:

* Perceived latency
* UX responsiveness

---

## 15. Measuring hallucination rate

### Approach:

1. Create labeled dataset
2. Compare answer vs ground truth
3. Mark unsupported claims

---

### Proxy methods:

* LLM-as-judge
* Retrieval overlap score

---

## 16. “Vibe-based” vs formal evaluation

### Vibe-based:

* Manual testing
* Subjective

### Formal:

* Metrics
* Benchmarks
* Automated pipelines

---

### Interview insight:

> Early stage → vibe-based
> Production → formal evals

---

## 17. Golden dataset

### Definition:

High-quality labeled dataset

---

### Use:

* Regression testing
* Benchmarking

---

### Example:

```id="4u0ix3"
Q: Refund policy?
A: 30 days with receipt
```

---

## 18. Feedback loops (system improvement)

### Sources:

* User feedback
* Logs
* Corrections

---

### Pipeline:

```id="o8yy6q"
User feedback → Data pipeline → Retraining → Evaluation → Deployment
```

---

## 19. Defining success metrics

### Depends on use case:

| Use case     | Metric            |
| ------------ | ----------------- |
| Chatbot      | Deflection rate   |
| Search       | Precision@k       |
| Writing tool | User satisfaction |

---

## 20. A/B testing prompts

### Method:

* Split traffic
* Compare:

  * accuracy
  * engagement
  * latency

---

## 21. Model testing strategies

### 🔹 Canary deployment

* Small % rollout

### 🔹 Shadow testing

* Run new model in parallel

### 🔹 Interleaving

* Compare outputs dynamically

---

## 22. Model calibration

### Problem:

Model is overconfident

---

### Solution:

* Calibrate probabilities
* Add uncertainty estimates

---

## 23. Debugging accuracy drop (real-world scenario)

### Steps:

1. Check data drift
2. Check prompt changes
3. Check retrieval quality
4. Check model version
5. Check infra issues

---

## 24. Regression testing

### Prevent breaking changes:

* Run against golden dataset
* Compare outputs

---

## 25. Building evaluation pipeline

```id="0e5k3x"
Data → Test cases → Metrics → Dashboard → Alerts
```

---

# 🔥 Production Evaluation Stack

```id="nyqg5u"
User Logs
 ↓
Data Labeling
 ↓
Evaluation Pipeline
 ↓
Metrics Dashboard
 ↓
Feedback Loop
 ↓
Model Updates
```

---

# 🧠 Senior-Level Insights

---

### 1. Most important shift:

> “From model performance → system performance”

---

### 2. You don’t improve what you don’t measure

---

### 3. Hallucination is a SYSTEM problem

Not just model problem

---

### 4. Human evaluation is still gold standard

---

### 5. Continuous evaluation > one-time testing