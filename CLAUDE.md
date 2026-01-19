# CLAUDE.md

AI 에이전트가 이 프로젝트를 효과적으로 작업하기 위한 가이드 문서입니다.

---

## 📋 프로젝트 개요

**Pattern Scout**는 AI 에이전트 디자인 패턴을 빠르게 찾아주는 웹 애플리케이션입니다. [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns)를 기반으로 한국어 번역과 탐색 기능을 제공합니다.

### 주요 특징
- **기술 스택**: Astro + Tailwind CSS + TypeScript
- **데이터 구조**: 117개의 개별 JSON 파일로 패턴 저장 (토큰 효율성)
- **언어 지원**: 한국어/영어 이중 언어 (AI 번역)
- **UI 특징**: 사이드바 네비게이션, 모달 상세 보기, 검색 기능(예정)
- **배포**: GitHub Pages
- **동기화**: upstream 저장소와 자동 동기화 (예정)

### 배포 URL
- **메인**: https://gorita.github.io/pattern-scout (예정)
- **개발**: http://localhost:4321

---

## 🚀 빠른 시작

### 개발 서버 실행
```bash
npm run dev
# → http://localhost:4321
```

### 빌드 & 미리보기
```bash
npm run build
npm run preview
```

### Standalone 빌드 (웹서버 불필요)
```bash
npm run build:standalone
# dist/standalone.html 생성 (팀 공유용)
# 더블클릭으로 바로 실행 가능
```

### AI Manifest 생성
```bash
npm run generate:ai-manifest
# public/ai-manifest.json 생성 (AI 검색용)
```

---

## 📁 프로젝트 구조

```
awesome-agentic-patterns/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Pages 자동 배포
│       └── check-upstream.yml  # upstream 변경 감지 (예정)
├── src/
│   ├── components/             # Astro 컴포넌트
│   │   ├── PatternCard.astro   # 패턴 카드 (요약)
│   │   ├── PatternModal.astro  # 패턴 상세 모달
│   │   ├── SearchBar.astro     # 검색 바 (클라이언트 검색)
│   │   └── LanguageToggle.astro # 언어 토글
│   ├── data/
│   │   ├── patterns/           # 117개의 개별 패턴 JSON 파일 ⭐
│   │   └── ai-manifest.json    # AI 검색용 최적화 데이터 (자동 생성)
│   ├── layouts/
│   │   └── MainLayout.astro    # 메인 레이아웃 (헤더, 푸터)
│   ├── pages/
│   │   └── index.astro         # 메인 페이지 (사이드바 + 그리드)
│   └── styles/
│       └── global.css          # 글로벌 스타일
├── public/                     # 정적 파일 (빌드 시 dist로 복사)
│   ├── favicon.svg
│   ├── pattern-scout-banner.png # 배너 이미지
│   └── ai-manifest.json        # AI 검색용 manifest ⭐
├── examples/
│   └── ai-search-example.html  # AI 검색 프로토타입 (Gemini)
├── patterns/                   # upstream 원본 마크다운 (참조용)
│   └── *.md
├── scripts/
│   ├── build-standalone-html.js # 단일 HTML 파일 생성기 (팀 공유용) ⭐
│   ├── generate-ai-manifest.js  # AI Manifest 생성기 ⭐
│   ├── README.md                # 스크립트 문서
│   └── sync-upstream.sh         # upstream 동기화 (예정)
├── astro.config.mjs
├── tailwind.config.js
└── package.json
```

---

## 🔑 핵심 개념: 개별 파일 방식

### 왜 개별 JSON 파일로 관리하나요?

| 상황 | 기존 방식 (1개 대용량 파일) | 개별 파일 방식 |
|------|----------------------|--------------|
| 새 패턴 추가 | 500KB 파일 전체 읽기 | 5KB 파일 1개만 생성 |
| 기존 패턴 수정 | 500KB 파일 읽고 수정 | 5KB 파일만 읽고 수정 |
| Git diff | 전체 파일 변경으로 표시 | 변경된 파일만 표시 |
| Claude Code 토큰 | 500KB = 약 125,000 토큰 | 5KB = 약 1,250 토큰 (100배 절약) |

### 데이터 구조

```
src/data/
└── patterns/                           # 개별 패턴 파일
    ├── plan-then-execute-pattern.json  # 약 5KB
    ├── reflection.json                 # 약 5KB
    └── ... (117개)
```

---

## 📊 데이터 스키마

### patterns/{id}.json (개별 패턴 파일)

```json
{
  "id": "pattern-id",                    // 필수: URL friendly ID
  "title": "Pattern Title",              // 필수: 영어 제목
  "title_ko": "패턴 제목",                // 필수: 한국어 제목
  "category": "Orchestration & Control", // 필수: 카테고리
  "status": "best-practice",             // 필수: 상태
  "original_url": "https://...",         // 선택: 원본 URL
  "problem": {                           // 선택: 문제 설명
    "en": "Problem description...",
    "ko": "문제 설명..."
  },
  "solution": {                          // 선택: 해결책
    "en": "Solution description...",
    "ko": "해결책 설명..."
  },
  "when_to_use": {                       // 선택: 사용 시기
    "en": ["When...", "When..."],
    "ko": ["...할 때", "...할 때"]
  },
  "pros": {                              // 선택: 장점
    "en": ["Advantage 1", "Advantage 2"],
    "ko": ["장점 1", "장점 2"]
  },
  "cons": {                              // 선택: 단점
    "en": ["Limitation 1", "Limitation 2"],
    "ko": ["단점 1", "단점 2"]
  },
  "ascii_diagram": "ASCII art...",       // 선택: ASCII 다이어그램
  "mermaid_diagram": "graph TD\n...",    // 선택: Mermaid 다이어그램
  "code_example": "// Code...",          // 선택: 코드 예제
  "tags": ["tag1", "tag2"]               // 선택: 태그
}
```

### 필수 필드
- `id`, `title`, `title_ko`, `category`, `status`

### 상태 (Status) 타입
- `best-practice` - 검증된 베스트 프랙티스 (녹색)
- `validated-in-production` - 프로덕션 검증됨 (파란색)
- `established` - 확립된 패턴 (보라색)
- `emerging` - 새롭게 떠오름 (노란색)
- `proposed` - 제안됨 (회색)
- `experimental-but-awesome` - 실험적이지만 유망 (분홍색)
- `rapidly-improving` - 빠르게 개선중 (주황색)

### 카테고리
```typescript
const categoryOrder = [
  'Orchestration & Control',    // 🎛️ 31개
  'Context & Memory',            // 🧠 13개
  'Feedback Loops',              // 🔄 13개
  'Learning & Adaptation',       // 📚 5개
  'Reliability & Eval',          // ✅ 13개
  'Security & Safety',           // 🔒 3개
  'Tool Use & Environment',      // 🔧 26개
  'UX & Collaboration',          // 👥 13개
  'Uncategorized'                // 📁
];
```

---

## 🔄 워크플로우

### Phase 1: 초기 세팅 (완료)

```
✅ 프로젝트 초기화 (Astro + Tailwind CSS)
✅ 원본 repo fork
✅ 웹사이트 템플릿 구축 (사이드바 + 모달)
✅ 모든 패턴 AI 처리 (117개 번역 + 시각화)
✅ 첫 배포 테스트
⬜ GitHub Actions 설정
```

### Phase 2: 업데이트 (자동화 예정)

```
[GitHub Actions: check-upstream.yml]
  │ 매일 실행, upstream 변경 감지
  ▼
[알림 Issue 생성]
  │ "New pattern detected: pattern-name"
  ▼
[Claude Code 실행]
  │
  ├── 1. upstream/patterns/*.md 동기화
  ├── 2. 새 패턴만 AI 처리 (번역 + 시각화)
  ├── 3. JSON 파일 생성/수정
  └── 4. git commit & push
        │
        ▼
[GitHub Actions: deploy.yml]
  │ main 브랜치 push 시 자동 실행
  │
  ├── npm run build
  ├── dist/ 폴더 생성
  └── GitHub Pages 배포
```

---

## 🎯 일반적인 작업

### 1. 🆕 upstream에서 새 패턴 추가하기

upstream 저장소(nibzard/awesome-agentic-patterns)에서 새로운 패턴이 추가되었을 때 우리 사이트에 추가하는 전체 프로세스입니다.

#### Step 1: 원본 마크다운 파일 확인

```bash
# upstream 저장소의 patterns/ 폴더에서 새 패턴 확인
# 예: patterns/new-pattern-name.md
```

원본 마크다운 파일 구조:
```markdown
---
title: Pattern Title
status: emerging
authors: ["author-name"]
based_on: ["url1", "url2"]
category: "Orchestration & Control"
source: https://example.com
tags: ["tag1", "tag2"]
---

# Pattern Title

## Problem
문제 설명...

## Solution
해결책 설명...

## How to use it
사용 방법...

## Trade-offs
### Pros
- 장점 1
- 장점 2

### Cons
- 단점 1
- 단점 2

## References
- [Link 1](url1)
```

#### Step 2: JSON 파일 생성 및 매핑

```bash
# src/data/patterns/{id}.json 생성
# ID는 마크다운 파일명과 동일 (kebab-case)
```

**필수 필드 매핑:**
- `id`: 파일명 (예: `new-pattern-name`)
- `title`: YAML front matter의 `title`
- `category`: YAML의 `category`
- `status`: YAML의 `status`

**선택 필드 매핑:**
- `original_url`: YAML의 `source` 또는 `based_on[0]`
- `problem.en`: "Problem" 섹션 내용
- `solution.en`: "Solution" 섹션 내용
- `when_to_use.en`: "How to use it" 섹션을 배열로 변환
- `pros.en`: "Trade-offs > Pros" 리스트
- `cons.en`: "Trade-offs > Cons" 리스트
- `tags`: YAML의 `tags`

#### Step 3: 한국어 번역 가이드

**번역 원칙:**

1. **어조 및 스타일**
   - 존댓말 사용 (~합니다, ~됩니다)
   - 기술 문서 톤 유지
   - 문장은 간결하고 명확하게

2. **용어 일관성**
   ```
   Agent → 에이전트
   Context → 컨텍스트
   Pattern → 패턴
   Tool → 도구
   Prompt → 프롬프트
   Injection → 인젝션
   Orchestration → 오케스트레이션
   Workflow → 워크플로우
   Spawning → 생성
   Reasoning → 추론
   Feedback → 피드백
   Loop → 루프
   ```

3. **문장 형식**
   - **문제(problem)**: "~합니다" 체
     - 예: "에이전트가 실행 중 프롬프트 인젝션에 취약합니다."
   - **해결책(solution)**: "~합니다" 체
     - 예: "계획 단계를 실행과 분리하여 계획을 잠급니다."
   - **사용 시기(when_to_use)**: 명사형
     - 예: "보안 민감 에이전트", "다단계 작업"
   - **장단점(pros/cons)**: 명사형 또는 "~함"
     - 예: "프롬프트 인젝션 방어", "유연성 감소", "토큰 비용 증가"

4. **번역하지 않는 것**
   - 코드 예제 (`code_example`)
   - ASCII/Mermaid 다이어그램 (영어 라벨 유지)
   - 태그 (`tags`)
   - URL

#### Step 4: 다이어그램 생성

**ASCII 다이어그램 작성:**
```
┌─────────────┐
│   Step 1    │  간단한 플로우는 ASCII로
└──────┬──────┘
       │
┌──────▼──────┐
│   Step 2    │
└─────────────┘
```

**Mermaid 다이어그램 작성:**
```javascript
// 복잡한 플로우는 Mermaid flowchart TD 형식
"flowchart TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[Action 1]
    C -->|No| E[Action 2]"
```

#### Step 5: 코드 예제 작성 (선택)

실제 사용 가능한 코드 스니펫을 추가합니다:
```python
# 간결하고 실용적인 예제
agent = Agent(task='example')
result = agent.execute()
```

#### Step 6: 빌드 및 테스트

```bash
# 빌드 테스트
npm run build

# 로컬 미리보기
npm run preview

# 브라우저에서 확인:
# - 패턴이 올바른 카테고리에 표시되는지
# - 한글/영어 전환이 작동하는지
# - 모달에서 모든 정보가 표시되는지
```

#### Step 7: 커밋

```bash
git add src/data/patterns/new-pattern-name.json
git commit -m "feat: Add [Pattern Title]

- Translate from upstream nibzard/awesome-agentic-patterns
- Add Korean translation
- Include diagrams and code examples

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

---

### 예시: 실제 패턴 추가 과정

**원본 마크다운** (patterns/example-pattern.md):
```markdown
---
title: Example Pattern
status: emerging
category: "Orchestration & Control"
tags: ["example", "demo"]
---

## Problem
Agents struggle with complex tasks requiring multiple steps.

## Solution
Break down tasks into smaller, manageable sub-tasks.

## Trade-offs
### Pros
- Easier to debug
- Better modularity

### Cons
- Coordination overhead
```

**생성할 JSON** (src/data/patterns/example-pattern.json):
```json
{
  "id": "example-pattern",
  "title": "Example Pattern",
  "title_ko": "예제 패턴",
  "category": "Orchestration & Control",
  "status": "emerging",
  "problem": {
    "en": "Agents struggle with complex tasks requiring multiple steps.",
    "ko": "에이전트가 여러 단계가 필요한 복잡한 작업에 어려움을 겪습니다."
  },
  "solution": {
    "en": "Break down tasks into smaller, manageable sub-tasks.",
    "ko": "작업을 더 작고 관리 가능한 하위 작업으로 나눕니다."
  },
  "pros": {
    "en": ["Easier to debug", "Better modularity"],
    "ko": ["디버깅 용이", "모듈성 향상"]
  },
  "cons": {
    "en": ["Coordination overhead"],
    "ko": ["조정 오버헤드"]
  },
  "tags": ["example", "demo"]
}
```

---

### 2. 수동으로 새 패턴 추가 (upstream 없이)

```bash
# JSON 파일 직접 생성
cat > src/data/patterns/my-new-pattern.json << 'EOF'
{
  "id": "my-new-pattern",
  "title": "My New Pattern",
  "title_ko": "나의 새 패턴",
  "category": "Orchestration & Control",
  "status": "proposed",
  "problem": {
    "en": "Problem description...",
    "ko": "문제 설명..."
  },
  "solution": {
    "en": "Solution description...",
    "ko": "해결책 설명..."
  },
  "tags": ["custom"]
}
EOF

# 빌드 및 커밋
npm run build && npm run preview
git add src/data/patterns/my-new-pattern.json
git commit -m "feat: Add custom pattern"
```

### 3. 기존 패턴 수정

```bash
# 1. 해당 JSON 파일만 읽기 (토큰 절약!)
cat src/data/patterns/reflection.json

# 2. 수정
# Edit tool 사용

# 3. 빌드 테스트
npm run build

# 4. 커밋
git add src/data/patterns/reflection.json
git commit -m "fix: Update reflection pattern description"
git push
```

### 4. 카테고리 추가

```astro
// src/pages/index.astro

// 1. categoryOrder 배열에 추가
const categoryOrder = [
  'Orchestration & Control',
  'Context & Memory',
  // ... 기존 카테고리
  'New Category'  // 추가
];

// 2. categoryIcons 객체에 이모지 추가
const categoryIcons: Record<string, string> = {
  // ... 기존 아이콘
  'New Category': '🆕'
};
```

### 5. UI 컴포넌트 수정

```bash
# 컴포넌트 위치
src/components/PatternCard.astro      # 카드 UI
src/components/PatternModal.astro     # 모달 UI
src/components/SearchBar.astro        # 검색 바 (미구현)
src/components/LanguageToggle.astro   # 언어 토글

# 레이아웃
src/layouts/MainLayout.astro          # 헤더, 푸터

# 메인 페이지
src/pages/index.astro                 # 사이드바, 그리드, 모달 로직
```

---

## 🔍 언어 전환 메커니즘

### LocalStorage 키
```javascript
// 저장 키: 'aap-language'
// 값: 'ko' 또는 'en'
```

### HTML 구조
```html
<!-- 기본값: 한국어 표시 -->
<span data-lang="ko">한국어 텍스트</span>
<span data-lang="en" style="display:none;">English text</span>
```

### JavaScript 로직
```javascript
// src/components/LanguageToggle.astro
function getCurrentLang() {
  return localStorage.getItem('aap-language') || 'ko';
}

function setLang(lang) {
  localStorage.setItem('aap-language', lang);

  // 모든 언어 요소 업데이트
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.dataset.lang === lang ? '' : 'none';
  });

  // 커스텀 이벤트 발생 (모달 업데이트용)
  window.dispatchEvent(new CustomEvent('languageChange', {
    detail: { lang }
  }));
}

// src/pages/index.astro (모달 로직)
window.addEventListener('languageChange', (e) => {
  if (currentOpenPatternId) {
    openModal(currentOpenPatternId); // 모달 다시 열어서 언어 업데이트
  }
});
```

---

## 🐛 디버깅 가이드

### 패턴이 표시되지 않을 때

1. **JSON 파일 경로 확인**
   ```bash
   ls src/data/patterns/{id}.json
   ```

2. **JSON 구조 유효성 검증**
   ```bash
   cat src/data/patterns/{id}.json | jq .
   ```

3. **브라우저 콘솔 확인**
   ```javascript
   console.log(window.patternsData);  // 모든 패턴 데이터
   console.log(window.patternsData.find(p => p.id === 'pattern-id'));
   ```

### 언어 전환이 작동하지 않을 때

1. **localStorage 확인**
   ```javascript
   localStorage.getItem('aap-language')  // 'ko' 또는 'en'
   ```

2. **data-lang 속성 확인**
   ```javascript
   document.querySelectorAll('[data-lang]').length  // 0이 아니어야 함
   ```

3. **이벤트 확인**
   ```javascript
   window.addEventListener('languageChange', e => {
     console.log('Language changed:', e.detail.lang);
   });
   ```

### 모달이 열리지 않을 때

1. **패턴 데이터 확인**
   ```javascript
   window.patternsData  // 배열이어야 함
   ```

2. **data-pattern-id 확인**
   ```html
   <div class="pattern-card" data-pattern-id="plan-then-execute-pattern">
   ```

3. **JavaScript 에러 확인**
   - 브라우저 개발자 도구 → Console

### 빌드 에러

1. **TypeScript 타입 에러**
   ```bash
   npm run build
   # 에러 메시지 확인
   ```

2. **Astro 설정 확인**
   ```bash
   cat astro.config.mjs
   ```

3. **의존성 재설치**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 📝 작업 시 주의사항

### 새 패턴 추가 시
- ✅ **ID 규칙**: kebab-case, 영문 소문자와 하이픈만 사용
- ✅ **번역 일관성**: 기존 패턴의 용어와 어조 유지
- ✅ **필수 필드**: id, title, title_ko, category, status는 반드시 포함
- ⚠️ **독자적 번역**: 다른 사이트 번역을 복사하지 말고 직접 번역
- ⚠️ **원본 출처**: original_url에 upstream 원본 또는 논문 링크 포함

### 토큰 효율성
- ✅ **개별 파일만 읽기**: 필요한 패턴 파일만 Read
- ✅ **Glob 사용**: `src/data/patterns/*.json` 패턴으로 검색
- ❌ **여러 파일 동시 읽기**: 필요한 것만 선택적으로 읽기

### 언어 관련
- ⚠️ **localStorage 키**: 반드시 `'aap-language'` 사용 (다른 키 사용 금지)
- ⚠️ **기본 언어**: 한국어 (`'ko'`)
- ⚠️ **data-lang 속성**: 모든 다국어 텍스트에 필수
- ⚠️ **번역 품질**: 존댓말, 기술 문서 톤, 용어 일관성 유지

### Git 워크플로우
- ✅ **의미 있는 커밋**: `feat:`, `fix:`, `docs:` 등 prefix 사용
- ✅ **Co-Authored-By**: 커밋 메시지에 항상 포함
  ```
  feat: Add new pattern

  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
  ```

---

## 🚀 배포

### GitHub Pages 자동 배포

**트리거**: `main` 브랜치에 push

**워크플로우**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 배포 전 체크리스트

- [ ] `npm run build` 성공
- [ ] `npm run preview` 로컬 확인
- [ ] 모든 패턴 표시 확인
- [ ] 언어 전환 테스트 (ko ↔ en)
- [ ] 모바일 반응형 확인
- [ ] 사이드바 네비게이션 작동 확인
- [ ] 모달 열기/닫기 확인

---

## 📦 Standalone 빌드 (팀 공유용)

팀원에게 공유할 수 있는 단일 HTML 파일을 생성합니다.

### 생성 방법
```bash
npm run build:standalone
```

- **결과물**: `dist/standalone.html` (단일 파일)
- **실행**: 더블클릭으로 바로 열림 (웹서버 불필요)
- **기능**: 모든 기능 포함 (사이드바, 검색, 언어 전환, 모달)

### Astro 빌드와의 차이

| 항목 | Astro 빌드 | Standalone 빌드 |
|------|-----------|----------------|
| 명령어 | `npm run build` | `npm run build:standalone` |
| 결과물 | `dist/` 폴더 (여러 파일) | `dist/standalone.html` (1개) |
| 실행 | 웹서버 필요 | 더블클릭으로 바로 열림 |
| 용도 | GitHub Pages 배포 | 팀 공유, 오프라인 사용 |

---

## 🤖 AI 검색 Manifest

AI가 패턴을 검색할 수 있도록 최적화된 manifest 파일을 자동 생성합니다.

### 생성 방법

```bash
npm run generate:ai-manifest
```

- **입력**: `src/data/patterns/*.json` (117개 패턴)
- **출력**: `public/ai-manifest.json` (146KB, ~37K 토큰)
- **배포**: `dist/ai-manifest.json` (빌드 시 자동 복사)

### 생성 시점

- 새 패턴 추가 후
- 기존 패턴의 description, problem, solution 수정 후
- AI 검색 기능 개발 전

### 데이터 구조

개별 패턴 파일을 AI가 읽기 좋게 변환:

```json
{
  "id": "pattern-id",
  "title": "Pattern Title",
  "title_ko": "패턴 제목",
  "category": "Orchestration & Control",
  "description": "문제와 해결책 요약 (200자)",
  "problem": "문제 전문",
  "solution": "해결책 전문",
  "when_to_use": ["사용 시기..."],
  "pros": ["장점..."],
  "cons": ["단점..."],
  "tags": ["tag1", "tag2"]
}
```

AI 검색 구현 예제는 `examples/ai-search-example.html` 참고.

---

## 🔮 향후 확장 계획

### 우선순위 높음
- [ ] **Pagefind 검색 통합**: 빌드타임 인덱싱
- [ ] **GitHub Actions**: upstream 자동 동기화
- [ ] **다크모드**: 테마 토글

### 우선순위 중간
- [ ] **AI 시맨틱 검색**: Anthropic API 클라이언트 사이드
- [ ] **즐겨찾기**: localStorage 기반
- [ ] **패턴 관계 그래프**: Mermaid 또는 D3.js

### 우선순위 낮음
- [ ] **PDF 내보내기**: 개별 패턴 또는 전체
- [ ] **댓글 시스템**: GitHub Discussions 통합
- [ ] **통계 대시보드**: 카테고리별 분포, 상태별 분포 등

---

## 📚 참고 자료

### 공식 문서
- [Astro 문서](https://docs.astro.build/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Mermaid 문서](https://mermaid.js.org/)
- [Pagefind 문서](https://pagefind.app/)

### 원본 프로젝트
- [nibzard/awesome-agentic-patterns](https://github.com/nibzard/awesome-agentic-patterns)
- [원본 웹사이트](https://agentic-patterns.com/)

### 관련 아티클
- [What Sourcegraph learned building AI coding agents](https://www.nibzard.com/ampcode)

---

## 🆘 문제 해결

### 이슈 발생 시

1. **이 문서 확인**: 디버깅 가이드 섹션
2. **브라우저 콘솔**: 개발자 도구 → Console
3. **빌드 로그**: `npm run build` 에러 메시지
4. **GitHub Issues**: 새 이슈 생성

### 일반적인 문제

| 문제 | 원인 | 해결 |
|-----|------|------|
| 패턴이 안 보임 | JSON 구조 오류 | jq로 검증 |
| 언어 전환 안됨 | localStorage 키 오류 | `'aap-language'` 확인 |
| 모달 안 열림 | window.patternsData 없음 | 브라우저 콘솔 확인 |
| 빌드 실패 | TypeScript 에러 | npm run build 로그 확인 |

---

**마지막 업데이트**: 2025-01-19
**버전**: 1.3.0
**상태**: 프로덕션 준비 완료

---

## 📝 변경 이력

### v1.3.0 (2025-01-19)
- Standalone 빌드 추가 (`npm run build:standalone`)
- 웹서버 없이 실행 가능한 단일 HTML 파일 생성
- 팀 공유 및 오프라인 사용 지원

### v1.2.0 (2025-01-19)
- AI 검색 Manifest 생성기 추가 (`npm run generate:ai-manifest`)
- `public/ai-manifest.json` 자동 생성
- `examples/ai-search-example.html` 프로토타입 추가

### v1.1.0 (2025-01-19)
- upstream에서 새 패턴 추가 가이드 추가
- 한국어 번역 가이드라인 상세화
- 용어 일관성 테이블 추가
- 실제 예시 추가

### v1.0.0 (2025-01-19)
- 초기 문서 작성
- 프로젝트 구조 및 데이터 스키마 정의
- 디버깅 가이드 및 워크플로우 문서화
