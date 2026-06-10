let snapshot = null
let connectivity = null
let activeFilter = 'all'
let activeView = 'overview'
const opportunityControls = {
  sortMode: 'net-desc',
  spreadBasis: 'net',
  minSpread: '',
  maxSpread: '',
  sellExchange: '',
  buyExchange: '',
}

const viewTitles = {
  overview: '总览',
  opportunities: '利差机会',
  exchanges: '交易所列表',
  markets: '平台行情',
  precheck: '操作预案',
}

const refs = {
  viewTitle: document.querySelector('#viewTitle'),
  sidebarPlatformCount: document.querySelector('#sidebarPlatformCount'),
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
  exchangeSummary: document.querySelector('#exchangeSummary'),
  exchangeList: document.querySelector('#exchangeList'),
  dryRunContent: document.querySelector('#dryRunContent'),
  sortMode: document.querySelector('#sortMode'),
  spreadBasis: document.querySelector('#spreadBasis'),
  minSpread: document.querySelector('#minSpread'),
  maxSpread: document.querySelector('#maxSpread'),
  sellExchangeFilter: document.querySelector('#sellExchangeFilter'),
  buyExchangeFilter: document.querySelector('#buyExchangeFilter'),
  resetOpportunityFilters: document.querySelector('#resetOpportunityFilters'),
}

document.querySelector('#refreshBtn').addEventListener('click', load)
document.querySelector('#refreshConnectivityBtn').addEventListener('click', () => loadConnectivity({ force: true }))
document.querySelector('#closeDryRun').addEventListener('click', () => {
  refs.dryRunContent.innerHTML = '选择一条利差机会后查看操作预案'
  refs.dryRunContent.classList.add('empty-state')
})

document.querySelectorAll('.side-tab').forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.view))
})

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'))
    button.classList.add('active')
    renderOpportunities()
  })
})

for (const [key, element] of [
  ['sortMode', refs.sortMode],
  ['spreadBasis', refs.spreadBasis],
  ['minSpread', refs.minSpread],
  ['maxSpread', refs.maxSpread],
  ['sellExchange', refs.sellExchangeFilter],
  ['buyExchange', refs.buyExchangeFilter],
]) {
  element?.addEventListener(element.tagName === 'INPUT' ? 'input' : 'change', () => {
    opportunityControls[key] = element.value
    renderOpportunities()
  })
}

refs.resetOpportunityFilters?.addEventListener('click', () => {
  Object.assign(opportunityControls, {
    sortMode: 'net-desc',
    spreadBasis: 'net',
    minSpread: '',
    maxSpread: '',
    sellExchange: '',
    buyExchange: '',
  })
  syncOpportunityControls()
  renderOpportunities()
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
    if (activeView === 'exchanges') await loadConnectivity()
  } catch (error) {
    refs.statusText.textContent = `更新失败：${error.message}`
    refs.opportunityList.innerHTML = renderEmpty('暂时无法获取利差机会，请稍后刷新')
  }
}

async function loadConnectivity({ force = false } = {}) {
  const total = snapshot?.platformCoverage?.catalog?.length || 0
  refs.exchangeSummary.innerHTML = renderExchangeSummary(connectivity, total)
  refs.statusText.textContent = '正在检测平台连通性'

  try {
    const response = await fetch(`/api/platform-connectivity${force ? '?refresh=1' : ''}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    connectivity = await response.json()
    refs.statusText.textContent = '平台连通性已更新'
    renderExchanges()
  } catch (error) {
    refs.statusText.textContent = `连通性检测失败：${error.message}`
    refs.exchangeSummary.innerHTML = renderExchangeSummary(connectivity, total)
  }
}

function showView(view) {
  activeView = view
  refs.viewTitle.textContent = viewTitles[view] || view

  document.querySelectorAll('.side-tab').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view)
  })
  document.querySelectorAll('[data-view-panel]').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.viewPanel === view)
  })

  if (view === 'exchanges' && !connectivity) loadConnectivity()
}

function render() {
  if (!snapshot) return

  refs.totalCount.textContent = snapshot.summary.total
  refs.instantCount.textContent = snapshot.summary.instantCount
  refs.theoreticalCount.textContent = snapshot.summary.theoreticalCount
  refs.strongCount.textContent = snapshot.summary.strongExecutable
  refs.bestRate.textContent = pct(snapshot.summary.bestNetProfitRate)
  refs.sidebarPlatformCount.textContent = `${snapshot.platformCoverage.summary.catalogTotal} 个平台`

  refs.platformCoverage.innerHTML = renderPlatformCoverage(snapshot.platformCoverage)
  refs.oracleList.innerHTML = snapshot.oracleResults.map(renderMarketMatrix).join('')
  populateExchangeFilters()
  renderOpportunities()
  renderExchanges()
}

function renderOpportunities() {
  if (!snapshot) return
  const opportunities = filterOpportunities(snapshot.opportunities)
  refs.filterCount.textContent = `${opportunities.length} 条`
  refs.opportunityList.innerHTML = opportunities.length
    ? opportunities.map(renderOpportunity).join('')
    : renderEmpty('当前筛选条件下没有符合条件的机会')
}

function filterOpportunities(opportunities) {
  const minSpread = parseSpreadInput(opportunityControls.minSpread)
  const maxSpread = parseSpreadInput(opportunityControls.maxSpread)
  const basisField = opportunityControls.spreadBasis === 'gross' ? 'grossProfitRate' : 'netProfitRate'

  const filtered = opportunities.filter((item) => {
    if (activeFilter === 'instant' && item.type !== 'INSTANT_BUY_ORDER') return false
    if (activeFilter === 'theoretical' && item.type !== 'THEORETICAL_LISTING') return false
    if (activeFilter === 'strong' && item.level !== 'STRONG_EXECUTABLE') return false
    if (activeFilter === 'watch' && item.level === 'STRONG_EXECUTABLE') return false
    if (opportunityControls.sellExchange && item.sellPlatformId !== opportunityControls.sellExchange) return false
    if (opportunityControls.buyExchange && item.buyPlatformId !== opportunityControls.buyExchange) return false

    const spread = Number(item[basisField]) || 0
    if (minSpread !== null && spread < minSpread) return false
    if (maxSpread !== null && spread > maxSpread) return false
    return true
  })

  return sortOpportunities(filtered)
}

function renderOpportunity(item) {
  const levelClass = item.level === 'STRONG_EXECUTABLE' ? 'strong' : item.level === 'WATCH_ONLY' ? 'watch' : 'verify'
  const typeClass = item.type === 'INSTANT_BUY_ORDER' ? 'instant' : 'theoretical'
  const scoreLabel = item.type === 'INSTANT_BUY_ORDER' ? '成交确定性' : '挂单成交评分'
  const scoreValue = item.type === 'INSTANT_BUY_ORDER' ? item.liquidityScore : item.listingFillProbability
  const feeRates = item.feeRateBreakdown || { sell: {}, buy: {} }
  const fees = item.feeBreakdown || {}
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
          <span>净利差</span>
          <strong>${pct(item.netProfitRate)}</strong>
          <small>毛利差 ${pct(item.grossProfitRate)}</small>
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
        <div><span>毛利润</span><strong>${formatMoney(item.totalGrossProfit)}</strong></div>
        <div><span>净利润</span><strong>${formatMoney(item.totalNetProfit)}</strong></div>
        <div><span>单件净利</span><strong>${formatMoney(item.unitNetProfit)}</strong></div>
        <div><span>毛利差</span><strong>${pct(item.grossProfitRate)}</strong></div>
        <div><span>净利差</span><strong>${pct(item.netProfitRate)}</strong></div>
        <div><span>手续费估算</span><strong>${formatMoney(item.estimatedFeeTotal)}</strong></div>
        <div><span>总成本率</span><strong>${pct(item.totalCostRate)}</strong></div>
        <div><span>流动性</span><strong>${pct(item.liquidityScore)}</strong></div>
        <div><span>${scoreLabel}</span><strong>${pct(scoreValue)}</strong></div>
        <div><span>可信度</span><strong>${confidenceName(item.confidence)}</strong></div>
      </div>

      <div class="fee-grid">
        <span>卖出费率 ${pct(feeRates.sell.totalFeeRate)}</span>
        <span>买入费率 ${pct(feeRates.buy.totalFeeRate)}</span>
        <span>充值成本率 ${pct(feeRates.buy.depositCostRate)}</span>
        <span>汇率成本率 ${pct(feeRates.buy.fxCostRate)}</span>
        <span>卖出费用 ${formatMoney(fees.sellFee)}</span>
        <span>买入费用 ${formatMoney(fees.buyFee)}</span>
        <span>充值成本 ${formatMoney(fees.depositCost)}</span>
        <span>汇率成本 ${formatMoney(fees.fxCost)}</span>
        <span>总手续费 ${formatMoney(fees.estimatedFeeTotal)}</span>
        <span>风险缓冲 ${formatMoney(fees.riskBuffer)}</span>
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
      <div><span>样例行情覆盖</span><strong>${coverage.summary.sampleQuoteCoverage || coverage.summary.pricingModelSample}</strong></div>
      <div><span>正式接口接入</span><strong>${coverage.summary.liveConnected}</strong></div>
    </div>
    <div class="platform-source">
      <span>来源</span>
      <a href="${escapeAttr(coverage.source.url)}" target="_blank" rel="noreferrer">${escapeHtml(coverage.source.name)}</a>
    </div>
  `
}

function renderExchanges() {
  if (!snapshot?.platformCoverage) return

  const catalog = snapshot.platformCoverage.catalog
  const connectionMap = new Map((connectivity?.items || []).map((item) => [item.platformId, item]))
  refs.exchangeSummary.innerHTML = renderExchangeSummary(connectivity, catalog.length)
  refs.exchangeList.innerHTML = catalog.map((platform) => renderExchangeRow(platform, connectionMap.get(platform.platformId))).join('')
}

function renderExchangeSummary(data, total) {
  const summary = data?.summary

  return `
    <div class="exchange-metric"><span>支持平台</span><strong>${total}</strong></div>
    <div class="exchange-metric"><span>在线/可访问</span><strong>${summary ? summary.online + summary.reachable : '-'}</strong></div>
    <div class="exchange-metric"><span>超时/不可达</span><strong>${summary ? summary.timeout + summary.offline : '-'}</strong></div>
    <div class="exchange-metric"><span>中位延迟</span><strong>${Number.isFinite(summary?.medianLatencyMs) ? `${summary.medianLatencyMs}ms` : '-'}</strong></div>
  `
}

function renderExchangeRow(platform, connection) {
  const status = connection?.connectivityStatus || 'PENDING'
  const latency = Number.isFinite(connection?.latencyMs) ? `${connection.latencyMs}ms` : '-'
  const httpStatus = connection?.httpStatus || '-'
  const probeLabel = platform.probeTargetKind === 'direct' ? '平台官网' : '目录页'
  const quoteStatus = platform.quoteCoverageStatus === 'SAMPLE_QUOTES_AVAILABLE' ? '样例行情覆盖' : '仅目录信息'
  const liveStatus = platform.liveConnectionStatus === 'NOT_CONNECTED' ? '正式接口待接入' : platform.liveConnectionStatus
  const feeStatus =
    platform.feeProfileStatus === 'CATALOG_ESTIMATED'
      ? '估算费率'
      : platform.feeProfileStatus === 'REQUIRES_PLATFORM_VERIFICATION'
        ? '费率待验证'
        : platform.feeProfileStatus

  return `
    <article class="exchange-row">
      <div class="exchange-main">
        <strong>${escapeHtml(platform.name)}</strong>
        <span>${escapeHtml(platform.marketType)} · 评分 ${Number(platform.marketStats.rating).toFixed(1)} · ${escapeHtml(platform.marketStats.marketValue)}</span>
      </div>
      <div class="exchange-badges">
        <span class="connectivity-pill ${status.toLowerCase()}">${connectivityName(status)}</span>
        <span>${latency}</span>
        <span>HTTP ${httpStatus}</span>
        <span>${escapeHtml(quoteStatus)}</span>
        <span>${escapeHtml(liveStatus)}</span>
        <span>${escapeHtml(feeStatus)}</span>
        <a href="${escapeAttr(connection?.probeUrl || platform.probeUrl)}" target="_blank" rel="noreferrer">${probeLabel}</a>
      </div>
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
  showView('precheck')
}

function renderExecutionPreview(plan) {
  refs.dryRunContent.classList.remove('empty-state')
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
}

function renderEmpty(text) {
  return `<div class="empty-state">${escapeHtml(text)}</div>`
}

function parseSpreadInput(value) {
  const text = String(value ?? '').trim()
  if (!text) return null
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed / 100 : null
}

function sortOpportunities(opportunities) {
  const sorters = {
    'net-desc': (a, b) => b.netProfitRate - a.netProfitRate,
    'net-asc': (a, b) => a.netProfitRate - b.netProfitRate,
    'gross-desc': (a, b) => b.grossProfitRate - a.grossProfitRate,
    'gross-asc': (a, b) => a.grossProfitRate - b.grossProfitRate,
    'profit-desc': (a, b) => b.totalNetProfit - a.totalNetProfit,
    'fee-asc': (a, b) => a.estimatedFeeTotal - b.estimatedFeeTotal,
  }
  const sorter = sorters[opportunityControls.sortMode] || sorters['net-desc']
  return [...opportunities].sort((a, b) => sorter(a, b) || opportunityTieBreak(a, b))
}

function opportunityTieBreak(a, b) {
  const levelScore = {
    STRONG_EXECUTABLE: 4,
    WATCH_ONLY: 2,
    NEEDS_VERIFICATION: 1,
    REJECTED: 0,
  }
  const typeScore = {
    INSTANT_BUY_ORDER: 2,
    THEORETICAL_LISTING: 1,
  }

  return (
    (levelScore[b.level] || 0) - (levelScore[a.level] || 0) ||
    (typeScore[b.type] || 0) - (typeScore[a.type] || 0) ||
    b.totalNetProfit - a.totalNetProfit ||
    b.liquidityScore - a.liquidityScore ||
    a.opportunityId.localeCompare(b.opportunityId)
  )
}

function populateExchangeFilters() {
  if (!snapshot) return
  const catalogOptions = (snapshot.platformCoverage?.catalog || []).map((platform) => ({
    id: platform.platformId,
    name: platform.name,
  }))
  const opportunityOptions = Array.from(
    new Map(
      snapshot.opportunities.flatMap((item) => [
        [item.sellPlatformId, { id: item.sellPlatformId, name: item.sellPlatformName }],
        [item.buyPlatformId, { id: item.buyPlatformId, name: item.buyPlatformName }],
      ]),
    ).values(),
  )
  const options = (catalogOptions.length ? catalogOptions : opportunityOptions).sort((a, b) => a.name.localeCompare(b.name))

  syncExchangeSelect(refs.sellExchangeFilter, options, '任意卖出交易所', 'sellExchange')
  syncExchangeSelect(refs.buyExchangeFilter, options, '任意买入交易所', 'buyExchange')
}

function syncExchangeSelect(element, options, placeholder, key) {
  if (!element) return
  const current = opportunityControls[key]
  element.innerHTML = [
    `<option value="">${escapeHtml(placeholder)}</option>`,
    ...options.map((platform) => `<option value="${escapeAttr(platform.id)}">${escapeHtml(platform.name)}</option>`),
  ].join('')
  const stillExists = !current || options.some((platform) => platform.id === current)
  opportunityControls[key] = stillExists ? current : ''
  element.value = opportunityControls[key]
}

function syncOpportunityControls() {
  refs.sortMode.value = opportunityControls.sortMode
  refs.spreadBasis.value = opportunityControls.spreadBasis
  refs.minSpread.value = opportunityControls.minSpread
  refs.maxSpread.value = opportunityControls.maxSpread
  refs.sellExchangeFilter.value = opportunityControls.sellExchange
  refs.buyExchangeFilter.value = opportunityControls.buyExchange
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

function connectivityName(status) {
  return {
    ONLINE: '在线',
    REACHABLE: '可访问',
    DEGRADED: '异常',
    TIMEOUT: '超时',
    OFFLINE: '不可达',
    UNKNOWN: '未知',
    PENDING: '待检测',
  }[status] || status
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
