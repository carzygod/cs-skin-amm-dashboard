const CSGOSKINS_MARKETS_URL = 'https://csgoskins.gg/markets'

const REQUIRED_CAPABILITIES = [
  'publicMarketStats',
  'itemMapping',
  'listings',
  'buyOrders',
  'recentSales',
  'feeProfile',
  'depositCost',
  'inventoryRead',
  'balanceRead',
  'precheck',
  'execution',
  'reconciliation',
]

const NOT_CONNECTED_STATUS = {
  publicMarketStats: 'DIRECTORY_ONLY',
  itemMapping: 'PENDING',
  listings: 'PENDING',
  buyOrders: 'PENDING',
  recentSales: 'PENDING',
  feeProfile: 'PENDING_VERIFICATION',
  depositCost: 'PENDING_VERIFICATION',
  inventoryRead: 'PENDING',
  balanceRead: 'PENDING',
  precheck: 'PENDING',
  execution: 'PENDING',
  reconciliation: 'PENDING',
}

const PROBE_TARGETS = {
  steam: ['https://steamcommunity.com/market/', 'direct'],
  csfloat: ['https://csfloat.com/', 'direct'],
  'lis-skins': ['https://lis-skins.com/', 'direct'],
  'cs-money': ['https://cs.money/', 'direct'],
  skinport: ['https://skinport.com/', 'direct'],
  tradeit: ['https://tradeit.gg/', 'direct'],
  buff163: ['https://buff.163.com/market/', 'direct'],
  gameboost: ['https://gameboost.com/', 'direct'],
  dmarket: ['https://dmarket.com/', 'direct'],
  'cs2-market': ['https://cs2.com/', 'direct'],
  pirateswap: ['https://pirateswap.com/', 'direct'],
  skinswap: ['https://skinswap.com/', 'direct'],
  'skin-land': ['https://skin.land/', 'direct'],
  'avan-market': ['https://avan.market/', 'direct'],
  skinflow: ['https://skinflow.gg/', 'direct'],
  'aim-market': ['https://aim.market/', 'direct'],
  'mannco-store': ['https://mannco.store/', 'direct'],
  'white-market': ['https://white.market/', 'direct'],
  skinbaron: ['https://skinbaron.de/', 'direct'],
  skinplace: ['https://skinplace.com/', 'direct'],
  'buff-market': ['https://buff.market/', 'direct'],
  shadowpay: ['https://shadowpay.com/', 'direct'],
  waxpeer: ['https://waxpeer.com/', 'direct'],
  skinout: ['https://skinout.gg/', 'direct'],
  'cs-trade': ['https://cs.trade/', 'direct'],
  skinvault: ['https://skinvault.gg/', 'direct'],
  uuskins: ['https://csgoskins.gg/markets/uuskins', 'directory'],
  'skins-com': ['https://skins.com/', 'direct'],
  haloskins: ['https://haloskins.com/', 'direct'],
  exeskins: ['https://exeskins.com/', 'direct'],
  ntskins: ['https://ntskins.com/', 'direct'],
  dupe: ['https://csgoskins.gg/markets/dupe', 'directory'],
}

export const platformCatalogSource = {
  name: 'CSGOSKINS.GG Markets',
  url: CSGOSKINS_MARKETS_URL,
  sourceScope: 'market-directory',
  notes:
    'The directory page is used as the canonical platform list. Fees and execution capabilities still require direct platform or account-level verification before live trading.',
}

export const platformCatalog = [
  market('steam', 'Steam', 'steam', 2.0, '4.6K', '33.3K', '29.2M', '$19.9M', 0.0, '182.3M', 'official-market'),
  market('csfloat', 'CSFloat', 'csfloat', 4.8, '8.5K', '26.5K', '2.2M', '$89.6M', 31.5, '12.7M', 'p2p-market'),
  market('lis-skins', 'LIS-SKINS', 'lis-skins', 4.9, '7.2K', '19.2K', '1.3M', '$31.2M', 31.0, '11.2M', 'cash-market'),
  market('cs-money', 'CS.MONEY', 'csmoney', 4.7, '8.4K', '26.6K', '796.8K', '$24.6M', 32.7, '7.9M', 'trade-bot'),
  market('skinport', 'Skinport', 'skinport', 4.8, '35.3K', '24.6K', '3.5M', '$16.8M', 26.6, '3.6M', 'cash-market'),
  market('tradeit', 'Tradeit.gg', 'tradeit-gg', 4.7, '21.5K', '18K', '423.2K', '$17.2M', 29.7, '3.1M', 'trade-bot'),
  market('buff163', 'BUFF163', 'buff163', 2.5, '94', '33.1K', '4.4M', '$117.7M', 33.4, '2.3M', 'cash-market'),
  market('gameboost', 'GameBoost', 'gameboost', 4.5, '19K', '20.2K', '710.7K', '$25.8M', 23.6, '2.1M', 'cash-market'),
  market('dmarket', 'DMarket', 'dmarket', 4.0, '21.6K', '19.5K', '673.8K', '$12.7M', 28.9, '2.1M', 'cash-market'),
  market('cs2-market', 'CS2', 'cs2', 4.0, '8', '1K', '1K', '$8.3K', 57.6, '1.5M', 'cash-market'),
  market('pirateswap', 'PirateSwap', 'pirateswap', 4.6, '4.3K', '9K', '652.6K', '$1.9M', 21.1, '1.3M', 'trade-bot'),
  market('skinswap', 'SkinSwap', 'skinswap', 4.1, '2K', '31.1K', '5.7M', '$120.9M', 33.5, '1.1M', 'trade-bot'),
  market('skin-land', 'Skin.Land', 'skin-land', 4.6, '3.8K', '19.2K', '1.3M', '$31.2M', 30.4, '1.1M', 'cash-market'),
  market('avan-market', 'Avan.market', 'avan-market', 4.5, '1.7K', '2.9K', '10K', '$716.2K', 26.0, '790.6K', 'cash-market'),
  market('skinflow', 'Skinflow', 'skinflow', 4.6, '1.5K', '59', '79', '$94.9K', 29.6, '718.9K', 'cash-market'),
  market('aim-market', 'Aim.market', 'aim-market', 4.1, '932', '16K', '363.4K', '$13.3M', 31.5, '599.5K', 'cash-market'),
  market('mannco-store', 'Mannco.store', 'mannco-store', 4.0, '2.9K', '7.3K', '204.8K', '$462.1K', 23.4, '571.6K', 'cash-market'),
  market('white-market', 'white.market', 'white-market', 4.1, '180', '18.7K', '2M', '$42.8M', 30.4, '564.5K', 'cash-market'),
  market('skinbaron', 'SkinBaron', 'skinbaron', 4.6, '4K', '20.9K', '2.1M', '$5.2M', 30.4, '557.2K', 'cash-market'),
  market('skinplace', 'SkinPlace', 'skinplace', 4.2, '1.9K', '8.9K', '116.7K', '$3.4M', 27.7, '370.7K', 'cash-market'),
  market('buff-market', 'BUFF Market', 'buff-market', 4.6, '1K', '26.1K', '390.6K', '$57.9M', 28.4, '348.6K', 'cash-market'),
  market('shadowpay', 'ShadowPay', 'shadowpay', 4.0, '856', '22.8K', '782.6K', '$27.7M', 29.7, '255.3K', 'cash-market'),
  market('waxpeer', 'WAXPEER', 'waxpeer', 2.1, '445', '19.7K', '649.6K', '$23.3M', 30.2, '201.9K', 'p2p-market'),
  market('skinout', 'SkinOut', 'skinout', 3.3, '89', '3.2K', '32.6K', '$507.5K', 29.7, '189.4K', 'cash-market'),
  market('cs-trade', 'CS.TRADE', 'cs-trade', 4.5, '333', '3.2K', '12.3K', '$207.8K', 27.6, '176.1K', 'trade-bot'),
  market('skinvault', 'Skinvault', 'skinvault', 4.0, '172', '19.8K', '638.5K', '$20M', 30.6, '137.6K', 'cash-market'),
  market('uuskins', 'UUSKINS', 'uuskins', 4.2, '149', '29.2K', '3.3M', '$160.7M', 29.6, '125.4K', 'cash-market'),
  market('skins-com', 'Skins.com', 'skins-com', 3.9, '120', '12.9K', '49.4K', '$5.2M', 31.8, '106.8K', 'cash-market'),
  market('haloskins', 'HaloSkins', 'haloskins', 3.9, '265', '27.7K', '3.9M', '$39.7M', 30.3, '65.6K', 'cash-market'),
  market('exeskins', 'Exeskins', 'exeskins', 4.1, '34', '20.8K', '740.6K', '$18.4M', 30.6, '64.7K', 'cash-market'),
  market('ntskins', 'NTSkins', 'ntskins', 3.5, '14', '29.2K', '3M', '$133.2M', 20.8, '5K', 'cash-market'),
  market('dupe', 'Dupe', 'dupe', 4.4, '11', '6.3K', '27.4K', '$2.9M', 27.3, '2K', 'cash-market'),
]

export function buildPlatformCoverage(pricingPlatforms = []) {
  const pricingNames = new Set(pricingPlatforms.map((platform) => platform.name.toLowerCase()))
  const pricingIds = new Set(pricingPlatforms.map((platform) => platform.platformId.toLowerCase()))
  const catalog = platformCatalog.map((platform) => {
    const hasSamplePricing = hasPricingModel(platform, pricingNames, pricingIds)
    return {
      ...platform,
      pricingModelStatus: hasSamplePricing ? 'PRICING_MODEL_SAMPLE' : 'CATALOG_ONLY',
      quoteCoverageStatus: hasSamplePricing ? 'SAMPLE_QUOTES_AVAILABLE' : 'CATALOG_ONLY',
      feeProfileStatus: hasSamplePricing ? 'CATALOG_ESTIMATED' : platform.feeProfileStatus,
      dataCompletenessStatus: hasSamplePricing ? 'DIRECTORY_WITH_SAMPLE_QUOTES' : platform.dataCompletenessStatus,
    }
  })
  const pricingModelSample = catalog.filter((platform) => platform.pricingModelStatus === 'PRICING_MODEL_SAMPLE').length
  const liveConnected = 0

  return {
    source: platformCatalogSource,
    summary: {
      catalogTotal: catalog.length,
      directoryCovered: catalog.length,
      liveConnected,
      pricingModelSample,
      sampleQuoteCoverage: pricingModelSample,
      pendingLiveAdapters: catalog.length - liveConnected,
      requiredCapabilities: REQUIRED_CAPABILITIES,
    },
    catalog,
  }
}

function market(id, name, slug, rating, reviews, items, offers, value, avgDiscountRate, monthlyVisits, marketType) {
  const [probeUrl, probeTargetKind] = PROBE_TARGETS[id] || [`${CSGOSKINS_MARKETS_URL}/${slug}`, 'directory']

  return {
    platformId: id,
    name,
    marketType,
    sourceUrl: `${CSGOSKINS_MARKETS_URL}/${slug}`,
    probeUrl,
    probeTargetKind,
    directoryStatus: 'LISTED',
    liveConnectionStatus: 'NOT_CONNECTED',
    feeProfileStatus: 'REQUIRES_PLATFORM_VERIFICATION',
    dataCompletenessStatus: 'DIRECTORY_COMPLETE_ADAPTER_PENDING',
    defaultCurrency: 'UNKNOWN',
    supportedCurrencies: [],
    marketStats: {
      rating,
      reviews,
      items,
      offers,
      marketValue: value,
      averageDiscountRate: avgDiscountRate / 100,
      monthlyVisits,
    },
    requiredCapabilities: REQUIRED_CAPABILITIES,
    capabilityStatus: { ...NOT_CONNECTED_STATUS },
  }
}

function hasPricingModel(platform, pricingNames, pricingIds) {
  if (pricingIds.has(platform.platformId)) return true
  if (pricingNames.has(platform.name.toLowerCase())) return true
  if (platform.platformId === 'buff163' && pricingIds.has('buff')) return true
  return false
}
