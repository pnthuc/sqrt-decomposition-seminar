<script setup lang="ts">
import type { DataConnection, Peer } from 'peerjs'
import { useNav } from '@slidev/client'
import { onBeforeUnmount, ref, watch } from 'vue'
import { connectTimeout, type RemoteState } from './lib/phone-remote'

const nav = useNav()
const { currentPage, clicks, total, hasPrev, hasNext, isEmbedded } = nav
const dialog = ref<HTMLDialogElement>()
const linkInput = ref<HTMLInputElement>()
const link = ref('')
const qr = ref('')
const status = ref('idle')
const copied = ref(false)
let peer: Peer | undefined
let phone: DataConnection | undefined
let key: string | undefined
let startup: ReturnType<typeof setTimeout> | undefined

function stopSession() {
  key = undefined
  phone = undefined
  clearTimeout(startup)
  peer?.destroy()
  peer = undefined
  link.value = ''
  qr.value = ''
  copied.value = false
  status.value = 'idle'
}

function sendState(type: RemoteState['type'] = 'state') {
  if (!phone?.open) return
  phone.send({
    type,
    page: currentPage.value,
    total: total.value,
    hasPrev: hasPrev.value,
    hasNext: hasNext.value,
  } satisfies RemoteState)
}

function accept(connection: DataConnection, sessionKey: string) {
  const authTimeout = setTimeout(() => connection.close(), connectTimeout)
  let moving = false

  connection.on('data', async data => {
    if (key !== sessionKey) return
    if (phone !== connection) {
      if (phone || data !== sessionKey) {
        connection.close()
        return
      }
      clearTimeout(authTimeout)
      phone = connection
      status.value = 'connected'
      sendState()
      return
    }
    if (moving || (data !== 'prev' && data !== 'next')) return
    moving = true
    try {
      if (data === 'prev' && hasPrev.value) await nav.prev()
      if (data === 'next' && hasNext.value) await nav.next()
      if (phone === connection) sendState('ack')
    } catch {
      connection.close()
    } finally {
      moving = false
    }
  })

  const onClose = () => {
    clearTimeout(authTimeout)
    if (phone !== connection) return
    phone = undefined
    if (peer?.disconnected) {
      stopSession()
      status.value = 'error'
    } else {
      status.value = 'ready'
    }
  }
  connection.on('close', onClose)
  connection.on('error', onClose)
}

async function startSession() {
  stopSession()
  const room = 'tdtt-' + crypto.randomUUID()
  const sessionKey = crypto.randomUUID()
  key = sessionKey
  status.value = 'loading'

  const fail = () => {
    if (key !== sessionKey) return
    stopSession()
    status.value = 'error'
  }

  startup = setTimeout(fail, connectTimeout)
  try {
    const [{ Peer }, { toDataURL }] = await Promise.all([import('peerjs'), import('qrcode')])
    if (key !== sessionKey) return
    const host = new Peer(room, { secure: true })
    peer = host
    host.on('open', () => {
      clearTimeout(startup)
      const target = nav.router.resolve({ name: 'phone-remote', query: { room, key: sessionKey } })
      const url = new URL(target.href, location.href).href
      link.value = url
      status.value = 'ready'
      void toDataURL(url, { width: 240, margin: 2 }).then(result => {
        if (key === sessionKey) qr.value = result
      }).catch(() => {})
    })
    host.on('connection', connection => accept(connection, sessionKey))
    host.on('error', error => { if (error.type !== 'peer-unavailable' && !phone?.open) fail() })
    host.on('disconnected', () => { if (!phone?.open) fail() })
  } catch {
    fail()
  }
}

function openDialog() {
  dialog.value?.showModal()
  if (status.value === 'idle') void startSession()
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(link.value)
    copied.value = true
  } catch {
    linkInput.value?.focus()
    linkInput.value?.select()
  }
}

watch([currentPage, clicks, hasPrev, hasNext], () => sendState())
onBeforeUnmount(stopSession)
</script>

<template>
  <button
    v-if="!isEmbedded" type="button" class="remote-launch" title="Điều khiển bằng điện thoại"
    aria-label="Điều khiển bằng điện thoại" aria-haspopup="dialog" @click="openDialog"
  >
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <path d="M10 17.5h4" />
    </svg>
  </button>
  <Teleport to="body">
    <dialog ref="dialog" class="remote-dialog" aria-labelledby="phone-pairing-title">
      <form method="dialog"><button type="submit" class="remote-close" aria-label="Đóng">×</button></form>
      <h2 id="phone-pairing-title">Điều khiển bằng điện thoại</h2>
      <p v-if="status === 'loading'" role="status">Đang tạo phiên kết nối…</p>
      <template v-else-if="link">
        <p role="status">{{ status === 'connected' ? 'Điện thoại đã kết nối. Bạn có thể đóng hộp này để trình chiếu.' : 'Quét mã QR hoặc mở link trên điện thoại.' }}</p>
        <img v-if="qr" :src="qr" width="192" height="192" alt="Mã QR ghép nối điện thoại" />
        <input ref="linkInput" :value="link" readonly aria-label="Link ghép nối" />
        <div class="remote-dialog-actions">
          <button type="button" @click="copyLink">{{ copied ? 'Đã sao chép' : 'Sao chép link' }}</button>
          <button type="button" @click="stopSession(); dialog?.close()">Kết thúc phiên</button>
        </div>
      </template>
      <template v-else-if="status === 'error'">
        <p role="alert">Chưa tạo được phiên. Kiểm tra mạng rồi thử lại.</p>
        <button type="button" @click="startSession">Thử lại</button>
      </template>
    </dialog>
  </Teleport>
</template>

<style scoped>
.remote-launch { display: grid; place-items: center; min-width: 36px; min-height: 36px; border-radius: 5px; }
.remote-launch:hover, .remote-launch:focus-visible { background: #006a7326; }
.remote-dialog {
  width: min(440px, calc(100vw - 28px)); margin: auto; padding: 25px;
  border: 1px solid #c3d6d8; border-radius: 12px; background: #f3f8f7; color: #102e38;
  font: 500 15px/1.5 'Be Vietnam Pro', sans-serif;
}
.remote-dialog::backdrop { background: #102e3880; }
.remote-dialog h2 { margin: 0 26px 8px 0; font-size: 21px; font-weight: 800; }
.remote-dialog p { margin: 0 0 14px; }
.remote-dialog img { margin: 0 auto 14px; }
.remote-dialog input { display: block; width: 100%; border: 1px solid #c3d6d8; border-radius: 5px; background: white; padding: 8px; }
.remote-dialog-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.remote-dialog button { padding: 6px 10px; border: 1px solid #c3d6d8; border-radius: 5px; }
.remote-dialog button:hover { background: #d5edeb; }
.remote-dialog .remote-close { position: absolute; right: 12px; top: 9px; border: 0; font-size: 22px; }
</style>
