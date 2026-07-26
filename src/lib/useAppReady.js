import { useSyncExternalStore } from 'react'

/**
 * Tiny external store for the "app ready" signal. The preloader flips it true
 * as its curtain lifts; the hero intro, Lenis scroll, and the 3D sculpture's
 * assembly all wait on it so the whole reveal is choreographed as one moment.
 */
const store = { ready: false, listeners: new Set() }

export function setReady(value = true) {
  if (store.ready === value) return
  store.ready = value
  store.listeners.forEach((l) => l())
}

export function getReady() {
  return store.ready
}

export function subscribeReady(listener) {
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}

function subscribe(listener) {
  store.listeners.add(listener)
  return () => store.listeners.delete(listener)
}

export function useAppReady() {
  return useSyncExternalStore(
    subscribe,
    () => store.ready,
    () => store.ready,
  )
}
