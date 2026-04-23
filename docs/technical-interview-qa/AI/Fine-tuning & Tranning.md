# Fine-tuning & Tranning

---

## 1. When would you fine-tune vs use prompt engineering?

### ✅ Use prompt engineering when:

- Task is **general-purpose**
- You can solve with:
  - few-shot examples
  - better instructions

- Data is limited

### ✅ Use fine-tuning when:

- You need:
  - Consistent tone/style
  - Domain specialization
  - Structured outputs at scale

- Prompts become too long/complex

---

### 🔥 Interview answer:

> “Start with prompting → move to RAG → fine-tune only if needed”

---

## 2. Fine-tuning vs RAG

| Fine-tuning                 | RAG                |
| --------------------------- | ------------------ |
| Stores knowledge in weights | External knowledge |
| Expensive to update         | Easy to update     |
| Faster inference            | Slightly slower    |

### Rule:

- **Knowledge changes frequently → RAG**
- **Behavior/style → Fine-tuning**

---

## 3. What is PEFT / LoRA?

**PEFT (Parameter-Efficient Fine-Tuning)** updates only a small subset of weights.

### LoRA (Low-Rank Adaptation):

Instead of updating full weight matrix:

```id="0k3u5r"
W → W + (A × B)
```

Where:

- A, B are small matrices

---

### Benefits:

- 10–100x fewer parameters
- Faster training
- Lower memory usage

---

## 4. What is QLoRA?

QLoRA = LoRA + quantization

### Key idea:

- Store base model in **4-bit precision**
- Train adapters in higher precision

---

### Benefits:

- Train large models on **single GPU**
- Huge cost savings

---

### Tradeoff:

- Slight accuracy drop

---

## 5. RLHF (Reinforcement Learning from Human Feedback)

### Pipeline:

```id="h2u1dz"
1. Pretrained model
2. Supervised Fine-Tuning (SFT)
3. Reward Model (human preferences)
4. PPO optimization
```

---

### Why needed:

- Align model with human expectations
- Reduce harmful outputs

---

## 6. DPO (Direct Preference Optimization)

### Simplified RLHF:

- No reward model
- No PPO

### Directly optimize:

```id="2v1qqq"
Preferred response > Rejected response
```

---

### Comparison:

| RLHF         | DPO     |
| ------------ | ------- |
| Complex      | Simple  |
| Expensive    | Cheaper |
| More control | Easier  |

---

### When to use:

- RLHF → large-scale alignment
- DPO → faster iteration

---

## 7. Instruction Tuning

Fine-tune model on:

```id="i0svyy"
Instruction → Response
```

### Example:

```id="cs2z9x"
"Summarize this text" → "Short summary..."
```

---

### Difference from pre-training:

- Pre-training = next token prediction
- Instruction tuning = task-following

---

## 8. Speculative Decoding

### Problem:

LLM decoding is slow

### Solution:

- Small model predicts tokens
- Large model verifies

---

### Benefit:

- Faster inference
- Same quality

---

## 9. Turning user behavior into training signals

### Signals:

- Accept response → positive
- Edit response → partial negative
- Reject → negative

---

### Use:

- Improve prompts
- Fine-tune model
- Train reward models

---

## 10. Quantization

Reduce precision:

```id="yx1z2g"
FP32 → FP16 → INT8 → INT4
```

---

### Benefits:

- Smaller model
- Faster inference
- Lower memory

---

### Tradeoffs:

- Accuracy loss
- Numerical instability

---

## 11. Model Distillation

### Idea:

Train small model from large model

```id="h4avz1"
Teacher (large) → Student (small)
```

---

### Benefits:

- Faster
- Cheaper
- Deployable on edge

---

## 12. Training pipeline (end-to-end)

```id="6v0t0o"
Data collection
 ↓
Cleaning & filtering
 ↓
Tokenization
 ↓
Pre-training
 ↓
Instruction tuning
 ↓
Alignment (RLHF/DPO)
 ↓
Evaluation
 ↓
Deployment
```

---

## 13. Designing a model for math problems

### Steps:

1. Data:
   - Math datasets
   - Step-by-step solutions

2. Training:
   - Supervised fine-tuning
   - Chain-of-thought examples

3. Post-training:
   - RLHF (correct reasoning)

4. Evaluation:
   - Accuracy
   - Reasoning quality

---

## 14. Scalable training system design

### Key components:

- Distributed training (data/model parallelism)
- GPU clusters
- Checkpointing
- Data pipelines

---

### Challenges:

- GPU memory limits
- Communication overhead
- Fault tolerance

---

## 15. When NOT to fine-tune

🚫 Avoid when:

- Knowledge changes frequently
- Small dataset
- Problem solvable with RAG

---

## 16. Prompt-engineered RAG vs Fine-tuning

### Interview insight:

> “RAG solves knowledge, fine-tuning solves behavior”

---

## 17. Tradeoffs: model size vs performance

| Larger model   | Smaller model |
| -------------- | ------------- |
| Better quality | Faster        |
| Expensive      | Cheap         |

---

## 18. Training vs Inference Optimization

| Training           | Inference          |
| ------------------ | ------------------ |
| Expensive upfront  | Ongoing cost       |
| Better performance | Needs optimization |

---

## 19. Data quality importance

> Garbage in → garbage out

### Key:

- Deduplication
- Filtering toxic data
- Balanced dataset

---

## 20. Evaluation during training

- Loss curves
- Validation datasets
- Human evals

---

# 🔥 Senior-Level Insights

---

1. Most companies DO NOT train LLMs from scratch

They:

- Use APIs
- Fine-tune small models
- Build RAG systems

2. Biggest mistake:

> Fine-tuning when RAG would solve it cheaper

3. Real-world stack:

```id="9ev2y6"
LLM API + RAG + Prompting + Minimal fine-tuning
```

4. LoRA/QLoRA is the industry standard

5. Alignment (RLHF/DPO) matters more than raw capability
