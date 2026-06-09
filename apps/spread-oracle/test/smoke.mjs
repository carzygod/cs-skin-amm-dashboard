import { buildDryRun, buildSnapshot } from '../src/oracle.mjs'

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

if (!snapshot.opportunities.every((item) => item.feeBreakdown && typeof item.feeBreakdown.depositCost === 'number')) {
  throw new Error('expected deposit cost in fee breakdown')
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
