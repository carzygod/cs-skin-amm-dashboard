let snapshot = null
let activeFilter = 'all'

const refs = {
  totalCount: document.querySelector('#totalCount'),
  instantCount: document.querySelector('#instantCount'),
  theoreticalCount: document.querySelector('#theoreticalCount'),
  strongCount: document.querySelector('#strongCount'),
  bestRate: document.querySelector('#bestRate'),
  filterCount: document.querySelector('#filterCount'),
  statusText: document.querySelector('#statusText'),
  opportunityList: document.querySelector('#opportunityList'),
  oracleList: document.querySelector('#oracleList'),
  platformCoverage: document.querySelector('#platformCoverage'),
  dryRunPanel: document.querySelector('#dryRunPanel'),
  dryRunContent: document.querySelector('#dryRunContent'),
}

document.querySelector('#refreshBtn').addEventListener('click', load)
document.querySelector('#closeDryRun').addEventListener('click', () => {
  refs.dryRunPanel.classList.add('hidden')
})

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'))
    button.classList.add('active')
    render()
  })
})

refs.opportunityList.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-dry-run]')
  if (!button) return
  await openExecutionPreview(button.dataset.dryRun)
})

async function load() {
  refs.statusText.textContent = '正在更新行情与费率'

  try {
    const response = await fetch('/api/snapshot')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    snapshot = await response.json()
    refs.statusText.textContent = '行情、费率与流动性已更新'
    render()
  } catch (error) {
    refs.statusText.textContent = `更新失败：${error.message}`
    refs.opportunityList.innerHTML = renderEmpty('暂时无法获取利差机会，请稍后刷新')
  }
}

function render() {
  if (!snapshot) return

  refs.totalCount.textContent = snapshot.summary.total
  refs.instantCount.textContent = snapshot.summary.instantCount
  refs.theoreticalCount.textContent = snapshot.summary.theoreticalCount
  refs.strongCount.textContent = snapshot.summary.strongExecutable
  refs.bestRate.textContent = pct(snapshot.summary.bestNetProfitRate)

  const opportunities = filterOpportunities(snapshot.opportunities)
  refs.filterCount.textContent = `${opportunities.length} 条`
  refs.opportunityList.innerHTML = opportunities.length
    ? opportunities.map(renderOpportunity).join('')
    : renderEmpty('当前筛选条件下没有符合条件的机会')

  refs.oracleList.innerHTML = snapshot.oracleResults.map(renderMarketMatrix).join('')
  refs.platformCoverage.innerHTML = renderPlatformCoverage(snapshot.platformCoverage)
}

function filterOpportunities(opportunities) {
  if (activeFilter === 'instant') return opportunities.filter((item) => item.type === 'INSTANT_BUY_ORDER')
  if (activeFilter === 'theoretical') return opportunities.filter((item) => item.type === 'THEORETICAL_LISTING')
  if (activeFilter === 'strong') return opportunities.filter((item) => item.level === 'STRONG_EXECUTABLE')
  if (activeFilter === 'watch') return opportunities.filter((item) => item.level !== 'STRONG_EXECUTABLE')
  return opportunities
}

function renderOpportunity(item) {
  const levelClass = item.level === 'STRONG_EXECUTABLE' ? 'strong' : item.level === 'WATCH_ONLY' ? 'watch' : 'verify'
  const typeClass = item.type === 'INSTANT_BUY_ORDER' ? 'instant' : 'theoretical'
  const scoreLabel = item.type === 'INSTANT_BUY_ORDER' ? '成交确定性' : '挂单成交评分'
  const scoreValue = item.type === 'INSTANT_BUY_ORDER' ? item.liquidityScore : item.listingFillProbability
  const reasons = item.rejectReasons.length
    ? `<ul class="reason-list">${item.rejectReasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('')}</ul>`
    : ''
  const notes = item.notes.length
    ? `<div class="note-strip">${item.notes.map((note) => `<span>${escapeHtml(note)}</span>`).join('')}</div>`
    : ''

  return `
    <article class="opportunity-card ${typeClass}">
      <div class="card-head">
        <div class="title-stack">
          <div class="pill-row">
            <span class="type-pill ${typeClass}">${escapeHtml(displayTypeName(item.type))}</span>
            <span class="status-pill ${levelClass}">${levelName(item.level)}</span>
          </div>
          <h3>${escapeHtml(item.cnName)}</h3>
          <p>${escapeHtml(item.itemName)}</p>
        </div>
        <div class="profit-stamp">
          <span>净利率</span>
          <strong>${pct(item.netProfitRate)}</strong>
        </div>
      </div>

      <div class="route-map">
        <div class="route-node">
          <span>${escapeHtml(item.sellActionName)}</span>
          <strong>${escapeHtml(item.sellPlatformName)} · ${formatMoney(item.sellPrice)}</strong>
        </div>
        <div class="route-node">
          <span>${escapeHtml(item.buyActionName)}</span>
          <strong>${escapeHtml(item.buyPlatformName)} · ${formatMoney(item.buyPrice)}</strong>
        </div>
      </div>

      <div class="metric-grid compact">
        <div><span>数量</span><strong>${item.quantity}</strong></div>
        <div><span>预计净收益</span><strong>${formatMoney(item.totalNetProfit)}</strong></div>
        <div><span>单件收益</span><strong>${formatMoney(item.unitNetProfit)}</strong></div>
        <div><span>流动性</span><strong>${pct(item.liquidityScore)}</strong></div>
        <div><span>${scoreLabel}</span><strong>${pct(scoreValue)}</strong></div>
        <div><span>可信度</span><strong>${confidenceName(item.confidence)}</strong></div>
      </div>

      <div class="fee-grid">
        <span>卖出费用 ${formatMoney(item.feeBreakdown.sellFee)}</span>
        <span>买入费用 ${formatMoney(item.feeBreakdown.buyFee)}</span>
        <span>资金成本 ${formatMoney(item.feeBreakdown.depositCost)}</span>
        <span>风险缓冲 ${formatMoney(item.feeBreakdown.riskBuffer)}</span>
      </div>

      ${notes}
      ${reasons}

      <div class="card-actions">
        <span>${escapeHtml(displayExecutionLabel(item))}</span>
        <button class="dry-run-button" data-dry-run="${escapeAttr(item.opportunityId)}" type="button">查看操作预案</button>
      </div>
    </article>
  `
}

function renderMarketMatrix(item) {
  return `
    <article class="oracle-card">
      <div class="oracle-head">
        <div>
          <h3>${escapeHtml(item.cnName)}</h3>
          <p>${escapeHtml(item.itemName)}</p>
        </div>
        <span>${confidenceName(item.confidence)}</span>
      </div>
      <div class="reference-row">
        <span>参考价 ${formatMoney(item.referencePrice)}</span>
        <span>综合估值 ${formatMoney(item.fairPrice)}</span>
        <span>目标 ${item.targetQuantity} 件</span>
      </div>
      <div class="quote-table-wrap">
        <table class="quote-table">
          <thead>
            <tr>
              <th>平台</th>
              <th>求购均价</th>
              <th>现货均价</th>
              <th>挂单参考价</th>
              <th>流动性</th>
            </tr>
          </thead>
          <tbody>
            ${item.quotes.map(renderQuoteRow).join('')}
          </tbody>
        </table>
      </div>
    </article>
  `
}

function renderQuoteRow(quote) {
  return `
    <tr>
      <td>${escapeHtml(quote.platformName)}</td>
      <td>${formatOptionalMoney(quote.takerSellPrice)}</td>
      <td>${formatOptionalMoney(quote.spotBuyPrice)}</td>
      <td>${formatOptionalMoney(quote.theoreticalListingPrice)}</td>
      <td>${pct(quote.liquidityScore)}</td>
    </tr>
  `
}

function renderPlatformCoverage(coverage) {
  if (!coverage) return renderEmpty('平台目录暂不可用')

  return `
    <div class="coverage-summary">
      <div><span>目录平台</span><strong>${coverage.summary.catalogTotal}</strong></div>
      <div><span>已纳入</span><strong>${coverage.summary.directoryCovered}</strong></div>
      <div><span>待真实接入</span><strong>${coverage.summary.pendingLiveAdapters}</strong></div>
    </div>
    <div class="platform-source">
      <span>来源</span>
      <a href="${escapeAttr(coverage.source.url)}" target="_blank" rel="noreferrer">${escapeHtml(coverage.source.name)}</a>
    </div>
    <div class="platform-list">
      ${coverage.catalog.map(renderPlatformItem).join('')}
    </div>
  `
}

function renderPlatformItem(platform) {
  return `
    <article class="platform-item">
      <div>
        <strong>${escapeHtml(platform.name)}</strong>
        <span>${escapeHtml(platform.marketType)} · 评分 ${Number(platform.marketStats.rating).toFixed(1)}</span>
      </div>
      <em>${platform.pricingModelStatus === 'PRICING_MODEL_SAMPLE' ? '计算模型已校验' : '真实行情待接入'}</em>
    </article>
  `
}

async function openExecutionPreview(opportunityId) {
  refs.statusText.textContent = '正在生成操作预案'
  const response = await fetch('/api/precheck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ opportunityId }),
  })

  if (!response.ok) {
    refs.statusText.textContent = '操作预案生成失败'
    return
  }

  const plan = await response.json()
  refs.statusText.textContent = '操作预案已生成'
  renderExecutionPreview(plan)
}

function renderExecutionPreview(plan) {
  refs.dryRunPanel.classList.remove('hidden')
  refs.dryRunContent.innerHTML = `
    <article class="dry-run-card">
      <div class="pill-row">
        <span class="type-pill ${plan.opportunity.type === 'INSTANT_BUY_ORDER' ? 'instant' : 'theoretical'}">
          ${escapeHtml(displayTypeName(plan.opportunity.type))}
        </span>
        <span class="status-pill ${plan.opportunity.executable ? 'strong' : 'watch'}">
          ${escapeHtml(displayExecutionLabel(plan.opportunity))}
        </span>
      </div>
      <h3>${escapeHtml(plan.opportunity.cnName)}</h3>
      <p>${escapeHtml(plan.opportunity.sellPlatformName)} -> ${escapeHtml(plan.opportunity.buyPlatformName)}</p>
      <div class="dry-run-section">
        <h4>预检步骤</h4>
        <ol>${plan.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
      </div>
      <div class="dry-run-section">
        <h4>操作提醒</h4>
        <ul>${plan.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('')}</ul>
      </div>
    </article>
  `
  refs.dryRunPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function renderEmpty(text) {
  return `<div class="empty-state">${escapeHtml(text)}</div>`
}

function displayTypeName(type) {
  return {
    INSTANT_BUY_ORDER: '即时成交机会',
    THEORETICAL_LISTING: '挂单观察机会',
  }[type] || type
}

function displayExecutionLabel(item) {
  if (item.type === 'THEORETICAL_LISTING') return '仅用于观察，不建议直接操作'
  return item.executable ? '通过基础预检，可进入下一步审核' : '需要复核后再操作'
}

function levelName(level) {
  return {
    STRONG_EXECUTABLE: '可操作',
    WATCH_ONLY: '待观察',
    NEEDS_VERIFICATION: '需复核',
    REJECTED: '已过滤',
  }[level] || level
}

function confidenceName(value) {
  return {
    HIGH: '高',
    MEDIUM: '中',
    LOW: '低',
    INVALID: '无效',
  }[value] || value
}

function pct(value) {
  return `${((Number(value) || 0) * 100).toFixed(2)}%`
}

function formatMoney(value) {
  return `￥${Number(value || 0).toFixed(2)}`
}

function formatOptionalMoney(value) {
  return value === null || value === undefined ? '-' : formatMoney(value)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttr(value) {
  return escapeHtml(value)
}

load()
