<script setup lang="ts">
import type { DailySheet, KitAsset } from '../../data/dailySheets'

defineProps<{ sheet: DailySheet; annexes: KitAsset[] }>()
</script>

<template>
  <!-- vue imprimable : lettre + annexes regroupés -->
  <div class="print-sheet" aria-hidden="true">
    <h1>J{{ sheet.day }} · {{ sheet.title }}</h1>
    <p class="print-date">{{ sheet.date }}</p>
    <h2>Le mot du lutin <small>(à découper)</small></h2>
    <p class="print-message">{{ sheet.message }}</p>
    <template v-if="annexes.length">
      <h2>Annexes <small>(à imprimer)</small></h2>
      <div class="print-assets"><figure v-for="(asset, i) in annexes" :key="asset.file"><img :src="asset.file" :alt="asset.label" :aria-labelledby="`annex-cap-${i}`"><figcaption :id="`annex-cap-${i}`">{{ asset.label }}{{ asset.page ? ` — p. ${asset.page}` : '' }}</figcaption></figure></div>
    </template>
  </div>
</template>

<style scoped>
.print-sheet {
  display:none
}

@media print {
  .print-sheet {
    display:block;
    padding:12px 4mm;
    color:#222;
    background:#fff;
    font-family:Georgia,serif
  }

  .print-sheet h1 {
    margin:0;
    font-size:20pt
  }

  .print-date {
    margin:2mm 0 6mm;
    font-size:9pt;
    letter-spacing:.14em;
    text-transform:uppercase
  }

  .print-sheet h2 {
    margin:7mm 0 3mm;
    font-size:12pt;
    border-bottom:1px solid #999
  }

  .print-sheet h2 small {
    font-weight:400;
    font-style:italic;
    color:#666
  }

  .print-message {
    padding:4mm;
    border:1.5px dashed #8a6a2f;
    font-size:11pt;
    line-height:1.6;
    white-space:pre-line
  }

  .print-assets {
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:5mm
  }

  .print-assets figure {
    margin:0;
    break-inside:avoid
  }

  .print-assets img {
    width:100%;
    border:1px solid #ccc
  }

  .print-assets figcaption {
    font-size:8pt;
    color:#555
  }
}
</style>
