import React, { useEffect, useState } from 'react'

type Task = {
  taskId: string
  taskName: string
  description?: string
  taskType?: string
  isDone?: boolean
  startDate?: string
  endDate?: string
  status?: string
}

type Props = {
  open: boolean
  task: Task | null
  onClose: () => void
  onSave: (t: Task) => void
}

const BacklogEditModal: React.FC<Props> = ({ open, task, onClose, onSave }) => {
  const [form, setForm] = useState<Task | null>(task)

  useEffect(() => {
    setForm(task)
  }, [task])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !form) return null

  function update<K extends keyof Task>(key: K, value: Task[K]) {
    setForm(prev => (prev ? { ...prev, [key]: value } : prev))
  }

  function save() {
    // simple validation: ensure id and name present
    const current = form
    if (!current) return
    if (!current.taskId) return
    onSave(current)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="relative bg-white rounded shadow-lg max-w-3xl w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Task {form.taskId}</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1"
              value={form.taskName}
              onChange={e => update('taskName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">ID</label>
            <input className="mt-1 w-full border rounded px-2 py-1 bg-gray-100" value={form.taskId} readOnly />
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-600">Description</label>
            <textarea
              className="mt-1 w-full border rounded px-2 py-1 h-28"
              value={form.description}
              onChange={e => update('description', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Type</label>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={form.taskType}
              onChange={e => update('taskType', e.target.value)}
            >
              <option>Feature</option>
              <option>Bug</option>
              <option>Chore</option>
              <option>Design</option>
              <option>Backend</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="block text-sm text-gray-600">Done</label>
            <input
              type="checkbox"
              checked={!!form.isDone}
              onChange={e => update('isDone', e.target.checked)}
              className="ml-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              className="mt-1 w-full border rounded px-2 py-1"
              value={form.startDate ?? ''}
              onChange={e => update('startDate', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">End Date</label>
            <input
              type="date"
              className="mt-1 w-full border rounded px-2 py-1"
              value={form.endDate ?? ''}
              onChange={e => update('endDate', e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-600">Status</label>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={form.status}
              onChange={e => update('status', e.target.value)}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Blocked</option>
              <option>Done</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default BacklogEditModal
