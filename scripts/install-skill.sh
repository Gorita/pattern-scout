#!/bin/bash
#
# Pattern Scout Skill Installer
# Claude Code에서 AI 에이전트 디자인 패턴을 검색/추천하는 스킬을 설치합니다.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/Gorita/pattern-scout/main/scripts/install-skill.sh | bash
#
# 또는 로컬에서:
#   ./scripts/install-skill.sh
#

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# GitHub 설정
GITHUB_REPO="Gorita/pattern-scout"
BRANCH="main"
BASE_URL="https://raw.githubusercontent.com/${GITHUB_REPO}/${BRANCH}"

# 설치 경로
SKILL_DIR="$HOME/.claude/skills/pattern-scout"
SCRIPTS_DIR="$SKILL_DIR/scripts"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Pattern Scout Skill Installer            ║${NC}"
echo -e "${BLUE}║   AI 에이전트 디자인 패턴 검색 스킬       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# 1. 디렉토리 생성
echo -e "${YELLOW}[1/4]${NC} 디렉토리 생성..."
mkdir -p "$SKILL_DIR"
mkdir -p "$SCRIPTS_DIR"
echo -e "  ${GREEN}✓${NC} $SKILL_DIR"

# 2. SKILL.md 다운로드
echo -e "${YELLOW}[2/4]${NC} 스킬 정의 다운로드..."
curl -fsSL "${BASE_URL}/scripts/pattern-scout/SKILL.md" -o "$SKILL_DIR/SKILL.md"
echo -e "  ${GREEN}✓${NC} SKILL.md"

# 3. sync_patterns.py 다운로드
echo -e "${YELLOW}[3/4]${NC} 동기화 스크립트 다운로드..."
curl -fsSL "${BASE_URL}/scripts/pattern-scout/sync_patterns.py" -o "$SCRIPTS_DIR/sync_patterns.py"
chmod +x "$SCRIPTS_DIR/sync_patterns.py"
echo -e "  ${GREEN}✓${NC} sync_patterns.py"

# 4. 패턴 데이터 동기화
echo -e "${YELLOW}[4/4]${NC} 패턴 데이터 동기화 중..."
echo ""
python3 "$SCRIPTS_DIR/sync_patterns.py" --quiet

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   설치 완료!                               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "스킬 위치: ${BLUE}$SKILL_DIR${NC}"
echo ""
echo -e "${YELLOW}사용법:${NC}"
echo -e "  Claude Code에서 ${BLUE}/pattern-scout${NC} 입력"
echo ""
echo -e "${YELLOW}예시:${NC}"
echo -e "  • \"멀티 에이전트 협업 패턴 추천해줘\""
echo -e "  • \"Reflection Loop 패턴 자세히 알려줘\""
echo -e "  • \"Plan-Then-Execute vs Sub-Agent Spawning 비교해줘\""
echo ""
echo -e "${YELLOW}패턴 업데이트:${NC}"
echo -e "  python3 $SCRIPTS_DIR/sync_patterns.py"
echo ""
