---
name: pattern-scout
description: AI agent design pattern search and recommendation. Find the right pattern among 127 proven patterns. Use when (1) starting agent design, (2) solving specific problems, (3) comparing patterns, (4) looking up pattern details, (5) questions like "which pattern should I use?"
---

# Pattern Scout - AI Agent Design Pattern Guide

Search and recommend from 127 proven AI agent design patterns.

## Data Location

- **Index**: `references/patterns-index.md` - Full pattern summary list
- **Details**: `references/patterns/{category}.md` - Detailed patterns by category

## Categories (8)

| Category | File | Description |
|----------|------|-------------|
| Orchestration & Control | `orchestration-control.md` | Agent coordination, planning, execution control |
| Context & Memory | `context-memory.md` | Context management, memory, RAG |
| Feedback Loops | `feedback-loops.md` | Self-improvement, iteration, feedback |
| Learning & Adaptation | `learning-adaptation.md` | Learning, adaptation, optimization |
| Reliability & Eval | `reliability-eval.md` | Reliability, evaluation, testing |
| Security & Safety | `security-safety.md` | Security, safety, guardrails |
| Tool Use & Environment | `tool-use-environment.md` | Tool usage, environment interaction |
| UX & Collaboration | `ux-collaboration.md` | User experience, collaboration |

## Workflow

### 1. Pattern Search/Recommendation

When user describes a problem or situation:

1. Read `references/patterns-index.md`
2. Find patterns matching the problem/requirements
3. Recommend 3-5 relevant patterns with summaries
4. Read category file for detailed info if needed

### 2. Pattern Detail Lookup

When user asks about a specific pattern:

1. Find the pattern's category in `references/patterns-index.md`
2. Read details from `references/patterns/{category}.md`
3. Provide problem, solution, pros/cons, diagram

### 3. Pattern Comparison

When user requests pattern comparison:

1. Read detailed info for each pattern
2. Create comparison table:
   - Problem-solving approach
   - Suitable situations
   - Pros/Cons
   - Complexity/Cost

## Output Format

### Pattern Recommendation

```
## Recommended Patterns

### 1. [Pattern Name]
- **Category**: ...
- **Summary**: ...
- **Why it fits**: ...

### 2. [Pattern Name]
...

Ask for details on any pattern you'd like to explore further.
```

### Pattern Detail

```
## [Pattern Name]

**Category**: ... | **Status**: ...

### Problem
...

### Solution
...

### When to Use
- ...

### Pros
- ...

### Cons
- ...

### Diagram
(Mermaid diagram if available)
```

### Pattern Comparison

```
## Pattern Comparison: [A] vs [B]

| Aspect | A | B |
|--------|---|---|
| Approach | ... | ... |
| Best for | ... | ... |
| Pros | ... | ... |
| Cons | ... | ... |
| Complexity | ... | ... |

### Recommendation
[Contextual recommendation with reasoning]
```

## Common Query Patterns

| Query Type | Recommended Category |
|------------|---------------------|
| "Agent runs too long" | Orchestration & Control |
| "Reduce hallucinations" | Feedback Loops, Reliability |
| "Coordinate multiple agents" | Orchestration & Control |
| "Agent loses context" | Context & Memory |
| "Unstable tool calls" | Tool Use & Environment |
| "Security concerns" | Security & Safety |

## Data Sync

### Automatic Update Check

When user asks to update patterns or says "패턴 업데이트", "update patterns", "sync patterns":

1. Run version check:
   ```bash
   python3 ~/.claude/skills/pattern-scout/scripts/sync_patterns.py --check
   ```

2. If remote has more patterns than local, run sync:
   ```bash
   python3 ~/.claude/skills/pattern-scout/scripts/sync_patterns.py
   ```

3. Report update results to user

### Manual Update

User can also run manually:

```bash
python3 ~/.claude/skills/pattern-scout/scripts/sync_patterns.py
```

## Reference

- Source: https://github.com/Gorita/pattern-scout
- Total patterns: 127
- Data format: English (for better pattern matching)
