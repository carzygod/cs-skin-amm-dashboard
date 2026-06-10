import { platformCatalog } from './platform-catalog.mjs'

const itemSeeds = [
  {
    itemId: 'ak-redline-ft',
    name: 'AK-47 | Redline (Field-Tested)',
    cnName: 'AK-47 | 红线（久经沙场）',
    targetQuantity: 2,
    basePrice: 640,
  },
  {
    itemId: 'awp-asiimov-ft',
    name: 'AWP | Asiimov (Field-Tested)',
    cnName: 'AWP | 二西莫夫（久经沙场）',
    targetQuantity: 1,
    basePrice: 860,
  },
  {
    itemId: 'm4-printstream-ft',
    name: 'M4A1-S | Printstream (Field-Tested)',
    cnName: 'M4A1-S | 印花集（久经沙场）',
    targetQuantity: 1,
    basePrice: 1220,
  },
  {
    itemId: 'usp-kill-confirmed-mw',
    name: 'USP-S | Kill Confirmed (Minimal Wear)',
    cnName: 'USP-S | 枪响人亡（略有磨损）',
    targetQuantity: 1,
    basePrice: 520,
  },
]

const feeProfiles = {
  'official-market': {
    sellerFeeRate: 0.08,
    buyerFeeRate: 0,
    makerFeeRate: 0,
    takerFeeRate: 0.005,
    depositCostRate: 0,
    fxCostRate: 0.004,
  },
  'cash-market': {
    sellerFeeRate: 0.045,
    buyerFeeRate: 0,
    makerFeeRate: 0.002,
    takerFeeRate: 0.004,
    depositCostRate: 0.008,
    fxCostRate: 0.006,
  },
  'p2p-market': {
    sellerFeeRate: 0.025,
    buyerFeeRate: 0,
    makerFeeRate: 0.001,
    takerFeeRate: 0.003,
    depositCostRate: 0.006,
    fxCostRate: 0.006,
  },
  'trade-bot': {
    sellerFeeRate: 0.035,
    buyerFeeRate: 0,
    makerFeeRate: 0.002,
    takerFeeRate: 0.005,
    depositCostRate: 0.007,
    fxCostRate: 0.006,
  },
}

const platformOverrides = {
  steam: { sellerFeeRate: 0.12, depositCostRate: 0, fxCostRate: 0.005 },
  buff163: { sellerFeeRate: 0.025, depositCostRate: 0.006, fxCostRate: 0 },
  csfloat: { sellerFeeRate: 0.02, depositCostRate: 0.004, fxCostRate: 0.005 },
  skinport: { sellerFeeRate: 0.06, depositCostRate: 0.008, fxCostRate: 0.006 },
  dmarket: { sellerFeeRate: 0.07, depositCostRate: 0.009, fxCostRate: 0.007 },
  waxpeer: { sellerFeeRate: 0.025, depositCostRate: 0.006, fxCostRate: 0.006 },
}

export const items = itemSeeds.map(({ basePrice, ...item }) => item)

export const platforms = platformCatalog.map((platform, index) => {
  const baseFees = feeProfiles[platform.marketType] || feeProfiles['cash-market']
  const overrides = platformOverrides[platform.platformId] || {}
  return {
    platformId: platform.platformId,
    name: platform.name,
    currency: 'CNY',
    healthScore: healthScore(platform),
    quoteSource: 'CATALOG_SAMPLE',
    fees: {
      ...baseFees,
      ...overrides,
      tickSize: 0.01,
      confidence: 'CATALOG_ESTIMATED',
    },
    rankIndex: index,
  }
})

export const inventory = itemSeeds.flatMap((item, itemIndex) =>
  platforms.map((platform, platformIndex) => ({
    platformId: platform.platformId,
    itemId: item.itemId,
    availableQuantity: 1 + ((platformIndex + itemIndex) % 3),
  })),
)

export const balances = platforms.map((platform, index) => ({
  platformId: platform.platformId,
  currency: 'CNY',
  availableAmount: 9000 + ((index * 1379) % 9000),
}))

export const orderBooks = itemSeeds.flatMap((item, itemIndex) =>
  platforms.map((platform, platformIndex) => buildOrderBook(item, itemIndex, platform, platformIndex)),
)

function buildOrderBook(item, itemIndex, platform, platformIndex) {
  const catalog = platformCatalog.find((entry) => entry.platformId === platform.platformId)
  const discount = catalog?.marketStats?.averageDiscountRate || 0.28
  const liquidityBase = liquidityFromCatalog(catalog)
  const noise = centeredNoise(platform.platformId, item.itemId)
  const marketTypeBias = {
    'official-market': 0.055,
    'p2p-market': -0.012,
    'cash-market': 0,
    'trade-bot': 0.018,
  }[catalog?.marketType] || 0
  const priceFactor = 1 + (0.32 - discount) * 0.22 + marketTypeBias + noise * 0.018
  const center = money(item.basePrice * priceFactor)
  const spreadRate = 0.016 + (1 - platform.healthScore) * 0.016 + Math.abs(noise) * 0.01
  const bestBid = money(center * (1 - spreadRate / 2))
  const bestAsk = money(center * (1 + spreadRate / 2))
  const topBidQuantity = Math.max(item.targetQuantity, Math.round(liquidityBase * (1 + ((platformIndex + itemIndex) % 3))))
  const topAskQuantity = Math.max(item.targetQuantity, Math.round(liquidityBase * (1 + ((platformIndex + itemIndex + 1) % 3))))

  return {
    platformId: platform.platformId,
    itemId: item.itemId,
    freshnessMs: 650 + ((platformIndex * 173 + itemIndex * 251) % 4200),
    tradeVelocity: clamp(0.34 + platform.healthScore * 0.42 + liquidityBase * 0.035 + Math.abs(noise) * 0.08),
    bids: priceLevels(bestBid, topBidQuantity, 'bid'),
    asks: priceLevels(bestAsk, topAskQuantity, 'ask'),
  }
}

function priceLevels(bestPrice, topQuantity, side) {
  const direction = side === 'bid' ? -1 : 1
  return [0, 1, 2].map((level) => ({
    price: money(bestPrice * (1 + direction * level * 0.006)),
    quantity: Math.max(1, topQuantity + level),
    orderCount: Math.max(1, Math.ceil((topQuantity + level) / 2)),
  }))
}

function healthScore(platform) {
  const rating = Number(platform.marketStats.rating) || 3.8
  const marketTypeBonus = platform.marketType === 'p2p-market' ? 0.04 : platform.marketType === 'official-market' ? -0.04 : 0
  return clamp(0.55 + rating / 10 + marketTypeBonus, 0.52, 0.96)
}

function liquidityFromCatalog(platform) {
  const offerText = String(platform?.marketStats?.offers || '')
  const numeric = Number(offerText.replace(/[^0-9.]/g, '')) || 1
  const multiplier = offerText.includes('M') ? 1000 : offerText.includes('K') ? 1 : 0.001
  const scaled = numeric * multiplier
  return clamp(Math.log10(Math.max(10, scaled)) - 1.4, 1.1, 5.8)
}

function centeredNoise(platformId, itemId) {
  const text = `${platformId}:${itemId}`
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 2001) / 1000 - 1
}

function money(value) {
  return Math.round((Number(value) || 0) * 100) / 100
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}
