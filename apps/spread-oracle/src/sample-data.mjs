export const platforms = [
  {
    platformId: 'buff',
    name: 'BUFF',
    currency: 'CNY',
    healthScore: 0.92,
    fees: {
      sellerFeeRate: 0.025,
      buyerFeeRate: 0,
      makerFeeRate: 0,
      takerFeeRate: 0,
      depositCostRate: 0.006,
      fxCostRate: 0,
      tickSize: 0.01,
      confidence: 'CONFIRMED',
    },
  },
  {
    platformId: 'uuyp',
    name: '悠悠有品',
    currency: 'CNY',
    healthScore: 0.88,
    fees: {
      sellerFeeRate: 0.02,
      buyerFeeRate: 0,
      makerFeeRate: 0,
      takerFeeRate: 0,
      depositCostRate: 0.006,
      fxCostRate: 0,
      tickSize: 0.01,
      confidence: 'CONFIRMED',
    },
  },
  {
    platformId: 'c5',
    name: 'C5',
    currency: 'CNY',
    healthScore: 0.84,
    fees: {
      sellerFeeRate: 0.02,
      buyerFeeRate: 0,
      makerFeeRate: 0,
      takerFeeRate: 0,
      depositCostRate: 0.008,
      fxCostRate: 0,
      tickSize: 0.01,
      confidence: 'CONFIRMED',
    },
  },
  {
    platformId: 'igxe',
    name: 'IGXE',
    currency: 'CNY',
    healthScore: 0.78,
    fees: {
      sellerFeeRate: 0.025,
      buyerFeeRate: 0,
      makerFeeRate: 0,
      takerFeeRate: 0,
      depositCostRate: 0.01,
      fxCostRate: 0,
      tickSize: 0.01,
      confidence: 'CONFIRMED',
    },
  },
]

export const items = [
  {
    itemId: 'ak-redline-ft',
    name: 'AK-47 | Redline (Field-Tested)',
    cnName: 'AK-47 | 红线（久经沙场）',
    targetQuantity: 2,
  },
  {
    itemId: 'awp-asiimov-ft',
    name: 'AWP | Asiimov (Field-Tested)',
    cnName: 'AWP | 二西莫夫（久经沙场）',
    targetQuantity: 1,
  },
  {
    itemId: 'm4-printstream-ft',
    name: 'M4A1-S | Printstream (Field-Tested)',
    cnName: 'M4A1-S | 印花集（久经沙场）',
    targetQuantity: 1,
  },
  {
    itemId: 'usp-kill-confirmed-mw',
    name: 'USP-S | Kill Confirmed (Minimal Wear)',
    cnName: 'USP-S | 枪响人亡（略有磨损）',
    targetQuantity: 1,
  },
]

export const inventory = [
  { platformId: 'buff', itemId: 'ak-redline-ft', availableQuantity: 3 },
  { platformId: 'uuyp', itemId: 'ak-redline-ft', availableQuantity: 1 },
  { platformId: 'c5', itemId: 'awp-asiimov-ft', availableQuantity: 2 },
  { platformId: 'igxe', itemId: 'm4-printstream-ft', availableQuantity: 1 },
  { platformId: 'buff', itemId: 'm4-printstream-ft', availableQuantity: 1 },
  { platformId: 'uuyp', itemId: 'usp-kill-confirmed-mw', availableQuantity: 1 },
]

export const balances = [
  { platformId: 'buff', currency: 'CNY', availableAmount: 5200 },
  { platformId: 'uuyp', currency: 'CNY', availableAmount: 6800 },
  { platformId: 'c5', currency: 'CNY', availableAmount: 4600 },
  { platformId: 'igxe', currency: 'CNY', availableAmount: 4200 },
]

export const orderBooks = [
  {
    platformId: 'buff',
    itemId: 'ak-redline-ft',
    freshnessMs: 1100,
    tradeVelocity: 0.82,
    bids: [
      { price: 636.2, quantity: 1, orderCount: 1 },
      { price: 634.6, quantity: 2, orderCount: 2 },
      { price: 629.5, quantity: 4, orderCount: 3 },
    ],
    asks: [
      { price: 646.5, quantity: 2, orderCount: 2 },
      { price: 651.0, quantity: 3, orderCount: 3 },
    ],
  },
  {
    platformId: 'uuyp',
    itemId: 'ak-redline-ft',
    freshnessMs: 900,
    tradeVelocity: 0.9,
    bids: [
      { price: 610.4, quantity: 2, orderCount: 2 },
      { price: 608.8, quantity: 3, orderCount: 3 },
    ],
    asks: [
      { price: 618.2, quantity: 3, orderCount: 2 },
      { price: 624.0, quantity: 4, orderCount: 4 },
    ],
  },
  {
    platformId: 'c5',
    itemId: 'ak-redline-ft',
    freshnessMs: 1400,
    tradeVelocity: 0.65,
    bids: [
      { price: 615.1, quantity: 1, orderCount: 1 },
      { price: 612.3, quantity: 2, orderCount: 2 },
    ],
    asks: [
      { price: 631.0, quantity: 2, orderCount: 2 },
      { price: 635.5, quantity: 3, orderCount: 3 },
    ],
  },
  {
    platformId: 'igxe',
    itemId: 'ak-redline-ft',
    freshnessMs: 2400,
    tradeVelocity: 0.44,
    bids: [
      { price: 604.5, quantity: 1, orderCount: 1 },
      { price: 601.0, quantity: 2, orderCount: 2 },
    ],
    asks: [
      { price: 620.8, quantity: 1, orderCount: 1 },
      { price: 626.6, quantity: 2, orderCount: 2 },
    ],
  },
  {
    platformId: 'buff',
    itemId: 'awp-asiimov-ft',
    freshnessMs: 800,
    tradeVelocity: 0.74,
    bids: [
      { price: 842.5, quantity: 1, orderCount: 1 },
      { price: 838.0, quantity: 2, orderCount: 2 },
    ],
    asks: [
      { price: 866.0, quantity: 1, orderCount: 1 },
      { price: 872.0, quantity: 2, orderCount: 2 },
    ],
  },
  {
    platformId: 'c5',
    itemId: 'awp-asiimov-ft',
    freshnessMs: 1000,
    tradeVelocity: 0.8,
    bids: [
      { price: 887.3, quantity: 1, orderCount: 1 },
      { price: 881.0, quantity: 1, orderCount: 1 },
    ],
    asks: [
      { price: 892.5, quantity: 1, orderCount: 1 },
      { price: 898.0, quantity: 1, orderCount: 1 },
    ],
  },
  {
    platformId: 'uuyp',
    itemId: 'awp-asiimov-ft',
    freshnessMs: 1200,
    tradeVelocity: 0.78,
    bids: [
      { price: 824.0, quantity: 1, orderCount: 1 },
      { price: 821.0, quantity: 2, orderCount: 2 },
    ],
    asks: [
      { price: 846.0, quantity: 1, orderCount: 1 },
      { price: 851.0, quantity: 2, orderCount: 2 },
    ],
  },
  {
    platformId: 'igxe',
    itemId: 'm4-printstream-ft',
    freshnessMs: 950,
    tradeVelocity: 0.72,
    bids: [
      { price: 1190.0, quantity: 1, orderCount: 1 },
      { price: 1184.0, quantity: 1, orderCount: 1 },
    ],
    asks: [
      { price: 1226.0, quantity: 1, orderCount: 1 },
      { price: 1235.0, quantity: 1, orderCount: 1 },
    ],
  },
  {
    platformId: 'buff',
    itemId: 'm4-printstream-ft',
    freshnessMs: 1300,
    tradeVelocity: 0.85,
    bids: [
      { price: 1215.0, quantity: 1, orderCount: 1 },
      { price: 1208.0, quantity: 1, orderCount: 1 },
    ],
    asks: [
      { price: 1240.0, quantity: 1, orderCount: 1 },
      { price: 1248.0, quantity: 1, orderCount: 1 },
    ],
  },
  {
    platformId: 'c5',
    itemId: 'm4-printstream-ft',
    freshnessMs: 2100,
    tradeVelocity: 0.5,
    bids: [
      { price: 1168.0, quantity: 1, orderCount: 1 },
      { price: 1160.0, quantity: 1, orderCount: 1 },
    ],
    asks: [
      { price: 1192.0, quantity: 1, orderCount: 1 },
      { price: 1200.0, quantity: 1, orderCount: 1 },
    ],
  },
  {
    platformId: 'uuyp',
    itemId: 'usp-kill-confirmed-mw',
    freshnessMs: 700,
    tradeVelocity: 0.76,
    bids: [
      { price: 512.4, quantity: 1, orderCount: 1 },
      { price: 507.0, quantity: 2, orderCount: 2 },
    ],
    asks: [
      { price: 526.0, quantity: 1, orderCount: 1 },
      { price: 532.0, quantity: 2, orderCount: 2 },
    ],
  },
  {
    platformId: 'igxe',
    itemId: 'usp-kill-confirmed-mw',
    freshnessMs: 1500,
    tradeVelocity: 0.58,
    bids: [
      { price: 494.0, quantity: 1, orderCount: 1 },
      { price: 488.5, quantity: 2, orderCount: 2 },
    ],
    asks: [
      { price: 499.2, quantity: 1, orderCount: 1 },
      { price: 504.8, quantity: 2, orderCount: 2 },
    ],
  },
]
