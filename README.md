# Practice for Interview

This repository contains **JavaScript** and **TypeScript** code snippets, examples, tricky concepts, and technical knowledge documentation commonly encountered in technical interviews.

## Project Structure

```
practice-for-interview/
├── src/
│   ├── concepts/          # Core language concepts and features
│   │   ├── generator/   # Generator functions and iterators
│   │   ├── map/        # Map data structure
│   │   ├── object/     # Object manipulation (Proxy)
│   │   ├── oop/        # Object-oriented programming
│   │   └── exp_opr/    # Expression operators
│   │
│   ├── examples/         # Practical coding problems and algorithms
│   │   ├── anagram/    # Anagram checking algorithms
│   │   ├── palindrome/ # Palindrome checking
│   │   ├── flatten_array.ts
│   │   ├── length_of_longest_substring.ts
│   │   └── reverse_words_capitalize.ts
│   │
│   └── js-tricks/       # JavaScript runtime behaviors and quirks
│       ├── event_loop_order.ts      # setTimeout, setImmediate, Promise order
│       ├── floating_point_precision.ts
│       ├── logical_or_falsy.ts     # || vs ?? operators
│       └── timing_nexttick_setimmediate.ts
│
└── docs/
    └── technical-interview-qa/
        ├── AI/                      # AI/ML/LLM fundamentals
        │   ├── Agents & Tool Use.md
        │   ├── Evaluatoon & Metrics.md
        │   ├── Fine-tuning & Tranning.md
        │   ├── LLM Fundamentals.md
        │   ├── ML Fundamentals + Software + Infra.md
        │   └── RAG system.md
        │
        ├── DevOps/
        │   └── Kubernetes Interview Questions & Answers.md
        │
        ├── Microservice/
        │   ├── API Gateway Platform – Full Architecture (Bun + Elysia).md
        │   ├── Saga Pattern.md
        │   └── saga-pattern-choreography.js
        │
        ├── Node/
        │   ├── Complete Login System - Learning Documentation.md
        │   ├── Simple RBAC.md
        │   └── simple-rbac.js
        │
        ├── Redis/
        │   └── Basic Interview Questions & Answers.md
        │
        ├── System Design/
        │   └── Basic of System Design & Architecture.md
        │
        └── backend-qa.md           # Backend interview Q&A
```

## Contents Overview

### src/concepts/

Core JavaScript/TypeScript language concepts.

| File/Folder                          | Description                              |
| ------------------------------------ | ---------------------------------------- |
| `generator/basic.ts`                 | Basic generator function usage           |
| `generator/class_symbol_iterator.ts` | Custom iterators using Symbol            |
| `generator/log_generator.ts`         | Log generator pattern                    |
| `map/basic.ts`                       | Map data structure operations            |
| `map/union.ts`                       | Set/Map union operations                 |
| `object/proxy.ts`                    | Proxy object for intercepting operations |
| `oop/method_overloading.ts`          | Method overloading patterns              |
| `exp_opr/void.ts`                    | void operator behavior                   |

### src/examples/

Practial algorithm implementations for coding problems.

| File/Folder                          | Description                           |
| ------------------------------------ | ------------------------------------- |
| `anagram/is_anagram.ts`              | Anagram check using sort              |
| `anagram/is_anagram_by_frequency.ts` | Anagram check using frequency counter |
| `palindrome/palindrome.ts`           | Palindrome check using reverse        |
| `palindrome/palindrome_with_loop.ts` | Palindrome check using loop           |
| `flatten_array.ts`                   | Flatten nested arrays                 |
| `length_of_longest_substring.ts`     | Longest substring without repeats     |
| `reverse_words_capitalize.ts`        | Reverse words and capitalize          |

### src/js-tricks/

Demonstrations of JavaScript runtime quirks and tricky behaviors.

| File                              | Description                                                    |
| --------------------------------- | -------------------------------------------------------------- |
| `event_loop_order.ts`             | Event loop phases: nextTick, Promise, setTimeout, setImmediate |
| `floating_point_precision.ts`     | 0.1 + 0.2 !== 0.3 demonstration                                |
| `logical_or_falsy.ts`             | \|\| vs ?? for handling falsy values                           |
| `timing_nexttick_setimmediate.ts` | process.nextTick vs setImmediate                               |

### docs/technical-interview-qa/

Comprehensive interview preparation documentation.

| Folder           | Topics Covered                                                 |
| ---------------- | -------------------------------------------------------------- |
| `AI/`            | LLM fundamentals, RAG, Agents, Fine-tuning, Evaluation metrics |
| `DevOps/`        | Kubernetes, Docker, Container orchestration                    |
| `Microservice/`  | API Gateway, Saga pattern, Service architecture                |
| `Node/`          | Login system, RBAC, Express.js                                 |
| `Redis/`         | Cache strategies, Redis data structures                        |
| `System Design/` | Scalability, CAP theorem, Load balancing                       |

## Running the Code

```bash
# Run TypeScript files with bun
bun run src/examples/flatten_array.ts

# Or with ts-node
npx ts-node src/examples/flatten_array.ts
```

## Topics Covered

- **JavaScript/TypeScript**: Generators, Proxies, Maps, OOP, Event Loop
- **Algorithms**: String manipulation, Array operations, Anagram/Palindrome checks
- **Backend**: Node.js, Express, Authentication, RBAC
- **System Design**: Scalability, Microservices, Load balancing
- **DevOps**: Docker, Kubernetes, CI/CD
- **AI/ML**: LLMs, RAG, Transformers, Fine-tuning
