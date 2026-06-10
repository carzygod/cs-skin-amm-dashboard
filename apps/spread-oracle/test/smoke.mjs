import { buildDryRun, buildSnapshot } from '../src/oracle.mjs'
import { platformCatalog } from '../src/platform-catalog.mjs'
import { readFileSync } from 'node:fs'

const snapshot = buildSnapshot()

if (!snapshot.opportunities.length) {
  throw new Error('expected opportunities')
}

if (!snapshot.oracleResults.every((item) => typeof item.referencePrice === 'number')) {
  throw new Error('expected oracle reference prices')
}

const instant = snapshot.opportunities.find((item) => item.type === 'INSTANT_BUY_ORDER')
if (!instant) {
  throw new Error('expected instant buy-order opportunity')
}

const theoretical = snapshot.opportunities.find((item) => item.type === 'THEORETICAL_LISTING')
if (!theoretical) {
  throw new Error('expected theoretical listing opportunity')
}

if (!snapshot.summary.instantCount || !snapshot.summary.theoreticalCount) {
  throw new Error('expected split summary counters')
}

if (!snapshot.platformCoverage || snapshot.platformCoverage.summary.catalogTotal !== 33) {
  throw new Error('expected 33 platforms including market.csgo.com')
}

if (snapshot.platformCoverage.summary.sampleQuoteCoverage !== 33) {
  throw new Error('expected sample quote coverage for all 33 platforms')
}

if (!snapshot.oracleResults.every((item) => item.quotes.length === 33)) {
  throw new Error('expected every oracle result to include all 33 platform quotes')
}

if (platformCatalog.length !== 33) {
  throw new Error('expected 33 platforms in platform catalog')
}

if (!platformCatalog.every((platform) => platform.sourceUrl && platform.probeUrl && platform.probeTargetKind)) {
  throw new Error('expected source and connectivity probe target for every platform')
}

for (const requiredPlatform of ['Steam', 'CSFloat', 'Skinport', 'DMarket', 'WAXPEER', 'BUFF163', 'CSGO Market']) {
  if (!platformCatalog.some((platform) => platform.name === requiredPlatform)) {
    throw new Error(`expected platform catalog to include ${requiredPlatform}`)
  }
}

const categoryCounts = snapshot.items.reduce((counts, item) => {
  counts[item.category] = (counts[item.category] || 0) + 1
  return counts
}, {})

if (
  categoryCounts.WEAPON_CASE !== 45 ||
  categoryCounts.STICKER_CAPSULE !== 48 ||
  categoryCounts.AUTOGRAPH_CAPSULE !== 48 ||
  categoryCounts.STICKER !== 48
) {
  throw new Error(`expected container and sticker-only item universe, got ${JSON.stringify(categoryCounts)}`)
}

const allowedCategories = new Set(['WEAPON_CASE', 'STICKER_CAPSULE', 'AUTOGRAPH_CAPSULE', 'STICKER'])
if (!snapshot.items.every((item) => allowedCategories.has(item.category))) {
  throw new Error('expected only weapon cases, sticker capsules, autograph capsules, and stickers')
}

for (const removedSkin of ['AK-47 | Redline', 'AWP | Asiimov', 'M4A1-S | Printstream', 'USP-S | Kill Confirmed']) {
  if (snapshot.items.some((item) => item.name.includes(removedSkin))) {
    throw new Error(`expected skin sample to be removed: ${removedSkin}`)
  }
}

for (const requiredItem of ['CS:GO Weapon Case', 'Revolution Case', 'Sticker Capsule 2', 'Paris 2023 Legends Sticker Capsule']) {
  if (!snapshot.items.some((item) => item.name === requiredItem)) {
    throw new Error(`expected item universe to include ${requiredItem}`)
  }
}

if (!snapshot.opportunities.every((item) => item.feeBreakdown && typeof item.feeBreakdown.depositCost === 'number')) {
  throw new Error('expected deposit cost in fee breakdown')
}

for (const opportunity of snapshot.opportunities) {
  for (const field of [
    'unitGrossProfit',
    'totalGrossProfit',
    'grossProfitRate',
    'unitNetProfit',
    'totalNetProfit',
    'netProfitRate',
    'estimatedFeeTotal',
    'estimatedFeeRate',
    'totalCostWithRisk',
    'totalCostRate',
  ]) {
    if (!Number.isFinite(opportunity[field])) {
      throw new Error(`expected finite opportunity economics field: ${field}`)
    }
  }

  if (opportunity.totalGrossProfit < opportunity.totalNetProfit) {
    throw new Error('expected net profit to be no greater than gross profit after fees and risk buffer')
  }

  if (!opportunity.feeRateBreakdown?.sell || !opportunity.feeRateBreakdown?.buy) {
    throw new Error('expected sell and buy fee rate breakdown')
  }

  if (!Number.isFinite(opportunity.feeRateBreakdown.buy.depositCostRate)) {
    throw new Error('expected deposit cost rate in buy fee rate breakdown')
  }

  if (!Number.isFinite(opportunity.feeBreakdown.estimatedFeeTotal)) {
    throw new Error('expected estimated fee total in fee breakdown')
  }
}

const opportunityPlatforms = new Set(snapshot.opportunities.flatMap((item) => [item.sellPlatformName, item.buyPlatformName]))
if (opportunityPlatforms.size < 10) {
  throw new Error('expected opportunities to cover more than the legacy domestic sample platforms')
}

for (const requiredOpportunityPlatform of ['CS2', 'PirateSwap', 'CS.TRADE', 'CSGO Market']) {
  if (!opportunityPlatforms.has(requiredOpportunityPlatform)) {
    throw new Error(`expected opportunities to include ${requiredOpportunityPlatform}`)
  }
}

const frontend = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8')
if (frontend.includes('待真实接入')) {
  throw new Error('frontend should not show the confusing pending-live-adapter summary label')
}

for (const expectedText of ['毛利差', '净利差', '充值成本', 'function sortOpportunities', 'function populateExchangeFilters']) {
  if (!frontend.includes(expectedText)) {
    throw new Error(`expected frontend to include ${expectedText}`)
  }
}

const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8')
for (const expectedControl of [
  'sortMode',
  'spreadBasis',
  'minSpread',
  'maxSpread',
  'sellExchangeFilter',
  'buyExchangeFilter',
]) {
  if (!html.includes(expectedControl)) {
    throw new Error(`expected opportunity filter control: ${expectedControl}`)
  }
}

const best = snapshot.opportunities[0]
if (!best.opportunityId || typeof best.netProfitRate !== 'number') {
  throw new Error('expected ranked opportunity')
}

const dryRun = buildDryRun(best.opportunityId)
if (!dryRun || dryRun.mode !== 'PRECHECK' || !dryRun.steps.length) {
  throw new Error('expected precheck plan')
}

console.log(
  JSON.stringify(
    {
      ok: true,
      summary: snapshot.summary,
      platforms: snapshot.platformCoverage.summary,
      best: {
        id: best.opportunityId,
        type: best.type,
        level: best.level,
        grossProfitRate: best.grossProfitRate,
        netProfitRate: best.netProfitRate,
        totalGrossProfit: best.totalGrossProfit,
        totalNetProfit: best.totalNetProfit,
        estimatedFeeTotal: best.estimatedFeeTotal,
      },
    },
    null,
    2,
  ),
)
