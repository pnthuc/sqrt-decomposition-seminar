<script setup lang="ts">
import { useNav, useSlideContext } from '@slidev/client'
import { computed, ref } from 'vue'
import BlockStrip from './BlockStrip.vue'

const props = defineProps<{ step: number }>()
const { go, next, prev, currentPage } = useNav()
const { $page } = useSlideContext()
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const blockSize = 4
const example = [2, 10] as const
const partLabels = ['Biên trái', 'Block trọn', 'Biên phải']
const sum = (terms: number[]) => terms.reduce((total, value) => total + value, 0)
const blockTotals = Array.from({ length: Math.ceil(values.length / blockSize) }, (_, block) =>
  sum(values.slice(block * blockSize, (block + 1) * blockSize)),
)
const captions = blockTotals.map((total, block) => 'b[' + block + '] = ' + total)

const anchor = ref<number>()
const end = ref<number>()
const pointerId = ref<number>()
const choosingWithKeyboard = ref(false)
const step = computed(() => pointerId.value === undefined ? Math.min(props.step, partLabels.length) : 0)
const picked = computed(() => {
  if (anchor.value === undefined || end.value === undefined) return
  return [Math.min(anchor.value, end.value), Math.max(anchor.value, end.value)] as const
})
const range = computed(() => picked.value ?? (step.value > 0 ? example : undefined))

const parts = computed(() => {
  const [left, right] = range.value ?? [0, -1]
  const leftEnd = Math.min(Math.ceil(left / blockSize) * blockSize, right + 1)
  const middleEnd = Math.max(leftEnd, Math.floor((right + 1) / blockSize) * blockSize)
  const spans = [[left, leftEnd], [leftEnd, middleEnd], [middleEnd, right + 1]]
  let subtotal = 0

  return spans.map(([start, stop], index) => {
    const terms = index === 1
      ? blockTotals.slice(start / blockSize, stop / blockSize)
      : values.slice(start, stop)
    const addends = subtotal === 0 ? terms : [subtotal, ...terms]
    subtotal += sum(terms)
    return {
      label: partLabels[index],
      start, stop,
      tone: index === 1 ? 'retained' : 'edge',
      expression: terms.length === 0
        ? 'Không có'
        : addends.length === 1 ? String(subtotal) : addends.join(' + ') + ' = ' + subtotal,
    }
  })
})

const marks = computed(() => Object.fromEntries(parts.value.flatMap((part, index) =>
  Array.from({ length: part.stop - part.start }, (_, offset) => [
    part.start + offset,
    step.value > index ? part.tone : 'in-range',
  ]),
)))

function cellIndex(event: Event) {
  const cell = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-index]')
  return cell ? Number(cell.dataset.index) : undefined
}

function startSelection(index: number) {
  anchor.value = end.value = index
  if (props.step > 0 && currentPage.value === $page.value) void go($page.value, 0)
}

function beginDrag(event: PointerEvent) {
  const index = cellIndex(event)
  if (index === undefined || pointerId.value !== undefined || !event.isPrimary || event.button !== 0) return
  event.preventDefault()
  const grid = event.currentTarget as HTMLElement
  grid.setPointerCapture(event.pointerId)
  pointerId.value = event.pointerId
  choosingWithKeyboard.value = false
  startSelection(index)
}

function moveDrag(event: PointerEvent) {
  if (event.pointerId !== pointerId.value) return
  const grid = event.currentTarget as HTMLElement
  let nearest = Infinity
  let index = end.value
  for (const cell of grid.querySelectorAll<HTMLButtonElement>('button[data-index]')) {
    const bounds = cell.getBoundingClientRect()
    const distance = Math.abs(event.clientX - (bounds.left + bounds.width / 2))
    if (distance < nearest) {
      nearest = distance
      index = Number(cell.dataset.index)
    }
  }
  end.value = index
}

function endDrag(event: PointerEvent) {
  if (event.pointerId === pointerId.value) pointerId.value = undefined
}

function pickWithKeyboard(event: KeyboardEvent) {
  const index = cellIndex(event)
  if (index === undefined) return
  event.preventDefault()
  event.stopPropagation()
  if (event.repeat) return
  if (choosingWithKeyboard.value) end.value = index
  else startSelection(index)
  choosingWithKeyboard.value = !choosingWithKeyboard.value
}
</script>

<template>
  <div class="array-demo range-demo" :data-step="step">
    <p class="demo-label">
      <code v-if="range">sum({{ range[0] }}, {{ range[1] }})</code>
      <code v-else>sum(L, R)</code>
      <span>B = {{ blockSize }}</span>
    </p>
    <div
      class="range-picker"
      role="group"
      aria-label="Kéo chuột hoặc nhấn Enter trên hai ô để chọn đoạn"
      @pointerdown.stop="beginDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @lostpointercapture="endDrag"
      @keydown.enter="pickWithKeyboard"
      @keydown.space="pickWithKeyboard"
      @keydown.left.stop.prevent="prev()"
      @keydown.right.stop.prevent="next()"
    >
      <BlockStrip :values="values" :block-size="blockSize" :captions="captions" :marks="marks" :selection="range" selectable />
    </div>
    <div class="demo-track" aria-live="polite">
      <div v-for="(part, index) in parts" :key="part.label" class="demo-step" :class="{ 'is-current': step === index + 1, 'is-complete': step > index + 1 }">
        <strong><span class="demo-step-num">{{ index + 1 }}</span>{{ part.label }}</strong>
        <span v-if="step > index" class="formula-text step-change">{{ part.expression }}</span>
      </div>
    </div>
  </div>
</template>
