export type ContactPayload = {
  name: string
  email: string
  subject: string
  message: string
}

export type SendResult =
  | { ok: true; simulated?: boolean }
  | { ok: false; reason: 'unavailable' | 'network' | 'server' }

export const LIMITS = { name: 80, email: 120, subject: 120, message: 2000, messageMin: 10 } as const

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT?.trim()

/** Vrai si un relais d'envoi est configuré au build. */
export const contactAvailable = Boolean(ENDPOINT)

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Envoie le message au relais (POST JSON { name, email, subject, message }).
 * Le relais (Cloudflare Worker ou équivalent, hors de ce dépôt) le transmet à Discord :
 * l'URL du webhook ne doit jamais se trouver dans le front.
 *
 * Sans VITE_CONTACT_ENDPOINT : succès simulé en dev, « unavailable » en production.
 */
export async function sendContactMessage(payload: ContactPayload): Promise<SendResult> {
  if (!ENDPOINT) {
    if (import.meta.env.DEV) {
      await wait(1200)
      console.info('[contact] envoi simulé (VITE_CONTACT_ENDPOINT non défini)', payload)
      return { ok: true, simulated: true }
    }
    return { ok: false, reason: 'unavailable' }
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })
    return res.ok ? { ok: true } : { ok: false, reason: 'server' }
  } catch {
    return { ok: false, reason: 'network' }
  }
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Validation côté client (le relais doit revalider côté serveur). */
export function validateContact(p: ContactPayload): ContactErrors {
  const errors: ContactErrors = {}
  const name = p.name.trim()
  const email = p.email.trim()
  const message = p.message.trim()
  if (name.length < 2) errors.name = 'Indiquez votre nom (2 caractères minimum).'
  else if (name.length > LIMITS.name) errors.name = `${LIMITS.name} caractères maximum.`
  if (!email) errors.email = 'Indiquez votre adresse e-mail pour que je puisse vous répondre.'
  else if (!EMAIL_RE.test(email) || email.length > LIMITS.email) errors.email = 'Cette adresse e-mail ne semble pas valide (exemple : prenom@domaine.fr).'
  if (p.subject.trim().length > LIMITS.subject) errors.subject = `${LIMITS.subject} caractères maximum.`
  if (message.length < LIMITS.messageMin) errors.message = `Votre message est un peu court (${LIMITS.messageMin} caractères minimum).`
  else if (message.length > LIMITS.message) errors.message = `${LIMITS.message} caractères maximum.`
  return errors
}

/** Lien mailto prérempli, utilisé quand l'envoi depuis le site est indisponible. */
export function mailtoFallback(to: string, p: ContactPayload) {
  const subject = p.subject.trim() || `Message de ${p.name.trim() || 'votre portfolio'}`
  const body = `${p.message.trim()}\n\n${p.name.trim()}${p.email.trim() ? ` (${p.email.trim()})` : ''}`
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
