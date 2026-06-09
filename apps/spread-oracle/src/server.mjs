import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildDryRun, buildSnapshot } from './oracle.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const publicDir = join(root, 'public')
const port = Number(process.env.PORT || 4873)
const host = process.env.HOST || '0.0.0.0'

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)

    if (url.pathname === '/api/health') {
      return json(res, { ok: true, mode: 'precheck-only' })
    }

    if (url.pathname === '/api/snapshot') {
      return json(res, buildSnapshot())
    }

    if (url.pathname === '/api/opportunities') {
      return json(res, { items: buildSnapshot().opportunities })
    }

    if (url.pathname === '/api/platforms') {
      return json(res, buildSnapshot().platformCoverage)
    }

    if (url.pathname.startsWith('/api/opportunities/')) {
      const id = decodeURIComponent(url.pathname.replace('/api/opportunities/', ''))
      const opportunity = buildSnapshot().opportunities.find((item) => item.opportunityId === id)
      return opportunity ? json(res, opportunity) : notFound(res)
    }

    if ((url.pathname === '/api/precheck' || url.pathname === '/api/dry-run') && req.method === 'POST') {
      const body = await readBody(req)
      const plan = buildDryRun(body.opportunityId)
      return plan ? json(res, plan) : notFound(res)
    }

    return staticFile(res, url.pathname)
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ ok: false, error: error.message }))
  }
})

server.listen(port, host, () => {
  console.log(`CS-AMM spread oracle listening on http://${host}:${port}`)
})

async function staticFile(res, pathname) {
  const safePath = normalize(pathname === '/' ? '/index.html' : pathname).replace(/^(\.\.[/\\])+/, '')
  const fullPath = join(publicDir, safePath)
  const data = await readFile(fullPath)
  res.writeHead(200, { 'Content-Type': mime[extname(fullPath)] || 'application/octet-stream' })
  res.end(data)
}

function json(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data, null, 2))
}

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify({ ok: false, error: 'not found' }))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}
