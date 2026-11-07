<script setup lang="ts">
import { computed } from 'vue'
import { getBenchmark, type benchmarks } from './benchmarkData'

const props = defineProps<{ chart: keyof typeof benchmarks, description: string }>()
const data = computed(() => getBenchmark(props.chart))
const width = 1094
const height = 340
const baseline = 270
const top = 35
const sourceBaseline = 969
const y = (value: number) => baseline - value / data.value.max * (baseline - top)
const ticks = computed(() =>
  Array.from({ length: Math.floor(data.value.max / data.value.tick) + 1 }, (_, i) => i * data.value.tick),
)

const panels = computed(() => {
  const { categories, panels, series, whiskers } = data.value
  const panelGap = 44
  const panelWidth = (width - (panels.length - 1) * panelGap) / panels.length
  const plotLeft = 52
  const plotRight = panelWidth - 10
  const groupWidth = (plotRight - plotLeft) / categories.length
  const barGap = 8
  const barWidth = Math.min(96, (groupWidth * .82 - barGap * (series.length - 1)) / series.length)
  const clusterWidth = series.length * barWidth + (series.length - 1) * barGap

  return panels.map((panel, p) => ({
    title: panel.title,
    start: p * (panelWidth + panelGap),
    plotLeft,
    plotRight,
    barWidth,
    groups: panel.values.map((values, g) => {
      const center = plotLeft + (g + .5) * groupWidth
      return {
        center,
        label: categories[g],
        note: data.value.categoryNotes?.[g],
        bars: values.map((value, s) => {
          const x = center - clusterWidth / 2 + s * (barWidth + barGap)
          const sourceRows = whiskers?.rows[(p * categories.length + g) * series.length + s]
          const range = sourceRows && whiskers
            ? sourceRows.map(row => y((sourceBaseline - row) / whiskers.pixelsPerUnit))
            : undefined
          const barTop = value === null ? baseline : y(value)
          return {
            series: series[s], x, middle: x + barWidth / 2, top: barTop, range,
            label: value === null ? 'N/A' : value.toFixed(data.value.digits),
            labelY: Math.min(barTop, range?.[0] ?? baseline) - 11,
          }
        }),
      }
    }),
  }))
})
</script>

<template>
  <figure class="benchmark-card">
    <div class="benchmark-header" aria-hidden="true">
      <strong>{{ data.unit }}</strong>
      <div class="benchmark-legend">
        <span v-for="series in data.series" :key="series" :data-series="series">{{ series }}</span>
      </div>
    </div>
    <svg :viewBox="'0 0 ' + width + ' ' + height" class="benchmark-plot" role="img" :aria-label="description">
      <g v-for="panel in panels" :key="panel.start" :transform="'translate(' + panel.start + ' 0)'">
        <text v-if="panel.title" :x="panel.plotLeft" y="20" class="benchmark-panel-title">{{ panel.title }}</text>
        <g v-for="tick in ticks" :key="tick" class="benchmark-grid" :class="{ 'is-baseline': tick === 0 }">
          <line :x1="panel.plotLeft" :x2="panel.plotRight" :y1="y(tick)" :y2="y(tick)" />
          <text :x="panel.plotLeft - 10" :y="y(tick)" dy=".32em" text-anchor="end">{{ tick }}</text>
        </g>
        <g v-for="group in panel.groups" :key="group.label">
          <g v-for="bar in group.bars" :key="bar.series" :data-series="bar.series">
            <rect v-if="bar.label !== 'N/A'" class="benchmark-bar" :x="bar.x" :y="bar.top" :width="panel.barWidth" :height="baseline - bar.top" rx="2" />
            <path v-if="bar.range" class="benchmark-whisker"
              :d="'M ' + (bar.middle - 5) + ' ' + bar.range[0] + ' h 10 M ' + bar.middle + ' ' + bar.range[0] + ' V ' + bar.range[1] + ' M ' + (bar.middle - 5) + ' ' + bar.range[1] + ' h 10'" />
            <text :x="bar.middle" :y="bar.labelY" text-anchor="middle" class="benchmark-value" :class="{ 'is-na': bar.label === 'N/A' }">{{ bar.label }}</text>
          </g>
          <text :x="group.center" :y="baseline + 27" text-anchor="middle" class="benchmark-category">{{ group.label }}</text>
          <text v-if="group.note" :x="group.center" :y="baseline + 48" text-anchor="middle" class="benchmark-category-note">{{ group.note }}</text>
        </g>
        <text :x="(panel.plotRight + panel.plotLeft) / 2" :y="height - 4" text-anchor="middle" class="benchmark-axis">{{ data.axis }}</text>
      </g>
    </svg>
    <figcaption class="benchmark-caption">
      <span>{{ data.conditions }}</span>
      <span v-if="data.whiskers">Vạch min–max theo seed</span>
      <span v-else>1 KiB = 1.024 byte</span>
    </figcaption>
  </figure>
</template>
