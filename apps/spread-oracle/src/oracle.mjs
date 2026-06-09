import { balances, inventory, items, orderBooks, platforms } from './sample-data.mjs'
import { buildPlatformCoverage } from './platform-catalog.mjs'

const LEVEL_SCORE = {
  STRONG_EXECUTABLE: 4,
  WATCH_ONLY: 2,
  NEEDS_VERIFICATION: 1,
  REJECTED: 0,
}

const TYPE_SCORE = {
  INSTANT_BUY_ORDER: 2,
  THEORETICAL_LISTING: 1,
}

const OPPORTUNITY_TYPES = {
  INSTANT_BUY_ORDER: {
    label: '即时成交机会',
    executionClass: 'IMMEDIATE',
    executionLabel: '通过基础预检，可进入下一步审核',
    thesis: '卖出端匹配已有求购订单，买入端同步从现货卖盘补回库存，成交确定性较高。',
  },
  THEORETICAL_LISTING: {
    label: '挂单观察机会',
    executionClass: 'THEORETICAL',
    executionLabel: '仅用于观察，不建议直接操作',
    thesis: '买入成本低于目标挂单价，但成交依赖排队位置、成交速度和价格波动。',
  },
}

const money = (value) => Math.round((Number(value) || 0) * 100) / 100
const rate = (value) => Math.round((Number(value) || 0) * 10000) / 10000
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value))

export function buildSnapshot() {
  const oracleResults = items.map((item) => buildOracleResult(item))
  const opportunities = buildOpportunities(oracleResults)
  const platformCoverage = buildPlatformCoverage(platforms)

  return {
    generatedBy: 'local-sample-oracle',
    mode: 'precheck-only',
    ruleSet: {
      splitModel: ['INSTANT_BUY_ORDER', 'THEORETICAL_LISTING'],
      liquidityPolicy: '流动性、库存、余额或充值成本不足的机会不进入可采纳列表。',
      executionBoundary: '系统只输出执行预检与人工审核摘要，不提交真实资产交割。',
    },
    summary: summarize(opportunities),
    platformCoverage,
    platforms,
    items,
    oracleResults,
    opportunities,
  }
}

function summarize(opportunities) {
  const strong = opportunities.filter((item) => item.level === 'STRONG_EXECUTABLE')
  const instant = opportunities.filter((item) => item.type === 'INSTANT_BUY_ORDER')
  const theoretical = opportunities.filter((item) => item.type === 'THEORETICAL_LISTING')
  const watchOnly = opportunities.filter((item) => item.level === 'WATCH_ONLY')
  const best = opportunities[0]

  return {
    total: opportunities.length,
    instantCount: instant.length,
    theoreticalCount: theoretical.length,
    strongExecutable: strong.length,
    watchOnly: watchOnly.length,
    bestNetProfitRate: best ? best.netProfitRate : 0,
    bestTotalNetProfit: best ? best.totalNetProfit : 0,
  }
}

function buildOracleResult(item) {
  const books = orderBooks.filter((book) => book.itemId === item.itemId)
  const mids = books
    .map((book) => {
      const bid = book.bids[0]?.price
      const ask = book.asks[0]?.price
      if (!bid || !ask) return null
      const platform = getPlatform(book.platformId)
      return {
        value: (bid + ask) / 2,
        weight: platform.healthScore * freshnessScore(book.freshnessMs) * depthScore(book),
      }
    })
    .filter(Boolean)

  const referencePrice = weightedMedian(mids)
  const fairPrice = money(referencePrice)

  const quotes = books.map((book) => {
    const platform = getPlatform(book.platformId)
    const takerSell = computeVwap(book.bids, item.targetQuantity, 'bid')
    const spotBuy = computeVwap(book.asks, item.targetQuantity, 'ask')
    const makerBuy = computeMakerBuy(book, platform, fairPrice)
    const listing = computeMakerSellListing(book, platform, fairPrice)
    const liquidityScore = computeLiquidityScore(book, takerSell, spotBuy, makerBuy, listing, platform)
    const confidence = quoteConfidence(book, liquidityScore, takerSell, spotBuy)

    return {
      platformId: platform.platformId,
      platformName: platform.name,
      takerSellPrice: takerSell.fillable ? money(takerSell.averagePrice) : null,
      takerSellQuantity: takerSell.filledQuantity,
      takerSellSlippageRate: rate(takerSell.slippageRate),
      spotBuyPrice: spotBuy.fillable ? money(spotBuy.averagePrice) : null,
      spotBuyQuantity: spotBuy.filledQuantity,
      spotBuySlippageRate: rate(spotBuy.slippageRate),
      makerBuyTargetPrice: makerBuy.targetPrice ? money(makerBuy.targetPrice) : null,
      makerBuyProbability: rate(makerBuy.probability),
      theoreticalListingPrice: listing.targetPrice ? money(listing.targetPrice) : null,
      listingFillProbability: rate(listing.probability),
      liquidityScore: rate(liquidityScore),
      freshnessMs: book.freshnessMs,
      confidence,
    }
  })

  return {
    itemId: item.itemId,
    itemName: item.name,
    cnName: item.cnName,
    targetQuantity: item.targetQuantity,
    referencePrice: money(referencePrice),
    fairPrice,
    quotes,
    confidence: resultConfidence(quotes),
    rejectReasons: [],
  }
}

function buildOpportunities(oracleResults) {
  const results = []

  for (const result of oracleResults) {
    for (const sellQuote of result.quotes) {
      for (const buyQuote of result.quotes) {
        if (sellQuote.platformId === buyQuote.platformId) continue

        const instant = buildInstantBuyOrderOpportunity(result, sellQuote, buyQuote)
        if (instant.level !== 'REJECTED') results.push(instant)

        const theoretical = buildTheoreticalListingOpportunity(result, sellQuote, buyQuote)
        if (theoretical.level !== 'REJECTED') results.push(theoretical)
      }
    }
  }

  return results.sort((a, b) => {
    return (
      LEVEL_SCORE[b.level] - LEVEL_SCORE[a.level] ||
      TYPE_SCORE[b.type] - TYPE_SCORE[a.type] ||
      b.totalNetProfit - a.totalNetProfit ||
      b.netProfitRate - a.netProfitRate ||
      b.liquidityScore - a.liquidityScore
    )
  })
}

function buildInstantBuyOrderOpportunity(result, sellQuote, buyQuote) {
  const type = OPPORTUNITY_TYPES.INSTANT_BUY_ORDER
  const sellPlatform = getPlatform(sellQuote.platformId)
  const buyPlatform = getPlatform(buyQuote.platformId)
  const quantity = executableQuantity(result.itemId, sellQuote, buyQuote, 'instant')
  const reasons = []

  if (!sellQuote.takerSellPrice) reasons.push('A侧求购订单深度不足，无法完整吃单')
  if (!buyQuote.spotBuyPrice) reasons.push('B侧现货卖盘深度不足，无法同步补货')
  if (sellQuote.confidence === 'INVALID' || buyQuote.confidence === 'INVALID') reasons.push('价格置信度无效')
  if (quantity <= 0) reasons.push('库存、余额或可成交深度不足')

  const economics = computeEconomics({
    sellPrice: sellQuote.takerSellPrice,
    buyPrice: buyQuote.spotBuyPrice,
    quantity,
    sellPlatform,
    buyPlatform,
    sellMode: 'TAKER',
    buyMode: 'TAKER',
    riskBufferRate: 0.005,
  })

  const liquidityScore = rate(Math.min(sellQuote.liquidityScore, buyQuote.liquidityScore))
  if (liquidityScore < 0.68) reasons.push('综合流动性低于即时对敲阈值')
  if (economics.totalNetProfit <= 0) reasons.push('扣除平台费率、充值成本和风控缓冲后净利润为负')
  if (economics.netProfitRate < 0.012) reasons.push('即时净利润率低于采纳阈值')

  const level =
    reasons.length === 0 && economics.netProfitRate >= 0.012
      ? 'STRONG_EXECUTABLE'
      : economics.totalNetProfit > 0 && quantity > 0
        ? 'NEEDS_VERIFICATION'
        : 'REJECTED'

  return buildOpportunityPayload({
    result,
    typeKey: 'INSTANT_BUY_ORDER',
    type,
    sellQuote,
    buyQuote,
    sellMode: 'TAKER_BUY_ORDER',
    buyMode: 'TAKER_SPOT',
    sellActionName: 'A侧卖给求购订单',
    buyActionName: 'B侧现货买入补货',
    sellPrice: sellQuote.takerSellPrice,
    buyPrice: buyQuote.spotBuyPrice,
    quantity,
    economics,
    liquidityScore,
    level,
    executable: level === 'STRONG_EXECUTABLE',
    notes: ['卖出端匹配求购队列；买入端按现货卖盘均价核算补货成本。'],
    rejectReasons: reasons,
  })
}

function buildTheoreticalListingOpportunity(result, sellQuote, buyQuote) {
  const type = OPPORTUNITY_TYPES.THEORETICAL_LISTING
  const sellPlatform = getPlatform(sellQuote.platformId)
  const buyPlatform = getPlatform(buyQuote.platformId)
  const quantity = executableQuantity(result.itemId, sellQuote, buyQuote, 'theoretical')
  const reasons = []

  if (!sellQuote.theoreticalListingPrice) reasons.push('A侧挂单目标价无效')
  if (!buyQuote.spotBuyPrice) reasons.push('B侧现货卖盘深度不足，无法形成入场成本')
  if (sellQuote.listingFillProbability < 0.45) reasons.push('挂单成交概率低于观察阈值')
  if (buyQuote.liquidityScore < 0.58) reasons.push('B侧买入流动性不足')
  if (quantity <= 0) reasons.push('库存、余额或现货买入深度不足')

  const economics = computeEconomics({
    sellPrice: sellQuote.theoreticalListingPrice,
    buyPrice: buyQuote.spotBuyPrice,
    quantity,
    sellPlatform,
    buyPlatform,
    sellMode: 'MAKER',
    buyMode: 'TAKER',
    riskBufferRate: 0.012,
  })

  const liquidityScore = rate(Math.min(sellQuote.liquidityScore, buyQuote.liquidityScore, sellQuote.listingFillProbability))
  if (economics.totalNetProfit <= 0) reasons.push('扣除平台费率、充值成本和挂单缓冲后净利润为负')
  if (economics.netProfitRate < 0.01) reasons.push('理论净利润率低于观察阈值')

  const level =
    reasons.length === 0 && economics.netProfitRate >= 0.018
      ? 'WATCH_ONLY'
      : economics.totalNetProfit > 0 && quantity > 0
        ? 'NEEDS_VERIFICATION'
        : 'REJECTED'

  return buildOpportunityPayload({
    result,
    typeKey: 'THEORETICAL_LISTING',
    type,
    sellQuote,
    buyQuote,
    sellMode: 'MAKER_LISTING',
    buyMode: 'TAKER_SPOT',
    sellActionName: 'A侧现货挂单',
    buyActionName: 'B侧现货买入',
    sellPrice: sellQuote.theoreticalListingPrice,
    buyPrice: buyQuote.spotBuyPrice,
    quantity,
    economics,
    liquidityScore,
    level,
    executable: false,
    notes: ['挂单机会只进入观察池，需要单独评估成交速度和价格波动。'],
    rejectReasons: reasons,
  })
}

function buildOpportunityPayload({
  result,
  typeKey,
  type,
  sellQuote,
  buyQuote,
  sellMode,
  buyMode,
  sellActionName,
  buyActionName,
  sellPrice,
  buyPrice,
  quantity,
  economics,
  liquidityScore,
  level,
  executable,
  notes,
  rejectReasons,
}) {
  return {
    opportunityId: `${result.itemId}:${typeKey}:${sellQuote.platformId}->${buyQuote.platformId}`,
    type: typeKey,
    typeName: type.label,
    executionClass: type.executionClass,
    executionLabel: type.executionLabel,
    thesis: type.thesis,
    itemId: result.itemId,
    itemName: result.itemName,
    cnName: result.cnName,
    sellPlatformId: sellQuote.platformId,
    sellPlatformName: sellQuote.platformName,
    buyPlatformId: buyQuote.platformId,
    buyPlatformName: buyQuote.platformName,
    sellMode,
    buyMode,
    sellActionName,
    buyActionName,
    quantity,
    sellPrice: money(sellPrice),
    buyPrice: money(buyPrice),
    unitNetProfit: money(economics.unitNetProfit),
    totalNetProfit: money(economics.totalNetProfit),
    netProfitRate: rate(economics.netProfitRate),
    liquidityScore,
    makerBuyProbability: buyQuote.makerBuyProbability,
    listingFillProbability: sellQuote.listingFillProbability,
    confidence: result.confidence,
    level,
    executable,
    feeBreakdown: economics.feeBreakdown,
    liquidityCheck: {
      accepted: level !== 'REJECTED',
      sellDepthQuantity: sellQuote.takerSellQuantity,
      buyDepthQuantity: buyQuote.spotBuyQuantity,
      sellLiquidityScore: sellQuote.liquidityScore,
      buyLiquidityScore: buyQuote.liquidityScore,
    },
    notes,
    rejectReasons,
  }
}

export function buildDryRun(opportunityId) {
  const snapshot = buildSnapshot()
  const opportunity = snapshot.opportunities.find((item) => item.opportunityId === opportunityId)
  if (!opportunity) return null

  const commonWarnings = [
    '系统不会在预检阶段创建订单、提交支付或触发资产交割。',
    '进入下一步前需要重新校验盘口、费率、库存、余额、资金成本和风控状态。',
    '涉及资产交割的最终确认仍需用户在 Steam Mobile 中人工审核。',
  ]

  if (opportunity.type === 'INSTANT_BUY_ORDER') {
    return {
      mode: 'PRECHECK',
      opportunity,
      steps: [
        `重新拉取 ${opportunity.sellPlatformName} 求购订单，计算可吃单 bid VWAP。`,
        `校验 ${opportunity.sellPlatformName} 可卖库存数量 >= ${opportunity.quantity}。`,
        `重新拉取 ${opportunity.buyPlatformName} 现货卖盘，计算补货 ask VWAP。`,
        `复算 ${opportunity.buyPlatformName} 买入成本、充值成本和资金缓冲。`,
        '模拟 A 侧卖给求购订单，模拟 B 侧现货买入补货。',
        '生成供用户审核的操作摘要和令牌确认提醒。',
      ],
      warnings: commonWarnings,
    }
  }

  return {
    mode: 'PRECHECK',
    opportunity,
    steps: [
      `重新拉取 ${opportunity.sellPlatformName} 当前最低挂单和排队结构。`,
      `校验 ${opportunity.sellPlatformName} 可挂库存数量 >= ${opportunity.quantity}。`,
      `重新拉取 ${opportunity.buyPlatformName} 现货卖盘，计算入场 ask VWAP。`,
      `复算挂单卖出费率、买入成本、充值成本和挂单风险缓冲。`,
      '只生成观察与人工决策摘要，不进入自动下单队列。',
    ],
    warnings: [
      ...commonWarnings,
      '挂单观察机会不代表立即成交，必须单独验证成交速度、排队位置和价格波动。',
    ],
  }
}

function computeEconomics({ sellPrice, buyPrice, quantity, sellPlatform, buyPlatform, sellMode, buyMode, riskBufferRate }) {
  const safeSellPrice = Number(sellPrice) || 0
  const safeBuyPrice = Number(buyPrice) || 0
  const safeQuantity = Number(quantity) || 0

  const sellGross = safeSellPrice * safeQuantity
  const sellModeFeeRate = sellMode === 'MAKER' ? sellPlatform.fees.makerFeeRate : sellPlatform.fees.takerFeeRate
  const sellPlatformFee = sellGross * sellPlatform.fees.sellerFeeRate
  const sellExecutionFee = sellGross * sellModeFeeRate
  const sellFee = sellPlatformFee + sellExecutionFee
  const sellNet = sellGross - sellFee

  const buyGross = safeBuyPrice * safeQuantity
  const buyModeFeeRate = buyMode === 'MAKER' ? buyPlatform.fees.makerFeeRate : buyPlatform.fees.takerFeeRate
  const buyPlatformFee = buyGross * buyPlatform.fees.buyerFeeRate
  const buyExecutionFee = buyGross * buyModeFeeRate
  const depositCost = buyGross * buyPlatform.fees.depositCostRate
  const fxCost = buyGross * buyPlatform.fees.fxCostRate
  const buyFee = buyPlatformFee + buyExecutionFee + depositCost + fxCost
  const buyCost = buyGross + buyFee
  const riskBuffer = buyCost * riskBufferRate
  const totalNetProfit = sellNet - buyCost - riskBuffer
  const unitNetProfit = safeQuantity > 0 ? totalNetProfit / safeQuantity : 0
  const netProfitRate = buyCost > 0 ? totalNetProfit / buyCost : 0

  return {
    unitNetProfit,
    totalNetProfit,
    netProfitRate,
    feeBreakdown: {
      sellPlatformFee: money(sellPlatformFee),
      sellExecutionFee: money(sellExecutionFee),
      sellFee: money(sellFee),
      sellNet: money(sellNet),
      buyPlatformFee: money(buyPlatformFee),
      buyExecutionFee: money(buyExecutionFee),
      depositCost: money(depositCost),
      fxCost: money(fxCost),
      buyFee: money(buyFee),
      buyCost: money(buyCost),
      riskBuffer: money(riskBuffer),
    },
  }
}

function computeVwap(levels, targetQuantity, side) {
  let remaining = targetQuantity
  let filledQuantity = 0
  let notional = 0
  const best = levels[0]?.price || 0

  for (const level of levels) {
    if (remaining <= 0) break
    const quantity = Math.min(level.quantity, remaining)
    filledQuantity += quantity
    notional += quantity * level.price
    remaining -= quantity
  }

  const averagePrice = filledQuantity > 0 ? notional / filledQuantity : 0
  const slippageRate =
    best > 0 && averagePrice > 0
      ? side === 'ask'
        ? Math.max(0, (averagePrice - best) / best)
        : Math.max(0, (best - averagePrice) / best)
      : 1

  return {
    fillable: filledQuantity >= targetQuantity,
    filledQuantity,
    averagePrice,
    slippageRate,
  }
}

function computeMakerBuy(book, platform, fairPrice) {
  const bestBid = book.bids[0]?.price || 0
  const bestAsk = book.asks[0]?.price || 0
  if (!bestBid || !bestAsk) return { targetPrice: null, probability: 0 }

  const tick = platform.fees.tickSize
  const maxReasonable = fairPrice * 1.01
  const targetPrice = Math.min(bestBid + tick, bestAsk - tick, maxReasonable)
  const spread = Math.max(0, bestAsk - bestBid)
  const spreadScore = bestAsk > 0 ? Math.max(0, 1 - spread / bestAsk / 0.04) : 0
  const queueQuantity = book.bids[0]?.quantity || 0
  const queueScore = Math.max(0, 1 - queueQuantity / 8)
  const askDepth = book.asks.reduce((sum, level) => sum + level.quantity, 0)
  const askDepthScore = Math.min(1, askDepth / 5)
  const probability =
    book.tradeVelocity * 0.35 +
    queueScore * 0.25 +
    spreadScore * 0.15 +
    askDepthScore * 0.15 +
    platform.healthScore * 0.1

  return { targetPrice, probability: clamp(probability) }
}

function computeMakerSellListing(book, platform, fairPrice) {
  const bestBid = book.bids[0]?.price || 0
  const bestAsk = book.asks[0]?.price || 0
  if (!bestBid || !bestAsk) return { targetPrice: null, probability: 0 }

  const tick = platform.fees.tickSize
  const targetPrice = Math.max(bestBid + tick, Math.min(bestAsk - tick, fairPrice * 1.025))
  const spread = Math.max(0, bestAsk - bestBid)
  const spreadScore = bestAsk > 0 ? Math.max(0, 1 - spread / bestAsk / 0.05) : 0
  const topAskQuantity = book.asks[0]?.quantity || 0
  const queueScore = Math.max(0, 1 - topAskQuantity / 10)
  const bidDepth = book.bids.reduce((sum, level) => sum + level.quantity, 0)
  const demandScore = Math.min(1, bidDepth / 5)
  const probability =
    book.tradeVelocity * 0.4 +
    demandScore * 0.2 +
    queueScore * 0.15 +
    spreadScore * 0.15 +
    platform.healthScore * 0.1

  return { targetPrice, probability: clamp(probability) }
}

function computeLiquidityScore(book, takerSell, spotBuy, makerBuy, listing, platform) {
  const sellScore = takerSell.fillable ? 1 - Math.min(0.55, takerSell.slippageRate * 12) : 0.15
  const buyScore = spotBuy.fillable ? 1 - Math.min(0.55, spotBuy.slippageRate * 12) : 0.15
  const fresh = freshnessScore(book.freshnessMs)
  const modelScore = Math.max(makerBuy.probability, listing.probability)

  return clamp(sellScore * 0.25 + buyScore * 0.25 + modelScore * 0.25 + fresh * 0.1 + platform.healthScore * 0.15)
}

function quoteConfidence(book, liquidityScore, takerSell, spotBuy) {
  if (!takerSell.fillable && !spotBuy.fillable) return 'INVALID'
  if (book.freshnessMs > 6000) return 'LOW'
  if (liquidityScore >= 0.78) return 'HIGH'
  if (liquidityScore >= 0.58) return 'MEDIUM'
  return 'LOW'
}

function resultConfidence(quotes) {
  if (quotes.some((quote) => quote.confidence === 'HIGH')) return 'HIGH'
  if (quotes.some((quote) => quote.confidence === 'MEDIUM')) return 'MEDIUM'
  if (quotes.some((quote) => quote.confidence === 'LOW')) return 'LOW'
  return 'INVALID'
}

function executableQuantity(itemId, sellQuote, buyQuote, type) {
  const inv = inventory.find((entry) => entry.platformId === sellQuote.platformId && entry.itemId === itemId)
  const balance = balances.find((entry) => entry.platformId === buyQuote.platformId)
  const buyPrice = buyQuote.spotBuyPrice || buyQuote.makerBuyTargetPrice || 0
  const buyBudgetQuantity = balance && buyPrice ? Math.floor(balance.availableAmount / (buyPrice * 1.035)) : 0
  const inventoryQuantity = inv?.availableQuantity || 0

  if (type === 'instant') {
    return Math.max(0, Math.min(inventoryQuantity, sellQuote.takerSellQuantity || 0, buyQuote.spotBuyQuantity || 0, buyBudgetQuantity))
  }

  return Math.max(0, Math.min(inventoryQuantity, buyQuote.spotBuyQuantity || 0, buyBudgetQuantity))
}

function weightedMedian(entries) {
  if (!entries.length) return 0
  const sorted = [...entries].sort((a, b) => a.value - b.value)
  const totalWeight = sorted.reduce((sum, item) => sum + item.weight, 0)
  let cursor = 0
  for (const item of sorted) {
    cursor += item.weight
    if (cursor >= totalWeight / 2) return item.value
  }
  return sorted[sorted.length - 1].value
}

function freshnessScore(freshnessMs) {
  if (freshnessMs <= 1000) return 1
  if (freshnessMs <= 3000) return 0.8
  if (freshnessMs <= 5000) return 0.55
  return 0.2
}

function depthScore(book) {
  const bidDepth = book.bids.reduce((sum, level) => sum + level.quantity, 0)
  const askDepth = book.asks.reduce((sum, level) => sum + level.quantity, 0)
  return Math.min(1, (bidDepth + askDepth) / 10)
}

function getPlatform(platformId) {
  const platform = platforms.find((item) => item.platformId === platformId)
  if (!platform) throw new Error(`unknown platform: ${platformId}`)
  return platform
}
