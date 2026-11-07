// TextMate colors from the bundled VS Code Light 2026 theme and its includes.
// https://github.com/microsoft/vscode/blob/a717861c07586a53d83b80d742cd3f59b20a6273/extensions/theme-defaults/themes/2026-light.json
import light2026 from './themes/vscode-light-2026.json'

export default () => ({
  themes: {
    light: { ...light2026, type: 'light' as const },
    dark: 'github-dark-high-contrast',
  },
})
