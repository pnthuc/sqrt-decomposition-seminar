<script setup lang="ts">
import type { DataConnection, Peer } from 'peerjs'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { commandTimeout, connectTimeout, isRemoteState, type Direction, type RemoteState } from '../lib/phone-remote'

const route = useRoute()
const room = computed(() => route.query.room)
const key = computed(() => route.query.key)
const status = ref('loading')
const slide = ref<RemoteState>()
const pending = ref(false)
let peer: Peer | undefined
let connection: DataConnection | undefined
let timeout: ReturnType<typeof setTimeout> | undefined
let attempt = 0

function disconnect() {
  attempt++
  clearTimeout(timeout)
  const oldPeer = peer
  peer = undefined
  connection = undefined
  oldPeer?.destroy()
  pending.value = false
}

async function connect() {
  disconnect()
  slide.value = undefined
  const hostId = room.value
  const sessionKey = key.value
  if (typeof hostId !== 'string' || !/^tdtt-[a-f0-9-]{36}$/.test(hostId)
    || typeof sessionKey !== 'string' || !/^[a-f0-9-]{36}$/.test(sessionKey)) {
    status.value = 'invalid'
    return
  }
  const connecting = attempt
  const fail = () => {
    if (attempt !== connecting) return
    disconnect()
    status.value = 'error'
  }
  status.value = 'loading'
  timeout = setTimeout(fail, connectTimeout)

  try {
    const { Peer } = await import('peerjs')
    if (attempt !== connecting) return
    const client = new Peer({ secure: true })
    peer = client
    client.on('open', () => {
      const channel = client.connect(hostId, { reliable: true, serialization: 'json' })
      connection = channel
      channel.on('open', () => channel.send(sessionKey))
      channel.on('data', data => {
        if (attempt !== connecting || !isRemoteState(data)) return
        if (status.value === 'loading' || data.type === 'ack') {
          clearTimeout(timeout)
          pending.value = false
        }
        slide.value = data
        status.value = 'connected'
      })
      channel.on('close', fail)
      channel.on('error', fail)
    })
    client.on('error', () => { if (!connection?.open) fail() })
    client.on('disconnected', () => { if (!connection?.open) fail() })
  } catch {
    fail()
  }
}

function send(direction: Direction) {
  if (!connection?.open || status.value !== 'connected' || pending.value) return
  pending.value = true
  timeout = setTimeout(() => {
    disconnect()
    status.value = 'error'
  }, commandTimeout)
  connection.send(direction)
}

watch([room, key], connect, { immediate: true })
onBeforeUnmount(disconnect)
</script>

<template>
  <main class="phone-remote">
    <header>
      <p class="remote-deck">Sqrt Decomposition</p>
      <h1>Điều khiển slide</h1>
      <p class="phone-status" role="status" :data-status="status">
        <span aria-hidden="true" />
        {{ status === 'connected' ? 'Đã kết nối với laptop' : status === 'loading' ? 'Đang kết nối…' : 'Chưa kết nối' }}
      </p>
    </header>
    <div v-if="slide" class="remote-position" aria-live="polite">
      Slide <strong>{{ slide.page }}</strong> / {{ slide.total }}
    </div>
    <div v-if="status === 'error' || status === 'invalid'" class="remote-message">
      <p>{{ status === 'invalid' ? 'Quét mã QR từ bài trình chiếu trên laptop để ghép nối.' : 'Kiểm tra mạng và giữ bài trình chiếu mở trên laptop.' }}</p>
      <button v-if="status === 'error'" type="button" @click="connect">Thử kết nối lại</button>
    </div>
    <div class="phone-buttons">
      <button type="button" class="phone-prev" :disabled="status !== 'connected' || pending || !slide?.hasPrev" @click="send('prev')">
        <span aria-hidden="true">←</span> Lùi
      </button>
      <button type="button" class="phone-next" :disabled="status !== 'connected' || pending || !slide?.hasNext" @click="send('next')">
        <span aria-hidden="true">→</span> Tiến
      </button>
    </div>
  </main>
</template>

<style scoped>
.phone-remote {
  position: fixed; inset: 0; overflow: auto; box-sizing: border-box;
  display: flex; flex-direction: column; gap: 18px;
  padding: max(24px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right))
    max(24px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
  background: #f3f8f7; color: #102e38; font: 500 16px/1.5 'Be Vietnam Pro', sans-serif;
}
.phone-remote > * { width: 100%; max-width: 480px; margin-inline: auto; }
.remote-deck { color: #006a73; font-weight: 700; }
.phone-remote h1 { margin: 4px 0 10px; font-size: clamp(26px, 8vw, 40px); line-height: 1.18; font-weight: 800; }
.phone-status { display: flex; align-items: center; gap: 8px; color: #45636b; }
.phone-status span { width: 9px; height: 9px; border-radius: 50%; background: #936025; }
.phone-status[data-status="connected"] span { background: #006a73; }
.remote-position { padding: 8px 0; border-block: 1px solid #c3d6d8; font-variant-numeric: tabular-nums; }
.remote-position strong { color: #006a73; font-size: 26px; }
.remote-message button { margin-top: 8px; padding: 7px 10px; border: 1px solid #c3d6d8; border-radius: 6px; }
.phone-buttons { display: grid; grid-template-rows: minmax(90px, 1fr) minmax(125px, 1.4fr); gap: 12px; flex: 1; }
.phone-buttons button {
  display: flex; justify-content: center; align-items: center; gap: 12px;
  border-radius: 10px; font-size: 24px; font-weight: 800; touch-action: manipulation;
}
.phone-buttons span { font: 600 46px/1 sans-serif; }
.phone-prev { background: #d5edeb; color: #102e38; }
.phone-next { background: #006a73; color: white; }
.phone-buttons button:disabled { opacity: .52; }
.phone-buttons button:active:not(:disabled) { filter: brightness(.87); }
.phone-remote button:focus-visible { outline: 3px solid #006a73; outline-offset: 3px; }
</style>
