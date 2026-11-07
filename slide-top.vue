<script setup lang="ts">
import { useNav, useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { chapters } from './components/seminarChapters'

const { slides } = useNav()
const { $page, $frontmatter } = useSlideContext()
const section = computed(() => {
  const divider = slides.value.slice(0, $page.value).findLast(route => route.meta.slide.frontmatter.chapter)
  return chapters.findIndex(chapter => chapter.scene === divider?.meta.slide.frontmatter.chapter)
})
const pageNumber = (value: number) => String(value).padStart(2, '0')
</script>

<template>
  <footer v-if="$page > 1 && !$frontmatter.chapter && section >= 0" class="seminar-footer" aria-hidden="true">
    <div class="seminar-footer-chapter">
      <span class="footer-segments">
        <span v-for="(chapter, i) in chapters" :key="chapter.scene" :class="{ 'is-current': i === section, 'is-past': i < section }" />
      </span>
      <span>{{ chapters[section].label }}</span>
    </div>
    <span class="seminar-footer-page">{{ pageNumber($page) }} / {{ pageNumber(slides.length) }}</span>
  </footer>
</template>
