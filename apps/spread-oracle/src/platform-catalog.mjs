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

export const platformCatalogSource = {
  name: 'CSGOSKINS.GG Markets',
  url: CSGOSKINS_MARKETS_URL,
  sourceScope: 'market-directory',
  notes:
    'The directory page is used as the canonical platform list. Fees and execution capabilities still require direct platform or account-level verification before live trading.',
}

export const platformCatalog = [
  market('steam', 'Steam', 'steam', 4.8, '8.5K', '26.5K', '2.2M', '$89.6M', 31.5, '12.7M', 'official-market'),
  market('csfloat', 'CSFloat', 'csfloat', 4.8, '922', '27.6K', '1M', '$46.4M', 39.7, '1.9M', 'p2p-market'),
  market('lis-skins', 'LIS-SKINS', 'lis-skins', 4.5, '18', '30.2K', '529.4K', '$23.1M', 39.3, '1.7M', 'cash-market'),
  market('cs-money', 'CS.MONEY', 'csmoney', 4.0, '269', '20.2K', '49K', '$21.7M', 30.2, '1.5M', 'trade-bot'),
  market('skinport', 'Skinport', 'skinport', 4.9, '35', '19.1K', '530.5K', '$19.5M', 45.0, '3.3M', 'cash-market'),
  market('tradeit', 'Tradeit.gg', 'tradeit-gg', 4.2, '137', '21.3K', '301.3K', '$11.2M', 42.8, '1.5M', 'trade-bot'),
  market('buff163', 'BUFF163', 'buff163', 4.1, '142', '25.1K', '1.3M', '$10.4M', 45.9, '5M', 'cash-market'),
  market('gameboost', 'GameBoost', 'gameboost', 4.0, '33', '10.4K', '83.4K', '$4.6M', 39.1, '6.8M', 'cash-market'),
  market('dmarket', 'DMarket', 'dmarket', 4.0, '171', '27.4K', '457.3K', '$4.3M', 48.6, '1.8M', 'cash-market'),
  market('cs2-market', 'CS2', 'cs2', 3.3, '106', '11.7K', '243.7K', '$3.2M', 44.8, '703.7K', 'cash-market'),
  market('pirateswap', 'PirateSwap', 'pirateswap', 4.6, '7', '20.4K', '205.8K', '$2.6M', 48.8, '83.9K', 'trade-bot'),
  market('skinswap', 'SkinSwap', 'skinswap', 4.3, '15', '10.5K', '135K', '$2.4M', 49.0, '134.8K', 'trade-bot'),
  market('skin-land', 'Skin.Land', 'skin-land', 3.6, '25', '13.4K', '41.6K', '$2.4M', 31.3, '1.1M', 'cash-market'),
  market('avan-market', 'Avan.market', 'avan-market', 4.3, '6', '6.5K', '56K', '$1.8M', 55.5, '74.8K', 'cash-market'),
  market('skinflow', 'Skinflow', 'skinflow', 4.0, '3', '8.8K', '85.3K', '$1.4M', 52.1, '7.6K', 'cash-market'),
  market('aim-market', 'Aim.market', 'aim-market', 3.5, '3', '9K', '26.8K', '$953.5K', 43.2, '294.9K', 'cash-market'),
  market('mannco-store', 'Mannco.store', 'mannco-store', 3.0, '1', '1.1K', '4.7K', '$744.6K', 38.6, '1.4M', 'cash-market'),
  market('white-market', 'white.market', 'white-market', 4.5, '7', '6.4K', '47.6K', '$564.8K', 50.2, '2.2M', 'cash-market'),
  market('skinbaron', 'SkinBaron', 'skinbaron', 3.4, '65', '10.6K', '48.8K', '$551.3K', 50.3, '1.3M', 'cash-market'),
  market('skinplace', 'SkinPlace', 'skinplace', 3.5, '9', '9.3K', '57.8K', '$511.6K', 48.0, '49.4K', 'cash-market'),
  market('buff-market', 'BUFF Market', 'buff-market', 3.4, '21', '15K', '167.7K', '$389.7K', 51.4, '297.5K', 'cash-market'),
  market('shadowpay', 'ShadowPay', 'shadowpay', 3.3, '21', '10.9K', '52.9K', '$339.7K', 50.5, '278.3K', 'cash-market'),
  market('waxpeer', 'WAXPEER', 'waxpeer', 3.2, '28', '14.5K', '60.3K', '$213.9K', 55.5, '333.4K', 'p2p-market'),
  market('skinout', 'SkinOut', 'skinout', 3.4, '18', '5.5K', '15.1K', '$114.1K', 58.2, '285.2K', 'cash-market'),
  market('cs-trade', 'CS.TRADE', 'cs-trade', 3.3, '31', '4K', '12K', '$103.1K', 52.6, '476.1K', 'trade-bot'),
  market('skinvault', 'Skinvault', 'skinvault', 4.2, '5', '1K', '2.7K', '$47.3K', 49.9, '69K', 'cash-market'),
  market('uuskins', 'UUSKINS', 'uuskins', 3.0, '3', '7.2K', '100.7K', '$21.4K', 49.4, '61.6K', 'cash-market'),
  market('skins-com', 'Skins.com', 'skins-com', 3.5, '10', '3.9K', '14.9K', '$7.3K', 55.4, '195.2K', 'cash-market'),
  market('haloskins', 'HaloSkins', 'haloskins', 2.3, '21', '337', '674', '$1.8K', 66.5, '29.6K', 'cash-market'),
  market('exeskins', 'Exeskins', 'exeskins', 4.3, '3', '373', '1.2K', '$240', 65.4, '77.6K', 'cash-market'),
  market('ntskins', 'NTSkins', 'ntskins', 2.5, '7', '35', '51', '$87', 70.3, '66.5K', 'cash-market'),
  market('dupe', 'Dupe', 'dupe', 3.9, '6', '2', '2', '$10', 37.8, '105.6K', 'cash-market'),
]

export function buildPlatformCoverage(pricingPlatforms = []) {
  const pricingNames = new Set(pricingPlatforms.map((platform) => platform.name.toLowerCase()))
  const pricingIds = new Set(pricingPlatforms.map((platform) => platform.platformId.toLowerCase()))
  const catalog = platformCatalog.map((platform) => ({
    ...platform,
    pricingModelStatus: hasPricingModel(platform, pricingNames, pricingIds) ? 'PRICING_MODEL_SAMPLE' : 'CATALOG_ONLY',
  }))

  return {
    source: platformCatalogSource,
    summary: {
      catalogTotal: catalog.length,
      directoryCovered: catalog.length,
      liveConnected: 0,
      pricingModelSample: catalog.filter((platform) => platform.pricingModelStatus === 'PRICING_MODEL_SAMPLE').length,
      pendingLiveAdapters: catalog.length,
      requiredCapabilities: REQUIRED_CAPABILITIES,
    },
    catalog,
  }
}

function market(id, name, slug, rating, reviews, items, offers, value, avgDiscountRate, monthlyVisits, marketType) {
  return {
    platformId: id,
    name,
    marketType,
    sourceUrl: `${CSGOSKINS_MARKETS_URL}/${slug}`,
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
