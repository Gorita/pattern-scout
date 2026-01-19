# Scripts

이 폴더에는 프로젝트 자동화 스크립트들이 있습니다.

## 📦 build-standalone-html.js

팀 공유용 단일 HTML 파일을 생성합니다.

### 사용법

```bash
npm run build:standalone
```

### 동작 방식

1. `src/data/patterns/*.json` 파일들을 읽음 (117개)
2. 완전한 기능을 가진 단일 HTML 생성:
   - 히어로 섹션 (통계)
   - 사이드바 네비게이션
   - 검색 기능
   - 언어 전환 (KO/EN)
   - 패턴 모달 (전체 상세 정보)
3. 모든 데이터와 스타일을 인라인으로 포함
4. `dist/standalone.html`에 저장

### 출력 정보

```
✅ Complete standalone HTML created!
   Output: dist/standalone.html

Features included:
   ✓ Hero section with stats
   ✓ Sidebar navigation
   ✓ Mobile responsive sidebar
   ✓ Search functionality
   ✓ Language toggle (KO/EN)
   ✓ Full pattern modal
   ✓ Works offline (no web server needed)
```

### 언제 사용하나요?

- 팀원에게 HTML 파일 공유
- 오프라인 환경에서 사용
- 웹서버 설정 없이 바로 실행

### Astro 빌드와의 차이

| 항목 | Astro 빌드 | Standalone 빌드 |
|------|-----------|----------------|
| 결과물 | `dist/` 폴더 | `dist/standalone.html` |
| 파일 수 | 여러 개 | 1개 |
| 실행 | 웹서버 필요 | 더블클릭 |
| 용도 | GitHub Pages | 팀 공유 |

---

## 📝 generate-ai-manifest.js

AI 검색 기능을 위한 최적화된 manifest 파일을 생성합니다.

### 사용법

```bash
npm run generate:ai-manifest
```

### 동작 방식

1. `src/data/patterns/*.json` 파일들을 읽음 (117개)
2. AI 검색에 필요한 핵심 정보만 추출:
   - id, title, title_ko, category
   - description (200자 요약)
   - problem, solution, when_to_use
   - pros, cons, tags, related
3. 카테고리별로 정렬
4. `src/data/ai-manifest.json`에 저장

### 출력 정보

- 총 패턴 수
- 카테고리별 통계
- 파일 크기 (KB)
- 예상 토큰 수

### 언제 실행하나요?

- 새 패턴 추가 후
- 기존 패턴 수정 후
- AI 검색 기능 개발 전

### 예시 출력

```
✅ AI Manifest generated successfully!
   Output: src/data/ai-manifest.json
   Patterns: 117
   Categories: 8
   File size: 146.98 KB
   Est. tokens: ~37,626

📊 Patterns by category:
   Orchestration & Control: 33
   Tool Use & Environment: 21
   Context & Memory: 14
   ...
```

## 🔄 자동화 워크플로우 (향후)

추후 GitHub Actions에 통합 예정:

```yaml
- name: Generate AI Manifest
  run: npm run generate:ai-manifest

- name: Commit if changed
  run: |
    git add src/data/ai-manifest.json
    git commit -m "chore: Update AI manifest" || true
```
