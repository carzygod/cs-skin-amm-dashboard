import { platformCatalog, platformCatalogSource } from './platform-catalog.mjs'

const DEFAULT_TIMEOUT_MS = 4500
const CACHE_TTL_MS = 30000
const CONCURRENCY = 8

let cachedSnapshot = null

export async function buildConnectivitySnapshot({ force = false, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  if (!force && cachedSnapshot && Date.now() - cachedSnapshot.cachedAt < CACHE_TTL_MS) {
    return cachedSnapshot.payload
  }

  const items = await mapLimit(platformCatalog, CONCURRENCY, (platform) => probePlatform(platform, timeoutMs))
  const payload = {
    source: platformCatalogSource,
    generatedAt: new Date().toISOString(),
    timeoutMs,
    summary: summarize(items),
    items,
  }

  cachedSnapshot = {
    cachedAt: Date.now(),
    payload,
  }

  return payload
}

async function probePlatform(platform, timeoutMs) {
  const startedAt = performance.now()
  const checkedAt = new Date().toISOString()
  const targetUrl = platform.probeUrl || platform.sourceUrl

  try {
    const response = await fetchWithTimeout(targetUrl, timeoutMs)
    const latencyMs = Math.round(performance.now() - startedAt)

    return {
      platformId: platform.platformId,
      name: platform.name,
      marketType: platform.marketType,
      probeUrl: targetUrl,
      probeTargetKind: platform.probeTargetKind || 'directory',
      connectivityStatus: classifyStatus(response.status),
      latencyMs,
      httpStatus: response.status,
      checkedAt,
      error: null,
    }
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startedAt)
    const timeout = error.name === 'AbortError' || error.message === 'probe-timeout'

    return {
      platformId: platform.platformId,
      name: platform.name,
      marketType: platform.marketType,
      probeUrl: targetUrl,
      probeTargetKind: platform.probeTargetKind || 'directory',
      connectivityStatus: timeout ? 'TIMEOUT' : 'OFFLINE',
      latencyMs: timeout ? timeoutMs : latencyMs,
      httpStatus: null,
      checkedAt,
      error: normalizeError(error),
    }
  }
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('probe-timeout')), timeoutMs)

  try {
    const head = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'CS-AMM connectivity probe',
      },
    })

    if (head.status !== 405) return head

    return fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'CS-AMM connectivity probe',
        range: 'bytes=0-1024',
      },
    })
  } finally {
    clearTimeout(timer)
  }
}

function classifyStatus(status) {
  if (status >= 200 && status < 400) return 'ONLINE'
  if (status === 401 || status === 403 || status === 429) return 'REACHABLE'
  if (status >= 400 && status < 500) return 'REACHABLE'
  if (status >= 500) return 'DEGRADED'
  return 'UNKNOWN'
}

function summarize(items) {
  const counts = {
    total: items.length,
    online: items.filter((item) => item.connectivityStatus === 'ONLINE').length,
    reachable: items.filter((item) => item.connectivityStatus === 'REACHABLE').length,
    degraded: items.filter((item) => item.connectivityStatus === 'DEGRADED').length,
    timeout: items.filter((item) => item.connectivityStatus === 'TIMEOUT').length,
    offline: items.filter((item) => item.connectivityStatus === 'OFFLINE').length,
    unknown: items.filter((item) => item.connectivityStatus === 'UNKNOWN').length,
  }
  const latencies = items
    .filter((item) => Number.isFinite(item.latencyMs))
    .map((item) => item.latencyMs)
    .sort((a, b) => a - b)
  const averageLatencyMs = latencies.length
    ? Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length)
    : null
  const medianLatencyMs = latencies.length ? latencies[Math.floor(latencies.length / 2)] : null

  return {
    ...counts,
    averageLatencyMs,
    medianLatencyMs,
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length)
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await mapper(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

function normalizeError(error) {
  if (!error) return null
  if (error.name === 'AbortError' || error.message === 'probe-timeout') return 'timeout'
  return error.code || error.cause?.code || error.name || 'network-error'
}
