# Agentic Patterns 웹사이트 개발 계획서

## 📋 프로젝트 개요

**목표**: nibzard/awesome-agentic-patterns 데이터를 기반으로 한국어 지원 + AI 시각화가 포함된 정적 웹사이트 구축

**배포 URL**: `https://gorita.github.io/awesome-agentic-patterns/`

---

## 🏗️ 기술 스택

| 구분 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Astro 또는 Next.js (Static Export) | 정적 사이트 최적화 |
| 스타일링 | Tailwind CSS | 빠른 UI 개발 |
| 다이어그램 | Mermaid.js | 원본과 호환 |
| 검색 | Pagefind | 서버리스, 빌드타임 인덱싱 |
| 배포 | GitHub Pages | 무료, 자동화 |

---

## 📁 프로젝트 구조

```
awesome-agentic-patterns/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # push 시 자동 배포
│       └── check-upstream.yml  # 원본 업데이트 알림
├── src/
│   ├── components/
│   │   ├── PatternCard.astro
│   │   ├── AsciiDiagram.astro
│   │   ├── MermaidDiagram.astro
│   │   ├── SearchBar.astro
│   │   └── LanguageToggle.astro
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── data/
│   │   ├── index.json              # 패턴 목록 (메타데이터만)
│   │   └── patterns/               # 개별 패턴 JSON 파일
│   │       ├── context-minimization-pattern.json
│   │       └── ...
│   └── styles/
│       └── global.css
├── patterns/                    # upstream에서 동기화
│   └── *.md
├── scripts/
│   └── sync-upstream.sh        # 동기화 스크립트
├── astro.config.mjs
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🔄 워크플로우

### Phase 1: 초기 세팅 (1회)

```
[Claude Code]
    │
    ├── 1. 프로젝트 초기화
    ├── 2. 원본 repo fork & clone
    ├── 3. 웹사이트 템플릿 구축
    ├── 4. 모든 패턴 AI 처리 (번역 + 시각화)
    ├── 5. GitHub Actions 설정
    └── 6. 첫 배포
```

### Phase 2: 업데이트 (반복)

```
[GitHub Actions: 알림]
    │
    ▼
[내가 확인]
    │
    ▼
[Claude Code 실행]
    │
    ├── upstream 동기화
    ├── 새 패턴 AI 처리
    └── git push
          │
          ▼
[GitHub Actions: 자동 배포]
```

---

## 📊 데이터 구조 (개별 파일 방식)

### 폴더 구조

```
src/data/
├── patterns/
│   ├── context-minimization-pattern.json
│   ├── sub-agent-spawning.json
│   └── ... (각 패턴별 파일, 약 100개)
└── index.json  (전체 목록, 메타데이터만)
```

### index.json (목록용, 약 10KB)

```json
[
  {
    "id": "context-minimization-pattern",
    "title": "Context-Minimization Pattern",
    "title_ko": "컨텍스트 최소화 패턴",
    "category": "Context & Memory"
  },
  {
    "id": "sub-agent-spawning",
    "title": "Sub-Agent Spawning",
    "title_ko": "서브 에이전트 스포닝",
    "category": "Orchestration & Control"
  }
]
```

### patterns/{id}.json (상세 데이터, 각 약 5KB)

```json
{
  "id": "context-minimization-pattern",
  "title": "Context-Minimization Pattern",
  "title_ko": "컨텍스트 최소화 패턴",
  "category": "Context & Memory",
  "original_url": "https://agentic-patterns.com/patterns/context-minimization-pattern/",
  "problem": {
    "en": "User-supplied text lingers in context...",
    "ko": "사용자 입력 텍스트가 컨텍스트에 남아있으면..."
  },
  "solution": {
    "en": "Purge untrusted segments after transforming...",
    "ko": "안전한 중간 형태로 변환 후 신뢰할 수 없는 세그먼트 제거..."
  },
  "ascii_diagram": "User Input ──▶ [Transform] ──▶ Safe Output\n    │              │\n    └────────▶ REMOVE tainted",
  "mermaid_diagram": "flowchart LR\nA[User Input] --> B[Transform]\nB --> C[Remove]\nC --> D[Execute]",
  "code_example": "sql = LLM(\"to SQL\", user_prompt)\nremove(user_prompt)\nrows = db.query(sql)",
  "when_to_use": {
    "en": ["Customer service chat", "Medical Q&A"],
    "ko": ["고객 서비스 챗봇", "의료 Q&A 시스템"]
  },
  "pros": {
    "en": ["Simple", "Prevents injection"],
    "ko": ["간단함", "인젝션 방지"]
  },
  "cons": {
    "en": ["Loses conversational nuance"],
    "ko": ["대화의 뉘앙스 손실"]
  },
  "tags": ["security", "context", "injection-prevention"]
}
```

### 개별 파일 방식의 장점

| 상황 | 이점 |
|------|------|
| 새 패턴 추가 | 새 파일 1개만 생성 (토큰 절약) |
| 기존 패턴 수정 | 해당 파일만 읽고 수정 |
| Git 관리 | 변경된 파일만 diff에 표시 |
| Claude Code 효율 | 필요한 파일만 컨텍스트에 로드 |

---

## ✅ 체크리스트

### 내가 직접 해야 할 작업

- [ ] GitHub에서 nibzard/awesome-agentic-patterns Fork
- [ ] Fork한 repo clone
- [ ] GitHub repo Settings → Pages 활성화
- [ ] (선택) 커스텀 도메인 설정

### Claude Code가 할 작업

- [ ] 프로젝트 구조 생성
- [ ] 웹사이트 컴포넌트 개발
- [ ] 패턴 데이터 AI 처리 (번역 + 시각화)
- [ ] GitHub Actions 워크플로우 작성
- [ ] 빌드 & 배포 테스트

---

## 🕐 예상 소요 시간

| 단계 | 예상 시간 |
|------|----------|
| 초기 세팅 (Fork, Clone) | 10분 |
| 프로젝트 구조 생성 | 30분 |
| 웹사이트 템플릿 개발 | 1-2시간 |
| 패턴 AI 처리 (~100개) | 1-2시간 |
| 테스트 & 배포 | 30분 |
| **총계** | **3-5시간** |

---

## 🚀 향후 확장 가능

- [ ] AI 시맨틱 검색 (Anthropic API 클라이언트 사이드)
- [ ] 다크모드
- [ ] 패턴 간 관계 그래프 시각화
- [ ] 즐겨찾기 기능 (localStorage)
- [ ] PDF 내보내기