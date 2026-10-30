import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { site } from '../data/site.ts'
import {
  LIMITS,
  mailtoFallback,
  sendContactMessage,
  validateContact,
  type ContactErrors,
  type ContactPayload,
} from '../lib/contact.ts'
import { Peek } from './Peek.tsx'

type Status = 'idle' | 'sending' | 'success' | 'error' | 'unavailable'
const EMPTY: ContactPayload = { name: '', email: '', subject: '', message: '' }
const ORDER: (keyof ContactPayload)[] = ['name', 'email', 'subject', 'message']

/**
 * Formulaire de contact : validation côté client, compteur de caractères, champ piège anti-robots,
 * états envoi / succès / erreur. Le renard passe les oreilles quand on écrit et réagit au résultat.
 */
export function ContactForm() {
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<ContactPayload>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof ContactPayload, boolean>>>({})
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [fallback, setFallback] = useState('')
  const [trap, setTrap] = useState('')

  const id = (k: string) => `${uid}-${k}`

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const next = { ...values, [name]: value }
    setValues(next)
    if (touched[name as keyof ContactPayload]) setErrors(validateContact(next))
    if (status !== 'idle' && status !== 'sending') setStatus('idle')
  }

  const onBlur = (e: { target: { name: string } }) => {
    const k = e.target.name as keyof ContactPayload
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validateContact(values))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const errs = validateContact(values)
    setErrors(errs)
    setTouched({ name: true, email: true, subject: true, message: true })
    const first = ORDER.find((k) => errs[k])
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    // Champ piège rempli : c'est un robot. On fait comme si de rien n'était, sans rien envoyer.
    if (trap) {
      await new Promise((r) => setTimeout(r, 800))
      setStatus('success')
      return
    }
    const payload: ContactPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    }
    const res = await sendContactMessage(payload)
    if (res.ok) {
      setStatus('success')
      setValues(EMPTY)
      setTouched({})
    } else if (res.reason === 'unavailable') {
      setFallback(mailtoFallback(site.email, payload))
      setStatus('unavailable')
    } else {
      setFallback(mailtoFallback(site.email, payload))
      setStatus('error')
    }
  }

  const show = (k: keyof ContactPayload) => (touched[k] ? errors[k] : undefined)
  const count = values.message.trim().length
  const peek = status === 'idle' ? null : 'head'
  const mood = status === 'success' ? 'happy' : status === 'error' || status === 'unavailable' ? 'sad' : 'idle'

  const field = (k: 'name' | 'email' | 'subject', label: string, opts: { type?: string; autoComplete?: string; optional?: boolean }) => {
    const err = show(k)
    return (
      <div className="field">
        <label htmlFor={id(k)}>
          {label}
          {opts.optional && <span className="field__opt"> (facultatif)</span>}
        </label>
        <input
          id={id(k)}
          name={k}
          type={opts.type ?? 'text'}
          autoComplete={opts.autoComplete}
          value={values[k]}
          maxLength={LIMITS[k]}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? id(`${k}-err`) : undefined}
          required={!opts.optional}
        />
        {err && (
          <p className="field__error" id={id(`${k}-err`)}>
            {err}
          </p>
        )}
      </div>
    )
  }

  const msgErr = show('message')

  return (
    <Peek className="contact-form-wrap" side="right" force={peek} mood={mood}>
      <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate aria-describedby={id('hint')}>
        <h3 className="contact-form__title">Écrire un message</h3>
        <p className="contact-form__hint" id={id('hint')}>
          Tous les champs sont obligatoires, sauf l'objet.
        </p>
        <div className="contact-form__row">
          {field('name', 'Nom', { autoComplete: 'name' })}
          {field('email', 'E-mail', { type: 'email', autoComplete: 'email' })}
        </div>
        {field('subject', 'Objet', { optional: true })}

        <div className="field">
          <label htmlFor={id('message')}>Message</label>
          <textarea
            id={id('message')}
            name="message"
            rows={6}
            value={values.message}
            maxLength={LIMITS.message}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={msgErr ? true : undefined}
            aria-describedby={`${id('count')}${msgErr ? ` ${id('message-err')}` : ''}`}
            required
          />
          <div className="field__meta">
            {msgErr ? (
              <p className="field__error" id={id('message-err')}>
                {msgErr}
              </p>
            ) : (
              <span />
            )}
            <span className={count > LIMITS.message * 0.9 ? 'field__count is-near' : 'field__count'} id={id('count')}>
              {count} / {LIMITS.message}
              <span className="sr-only"> caractères</span>
            </span>
          </div>
        </div>

        {/* Piège à robots : invisible et hors du parcours clavier ; un humain ne le remplit jamais. */}
        <div className="hp" aria-hidden="true">
          <label htmlFor={id('website')}>Site web</label>
          <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </div>

        <div className="contact-form__actions">
          <button type="submit" className="btn btn--primary" disabled={status === 'sending'} aria-disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
          </button>
          <div className="contact-form__status" role="status" aria-live="polite">
            {status === 'sending' && <p className="status status--sending">Le renard porte votre message…</p>}
            {status === 'success' && <p className="status status--ok">Message envoyé, merci ! Je vous réponds au plus vite.</p>}
            {status === 'error' && (
              <p className="status status--err">
                L'envoi a échoué (connexion ou serveur). Réessayez dans un instant, ou{' '}
                <a href={fallback}>écrivez-moi directement à {site.email}</a>.
              </p>
            )}
            {status === 'unavailable' && (
              <p className="status status--err">
                L'envoi depuis le site n'est pas encore disponible. Votre message est prêt :{' '}
                <a href={fallback}>l'envoyer depuis votre messagerie à {site.email}</a>.
              </p>
            )}
          </div>
        </div>
      </form>
    </Peek>
  )
}
