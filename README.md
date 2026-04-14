# Pattern Scout 🔍

![Pattern Scout](./public/pattern-scout-banner.png)

[한국어](./README_KR.md)

**Pattern Scout** is a web application that helps you quickly find the right design patterns when building AI agents. It provides **155 patterns** from [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns) in both Korean and English, with category-based navigation and real-time search.

🌐 **Website**: [https://gorita.github.io/pattern-scout](https://gorita.github.io/pattern-scout)

---

## ✨ Key Features

- 🇰🇷 **Korean/English Support** - Bilingual support for all patterns
- 📂 **Category Organization** - 8 major categories, 155 patterns
- 🗂️ **Sidebar Navigation** - Optimized for desktop/mobile
- 🔍 **Real-time Search** - Search by title, description, tags
- 📊 **Detail Modal** - Problem, solution, diagrams, code examples, pros/cons

---

## 📂 8 Categories

- 🎛️ **Orchestration & Control** (47) - Task decomposition, sub-agent spawning
- 🧠 **Context & Memory** (18) - Sliding window, vector cache
- 🔄 **Feedback Loops** (15) - Compiler, CI, self-healing retry
- 📚 **Learning & Adaptation** (7) - Agent RFT, skill library
- ✅ **Reliability & Eval** (19) - Guardrails, evaluation framework
- 🔒 **Security & Safety** (10) - Isolated VM, PII tokenization
- 🔧 **Tool Use & Environment** (23) - Shell, browser, DB
- 👥 **UX & Collaboration** (16) - Prompt handoff, step-by-step commit

---

## 🚀 Quick Start

### Local Development

```bash
git clone https://github.com/gorita/pattern-scout.git
cd pattern-scout
npm install
npm run dev  # http://localhost:4321
```

### Build & Deploy

```bash
npm run build              # Production build (GitHub Pages)
npm run build:standalone   # Single HTML file (for team sharing)
npm run preview            # Preview build
```

---

## 🤖 Claude Code Skill

Search and get pattern recommendations with the `/pattern-scout` command in Claude Code.

### Installation

```bash
curl -fsSL https://raw.githubusercontent.com/Gorita/pattern-scout/main/scripts/install-skill.sh | bash
```

### Usage

```
/pattern-scout
```

- "Recommend multi-agent collaboration patterns"
- "Tell me more about the Reflection Loop pattern"
- "Compare Plan-Then-Execute vs Sub-Agent Spawning"

### Update Patterns

```bash
python3 ~/.claude/skills/pattern-scout/scripts/sync_patterns.py
```

---

## 🤝 Contributing

We welcome all contributions including pattern additions, translation improvements, and bug fixes.

For detailed guidelines for AI agents, see [CLAUDE.md](./CLAUDE.md).

---

## 📄 License

Apache-2.0 License - Same as [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns)

---

This project is a reimplementation of [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns) using Astro + Tailwind CSS with Korean translation added.
