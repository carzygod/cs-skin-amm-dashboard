import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const docs = [
  ['需求文档', 'docs/需求文档.md'],
  ['开发文档', 'docs/开发文档.md'],
  ['数据采集与价格预言机', 'docs/数据采集与价格预言机.md'],
  ['平台接入矩阵', 'docs/平台接入矩阵.md'],
  ['恢复说明', 'docs/恢复说明.md'],
]

const chromePath = process.env.CHROME_PATH || 'google-chrome'
const tempDir = await mkdtemp(join(tmpdir(), 'cs-amm-docs-'))
const htmlPath = join(tempDir, 'docs.html')
const pdfPath = resolve('docs/恢复文档合集.pdf')

const sections = []
for (const [title, file] of docs) {
  const markdown = await readFile(file, 'utf8')
  sections.push(`<section class="doc-section"><h1>${escapeHtml(title)}</h1>${renderMarkdown(markdown)}</section>`)
}

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>CS-AMM 文档合集</title>
<style>
@page { size: A4; margin: 14mm 12mm 15mm; }
* { box-sizing: border-box; }
body {
  margin: 0;
  color: #172033;
  font-family: "Microsoft YaHei", "Noto Sans CJK SC", "PingFang SC", Arial, sans-serif;
  font-size: 10px;
  line-height: 1.62;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.cover {
  min-height: 265mm;
  padding: 24mm 14mm;
  background: linear-gradient(135deg, #f5f1ff, #ffffff 56%, #eefbff);
  border: 1px solid #dce5ee;
  page-break-after: always;
}
.cover h1 {
  margin: 26mm 0 8mm;
  font-size: 30px;
  color: #10233d;
}
.cover p {
  max-width: 150mm;
  color: #526175;
  font-size: 12px;
}
.pill {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  background: #eee8ff;
  color: #5532b8;
  font-weight: 700;
}
.doc-section {
  page-break-before: always;
}
.doc-section:first-of-type {
  page-break-before: auto;
}
h1 {
  color: #10233d;
  font-size: 24px;
  margin: 0 0 12px;
}
h2 {
  margin: 16px 0 8px;
  padding: 7px 9px;
  color: #10233d;
  font-size: 16px;
  border-left: 5px solid #5532b8;
  background: #f3f0ff;
  border-radius: 5px;
}
h3 {
  color: #173d63;
  font-size: 12px;
  margin: 12px 0 6px;
}
p { margin: 5px 0 8px; }
ul, ol { margin: 5px 0 9px; padding-left: 18px; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0 12px;
  font-size: 8.2px;
  break-inside: avoid;
}
th {
  background: #1f2947;
  color: #fff;
  padding: 5px;
  border: 1px solid #1f2947;
  text-align: left;
}
td {
  padding: 5px;
  border: 1px solid #d7e1eb;
  vertical-align: top;
}
tr:nth-child(even) td { background: #f7fafc; }
pre {
  background: #10172a;
  color: #f7fafc;
  padding: 8px;
  border-radius: 6px;
  font-size: 8px;
  white-space: pre-wrap;
}
code {
  font-family: Consolas, monospace;
}
</style>
</head>
<body>
<section class="cover">
  <span class="pill">CS-AMM</span>
  <h1>CS2 饰品库存对敲套利系统文档合集</h1>
  <p>本 PDF 汇总需求文档、开发文档、数据采集与价格预言机设计、恢复说明。内容用于工程恢复、继续开发和后续验收，不包含时间戳、账号凭证、会话、令牌或支付信息。</p>
</section>
${sections.join('\n')}
</body>
</html>`

await writeFile(htmlPath, html, 'utf8')
execFileSync(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  htmlPath,
])
await rm(tempDir, { recursive: true, force: true })
console.log(`rendered ${pdfPath}`)

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/)
  let html = ''
  let inCode = false
  let code = []
  let table = []
  let list = []

  function flushList() {
    if (!list.length) return
    html += `<ul>${list.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`
    list = []
  }

  function flushTable() {
    if (!table.length) return
    const rows = table.filter((row) => !/^\s*\|?\s*:?-+/.test(row.replace(/\|/g, '')))
    const parsed = rows.map((row) =>
      row
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => inline(cell.trim())),
    )
    const [head, ...body] = parsed
    html += '<table>'
    if (head) html += `<thead><tr>${head.map((cell) => `<th>${cell}</th>`).join('')}</tr></thead>`
    html += `<tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>`
    html += '</table>'
    table = []
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      flushList()
      flushTable()
      if (inCode) {
        html += `<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`
        code = []
        inCode = false
      } else {
        inCode = true
      }
      continue
    }

    if (inCode) {
      code.push(line)
      continue
    }

    if (line.startsWith('|')) {
      flushList()
      table.push(line)
      continue
    }

    flushTable()

    if (line.startsWith('### ')) {
      flushList()
      html += `<h3>${inline(line.slice(4))}</h3>`
    } else if (line.startsWith('## ')) {
      flushList()
      html += `<h2>${inline(line.slice(3))}</h2>`
    } else if (line.startsWith('# ')) {
      flushList()
      html += `<h1>${inline(line.slice(2))}</h1>`
    } else if (/^\s*-\s+/.test(line)) {
      list.push(line.replace(/^\s*-\s+/, ''))
    } else if (/^\s*\d+\.\s+/.test(line)) {
      list.push(line.replace(/^\s*\d+\.\s+/, ''))
    } else if (line.trim()) {
      flushList()
      html += `<p>${inline(line)}</p>`
    } else {
      flushList()
    }
  }

  flushList()
  flushTable()
  return html
}

function inline(value) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
