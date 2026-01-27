#!/usr/bin/env python3
"""
Pattern Scout Sync Script
GitHub에서 패턴 데이터를 가져와 Markdown으로 변환합니다.

Usage:
    python sync_patterns.py           # 기본 동기화
    python sync_patterns.py --check   # 버전 확인만
    python sync_patterns.py --branch develop  # 특정 브랜치
"""

import json
import os
import sys
import urllib.request
import urllib.error
import ssl
from pathlib import Path
from collections import defaultdict
import argparse
import re

# SSL 컨텍스트 설정 (macOS 인증서 문제 해결)
SSL_CONTEXT = ssl.create_default_context()
try:
    import certifi
    SSL_CONTEXT.load_verify_locations(certifi.where())
except ImportError:
    # certifi가 없으면 인증서 검증 비활성화 (개발용)
    SSL_CONTEXT.check_hostname = False
    SSL_CONTEXT.verify_mode = ssl.CERT_NONE

# GitHub 설정
GITHUB_REPO = "Gorita/pattern-scout"
DEFAULT_BRANCH = "main"

# 경로 설정
SKILL_DIR = Path(__file__).parent.parent
SCRIPTS_DIR = SKILL_DIR / "scripts"
REFERENCES_DIR = SKILL_DIR / "references"
PATTERNS_DIR = REFERENCES_DIR / "patterns"
SKILL_MD_PATH = SKILL_DIR / "SKILL.md"
SELF_PATH = Path(__file__)

# 카테고리 순서 및 슬러그
CATEGORY_ORDER = [
    "Orchestration & Control",
    "Context & Memory",
    "Feedback Loops",
    "Learning & Adaptation",
    "Reliability & Eval",
    "Security & Safety",
    "Tool Use & Environment",
    "UX & Collaboration",
    "Uncategorized"
]

def get_category_slug(category: str) -> str:
    """카테고리를 파일명용 슬러그로 변환"""
    return category.lower().replace(" & ", "-").replace(" ", "-")

def fetch_url(url: str) -> str:
    """URL에서 콘텐츠 가져오기"""
    try:
        with urllib.request.urlopen(url, timeout=30, context=SSL_CONTEXT) as response:
            return response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        print(f"  ❌ HTTP Error {e.code}: {url}")
        return None
    except urllib.error.URLError as e:
        print(f"  ❌ URL Error: {e.reason}")
        return None

def fetch_manifest(branch: str) -> list:
    """ai-manifest.json 가져오기"""
    url = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{branch}/public/ai-manifest.json"
    print(f"📥 Fetching manifest from {branch} branch...")

    content = fetch_url(url)
    if content:
        return json.loads(content)
    return None

def fetch_pattern_detail(pattern_id: str, branch: str) -> dict:
    """개별 패턴 상세 정보 가져오기"""
    url = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{branch}/src/data/patterns/{pattern_id}.json"
    content = fetch_url(url)
    if content:
        return json.loads(content)
    return None

def fetch_skill_md(branch: str) -> str:
    """SKILL.md 가져오기"""
    url = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{branch}/scripts/pattern-scout/SKILL.md"
    return fetch_url(url)

def fetch_self_script(branch: str) -> str:
    """sync_patterns.py 자기 자신 가져오기"""
    url = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{branch}/scripts/pattern-scout/sync_patterns.py"
    return fetch_url(url)

def update_self(branch: str) -> bool:
    """자기 자신 업데이트"""
    new_script = fetch_self_script(branch)
    if not new_script:
        return False

    current_script = SELF_PATH.read_text(encoding='utf-8')
    if new_script != current_script:
        SELF_PATH.write_text(new_script, encoding='utf-8')
        return True
    return False

def get_text(obj, lang='en') -> str:
    """다국어 객체에서 텍스트 추출 (영문 우선)"""
    if obj is None:
        return ""
    if isinstance(obj, str):
        return obj
    if isinstance(obj, dict):
        return obj.get(lang, obj.get('ko', ''))
    return str(obj)

def get_list(obj, lang='en') -> list:
    """다국어 객체에서 리스트 추출 (영문 우선)"""
    if obj is None:
        return []
    if isinstance(obj, list):
        return obj
    if isinstance(obj, dict):
        return obj.get(lang, obj.get('ko', []))
    return []

def status_to_korean(status: str) -> str:
    """상태를 한국어로 변환"""
    mapping = {
        'best-practice': '베스트 프랙티스',
        'validated-in-production': '프로덕션 검증됨',
        'established': '확립됨',
        'emerging': '새롭게 떠오름',
        'proposed': '제안됨',
        'experimental-but-awesome': '실험적이지만 유망',
        'rapidly-improving': '빠르게 개선중'
    }
    return mapping.get(status, status)

def pattern_to_markdown(pattern: dict) -> str:
    """패턴을 Markdown으로 변환 (영문)"""
    lines = []

    # 제목
    title = pattern.get('title', '')
    lines.append(f"## {title}")
    lines.append("")

    # 메타 정보
    status = pattern.get('status', '')
    tags = pattern.get('tags', [])
    original_url = pattern.get('original_url', '')

    meta_parts = []
    if status:
        meta_parts.append(f"**Status:** {status}")
    if tags:
        meta_parts.append(f"**Tags:** {', '.join(tags)}")
    if meta_parts:
        lines.append(" | ".join(meta_parts))
        lines.append("")

    if original_url:
        lines.append(f"**Source:** {original_url}")
        lines.append("")

    # Problem
    problem = get_text(pattern.get('problem'), 'en')
    if problem:
        lines.append("### Problem")
        lines.append(problem)
        lines.append("")

    # Solution
    solution = get_text(pattern.get('solution'), 'en')
    if solution:
        lines.append("### Solution")
        lines.append(solution)
        lines.append("")

    # When to use
    when_to_use = get_list(pattern.get('when_to_use'), 'en')
    if when_to_use:
        lines.append("### When to Use")
        for item in when_to_use:
            lines.append(f"- {item}")
        lines.append("")

    # Pros
    pros = get_list(pattern.get('pros'), 'en')
    if pros:
        lines.append("### Pros")
        for item in pros:
            lines.append(f"- {item}")
        lines.append("")

    # Cons
    cons = get_list(pattern.get('cons'), 'en')
    if cons:
        lines.append("### Cons")
        for item in cons:
            lines.append(f"- {item}")
        lines.append("")

    # Diagram
    mermaid = pattern.get('mermaid_diagram', '')
    if mermaid:
        lines.append("### Diagram")
        lines.append("```mermaid")
        lines.append(mermaid)
        lines.append("```")
        lines.append("")

    # Code example
    code = pattern.get('code_example', '')
    if code:
        lines.append("### Code Example")
        lines.append("```python")
        lines.append(code)
        lines.append("```")
        lines.append("")

    lines.append("---")
    lines.append("")

    return "\n".join(lines)

def generate_index_markdown(patterns: list) -> str:
    """패턴 인덱스 Markdown 생성 (영문)"""
    lines = []
    lines.append("# AI Agent Design Patterns Index")
    lines.append("")
    lines.append(f"Total **{len(patterns)}** patterns available.")
    lines.append("")

    # 카테고리별 그룹화
    grouped = defaultdict(list)
    for p in patterns:
        category = p.get('category', 'Uncategorized')
        grouped[category].append(p)

    # 목차
    lines.append("## Table of Contents")
    for category in CATEGORY_ORDER:
        if category in grouped:
            slug = get_category_slug(category)
            count = len(grouped[category])
            lines.append(f"- [{category}](#{slug}) ({count})")
    lines.append("")

    # 카테고리별 테이블
    for category in CATEGORY_ORDER:
        if category not in grouped:
            continue

        slug = get_category_slug(category)
        category_patterns = grouped[category]

        lines.append(f"## {category}")
        lines.append(f"<a name=\"{slug}\"></a>")
        lines.append("")
        lines.append("| Pattern | Summary | Tags |")
        lines.append("|---------|---------|------|")

        for p in sorted(category_patterns, key=lambda x: x.get('title', '')):
            title = p.get('title', '')

            # 요약 생성: problem의 앞 80자
            problem = get_text(p.get('problem'), 'en')
            summary = problem[:80] + "..." if len(problem) > 80 else problem
            summary = summary.replace("|", "/").replace("\n", " ")

            tags = ", ".join(p.get('tags', [])[:3])

            lines.append(f"| {title} | {summary} | {tags} |")

        lines.append("")

    return "\n".join(lines)

def generate_category_markdown(category: str, patterns: list) -> str:
    """카테고리별 상세 Markdown 생성 (영문)"""
    lines = []
    lines.append(f"# {category}")
    lines.append("")
    lines.append(f"This category contains **{len(patterns)}** patterns.")
    lines.append("")

    # 목차
    lines.append("## Table of Contents")
    for p in sorted(patterns, key=lambda x: x.get('title', '')):
        title = p.get('title', '')
        anchor = title.lower().replace(" ", "-").replace("'", "")
        lines.append(f"- [{title}](#{anchor})")
    lines.append("")
    lines.append("---")
    lines.append("")

    # 각 패턴 상세
    for p in sorted(patterns, key=lambda x: x.get('title', '')):
        lines.append(pattern_to_markdown(p))

    return "\n".join(lines)

def sync(branch: str = DEFAULT_BRANCH, verbose: bool = True):
    """메인 동기화 함수"""

    # 디렉토리 생성
    REFERENCES_DIR.mkdir(parents=True, exist_ok=True)
    PATTERNS_DIR.mkdir(parents=True, exist_ok=True)

    # 0. 자기 자신(sync_patterns.py) 업데이트
    print("📥 Checking for script updates...")
    if update_self(branch):
        print("  ✅ sync_patterns.py updated (changes will apply on next run)")
    else:
        print("  ✅ sync_patterns.py is up to date")

    # 1. SKILL.md 업데이트
    print("📥 Updating SKILL.md...")
    skill_md = fetch_skill_md(branch)
    if skill_md:
        SKILL_MD_PATH.write_text(skill_md, encoding='utf-8')
        print("  ✅ SKILL.md updated")
    else:
        print("  ⚠️  Failed to fetch SKILL.md (keeping existing)")

    # 1. Manifest 가져오기
    manifest = fetch_manifest(branch)
    if not manifest:
        print("❌ Failed to fetch manifest")
        return False

    print(f"✅ Fetched {len(manifest)} patterns from manifest")

    # 2. 개별 패턴 상세 정보 가져오기
    print("📥 Fetching pattern details...")
    detailed_patterns = []

    for i, p in enumerate(manifest):
        pattern_id = p.get('id')
        if verbose:
            print(f"  [{i+1}/{len(manifest)}] {pattern_id}")

        detail = fetch_pattern_detail(pattern_id, branch)
        if detail:
            detailed_patterns.append(detail)
        else:
            # manifest 정보라도 사용
            detailed_patterns.append(p)

    print(f"✅ Fetched {len(detailed_patterns)} pattern details")

    # 3. 인덱스 Markdown 생성
    print("📝 Generating index markdown...")
    index_md = generate_index_markdown(detailed_patterns)
    index_path = REFERENCES_DIR / "patterns-index.md"
    index_path.write_text(index_md, encoding='utf-8')
    print(f"  ✅ Saved: {index_path}")

    # 4. 카테고리별 Markdown 생성
    print("📝 Generating category markdowns...")
    grouped = defaultdict(list)
    for p in detailed_patterns:
        category = p.get('category', 'Uncategorized')
        grouped[category].append(p)

    for category, patterns in grouped.items():
        slug = get_category_slug(category)
        category_md = generate_category_markdown(category, patterns)
        category_path = PATTERNS_DIR / f"{slug}.md"
        category_path.write_text(category_md, encoding='utf-8')
        print(f"  ✅ Saved: {category_path} ({len(patterns)} patterns)")

    # 5. 메타 정보 저장
    meta = {
        "version": "1.0.0",
        "branch": branch,
        "total_patterns": len(detailed_patterns),
        "categories": {cat: len(pats) for cat, pats in grouped.items()}
    }
    meta_path = REFERENCES_DIR / "meta.json"
    meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding='utf-8')

    print("")
    print("🎉 Sync completed!")
    print(f"   Total patterns: {len(detailed_patterns)}")
    print(f"   Categories: {len(grouped)}")
    print(f"   Location: {REFERENCES_DIR}")

    return True

def check_version(branch: str = DEFAULT_BRANCH):
    """현재 버전과 원격 버전 비교"""
    meta_path = REFERENCES_DIR / "meta.json"

    if meta_path.exists():
        local_meta = json.loads(meta_path.read_text())
        print(f"📍 Local version:")
        print(f"   Branch: {local_meta.get('branch', 'unknown')}")
        print(f"   Patterns: {local_meta.get('total_patterns', 0)}")
    else:
        print("📍 Local version: Not synced yet")

    manifest = fetch_manifest(branch)
    if manifest:
        print(f"📍 Remote version ({branch}):")
        print(f"   Patterns: {len(manifest)}")

def main():
    parser = argparse.ArgumentParser(description="Pattern Scout Sync Script")
    parser.add_argument("--branch", default=DEFAULT_BRANCH, help="GitHub branch to sync from")
    parser.add_argument("--check", action="store_true", help="Check version only")
    parser.add_argument("--quiet", action="store_true", help="Minimal output")

    args = parser.parse_args()

    if args.check:
        check_version(args.branch)
    else:
        sync(args.branch, verbose=not args.quiet)

if __name__ == "__main__":
    main()
