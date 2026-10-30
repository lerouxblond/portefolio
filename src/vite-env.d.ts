/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL du relais qui reçoit les messages du formulaire de contact (ex. un Cloudflare Worker). */
  readonly VITE_CONTACT_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
