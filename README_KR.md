# Pattern Scout 🔍

![Pattern Scout](./public/pattern-scout-banner.png)

**Pattern Scout**는 AI 에이전트를 구축할 때 적합한 디자인 패턴을 빠르게 찾아주는 웹 애플리케이션입니다. [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns)의 **158개 패턴**을 한국어와 영어로 제공하며, 카테고리별 탐색과 실시간 검색을 지원합니다.

🌐 **웹사이트**: [https://gorita.github.io/pattern-scout](https://gorita.github.io/pattern-scout)

---

## ✨ 주요 특징

- 🇰🇷 **한국어/영어 지원** - 모든 패턴의 이중 언어 제공
- 📂 **카테고리별 정리** - 8개 주요 카테고리, 158개 패턴
- 🗂️ **사이드바 네비게이션** - 데스크톱/모바일 최적화
- 🔍 **실시간 검색** - 제목, 설명, 태그 검색
- 📊 **상세 모달** - 문제, 해결책, 다이어그램, 코드 예제, 장단점

---

## 📂 8개 카테고리

- 🎛️ **Orchestration & Control** (48개) - 태스크 분해, 서브 에이전트 생성
- 🧠 **Context & Memory** (19개) - 슬라이딩 윈도우, 벡터 캐시
- 🔄 **Feedback Loops** (15개) - 컴파일러, CI, 자가 치유 재시도
- 📚 **Learning & Adaptation** (7개) - 에이전트 RFT, 스킬 라이브러리
- ✅ **Reliability & Eval** (19개) - 가드레일, 평가 프레임워크
- 🔒 **Security & Safety** (10개) - 격리된 VM, PII 토큰화
- 🔧 **Tool Use & Environment** (24개) - 셸, 브라우저, DB
- 👥 **UX & Collaboration** (16개) - 프롬프트 핸드오프, 단계별 커밋

---

## 🚀 빠른 시작

### 로컬 실행

```bash
git clone https://github.com/gorita/pattern-scout.git
cd pattern-scout
npm install
npm run dev  # http://localhost:4321
```

### 빌드 및 배포

```bash
npm run build              # 프로덕션 빌드 (GitHub Pages)
npm run build:standalone   # 단일 HTML 파일 생성 (팀 공유용)
npm run preview            # 빌드 미리보기
```

---

## 🤖 Claude Code Skill

Claude Code에서 `/pattern-scout` 명령으로 패턴을 검색하고 추천받을 수 있습니다.

### 설치

```bash
curl -fsSL https://raw.githubusercontent.com/Gorita/pattern-scout/main/scripts/install-skill.sh | bash
```

### 사용법

```
/pattern-scout
```

- "멀티 에이전트 협업 패턴 추천해줘"
- "Reflection Loop 패턴 자세히 알려줘"
- "Plan-Then-Execute vs Sub-Agent Spawning 비교해줘"

### 패턴 업데이트

```bash
python3 ~/.claude/skills/pattern-scout/scripts/sync_patterns.py
```

---

## 🤝 기여

패턴 추가, 번역 개선, 버그 수정 등 모든 기여를 환영합니다.

AI 에이전트를 위한 상세한 가이드는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

---

## 📄 라이선스

Apache-2.0 License - [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns)와 동일

---

이 프로젝트는 [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns)를 기반으로 Astro + Tailwind CSS로 재구현하고 한국어 번역을 추가한 버전입니다.
