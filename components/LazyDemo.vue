<script setup lang="ts">
import { computed } from 'vue'
import BlockStrip from './BlockStrip.vue'

const props = defineProps<{ step: number }>()
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const steps = [
  { label: 'Biên trái', indices: [2, 3], tone: 'edge', expression: 'a[2] = 6, a[3] = 7' },
  { label: 'Block trọn', indices: [4, 5, 6, 7], tone: 'retained', expression: 'lazy[1] = 0 + 3 = 3' },
  { label: 'Biên phải', indices: [8, 9, 10], tone: 'edge', expression: 'a[8..10] = [12, 13, 14]' },
]
const step = computed(() => Math.min(props.step, steps.length))
const applied = computed(() => steps.slice(0, step.value))
const updated = computed(() =>
  values.map((value, i) => applied.value.some(part => part.tone === 'edge' && part.indices.includes(i)) ? value + 3 : value),
)
const marks = computed(() =>
  Object.fromEntries(applied.value.flatMap(part => part.indices.map(i => [i, part.tone]))),
)
</script>

<template>
  <div class="array-demo lazy-demo" :data-step="step">
    <p class="demo-label"><code>[2, 10] += 3</code><span>B = 4</span><span>Chỉ số từ 0</span></p>
    <BlockStrip :values="updated" :block-size="4" :captions="['lazy[0] = 0', 'lazy[1] = ' + (step >= 2 ? 3 : 0), 'lazy[2] = 0']" :marks="marks" :active-block="step === 2 ? 1 : undefined" />
    <div class="demo-track">
      <div v-for="(part, index) in steps" :key="part.label" class="demo-step" :class="{ 'is-current': step === index + 1, 'is-complete': step > index + 1 }">
        <strong><span class="demo-step-num">{{ index + 1 }}</span>{{ part.label }}</strong>
        <code v-if="step > index" class="step-change">{{ part.expression }}</code>
      </div>
    </div>
    <p v-if="step >= 2" class="small step-change">Các ô của block 1 vẫn giữ giá trị cơ sở</p>
  </div>
</template>
