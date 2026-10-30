export interface Env {
  DISCORD_WEBHOOK_URL: string
  ALLOWED_ORIGINS: string
  CONTACT_LIMITER: RateLimit
}

type ContactPayload = {
  name: string
  email: string
  subject: string
  message: string
}

// Mêmes bornes que LIMITS / validateContact dans src/lib/contact.ts : le site valide, le relais revalide.
const LIMITS = { name: 80, email: 120, subject: 120, message: 2000, messageMin: 10 } as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAX_BODY = 8 * 1024

// Orange renard du site (--accent dans src/styles.css).
const FOX_ORANGE = 0xe8671c

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** Renvoie le message nettoyé, ou null s'il ne respecte pas les règles du formulaire. */
function parsePayload(data: unknown): ContactPayload | null {
  if (!data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>
  const p = { name: str(d.name), email: str(d.email), subject: str(d.subject), message: str(d.message) }
  if (p.name.length < 2 || p.name.length > LIMITS.name) return null
  if (!EMAIL_RE.test(p.email) || p.email.length > LIMITS.email) return null
  if (p.subject.length > LIMITS.subject) return null
  if (p.message.length < LIMITS.messageMin || p.message.length > LIMITS.message) return null
  return p
}

/** Neutralise le markdown Discord dans les champs courts (titre, nom). */
const escapeMd = (s: string) => s.replace(/([\\*_~`|>[\]])/g, '\\$1')

function discordBody(p: ContactPayload) {
  return {
    username: 'Renard du portfolio',
    // Personne n'est notifié par un « @everyone » glissé dans le message.
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: escapeMd(p.subject || 'Nouveau message du portfolio'),
        description: p.message,
        color: FOX_ORANGE,
        fields: [
          { name: 'Nom', value: escapeMd(p.name), inline: true },
          { name: 'E-mail', value: `[${p.email}](mailto:${encodeURI(p.email)})`, inline: true },
        ],
        footer: { text: 'portefolio · lerouxblond.github.io' },
        timestamp: new Date().toISOString(),
      },
    ],
  }
}

function corsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? ''
    const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    if (!allowed.includes(origin)) return new Response('Origine non autorisée', { status: 403 })

    const cors = corsHeaders(origin)
    const reply = (status: number, body: string | null = null) => new Response(body, { status, headers: cors })

    if (request.method === 'OPTIONS') return reply(204)
    if (request.method !== 'POST') return reply(405, 'Méthode non autorisée')

    const ip = request.headers.get('CF-Connecting-IP') ?? 'inconnue'
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip })
    if (!success) return reply(429, 'Trop de messages, réessayez dans une minute')

    const raw = await request.text()
    if (raw.length > MAX_BODY) return reply(413, 'Message trop long')
    let data: unknown
    try {
      data = JSON.parse(raw)
    } catch {
      return reply(400, 'JSON invalide')
    }
    const payload = parsePayload(data)
    if (!payload) return reply(400, 'Champs invalides')

    const res = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordBody(payload)),
    })
    if (!res.ok) {
      console.error('[contact] Discord a répondu', res.status, await res.text())
      return reply(502, 'Envoi impossible')
    }
    return reply(204)
  },
} satisfies ExportedHandler<Env>
