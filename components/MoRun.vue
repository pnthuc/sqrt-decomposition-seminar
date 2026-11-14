<script setup lang="ts">
import { useNav, useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import BlockStrip from './BlockStrip.vue'

const props = defineProps<{ step: number }>()
const { go } = useNav()
const { $page } = useSlideContext()
const values = [1, 1, 1, 2, 2, 3, 3, 3, 2, 2]
const queries = [{ l: 3, r: 9, id: 0 }, { l: 0, r: 9, id: 1 }, { l: 0, r: 4, id: 2 }]
const blockSize = 3
const ordered = [...queries].sort((a, b) => Math.floor(a.l / blockSize) - Math.floor(b.l / blockSize) || a.r - b.r)
type Frame = {
  left: number
  right: number
  counts: number[]
  answers: (number | null)[]
  queryId: number
  action: string
  changed?: number
  delta?: number
}
const counts = [0, 0, 0]
const answers: (number | null)[] = queries.map(() => null)
let left = 0
let right = -1
const frames: Frame[] = [{ left, right, counts: [...counts], answers: [...answers], queryId: ordered[0].id, action: 'Bắt đầu với cửa sổ rỗng [0, −1]' }]

function snapshot(queryId: number, action: string, changed?: number, delta?: number) {
  frames.push({ left, right, counts: [...counts], answers: [...answers], queryId, action, changed, delta })
}

function change(queryId: number, position: number, delta: number) {
  const value = values[position]
  const before = counts[value - 1]
  counts[value - 1] += delta
  const action = delta > 0 ? 'add' : 'remove'
  snapshot(queryId, action + '(' + position + ') → cnt[' + value + '] = ' + before + ' → ' + counts[value - 1], position, delta)
}

for (const query of ordered) {
  while (left > query.l) change(query.id, --left, 1)
  while (right < query.r) change(query.id, ++right, 1)
  while (left < query.l) change(query.id, left++, -1)
  while (right > query.r) change(query.id, right--, -1)
  const mode = counts.lastIndexOf(Math.max(...counts)) + 1
  answers[query.id] = mode
  snapshot(query.id, 'Ghi ans[' + query.id + '] = ' + mode)
}

const lastStep = frames.length - 1
const currentStep = computed(() => Math.max(0, Math.min(props.step, lastStep)))
const state = computed(() => frames[currentStep.value])
const mode = computed(() => state.value.right < state.value.left ? '—' : state.value.counts.lastIndexOf(Math.max(...state.value.counts)) + 1)
const marks = computed(() => Object.fromEntries(values.map((_, index) => {
  if (index === state.value.changed) return [index, state.value.delta === 1 ? 'added' : 'removed']
  return [index, index >= state.value.left && index <= state.value.right ? 'retained' : 'outside']
})))
function seek(step: number) {
  void go($page.value, Math.max(0, Math.min(step, lastStep)))
}
</script>

<template>
  <div class="mo-run">
    <p class="demo-label">Thứ tự Mo <code>Q3 → Q2 → Q1</code><span>B = 3</span></p>
    <BlockStrip :values="values" :marks="marks" />
    <div class="pointer-track">
      <span class="pointer" :style="{ left: (state.left * 10 + 5) + '%' }">L = {{ state.left }}</span>
      <span v-if="state.right >= 0" class="pointer is-right" :style="{ left: (state.right * 10 + 5) + '%' }">R = {{ state.right }}</span>
    </div>
    <div class="mo-run-details">
      <div aria-live="polite">
        <p :key="currentStep" class="mo-action step-change" :data-action="state.delta === -1 ? 'remove' : state.delta === 1 ? 'add' : undefined">{{ state.action }}</p>
        <table class="counts" aria-label="Tần suất hiện tại">
          <thead><tr><th scope="col">Giá trị</th><th v-for="value in [1, 2, 3]" :key="value" scope="col">{{ value }}</th></tr></thead>
          <tbody><tr><th scope="row">Tần suất</th><td v-for="(count, index) in state.counts" :key="index">{{ count }}</td></tr></tbody>
        </table>
        <p class="emphasis">Mode hiện tại {{ mode }}</p>
      </div>
      <table class="mo-results" aria-label="Đáp án theo thứ tự đầu vào">
        <thead><tr><th scope="col">Đầu vào</th><th scope="col">Đoạn</th><th scope="col">Đáp án</th></tr></thead>
        <tbody><tr v-for="query in queries" :key="query.id" :class="{ 'is-current': state.queryId === query.id }">
          <th scope="row">Q{{ query.id + 1 }}</th><td>[{{ query.l }}, {{ query.r }}]</td><td>{{ state.answers[query.id] ?? '—' }}</td>
        </tr></tbody>
      </table>
    </div>
    <div class="demo-controls" @pointerdown.stop @keydown.left.stop.prevent="seek(currentStep - 1)" @keydown.right.stop.prevent="seek(currentStep + 1)">
      <button type="button" :disabled="currentStep === 0" @click="seek(0)">Chạy lại</button>
      <button type="button" :disabled="currentStep === 0" @click="seek(currentStep - 1)">Lùi</button>
      <button type="button" :disabled="currentStep === lastStep" @click="seek(currentStep + 1)">Tiếp</button>
      <span>Bước {{ currentStep }} / {{ lastStep }}</span>
    </div>
  </div>
</template>
