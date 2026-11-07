<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  values: number[]
  blockSize?: number
  captions?: string[]
  activeBlock?: number
  marks?: Record<number, string>
  indexOnly?: boolean
}>()

const groups = computed(() => {
  const size = props.blockSize ?? props.values.length
  return Array.from({ length: Math.ceil(props.values.length / size) }, (_, block) => {
    const start = block * size
    return { start, values: props.values.slice(start, start + size) }
  })
})
</script>

<template>
  <div class="array-strip" :style="{ gridTemplateColumns: 'repeat(' + values.length + ', minmax(0, 1fr))' }" aria-label="Mảng theo chỉ số từ 0">
    <div
      v-for="(group, block) in groups"
      :key="group.start"
      class="array-group"
      :style="{
        gridColumn: 'span ' + group.values.length,
        gridTemplateColumns: 'repeat(' + group.values.length + ', minmax(0, 1fr))',
      }"
    >
      <div v-for="(value, offset) in group.values" :key="offset" class="array-item">
        <span v-if="!indexOnly" class="array-index">{{ group.start + offset }}</span>
        <span class="array-cell" :class="marks?.[group.start + offset]">{{ value }}</span>
      </div>
      <div v-if="indexOnly || captions?.[block]" class="array-caption" :class="{ active: activeBlock === block }">
        Block {{ block }}
        <strong v-if="captions?.[block]">{{ captions[block] }}</strong>
      </div>
    </div>
  </div>
</template>
