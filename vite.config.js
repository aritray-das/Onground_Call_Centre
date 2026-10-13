import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tokenHandler from './api/token.js'
import voiceHandler from './api/voice.js'

function localApiPlugin() {
  return {
    name: 'local-api-endpoints',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/token') {
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          }
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              req.body = body ? JSON.parse(body) : {}
            } catch {
              req.body = {}
            }
            tokenHandler(req, res)
          })
          return
        }

        if (req.url && req.url.startsWith('/api/voice')) {
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.send = (data) => {
            res.end(data)
          }
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            req.body = body
            voiceHandler(req, res)
          })
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), localApiPlugin()],
  }
})
