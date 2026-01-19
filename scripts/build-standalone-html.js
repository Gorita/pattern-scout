#!/usr/bin/env node

/**
 * Generate a complete standalone HTML file with all features
 * - Works without a web server (no ES modules)
 * - Sidebar navigation
 * - Hero section with stats
 * - Language toggle (KO/EN)
 * - Search functionality
 * - Full pattern modal with all details
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATTERNS_DIR = join(__dirname, '../src/data/patterns');
const DIST_DIR = join(__dirname, '../dist');
const OUTPUT_FILE = join(DIST_DIR, 'standalone.html');
const AI_MANIFEST_SRC = join(__dirname, '../public/ai-manifest.json');
const AI_MANIFEST_DEST = join(DIST_DIR, 'ai-manifest.json');

console.log('📦 Building complete standalone HTML...');

// Ensure dist directory exists
if (!existsSync(DIST_DIR)) {
  mkdirSync(DIST_DIR, { recursive: true });
}

// Load all pattern files
const files = readdirSync(PATTERNS_DIR).filter(f => f.endsWith('.json'));
const patterns = files.map(file => {
  const content = readFileSync(join(PATTERNS_DIR, file), 'utf-8');
  return JSON.parse(content);
});

console.log(`   Found ${patterns.length} patterns`);

// Group by category
const categoryOrder = [
  'Orchestration & Control',
  'Context & Memory',
  'Feedback Loops',
  'Learning & Adaptation',
  'Reliability & Eval',
  'Security & Safety',
  'Tool Use & Environment',
  'UX & Collaboration'
];

const categorized = {};
categoryOrder.forEach(cat => { categorized[cat] = []; });

patterns.forEach(pattern => {
  const cat = pattern.category || 'Uncategorized';
  if (!categorized[cat]) categorized[cat] = [];
  categorized[cat].push(pattern);
});

// Remove empty categories
Object.keys(categorized).forEach(cat => {
  if (categorized[cat].length === 0) delete categorized[cat];
});

const totalPatterns = patterns.length;
const totalCategories = Object.keys(categorized).length;

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="ko" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="AI 에이전트 디자인 패턴 찾기 - ${totalPatterns}개 패턴 탐색">
  <title>Pattern Scout - AI 에이전트 디자인 패턴</title>

  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            dark: {
              bg: '#0d1117',
              card: '#161b22',
              border: '#30363d',
              text: '#c9d1d9',
              muted: '#8b949e'
            },
            primary: {
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7'
            }
          }
        }
      }
    }
  </script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0d1117;
      color: #c9d1d9;
    }

    html { scroll-behavior: smooth; }

    .pattern-card {
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .pattern-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .category-link.active {
      background-color: rgba(14, 165, 233, 0.1);
      color: #38bdf8;
      border-left: 2px solid #0ea5e9;
      margin-left: -2px;
    }

    .modal-overlay { backdrop-filter: blur(4px); }
    .modal-overlay.hidden { display: none; }

    .modal-content {
      animation: modalSlideIn 0.2s ease-out;
    }
    @keyframes modalSlideIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .mobile-sidebar {
      transition: transform 0.3s ease-in-out;
    }
    .mobile-sidebar.open {
      transform: translateX(0);
    }
    .sidebar-overlay {
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    }
    .sidebar-overlay.show {
      opacity: 1;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #161b22; }
    ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #484f58; }
  </style>
</head>
<body class="bg-dark-bg text-dark-text min-h-screen">

  <!-- Header -->
  <header class="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a href="#" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span class="text-2xl">🔍</span>
          <span class="font-semibold text-lg hidden sm:block">Pattern Scout</span>
        </a>

        <div class="flex items-center gap-4">
          <!-- Search -->
          <div class="relative w-full max-w-md">
            <input
              type="text"
              id="pattern-search"
              placeholder="패턴 검색..."
              class="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 pl-10 text-dark-text placeholder-dark-muted focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button id="search-clear" class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text hidden">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Language Toggle -->
          <div class="language-toggle flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg p-1">
            <button class="lang-btn px-3 py-1.5 rounded text-sm font-medium transition-all text-dark-muted hover:text-dark-text" data-lang="en">EN</button>
            <button class="lang-btn px-3 py-1.5 rounded text-sm font-medium transition-all bg-primary-500 text-white" data-lang="ko">KO</button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Hero Section -->
    <section class="text-center py-8 border-b border-dark-border mb-6">
      <h1 class="text-3xl md:text-4xl font-bold mb-3">
        <span data-lang="ko">AI 에이전트 디자인 패턴</span>
        <span data-lang="en" style="display:none;">AI Agent Design Patterns</span>
      </h1>
      <p class="text-dark-muted text-base max-w-2xl mx-auto mb-4">
        <span data-lang="ko">효과적인 AI 에이전트 시스템 구축을 위한 검증된 패턴 모음</span>
        <span data-lang="en" style="display:none;">A curated collection of proven patterns for building effective AI agent systems</span>
      </p>
      <div class="flex justify-center gap-6 text-sm text-dark-muted">
        <div class="flex items-center gap-2">
          <span class="text-primary-400 font-semibold text-lg">${totalPatterns}</span>
          <span data-lang="ko">패턴</span>
          <span data-lang="en" style="display:none;">Patterns</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-primary-400 font-semibold text-lg">${totalCategories}</span>
          <span data-lang="ko">카테고리</span>
          <span data-lang="en" style="display:none;">Categories</span>
        </div>
      </div>
    </section>

    <!-- Mobile Sidebar Toggle -->
    <button id="sidebar-toggle" class="lg:hidden fixed bottom-6 right-6 z-50 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-all">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <!-- Sidebar + Main Content -->
    <div class="flex gap-8">
      <!-- Sidebar (Desktop) -->
      <aside id="category-sidebar" class="hidden lg:block w-64 flex-shrink-0">
        <nav class="lg:sticky lg:top-20 bg-dark-card border border-dark-border rounded-lg p-4">
          <h2 class="text-sm font-semibold text-dark-muted uppercase tracking-wider mb-4">
            <span data-lang="ko">카테고리</span>
            <span data-lang="en" style="display:none;">Categories</span>
          </h2>
          <ul id="sidebar-nav" class="space-y-1"></ul>
        </nav>
      </aside>

      <!-- Mobile Sidebar Overlay -->
      <div id="sidebar-overlay" class="sidebar-overlay hidden fixed inset-0 bg-black/60 z-40 lg:hidden"></div>

      <!-- Mobile Sidebar Panel -->
      <div id="mobile-sidebar" class="mobile-sidebar fixed top-0 left-0 h-full w-72 bg-dark-bg border-r border-dark-border z-50 transform -translate-x-full lg:hidden overflow-y-auto">
        <div class="p-4">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold">
              <span data-lang="ko">카테고리</span>
              <span data-lang="en" style="display:none;">Categories</span>
            </h2>
            <button id="sidebar-close" class="text-dark-muted hover:text-white p-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <ul id="mobile-sidebar-nav" class="space-y-1"></ul>
        </div>
      </div>

      <!-- Main Content -->
      <main class="flex-1 min-w-0 pb-20">
        <div id="patterns-container"></div>

        <!-- Empty State -->
        <div id="no-results" class="hidden text-center py-12">
          <p class="text-dark-muted text-lg">
            <span data-lang="ko">검색 결과가 없습니다</span>
            <span data-lang="en" style="display:none;">No patterns found</span>
          </p>
        </div>
      </main>
    </div>
  </div>

  <!-- Pattern Modal -->
  <div id="pattern-modal" class="modal-overlay hidden fixed inset-0 bg-black/80 z-50 overflow-y-auto">
    <div class="modal-container min-h-screen px-4 py-8 flex items-start justify-center">
      <div class="modal-content bg-dark-card border border-dark-border rounded-lg w-full max-w-4xl relative">
        <!-- Close button -->
        <button id="modal-close" class="absolute top-4 right-4 text-dark-muted hover:text-white transition-colors z-10">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Modal Header -->
        <div class="p-6 border-b border-dark-border">
          <div class="flex items-start gap-3 pr-8">
            <h2 id="modal-title" class="text-2xl font-bold"></h2>
            <span id="modal-status" class="text-xs px-2 py-1 rounded border whitespace-nowrap"></span>
          </div>
          <div class="flex items-center gap-3 mt-2 text-sm text-dark-muted">
            <span id="modal-category"></span>
            <a id="modal-source" href="#" target="_blank" class="text-primary-400 hover:underline hidden">
              <span data-lang="ko">원본 소스</span>
              <span data-lang="en" style="display:none;">Original Source</span>
            </a>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <!-- Problem -->
          <section>
            <h3 class="text-lg font-semibold mb-2 text-primary-400">
              <span data-lang="ko">문제</span>
              <span data-lang="en" style="display:none;">Problem</span>
            </h3>
            <p id="modal-problem" class="text-dark-muted"></p>
          </section>

          <!-- Solution -->
          <section>
            <h3 class="text-lg font-semibold mb-2 text-primary-400">
              <span data-lang="ko">해결책</span>
              <span data-lang="en" style="display:none;">Solution</span>
            </h3>
            <p id="modal-solution" class="text-dark-muted"></p>
          </section>

          <!-- Diagrams -->
          <section id="modal-diagrams-section" class="hidden">
            <h3 class="text-lg font-semibold mb-2 text-primary-400">
              <span data-lang="ko">다이어그램</span>
              <span data-lang="en" style="display:none;">Diagram</span>
            </h3>
            <div class="flex gap-2 mb-3">
              <button id="modal-ascii-tab" class="tab-btn text-sm px-4 py-2 rounded bg-dark-border text-dark-text">ASCII</button>
              <button id="modal-mermaid-tab" class="tab-btn text-sm px-4 py-2 rounded bg-transparent text-dark-muted hidden">Mermaid</button>
            </div>
            <div class="bg-dark-bg rounded-lg p-4 overflow-x-auto">
              <pre id="modal-ascii" class="font-mono text-sm text-dark-text whitespace-pre"></pre>
            </div>
          </section>

          <!-- Code Example -->
          <section id="modal-code-section" class="hidden">
            <h3 class="text-lg font-semibold mb-2 text-primary-400">
              <span data-lang="ko">코드 예제</span>
              <span data-lang="en" style="display:none;">Code Example</span>
            </h3>
            <div class="bg-dark-bg rounded-lg p-4 overflow-x-auto">
              <pre id="modal-code" class="font-mono text-sm text-dark-text whitespace-pre"></pre>
            </div>
          </section>

          <!-- When to Use -->
          <section id="modal-when-section" class="hidden">
            <h3 class="text-lg font-semibold mb-2 text-primary-400">
              <span data-lang="ko">사용 시기</span>
              <span data-lang="en" style="display:none;">When to Use</span>
            </h3>
            <ul id="modal-when" class="list-disc list-inside text-dark-muted space-y-1"></ul>
          </section>

          <!-- Pros & Cons -->
          <div class="grid md:grid-cols-2 gap-6">
            <section id="modal-pros-section" class="hidden">
              <h3 class="text-lg font-semibold mb-2 text-green-400">
                <span data-lang="ko">장점</span>
                <span data-lang="en" style="display:none;">Pros</span>
              </h3>
              <ul id="modal-pros" class="list-disc list-inside text-dark-muted space-y-1"></ul>
            </section>

            <section id="modal-cons-section" class="hidden">
              <h3 class="text-lg font-semibold mb-2 text-red-400">
                <span data-lang="ko">단점</span>
                <span data-lang="en" style="display:none;">Cons</span>
              </h3>
              <ul id="modal-cons" class="list-disc list-inside text-dark-muted space-y-1"></ul>
            </section>
          </div>

          <!-- Tags -->
          <section>
            <div id="modal-tags" class="flex flex-wrap gap-2"></div>
          </section>
        </div>
      </div>
    </div>
  </div>

  <script>
    // ========== DATA ==========
    const patternsData = ${JSON.stringify(patterns, null, 2)};

    const categories = ${JSON.stringify(categorized)};

    const categoryIcons = {
      'Orchestration & Control': '🎛️',
      'Context & Memory': '🧠',
      'Feedback Loops': '🔄',
      'Learning & Adaptation': '📚',
      'Reliability & Eval': '✅',
      'Security & Safety': '🔒',
      'Tool Use & Environment': '🔧',
      'UX & Collaboration': '👥',
      'Uncategorized': '📁'
    };

    const statusColors = {
      'best-practice': 'bg-green-500/20 text-green-400 border-green-500/30',
      'validated-in-production': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'established': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'emerging': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'proposed': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'experimental-but-awesome': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'rapidly-improving': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    // ========== LANGUAGE ==========
    const STORAGE_KEY = 'aap-language';
    let currentLang = localStorage.getItem(STORAGE_KEY) || 'ko';

    function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);

      // Update buttons
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === lang) {
          btn.classList.add('bg-primary-500', 'text-white');
          btn.classList.remove('text-dark-muted', 'hover:text-dark-text');
        } else {
          btn.classList.remove('bg-primary-500', 'text-white');
          btn.classList.add('text-dark-muted', 'hover:text-dark-text');
        }
      });

      // Update content
      document.querySelectorAll('[data-lang]').forEach(el => {
        if (el.classList.contains('lang-btn')) return;
        const elLang = el.getAttribute('data-lang');
        el.style.display = (elLang === lang) ? '' : 'none';
      });

      // Update search placeholder
      const searchInput = document.getElementById('pattern-search');
      searchInput.placeholder = lang === 'ko' ? '패턴 검색...' : 'Search patterns...';

      // Re-render patterns
      renderPatterns();
    }

    // ========== SIDEBAR ==========
    function renderSidebar() {
      const sidebarNav = document.getElementById('sidebar-nav');
      const mobileSidebarNav = document.getElementById('mobile-sidebar-nav');

      const html = Object.entries(categories).map(([category, items]) => {
        const catId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return \`
          <li>
            <a href="#category-\${catId}" class="category-link flex items-center gap-2 px-3 py-2 rounded-md text-sm text-dark-muted hover:bg-dark-border hover:text-dark-text transition-all" data-category="\${catId}">
              <span class="text-base">\${categoryIcons[category] || '📁'}</span>
              <span class="flex-1 truncate">\${category}</span>
              <span class="text-xs bg-dark-border px-1.5 py-0.5 rounded">\${items.length}</span>
            </a>
          </li>
        \`;
      }).join('');

      sidebarNav.innerHTML = html;
      mobileSidebarNav.innerHTML = html;

      // Add click handlers for mobile
      document.querySelectorAll('#mobile-sidebar-nav .category-link').forEach(link => {
        link.addEventListener('click', closeSidebar);
      });
    }

    // Mobile sidebar controls
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function openSidebar() {
      mobileSidebar.classList.add('open');
      sidebarOverlay.classList.remove('hidden');
      setTimeout(() => sidebarOverlay.classList.add('show'), 10);
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      mobileSidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');
      setTimeout(() => sidebarOverlay.classList.add('hidden'), 300);
      document.body.style.overflow = '';
    }

    sidebarToggle.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // ========== PATTERNS ==========
    function renderPatterns(filteredCategories = null) {
      const container = document.getElementById('patterns-container');
      const noResults = document.getElementById('no-results');
      const data = filteredCategories || categories;

      if (Object.keys(data).length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
      }

      noResults.classList.add('hidden');

      container.innerHTML = Object.entries(data).map(([category, items]) => {
        const catId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return \`
          <section class="category-section mb-12 scroll-mt-20" id="category-\${catId}">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span>\${categoryIcons[category] || '📁'}</span>
              <span>\${category}</span>
              <span class="text-sm font-normal text-dark-muted">(\${items.length})</span>
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              \${items.map(pattern => \`
                <div class="pattern-card bg-dark-card border border-dark-border rounded-lg p-5 hover:border-primary-500"
                     onclick='openModal("\${pattern.id}")'>
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-semibold text-lg leading-tight">\${currentLang === 'ko' && pattern.title_ko ? pattern.title_ko : pattern.title}</h3>
                    <span class="text-xs px-2 py-1 rounded border ml-2 whitespace-nowrap \${statusColors[pattern.status] || statusColors['proposed']}">\${pattern.status || 'proposed'}</span>
                  </div>
                  <p class="text-xs text-dark-muted mb-3">\${pattern.title}</p>
                  <p class="text-sm text-dark-muted line-clamp-3">\${currentLang === 'ko' && pattern.problem?.ko ? pattern.problem.ko : (pattern.problem?.en || '')}</p>
                  \${pattern.tags && pattern.tags.length > 0 ? \`
                    <div class="flex flex-wrap gap-1 mt-3">
                      \${pattern.tags.slice(0, 3).map(tag => \`<span class="text-xs px-2 py-0.5 rounded bg-dark-border text-dark-muted">#\${tag}</span>\`).join('')}
                    </div>
                  \` : ''}
                </div>
              \`).join('')}
            </div>
          </section>
        \`;
      }).join('');
    }

    // ========== SEARCH ==========
    const searchInput = document.getElementById('pattern-search');
    const clearBtn = document.getElementById('search-clear');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      clearBtn.classList.toggle('hidden', !query);

      if (!query) {
        renderPatterns();
        return;
      }

      const filtered = {};
      Object.entries(categories).forEach(([category, items]) => {
        const matches = items.filter(p =>
          (p.title || '').toLowerCase().includes(query) ||
          (p.title_ko || '').toLowerCase().includes(query) ||
          (p.problem?.ko || '').toLowerCase().includes(query) ||
          (p.problem?.en || '').toLowerCase().includes(query) ||
          (p.tags || []).some(t => t.toLowerCase().includes(query))
        );
        if (matches.length > 0) {
          filtered[category] = matches;
        }
      });

      renderPatterns(filtered);
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      renderPatterns();
      searchInput.focus();
    });

    // ========== MODAL ==========
    const modal = document.getElementById('pattern-modal');
    const modalClose = document.getElementById('modal-close');

    function openModal(patternId) {
      const pattern = patternsData.find(p => p.id === patternId);
      if (!pattern) return;

      // Title
      document.getElementById('modal-title').textContent =
        currentLang === 'ko' && pattern.title_ko ? pattern.title_ko : pattern.title;

      // Status
      const statusEl = document.getElementById('modal-status');
      statusEl.textContent = pattern.status || 'proposed';
      statusEl.className = 'text-xs px-2 py-1 rounded border whitespace-nowrap ' + (statusColors[pattern.status] || statusColors['proposed']);

      // Category
      document.getElementById('modal-category').textContent = pattern.category || '';

      // Source link
      const sourceEl = document.getElementById('modal-source');
      if (pattern.original_url) {
        sourceEl.href = pattern.original_url;
        sourceEl.classList.remove('hidden');
      } else {
        sourceEl.classList.add('hidden');
      }

      // Problem
      document.getElementById('modal-problem').textContent =
        currentLang === 'ko' && pattern.problem?.ko ? pattern.problem.ko : (pattern.problem?.en || '');

      // Solution
      document.getElementById('modal-solution').textContent =
        currentLang === 'ko' && pattern.solution?.ko ? pattern.solution.ko : (pattern.solution?.en || '');

      // Diagrams
      const diagramsSection = document.getElementById('modal-diagrams-section');
      if (pattern.ascii_diagram) {
        diagramsSection.classList.remove('hidden');
        document.getElementById('modal-ascii').textContent = pattern.ascii_diagram;
      } else {
        diagramsSection.classList.add('hidden');
      }

      // Code
      const codeSection = document.getElementById('modal-code-section');
      if (pattern.code_example) {
        codeSection.classList.remove('hidden');
        document.getElementById('modal-code').textContent = pattern.code_example;
      } else {
        codeSection.classList.add('hidden');
      }

      // When to Use
      const whenSection = document.getElementById('modal-when-section');
      const whenData = currentLang === 'ko' && pattern.when_to_use?.ko ? pattern.when_to_use.ko : (pattern.when_to_use?.en || []);
      if (whenData.length > 0) {
        whenSection.classList.remove('hidden');
        document.getElementById('modal-when').innerHTML = whenData.map(item => '<li>' + item + '</li>').join('');
      } else {
        whenSection.classList.add('hidden');
      }

      // Pros
      const prosSection = document.getElementById('modal-pros-section');
      const prosData = currentLang === 'ko' && pattern.pros?.ko ? pattern.pros.ko : (pattern.pros?.en || []);
      if (prosData.length > 0) {
        prosSection.classList.remove('hidden');
        document.getElementById('modal-pros').innerHTML = prosData.map(item => '<li>' + item + '</li>').join('');
      } else {
        prosSection.classList.add('hidden');
      }

      // Cons
      const consSection = document.getElementById('modal-cons-section');
      const consData = currentLang === 'ko' && pattern.cons?.ko ? pattern.cons.ko : (pattern.cons?.en || []);
      if (consData.length > 0) {
        consSection.classList.remove('hidden');
        document.getElementById('modal-cons').innerHTML = consData.map(item => '<li>' + item + '</li>').join('');
      } else {
        consSection.classList.add('hidden');
      }

      // Tags
      const tagsContainer = document.getElementById('modal-tags');
      if (pattern.tags && pattern.tags.length > 0) {
        tagsContainer.innerHTML = pattern.tags.map(tag =>
          '<span class="text-xs px-2 py-1 rounded bg-dark-border text-dark-muted">#' + tag + '</span>'
        ).join('');
      } else {
        tagsContainer.innerHTML = '';
      }

      // Show modal
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-container')) {
        closeModal();
      }
    });

    // ESC to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // ========== ACTIVE CATEGORY HIGHLIGHT ==========
    function updateActiveCategory() {
      const scrollPos = window.scrollY + 150;
      let currentSection = '';

      document.querySelectorAll('.category-section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          currentSection = section.id;
        }
      });

      document.querySelectorAll('.category-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveCategory);

    // ========== LANGUAGE BUTTONS ==========
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });

    // ========== INIT ==========
    renderSidebar();
    setLanguage(currentLang);
    updateActiveCategory();
  </script>
</body>
</html>`;

writeFileSync(OUTPUT_FILE, html, 'utf-8');

// Copy ai-manifest.json for AI search functionality
if (existsSync(AI_MANIFEST_SRC)) {
  copyFileSync(AI_MANIFEST_SRC, AI_MANIFEST_DEST);
  console.log('✅ Complete standalone HTML created!');
  console.log(`   Output: ${OUTPUT_FILE}`);
  console.log(`   AI Manifest: ${AI_MANIFEST_DEST}`);
} else {
  console.log('✅ Complete standalone HTML created!');
  console.log(`   Output: ${OUTPUT_FILE}`);
  console.log('⚠️  AI manifest not found. Run: npm run generate:ai-manifest');
}

console.log('');
console.log('Features included:');
console.log('   ✓ Hero section with stats');
console.log('   ✓ Sidebar navigation');
console.log('   ✓ Mobile responsive sidebar');
console.log('   ✓ Search functionality');
console.log('   ✓ Language toggle (KO/EN)');
console.log('   ✓ Full pattern modal');
console.log('   ✓ Works offline (no web server needed)');
