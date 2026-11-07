<script setup lang="ts">
import { computed } from 'vue'
import BlockStrip from './BlockStrip.vue'

const props = defineProps<{ step: number }>()
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const steps = [
  { label: 'Biên trái', indices: [2, 3], tone: 'edge', expression: '3 + 4 = 7' },
  { label: 'Block trọn', indices: [4, 5, 6, 7], tone: 'retained', expression: '7 + 26 = 33' },
  { label: 'Biên phải', indices: [8, 9, 10], tone: 'edge', expression: '33 + 9 + 10 + 11 = 63' },
]
const totals = ['?', 7, 33, 63]
const step = computed(() => Math.min(props.step, steps.length))
const marks = computed(() =>
  Object.fromEntries(steps.slice(0, step.value).flatMap(part => part.indices.map(i => [i, part.tone]))),
)
</script>

<template>
  <div class="array-demo" :data-step="step">
    <p class="demo-label"><code>sum(2, 10)</code><span>B = 4</span><span>Chỉ số từ 0</span></p>
    <BlockStrip :values="values" :block-size="4" :captions="['b[0] = 10', 'b[1] = 26', 'b[2] = 42']" :marks="marks" :active-block="step === 2 ? 1 : undefined" />
    <div class="demo-track">
      <div v-for="(part, index) in steps" :key="part.label" class="demo-step" :class="{ 'is-current': step === index + 1, 'is-complete': step > index + 1 }">
        <strong><span class="demo-step-num">{{ index + 1 }}</span>{{ part.label }}</strong>
        <span v-if="step > index" class="formula-text step-change">{{ part.expression }}</span>
      </div>
    </div>
    <div class="demo-total" aria-live="polite">ans = <strong :key="step" class="step-change">{{ totals[step] }}</strong></div>
  </div>
</template>
