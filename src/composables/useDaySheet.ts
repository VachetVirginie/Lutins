import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentAdventure } from '../data/adventure'
import { adventure } from '../data/adventureStore'
import { contentGapByDay } from '../data/contentGaps'
import { dailySheetsByActivityId, type KitAsset } from '../data/dailySheets'
import { visualForDay } from '../data/dayVisuals'
import { sheetForDay } from '../data/farces'
import { haptic } from '../utils/haptics'
import { personalizeSheet } from '../utils/personalize'

/**
 * Toute la donnée d'une dépêche — partagée par les coquilles mobile et bureau.
 * Les vues n'ajoutent que leurs interactions (swipe/tilt vs hover/clavier).
 */
export function useDaySheet() {
  const route = useRoute()
  const router = useRouter()

  const activityId = computed(() => String(route.params.activityId))
  const dayNumber = computed(() => Number(activityId.value.match(/jour-(\d+)/)?.[1] ?? 0))
  const sheet = computed(() => {
    const raw = sheetForDay(dayNumber.value) ?? dailySheetsByActivityId[activityId.value]
    return raw ? personalizeSheet(raw) : raw
  })
  const gap = computed(() => contentGapByDay[dayNumber.value])
  const dayVisual = computed(() => (dayNumber.value ? visualForDay(dayNumber.value) : undefined))
  const annexes = computed<KitAsset[]>(() => {
    const list: KitAsset[] = []
    if (dayVisual.value) list.push({ file: dayVisual.value, label: 'Illustration du jour', page: 0 })
    list.push(...(sheet.value?.assets ?? []))
    return list
  })

  const preparationDone = computed({
    get: () => adventure.daysDone.has(dayNumber.value),
    set: (value) => {
      const next = new Set(adventure.daysDone)
      value ? next.add(dayNumber.value) : next.delete(dayNumber.value)
      adventure.daysDone = next
    },
  })

  const chapter = computed(() => currentAdventure.chapter)
  const totalDays = computed(() => currentAdventure.totalDays)

  // Le rituel du sceau — partagé entre coquilles : chaque vue choisit
  // son effet de cire (haptique mobile, son desktop) au moment du geste.
  const opened = ref(false)
  const cracking = ref(false)

  watch(sheet, () => {
    opened.value = false
    cracking.value = false
  }, { immediate: true })

  function unseal(opts: { crack?: () => void; open?: () => void; delay?: number } = {}) {
    if (cracking.value || opened.value) return
    cracking.value = true
    opts.crack?.()
    window.setTimeout(() => {
      opened.value = true
      opts.open?.()
    }, opts.delay ?? 720)
  }

  const copied = ref(false)

  function goBack() {
    if (window.history.state?.back) router.back()
    else router.push('/home')
  }

  function goToDay(day: number) {
    if (day < 1 || day > totalDays.value) return
    router.push(`/activites/jour-${day}`)
  }

  function togglePreparation() {
    preparationDone.value = !preparationDone.value
    haptic(12)
  }

  async function copyMessage() {
    if (!sheet.value) return
    await navigator.clipboard?.writeText(sheet.value.message)
    haptic(8)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  }

  // Distinction d'usage : découper le mot, imprimer le support, écrire à la main
  function assetKind(label: string): string {
    if (/coloriage/i.test(label)) return 'À imprimer puis colorier'
    if (/carte|pancarte|image|illustration/i.test(label)) return 'À imprimer puis découper'
    return 'À imprimer'
  }

  /** Imprime la fiche complète (lettre + annexes) via la vue d'impression */
  function printSheet() {
    haptic(8)
    window.print()
  }

  /** Imprime une seule annexe dans une fenêtre dédiée */
  function printAsset(file: string) {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!doctype html><html><head><title>Annexe</title></head><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#fff"><img src="${file}" style="max-width:100%;max-height:100vh;object-fit:contain" onload="setTimeout(()=>window.print(),150)" /></body></html>`)
    w.document.close()
  }

  return {
    activityId,
    dayNumber,
    sheet,
    gap,
    dayVisual,
    annexes,
    preparationDone,
    chapter,
    totalDays,
    opened,
    cracking,
    unseal,
    copied,
    goBack,
    goToDay,
    togglePreparation,
    copyMessage,
    assetKind,
    printSheet,
    printAsset,
  }
}
