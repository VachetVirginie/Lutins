import { reactive, ref, watch } from 'vue'
import { supabase } from '../lib/supabase'

/**
 * L'état partagé de l'aventure — vit en mémoire + localStorage,
 * et se synchronise sur Supabase quand un code famille relie deux appareils.
 * Aucune donnée n'est envoyée sans code famille.
 */

export interface AdventureSnapshot {
  prenoms_enfants: string[]
  nom_proche: string
  nom_lutin: string
  deuxieme_lutin: boolean
  nom_second_lutin: string
  ville: string
  destination: string
  quartier: string
  date_debut: string
  date_fin: string
  jours_sans_activite: string
  lieux_sejour: string
  activites_modifiees: string
  photo_entree: string
  photo_lutins: string
  prep_done: string[]
}

const STORAGE_KEY = 'lutin:adventure-state'
const CODE_KEY = 'lutin:family-code'

const emptyState = (): AdventureSnapshot => ({
  prenoms_enfants: [],
  nom_proche: '',
  nom_lutin: '',
  deuxieme_lutin: false,
  nom_second_lutin: '',
  ville: '',
  destination: '',
  quartier: '',
  date_debut: '',
  date_fin: '',
  jours_sans_activite: '',
  lieux_sejour: '',
  activites_modifiees: '',
  photo_entree: '',
  photo_lutins: '',
  prep_done: [],
})

function loadLocal(): AdventureSnapshot {
  try {
    const state = { ...emptyState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
    if (!Array.isArray(state.prenoms_enfants)) state.prenoms_enfants = []
    if (!Array.isArray(state.prep_done)) state.prep_done = []
    return state
  } catch {
    return emptyState()
  }
}

/** L'état vivant — les vues s'abonnent directement dessus */
const { prep_done: localDone, ...localRest } = loadLocal()
export const adventure = reactive({ ...localRest, prepDone: new Set<string>(localDone) })

export const familyCode = ref<string | null>(localStorage.getItem(CODE_KEY))
export const syncStatus = ref<'local' | 'connecting' | 'synced' | 'error'>(supabase && familyCode.value ? 'connecting' : 'local')

/* ---- sérialisation ---- */
const snapshot = (): AdventureSnapshot => {
  const { prepDone, ...rest } = adventure
  return { ...rest, prep_done: [...prepDone] }
}

function applyRemote(state: AdventureSnapshot) {
  applyingRemote = true
  const { prep_done, prenoms_enfants, ...rest } = state
  Object.assign(adventure, rest)
  adventure.prenoms_enfants = Array.isArray(prenoms_enfants) ? prenoms_enfants : []
  adventure.prepDone = new Set(Array.isArray(prep_done) ? prep_done : [])
  applyingRemote = false
}

/* ---- persistance locale + push distant (debounce) ---- */
let applyingRemote = false
let pushTimer = 0

watch(
  () => snapshot(),
  (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    const sb = supabase
    if (applyingRemote || !familyCode.value || !sb) return
    clearTimeout(pushTimer)
    pushTimer = window.setTimeout(() => {
      sb.from('adventures')
        .upsert({ code: familyCode.value, state, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          syncStatus.value = error ? 'error' : 'synced'
          if (error) console.warn('[lutins] sync push failed:', error.message)
        })
    }, 800)
  },
  { deep: true, flush: 'sync' },
)

/* ---- le code famille ---- */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function generateCode(): string {
  let tail = ''
  for (let i = 0; i < 4; i++) tail += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  return `LUTIN-${tail}`
}

let channel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null

function subscribe(code: string) {
  channel?.unsubscribe()
  if (!supabase) return
  channel = supabase
    .channel(`adventure-${code}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'adventures', filter: `code=eq.${code}` },
      (payload) => applyRemote(payload.new.state as AdventureSnapshot),
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') syncStatus.value = 'synced'
    })
}

/** Crée une expédition partagée : génère le code et pousse l'état courant */
export async function createFamily(): Promise<string | null> {
  if (!supabase) return null
  const code = generateCode()
  const { error } = await supabase
    .from('adventures')
    .upsert({ code, state: snapshot(), updated_at: new Date().toISOString() })
  if (error) {
    syncStatus.value = 'error'
    console.warn('[lutins] createFamily failed:', error.message)
    return null
  }
  familyCode.value = code
  localStorage.setItem(CODE_KEY, code)
  syncStatus.value = 'connecting'
  subscribe(code)
  return code
}

/** Rejoint une expédition existante : tire l'état puis s'abonne aux changements */
export async function joinFamily(code: string): Promise<boolean> {
  if (!supabase) return false
  const normalized = code.trim().toUpperCase()
  const { data, error } = await supabase
    .from('adventures')
    .select('state')
    .eq('code', normalized)
    .maybeSingle()
  if (error || !data) return false
  applyRemote(data.state as AdventureSnapshot)
  familyCode.value = normalized
  localStorage.setItem(CODE_KEY, normalized)
  syncStatus.value = 'connecting'
  subscribe(normalized)
  return true
}

/** Se détache de l'expédition — l'état local est conservé */
export function leaveFamily() {
  channel?.unsubscribe()
  channel = null
  familyCode.value = null
  localStorage.removeItem(CODE_KEY)
  syncStatus.value = 'local'
}

/** Reconnexion au démarrage si un code est déjà enregistré */
if (supabase && familyCode.value) subscribe(familyCode.value)

/* ---- les photos : Storage pour la sync, data-URL compressée en local ---- */

/** Réduit une image en data-URL JPEG (persiste dans le state local) */
export function fileToDataUrl(file: File, maxSize = 1024, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(img.src)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Téléverse la photo dans le bucket `adventure-photos/{code}/{champ}`.
 * Renvoie l'URL publique à ranger dans le state — null si non synchronisé.
 */
export async function uploadPhoto(field: 'photo_entree' | 'photo_lutins', file: File): Promise<string | null> {
  if (!supabase || !familyCode.value) return null
  const path = `${familyCode.value}/${field}`
  const { error } = await supabase.storage.from('adventure-photos').upload(path, file, { upsert: true, contentType: file.type })
  if (error) {
    syncStatus.value = 'error'
    return null
  }
  const { data } = supabase.storage.from('adventure-photos').getPublicUrl(path)
  return `${data.publicUrl}?v=${Date.now()}` // cache-bust après un ré-upload
}
