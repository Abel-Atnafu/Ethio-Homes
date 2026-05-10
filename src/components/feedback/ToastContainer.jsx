import { createPortal } from 'react-dom'
import { useToast } from './useToast'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, dismiss } = useToast()

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast {...t} onDismiss={dismiss} />
        </div>
      ))}
    </div>,
    document.body
  )
}
