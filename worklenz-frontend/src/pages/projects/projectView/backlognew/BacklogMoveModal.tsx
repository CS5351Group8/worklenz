import React, { useEffect, useState } from 'react'

type Props = {
  open: boolean
  taskId?: string | null
  onClose: () => void
  onConfirm?: (sprint: string | null) => void
}

const BacklogMoveModal: React.FC<Props> = ({ open, taskId = null, onClose, onConfirm = () => {} }) => {
  const [sprint, setSprint] = useState('Sprint 1')

  useEffect(() => {
    if (open) setSprint('Sprint 1')
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded shadow-lg max-w-sm w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Move Task {taskId ? taskId : ''} to Sprint</h3>

        <div>
          <label className="block text-sm text-gray-600 mb-2">Select Sprint</label>
          <select
            value={sprint}
            onChange={e => setSprint(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option>Sprint 1</option>
            <option>Sprint 2</option>
            <option>Sprint 3</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button
            onClick={() => {
              // stubbed confirm logic: call onConfirm and close
              onConfirm(sprint)
              onClose()
            }}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default BacklogMoveModal
