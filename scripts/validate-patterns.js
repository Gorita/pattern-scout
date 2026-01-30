#!/usr/bin/env node
/**
 * Pattern JSON Validator
 * 패턴 JSON 파일들의 유효성을 검증합니다.
 *
 * Usage:
 *   node scripts/validate-patterns.js
 *   node scripts/validate-patterns.js --verbose
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATTERNS_DIR = path.join(__dirname, '../src/data/patterns');

// 필수 필드
const REQUIRED_FIELDS = ['id', 'title', 'title_ko', 'category', 'status'];

// 유효한 카테고리
const VALID_CATEGORIES = [
  'Orchestration & Control',
  'Context & Memory',
  'Feedback Loops',
  'Learning & Adaptation',
  'Reliability & Eval',
  'Security & Safety',
  'Tool Use & Environment',
  'UX & Collaboration',
  'Uncategorized'
];

// 유효한 상태
const VALID_STATUSES = [
  'best-practice',
  'validated-in-production',
  'established',
  'emerging',
  'proposed',
  'experimental-but-awesome',
  'rapidly-improving'
];

// 다국어 필드 (객체 형태여야 함)
const BILINGUAL_FIELDS = ['problem', 'solution', 'when_to_use', 'pros', 'cons'];

const verbose = process.argv.includes('--verbose');

function log(msg) {
  if (verbose) console.log(msg);
}

function validatePattern(filePath) {
  const errors = [];
  const warnings = [];
  const fileName = path.basename(filePath);

  // 1. JSON 파싱
  let pattern;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    pattern = JSON.parse(content);
  } catch (e) {
    errors.push(`JSON 파싱 실패: ${e.message}`);
    return { fileName, errors, warnings };
  }

  // 2. 필수 필드 확인
  for (const field of REQUIRED_FIELDS) {
    if (!pattern[field]) {
      errors.push(`필수 필드 누락: ${field}`);
    }
  }

  // 3. ID와 파일명 일치 확인
  const expectedId = fileName.replace('.json', '');
  if (pattern.id !== expectedId) {
    errors.push(`ID 불일치: 파일명=${expectedId}, id=${pattern.id}`);
  }

  // 4. 카테고리 유효성
  if (pattern.category && !VALID_CATEGORIES.includes(pattern.category)) {
    errors.push(`유효하지 않은 카테고리: ${pattern.category}`);
  }

  // 5. 상태 유효성
  if (pattern.status && !VALID_STATUSES.includes(pattern.status)) {
    errors.push(`유효하지 않은 상태: ${pattern.status}`);
  }

  // 6. 다국어 필드 형식 확인
  for (const field of BILINGUAL_FIELDS) {
    if (pattern[field]) {
      if (typeof pattern[field] !== 'object') {
        warnings.push(`${field}는 객체(en/ko) 형태 권장`);
      } else {
        if (!pattern[field].en) {
          warnings.push(`${field}.en 누락`);
        }
        if (!pattern[field].ko) {
          warnings.push(`${field}.ko 누락`);
        }
      }
    }
  }

  // 7. tags가 배열인지 확인
  if (pattern.tags && !Array.isArray(pattern.tags)) {
    errors.push(`tags는 배열이어야 함`);
  }

  // 8. title_ko가 있는지 확인
  if (pattern.title && !pattern.title_ko) {
    warnings.push(`title_ko 누락 (한국어 제목)`);
  }

  return { fileName, errors, warnings, pattern };
}

function main() {
  console.log('🔍 패턴 JSON 검증 시작...\n');

  // 패턴 파일 목록
  const files = fs.readdirSync(PATTERNS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(PATTERNS_DIR, f));

  console.log(`📁 총 ${files.length}개 패턴 파일 발견\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  const categoryCount = {};
  const statusCount = {};

  for (const file of files) {
    const result = validatePattern(file);

    // 카테고리별 집계
    if (result.pattern?.category) {
      categoryCount[result.pattern.category] = (categoryCount[result.pattern.category] || 0) + 1;
    }

    // 상태별 집계
    if (result.pattern?.status) {
      statusCount[result.pattern.status] = (statusCount[result.pattern.status] || 0) + 1;
    }

    if (result.errors.length > 0) {
      console.log(`❌ ${result.fileName}`);
      result.errors.forEach(e => console.log(`   ERROR: ${e}`));
      totalErrors += result.errors.length;
    }

    if (result.warnings.length > 0) {
      if (result.errors.length === 0) {
        log(`⚠️  ${result.fileName}`);
      }
      result.warnings.forEach(w => log(`   WARNING: ${w}`));
      totalWarnings += result.warnings.length;
    }

    if (result.errors.length === 0 && result.warnings.length === 0) {
      log(`✅ ${result.fileName}`);
    }
  }

  // 요약
  console.log('\n' + '='.repeat(50));
  console.log('📊 검증 결과 요약');
  console.log('='.repeat(50));
  console.log(`총 패턴 수: ${files.length}`);
  console.log(`에러: ${totalErrors}개`);
  console.log(`경고: ${totalWarnings}개`);

  console.log('\n📂 카테고리별 분포:');
  for (const [cat, count] of Object.entries(categoryCount).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${count}`);
  }

  console.log('\n📈 상태별 분포:');
  for (const [status, count] of Object.entries(statusCount).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${status}: ${count}`);
  }

  console.log('\n' + '='.repeat(50));

  if (totalErrors > 0) {
    console.log('❌ 검증 실패: 에러를 수정해주세요.');
    process.exit(1);
  } else {
    console.log('✅ 검증 성공!');
    process.exit(0);
  }
}

main();
