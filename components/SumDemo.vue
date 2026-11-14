<script setup lang="ts">
import { useNav, useSlideContext } from '@slidev/client'
import { computed, ref } from 'vue'
import BlockStrip from './BlockStrip.vue'

const props = defineProps<{ step: number, editable?: boolean }>()
const { go, next, prev, currentPage } = useNav()
const { $page } = useSlideContext()
const initialValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const values = ref([...initialValues])
const updateIndex = ref(5)
const updateValue = ref(20)
const lastUpdate = ref('')
const blockSize = 4
const example = [2, 10] as const
const partLabels = ['Biên trái', 'Block trọn', 'Biên phải']
const sum = (terms: number[]) => terms.reduce((total, value) => total + value, 0)
const initialBlockTotals = Array.from({ length: Math.ceil(initialValues.length / blockSize) }, (_, block) =>
  sum(initialValues.slice(block * blockSize, (block + 1) * blockSize)),
)
const blockTotals = ref([...initialBlockTotals])
const captions = computed(() => blockTotals.value.map((total, block) => 'b[' + block + '] = ' + total))

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
const displayStep = computed(() => {
  if (step.value > 0 || !picked.value || pointerId.value !== undefined || choosingWithKeyboard.value)
    return step.value
  return partLabels.length
})

const parts = computed(() => {
  const [left, right] = range.value ?? [0, -1]
  const leftEnd = Math.min(Math.ceil(left / blockSize) * blockSize, right + 1)
  const middleEnd = Math.max(leftEnd, Math.floor((right + 1) / blockSize) * blockSize)
  const spans = [[left, leftEnd], [leftEnd, middleEnd], [middleEnd, right + 1]]
  let subtotal = 0

  return spans.map(([start, stop], index) => {
    const terms = index === 1
      ? blockTotals.value.slice(start / blockSize, stop / blockSize)
      : values.value.slice(start, stop)
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
    displayStep.value > index ? part.tone : 'in-range',
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

function assignValue() {
  const index = Number(updateIndex.value)
  const value = Number(updateValue.value)
  if (!Number.isInteger(index) || index < 0 || index >= values.value.length || !Number.isInteger(value) || Math.abs(value) > 1000000) return
  const block = Math.floor(index / blockSize)
  const previousTotal = blockTotals.value[block]
  const previous = values.value[index]
  blockTotals.value[block] += value - previous
  values.value[index] = value
  lastUpdate.value = 'Δ = ' + value + ' − (' + previous + ') = ' + (value - previous)
    + ' → b[' + block + '] = ' + previousTotal + ' + (' + (value - previous) + ') = ' + blockTotals.value[block]
}

function reset() {
  values.value = [...initialValues]
  blockTotals.value = [...initialBlockTotals]
  anchor.value = end.value = undefined
  lastUpdate.value = ''
  if (currentPage.value === $page.value) void go($page.value, 0)
}
</script>

<template>
  <div class="array-demo range-demo" :data-step="step">
    <form v-if="editable" class="demo-controls sum-controls" @submit.prevent="assignValue" @keydown.stop @pointerdown.stop>
      <label>Vị trí <select v-model="updateIndex" aria-label="Vị trí cần gán"><option v-for="(_, index) in values" :key="index" :value="index">{{ index }}</option></select></label>
      <label>Giá trị <input v-model="updateValue" type="number" step="1" min="-1000000" max="1000000" required aria-label="Giá trị mới" /></label>
      <button type="submit">Gán điểm</button>
      <button type="button" @click="reset">Mảng ban đầu</button>
    </form>
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
      <div v-for="(part, index) in parts" :key="part.label" class="demo-step" :class="{ 'is-current': displayStep === index + 1, 'is-complete': displayStep > index + 1 }">
        <strong><span class="demo-step-num">{{ index + 1 }}</span>{{ part.label }}</strong>
        <span v-if="displayStep > index" class="formula-text step-change">{{ part.expression }}</span>
      </div>
    </div>
    <p v-if="editable && lastUpdate" class="small update-summary" aria-live="polite">{{ lastUpdate }}</p>
  </div>
</template>
