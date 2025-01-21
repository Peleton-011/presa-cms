import { ref } from 'vue'

interface Toast {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  id: number
}

export const useToast = () => {
  const toasts = ref<Toast[]>([])
  let nextId = 0

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = nextId++
    toasts.value.push({ message, type, id })

    // Remove toast after 3 seconds
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
