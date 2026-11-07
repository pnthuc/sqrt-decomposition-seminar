import type { ShikiTransformer } from 'shiki'

const seminarLight = {
  name: 'seminar-light',
  type: 'light' as const,
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#102e38',
  },
  tokenColors: [
    { scope: 'keyword.control', settings: { foreground: '#204e87' } },
    { scope: ['storage', 'support.type'], settings: { foreground: '#00636b' } },
    { scope: ['constant', 'string'], settings: { foreground: '#40558a' } },
    { scope: 'comment', settings: { foreground: '#45636b' } },
  ],
}

const controlFlow: ShikiTransformer = {
  name: 'seminar:cpp-control-flow',
  span(node) {
    if (this.options.lang !== 'cpp') return
    const token = node.children[0]
    if (token?.type === 'text' && /^(for|if|else|while|return|break|continue)$/.test(token.value.trim())) {
      this.addClassToHast(node, 'seminar-control-keyword')
    }
  },
}

export default () => ({
  themes: {
    light: seminarLight,
    dark: 'github-dark-high-contrast',
  },
  transformers: [controlFlow],
})
