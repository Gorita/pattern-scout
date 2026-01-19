#!/usr/bin/env node

/**
 * AI Manifest Generator
 *
 * 개별 패턴 JSON 파일들을 읽어서 AI 검색에 최적화된 manifest 파일을 생성합니다.
 *
 * Usage:
 *   node scripts/generate-ai-manifest.js
 *
 * Output:
 *   src/data/ai-manifest.json
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATTERNS_DIR = join(__dirname, '../src/data/patterns');
const OUTPUT_FILE = join(__dirname, '../public/ai-manifest.json');

/**
 * 패턴 JSON 파일을 AI 검색에 최적화된 형태로 변환
 */
function transformPattern(pattern) {
  return {
    id: pattern.id,
    title: pattern.title,
    title_ko: pattern.title_ko || pattern.title,
    category: pattern.category || 'Uncategorized',

    // 핵심 설명 (AI가 가장 먼저 읽는 부분)
    description: combineDescription(pattern),

    // 구조화된 정보
    problem: pattern.problem?.en || '',
    solution: pattern.solution?.en || '',

    // 사용 시기 (배열로 평탄화)
    when_to_use: pattern.when_to_use?.en || [],

    // 장단점 (간결하게)
    pros: pattern.pros?.en || [],
    cons: pattern.cons?.en || [],

    // 태그 (검색 키워드)
    tags: pattern.tags || [],

    // 관련 패턴 (있으면)
    related: pattern.related_patterns || []
  };
}

/**
 * 여러 필드를 결합해서 간결한 description 생성
 */
function combineDescription(pattern) {
  const parts = [];

  if (pattern.problem?.en) {
    parts.push(pattern.problem.en.split('.')[0]); // 첫 문장만
  }

  if (pattern.solution?.en) {
    parts.push(pattern.solution.en.split('.')[0]);
  }

  return parts.join(' ').substring(0, 200); // 200자 제한
}

/**
 * 메인 함수
 */
function generateManifest() {
  console.log('🔍 Reading pattern files...');

  // 1. 모든 패턴 파일 읽기
  const files = readdirSync(PATTERNS_DIR).filter(f => f.endsWith('.json'));
  console.log(`   Found ${files.length} pattern files`);

  // 2. 변환
  const manifest = [];
  let errors = 0;

  for (const file of files) {
    try {
      const filePath = join(PATTERNS_DIR, file);
      const content = readFileSync(filePath, 'utf-8');
      const pattern = JSON.parse(content);

      const transformed = transformPattern(pattern);
      manifest.push(transformed);
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error.message);
      errors++;
    }
  }

  // 3. 카테고리별로 정렬
  manifest.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });

  // 4. 저장
  const output = JSON.stringify(manifest, null, 2);
  writeFileSync(OUTPUT_FILE, output, 'utf-8');

  // 5. 통계
  const categories = [...new Set(manifest.map(p => p.category))];
  const totalTokens = Math.ceil(output.length / 4); // 대략적인 토큰 수

  console.log('\n✅ AI Manifest generated successfully!');
  console.log(`   Output: ${OUTPUT_FILE}`);
  console.log(`   Patterns: ${manifest.length}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   File size: ${(output.length / 1024).toFixed(2)} KB`);
  console.log(`   Est. tokens: ~${totalTokens.toLocaleString()}`);

  if (errors > 0) {
    console.log(`\n⚠️  ${errors} file(s) had errors`);
  }

  // 6. 카테고리별 통계
  console.log('\n📊 Patterns by category:');
  categories.forEach(cat => {
    const count = manifest.filter(p => p.category === cat).length;
    console.log(`   ${cat}: ${count}`);
  });
}

// 실행
try {
  generateManifest();
} catch (error) {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}
