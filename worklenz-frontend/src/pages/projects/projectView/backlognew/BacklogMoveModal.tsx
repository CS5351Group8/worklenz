import React, { useEffect, useState } from 'react'

type Task = {
  taskId: string
  taskName: string
  description?: string
  taskType?: string
  priority?: string
  startDate?: string
  endDate?: string
  status?: string
}

type Props = {
  open: boolean
  task?: Task | null
  onClose: () => void
  onConfirm?: (sprint: string | null) => void
}

const BacklogMoveModal: React.FC<Props> = ({ open, task = null, onClose, onConfirm = () => {} }) => {
  const [sprint, setSprint] = useState('Sprint 1')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) setSprint('Sprint 1')
  }, [open])

  if (!open || !task) return null

  async function confirm() {
    // build request body per spec
    const sprintId = sprint === 'Sprint 1' ? 1 : sprint === 'Sprint 2' ? 2 : 3
    const current = task
    if (!current) return
    const body = {
      name: current.taskName,
      description: current.description || '',
      type: current.taskType || '',
      weight: 1,
      progressMode: 'default',
      priority_id: '965903ca-86e2-4b87-a840-239e2e041c1a',
      status_id: 'abe4b826-b659-454b-bba3-fec06a9c597e',
      sprintId: sprintId,
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:8080/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        alert('Move failed: ' + (text || res.statusText))
        setLoading(false)
        return
      }

      // success
      onConfirm(sprint)
      setLoading(false)
      onClose()
    } catch (err: any) {
      alert('Move failed: ' + (err?.message || String(err)))
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded shadow-lg max-w-sm w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Move Task {task.taskId} to Sprint</h3>

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
            onClick={confirm}
            disabled={loading}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Moving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BacklogMoveModal
