<script setup lang="ts">
import { computed } from 'vue'
import { chapters } from './seminarChapters'

const props = defineProps<{ scene: 'cover' | 'sum' | 'lazy' | 'mo' | 'practice' | 'questions' }>()

const index = computed(() => chapters.findIndex(chapter => chapter.scene === props.scene))
const blocks = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
const modeValues = [1, 1, 1, 2, 2, 3, 3, 3, 2, 2]
const windows = [[1, 5], [2, 6]]
const records = [
  { title: 'Biên trái', detail: 'Duyệt ô' },
  { title: 'Block trọn', detail: 'Dùng tổng' },
  { title: 'Biên phải', detail: 'Duyệt ô' },
]
</script>

<template>
  <div class="opener">
    <div class="opener-main">
      <div class="opener-copy">
        <p v-if="index >= 0 && index < 4" class="opener-index">Phần {{ String(index + 1).padStart(2, '0') }}</p>
        <slot />
      </div>

      <div class="opener-figure" aria-hidden="true">
        <template v-if="scene === 'cover'">
          <div class="opener-figure-header">
            <svg viewBox="0 0 100 58" class="radical-mark" aria-hidden="true">
              <path d="M4 32h15l12 20L48 6h48" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="square" />
            </svg>
            <span>B = 4</span>
          </div>
          <div v-for="(values, block) in blocks" :key="block" class="opener-block-row" :style="{ '--order': block }">
            <span>Block {{ block }}</span>
            <div class="opener-cells">
              <span v-for="value in values" :key="value" class="opener-cell" :class="{ retained: block === 1 }">{{ value }}</span>
            </div>
            <strong>{{ [10, 26, 42][block] }}</strong>
          </div>
        </template>

        <template v-else-if="scene === 'sum' || scene === 'lazy'">
          <div class="opener-figure-label">
            <code>{{ scene === 'sum' ? 'sum(2, 10)' : '[2, 10] += 3' }}</code>
          </div>
          <div class="opener-cells range-cells">
            <span v-for="value in blocks.flat()" :key="value" class="opener-cell" :class="{ retained: value >= 5 && value <= 8, edge: value >= 3 && value <= 11 && (value < 5 || value > 8) }">{{ value }}</span>
          </div>
          <div v-if="scene === 'sum'" class="opener-legend">
            <span>Hai biên</span><span>Block trọn</span>
          </div>
          <div v-else class="opener-figure-result">Giá trị cơ sở + lazy</div>
        </template>

        <template v-else-if="scene === 'mo'">
          <div v-for="([left, right], row) in windows" :key="left" class="opener-window" :style="{ '--order': row }">
            <div class="opener-window-label">[{{ left }}, {{ right }}]</div>
            <div class="opener-cells">
              <span v-for="(value, i) in modeValues" :key="i" class="opener-cell" :class="{ retained: i >= 2 && i <= 5, edge: i === (row === 0 ? 1 : 6) }">{{ value }}</span>
            </div>
          </div>
          <div class="opener-figure-result">Phần giao [2, 5]</div>
        </template>

        <template v-else-if="scene === 'practice'">
          <div class="opener-figure-label">100.000.000 bản ghi</div>
          <div class="opener-records">
            <div v-for="(record, i) in records" :key="record.title" class="opener-record" :class="i === 1 ? 'retained' : 'edge'" :style="{ '--order': i }">
              <strong>{{ record.title }}</strong>
              <span>{{ record.detail }}</span>
            </div>
          </div>
          <div class="opener-figure-result">Tổng đoạn</div>
        </template>

        <div v-else class="opener-questions">
          <div v-for="(label, i) in ['Tổng đoạn', 'Gán điểm', 'Chọn cấu trúc']" :key="label" class="opener-question" :style="{ '--order': i }">
            <span>Bài {{ i + 1 }}</span><strong>{{ label }}</strong>
          </div>
        </div>
      </div>
    </div>

    <ol class="opener-progress" aria-label="Các phần của seminar">
      <li v-for="(chapter, i) in chapters" :key="chapter.scene" :class="{ 'is-active': i === index, 'is-past': i < index }" :aria-current="i === index ? 'step' : undefined">
        <span class="opener-progress-number">{{ String(i + 1).padStart(2, '0') }}</span>
        <span>{{ chapter.label }}</span>
      </li>
    </ol>
  </div>
</template>
