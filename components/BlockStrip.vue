<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  values: number[]
  blockSize?: number
  captions?: string[]
  activeBlock?: number
  marks?: Record<number, string>
  indexOnly?: boolean
  selectable?: boolean
  selection?: readonly [number, number]
}>()

const groups = computed(() => {
  const size = props.blockSize ?? props.values.length
  return Array.from({ length: Math.ceil(props.values.length / size) }, (_, block) => {
    const start = block * size
    const cells = props.values.slice(start, start + size).map((value, offset) => ({ value, index: start + offset }))
    return { start, cells }
  })
})

function isSelected(index: number) {
  const { selection } = props
  return !!selection && index >= selection[0] && index <= selection[1]
}

function boundaryAt(index: number) {
  if (!props.selection) return
  const [left, right] = props.selection
  if (index === left) return left === right ? 'L = R' : 'L'
  if (index === right) return 'R'
}
</script>

<template>
  <div class="array-strip" :style="{ gridTemplateColumns: 'repeat(' + values.length + ', minmax(0, 1fr))' }" aria-label="Mảng theo chỉ số từ 0">
    <div
      v-for="(group, block) in groups"
      :key="group.start"
      class="array-group"
      :style="{
        gridColumn: 'span ' + group.cells.length,
        gridTemplateColumns: 'repeat(' + group.cells.length + ', minmax(0, 1fr))',
      }"
    >
      <div v-for="{ value, index } in group.cells" :key="index" class="array-item">
        <span v-if="!indexOnly" class="array-index">{{ index }}</span>
        <component
          :is="selectable ? 'button' : 'span'"
          :type="selectable ? 'button' : undefined"
          class="array-cell"
          :class="marks?.[index]"
          :data-index="selectable ? index : undefined"
          :aria-label="selectable ? 'Ô ' + index + ', giá trị ' + value : undefined"
          :aria-pressed="selectable ? isSelected(index) : undefined"
          :data-boundary="selectable ? boundaryAt(index) : undefined"
        >
          {{ value }}
        </component>
      </div>
      <div v-if="indexOnly || captions?.[block]" class="array-caption" :class="{ active: activeBlock === block }">
        Block {{ block }}
        <strong v-if="captions?.[block]">{{ captions[block] }}</strong>
      </div>
    </div>
  </div>
</template>
