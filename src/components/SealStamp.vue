<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { haptic } from '../utils/haptics'

const route = useRoute()
const stampId = ref(0)
let timer: number | undefined

// À chaque fiche ouverte, le sceau du Pôle Nord tamponne la page :
// l'anneau se dessine, puis le flash couvre l'arrivée du contenu
watch(
  () => route.path,
  (path) => {
    if (!path.startsWith('/activites/')) return
    stampId.value++
    haptic([8, 40, 10])
    window.clearTimeout(timer)
    timer = window.setTimeout(() => (stampId.value = 0), 950)
  },
)
</script>

<template>
  <div v-if="stampId" :key="stampId" class="seal-stamp" aria-hidden="true">
    <span class="stamp-veil" />
    <span class="stamp-core">
      <i class="stamp-ring" />
      <i class="stamp-comet" />
      <i class="stamp-flash" />
    </span>
  </div>
</template>

<style scoped>
.seal-stamp {
  position:fixed;
  inset:0;
  z-index:80;
  display:grid;
  place-items:center;
  pointer-events:none;
  animation:stamp-out .3s ease .68s both
}

@keyframes stamp-out {
  to {
    opacity:0
  }
}

/* léger voile sombre : la page se tamponne dans la pénombre */
.stamp-veil {
  position:absolute;
  inset:0;
  background:radial-gradient(circle at 50% 46%,transparent 26%,rgba(4,12,9,.42) 100%);
  animation:veil-in .45s ease both
}

@keyframes veil-in {
  from {
    opacity:0
  }
  to {
    opacity:1
  }
}

.stamp-core {
  position:relative;
  display:grid;
  place-items:center;
  width:130px;
  height:130px;
  animation:stamp-pop .6s var(--spring) both
}

@keyframes stamp-pop {
  0% {
    transform:scale(.35);
    opacity:0
  }
  60% {
    opacity:1
  }
  100% {
    transform:scale(1);
    opacity:1
  }
}

/* l'anneau conique se trace comme sur le sceau d'ouverture */
.stamp-ring {
  position:absolute;
  inset:0;
  border-radius:50%;
  background:conic-gradient(#ffd700,#ffe9a8,#ffd700);
  mask:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px));
  -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 5px),#000 calc(100% - 4px));
  filter:drop-shadow(0 0 10px rgba(255,215,0,.9));
  animation:ring-spin .55s cubic-bezier(.5,0,.3,1) both
}

@keyframes ring-spin {
  from {
    transform:rotate(-140deg) scale(.8);
    opacity:0
  }
  30% {
    opacity:1
  }
  to {
    transform:rotate(0deg) scale(1);
    opacity:1
  }
}

.stamp-comet {
  position:absolute;
  inset:0;
  animation:comet-turn .55s cubic-bezier(.5,0,.3,1) both
}

.stamp-comet::before {
  content:'';
  position:absolute;
  left:50%;
  top:-4px;
  width:10px;
  height:10px;
  margin-left:-5px;
  border-radius:50%;
  background:#fff;
  box-shadow:0 0 12px 5px rgba(255,242,161,.95)
}

@keyframes comet-turn {
  from {
    transform:rotate(-140deg);
    opacity:0
  }
  25% {
    opacity:1
  }
  to {
    transform:rotate(0deg);
    opacity:1
  }
}

/* le flash d'or qui couvre l'arrivée de la fiche */
.stamp-flash {
  position:absolute;
  inset:-20px;
  border-radius:50%;
  background:radial-gradient(circle,#fffdf0 0%,rgba(255,242,161,.85) 34%,rgba(255,215,0,.3) 58%,transparent 72%);
  mix-blend-mode:screen;
  animation:stamp-flash .55s cubic-bezier(.2,.7,.3,1) .38s both
}

@keyframes stamp-flash {
  0% {
    transform:scale(.4);
    opacity:0
  }
  22% {
    opacity:1
  }
  100% {
    transform:scale(3.2);
    opacity:0
  }
}

@media (prefers-reduced-motion:reduce) {
  .seal-stamp {
    animation-duration:.01ms;
    animation-delay:0s
  }
  .stamp-ring,.stamp-comet,.stamp-flash {
    animation-duration:.01ms!important
  }
}
</style>
