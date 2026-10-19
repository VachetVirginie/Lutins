import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * MatchMedia réactif — l'équivalent minimal de useDisplay() de Vuetify,
 * sans dépendance ni design system imposé.
 *
 * Usage : const isDesktop = useMediaQuery('(min-width: 1024px)')
 * puis v-if="isDesktop" pour diverger le markup, ou des classes CSS.
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(false)
  let mql: MediaQueryList | null = null
  const update = () => {
    matches.value = mql?.matches ?? false
  }
  onMounted(() => {
    mql = matchMedia(query)
    mql.addEventListener('change', update)
    update()
  })
  onUnmounted(() => mql?.removeEventListener('change', update))
  return matches
}

/** Le point de bascule unique mobile ↔ bureau de l'app */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
