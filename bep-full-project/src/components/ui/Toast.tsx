// Toast is handled by react-hot-toast in providers.tsx
// This file exports convenience wrappers

import toast from 'react-hot-toast'

export const showToast = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  loading: (msg: string) => toast.loading(msg),
  dismiss: (id?: string) => toast.dismiss(id),
  promise: toast.promise,
}

export { toast }
