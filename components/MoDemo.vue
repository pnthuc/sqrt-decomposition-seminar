<script setup lang="ts">
import { computed } from 'vue'
import BlockStrip from './BlockStrip.vue'

const props = defineProps<{ step: number, example?: 'intersection' | 'expand' | 'shrink' }>()
const values = [1, 1, 1, 2, 2, 3, 3, 3, 2, 2]
const example = computed(() => props.example ?? 'intersection')
const windows = {
  intersection: [[1, 5], [2, 5], [2, 6]],
  expand: [[0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]],
  shrink: [[0, 9], [1, 9], [2, 9], [3, 9]],
}

function countsFor([left, right]: number[]) {
  return [1, 2, 3].map(x => values.slice(left, right + 1).filter(value => value === x).length)
}

const state = computed(() => {
  const states = windows[example.value]
  const index = Math.min(props.step, states.length - 1)
  const [left, right] = states[index]
  const previous = states[index - 1]
  const counts = countsFor(states[index])
  const adding = previous && right > previous[1]
  const action = previous && (adding ? 'add' : 'remove')
  const changed = previous && (adding ? right : previous[0])
  const value = changed === undefined ? undefined : values[changed]
  const before = previous && value !== undefined ? countsFor(previous)[value - 1] : undefined
  const after = value === undefined ? undefined : counts[value - 1]
  const maxCount = Math.max(...counts)
  const best = counts.flatMap((count, i) => count === maxCount ? [i + 1] : [])
  const marks = Object.fromEntries(values.map((_, i) => {
    if (i === changed) return [i, adding ? 'added' : 'removed']
    return [i, i >= left && i <= right ? 'retained' : 'outside']
  }))
  return { left, right, counts, action, changed, value, before, after, best, marks }
})
</script>

<template>
  <div class="array-demo mo-demo" :data-step="step">
    <p v-if="example === 'intersection'" class="demo-label">Cửa sổ [1, 5] → truy vấn [2, 6]</p>
    <p v-else-if="example === 'expand'" class="demo-label">Query 1 [0, 4] → Query 2 [0, 9]</p>
    <p v-else class="demo-label">Query 2 [0, 9] → Query 3 [3, 9]</p>
    <BlockStrip :values="values" :marks="state.marks" />
    <div class="pointer-track">
      <span class="pointer" :style="{ left: (state.left * 10 + 5) + '%' }">L = {{ state.left }}</span>
      <span class="pointer is-right" :style="{ left: (state.right * 10 + 5) + '%' }">R = {{ state.right }}</span>
    </div>
    <div class="mo-status" aria-live="polite">
      <div v-if="state.action" :key="step" class="mo-action step-change" :data-action="state.action">
        <template v-if="example === 'intersection'">
          {{ state.action === 'add' ? 'Thêm' : 'Bỏ' }} vị trí {{ state.changed }} với <code>{{ state.action }}({{ state.changed }})</code>
        </template>
        <template v-else>
          <code>{{ state.action }}({{ state.changed }})</code> với <code>a[{{ state.changed }}] = {{ state.value }}</code> → <code>cnt[{{ state.value }}]</code> từ {{ state.before }} thành {{ state.after }}
        </template>
      </div>
      <div v-else class="mo-action">
        {{ example === 'intersection' ? 'Cửa sổ hiện tại' : 'Kết quả của truy vấn trước' }}
      </div>
      <p v-if="example === 'intersection'" class="emphasis">Phần giao [2, 5] giữ nguyên</p>
      <div v-else class="mo-details">
        <table class="counts" aria-label="Bảng tần suất trong cửa sổ">
          <thead>
            <tr><th scope="col">Giá trị x</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th></tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">cnt[x]</th>
              <td v-for="(count, i) in state.counts" :key="i" :class="{ changed: i + 1 === state.value, [state.action ?? '']: i + 1 === state.value }">
                <span :key="count" :class="{ 'step-change': i + 1 === state.value }">{{ count }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mode">Mode = <span :key="state.best.at(-1)" class="step-change">{{ state.best.at(-1) }}</span></div>
        <div v-if="state.best.length > 1" class="small">{{ state.best.join(', ') }} đồng hạng</div>
      </div>
    </div>
  </div>
</template>
