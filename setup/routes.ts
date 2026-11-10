import { defineRoutesSetup } from '@slidev/types'

export default defineRoutesSetup(routes => [
  ...routes,
  {
    path: '/phone-remote',
    name: 'phone-remote',
    component: () => import('../pages/phone-remote.vue'),
  },
])
