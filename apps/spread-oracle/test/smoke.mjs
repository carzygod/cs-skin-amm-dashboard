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

if (!snapshot.platformCoverage || snapshot.platformCoverage.summary.catalogTotal !== 32) {
  throw new Error('expected 32 platforms from CSGOSKINS.GG markets directory')
}

if (snapshot.platformCoverage.summary.sampleQuoteCoverage !== 32) {
  throw new Error('expected sample quote coverage for all 32 platforms')
}

if (!snapshot.oracleResults.every((item) => item.quotes.length === 32)) {
  throw new Error('expected every oracle result to include all 32 platform quotes')
}

if (platformCatalog.length !== 32) {
  throw new Error('expected 32 platforms in platform catalog')
}

if (!platformCatalog.every((platform) => platform.sourceUrl && platform.probeUrl && platform.probeTargetKind)) {
  throw new Error('expected source and connectivity probe target for every platform')
}

for (const requiredPlatform of ['Steam', 'CSFloat', 'Skinport', 'DMarket', 'WAXPEER', 'BUFF163']) {
  if (!platformCatalog.some((platform) => platform.name === requiredPlatform)) {
    throw new Error(`expected platform catalog to include ${requiredPlatform}`)
  }
}

if (!snapshot.opportunities.every((item) => item.feeBreakdown && typeof item.feeBreakdown.depositCost === 'number')) {
  throw new Error('expected deposit cost in fee breakdown')
}

const opportunityPlatforms = new Set(snapshot.opportunities.flatMap((item) => [item.sellPlatformName, item.buyPlatformName]))
if (opportunityPlatforms.size < 10) {
  throw new Error('expected opportunities to cover more than the legacy domestic sample platforms')
}

for (const requiredOpportunityPlatform of ['CS2', 'PirateSwap', 'CS.TRADE']) {
  if (!opportunityPlatforms.has(requiredOpportunityPlatform)) {
    throw new Error(`expected opportunities to include ${requiredOpportunityPlatform}`)
  }
}

const frontend = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8')
if (frontend.includes('待真实接入')) {
  throw new Error('frontend should not show the confusing pending-live-adapter summary label')
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
        netProfitRate: best.netProfitRate,
        totalNetProfit: best.totalNetProfit,
      },
    },
    null,
    2,
  ),
)
