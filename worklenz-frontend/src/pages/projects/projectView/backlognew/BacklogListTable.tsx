import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import BacklogEditModal from './BacklogEditModal'
import BacklogMoveModal from './BacklogMoveModal'

type Task = {
  taskId: string
  taskName: string
  description?: string
  taskType?: string
  isDone?: boolean
  startDate?: string // ISO date
  endDate?: string // ISO date
  status?: string
}

const defaultTask = (id: string): Task => ({
  taskId: id,
  taskName: '',
  description: '',
  taskType: 'Feature',
  isDone: false,
  startDate: '',
  endDate: '',
  status: 'To Do',
})

const BacklogListTable: React.FC = () => {
  // simple id counter
  const idRef = useRef(1)
  const [tasks, setTasks] = useState<Task[]>(() => {
    // initial sample rows
    const t1 = defaultTask('T-1')
    t1.taskName = 'Design login page'
    t1.description = 'Create wireframes and final UI for login'
    t1.taskType = 'Design'
    t1.startDate = '2025-11-01'
    t1.endDate = '2025-11-05'
    t1.status = 'In Progress'

    const t2 = defaultTask('T-2')
    t2.taskName = 'Implement auth API'
    t2.description = 'Implement JWT login endpoint'
    t2.taskType = 'Backend'
    t2.isDone = false
    t2.status = 'To Do'

    idRef.current = 3
    return [t1, t2]
  })

  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('edit')
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null)
  const [moveModalOpen, setMoveModalOpen] = useState(false)
  const [moveTaskId, setMoveTaskId] = useState<string | null>(null)

  // close menu when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('.blt-row-menu') && !target.closest('.blt-menu-button')) {
        setOpenMenuFor(null)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // close menu on scroll/resize to avoid stale position
  useEffect(() => {
    function onClose() {
      setOpenMenuFor(null)
      setMenuPos(null)
    }
    window.addEventListener('scroll', onClose, true)
    window.addEventListener('resize', onClose)
    return () => {
      window.removeEventListener('scroll', onClose, true)
      window.removeEventListener('resize', onClose)
    }
  }, [])

  function addRow() {
    const id = `T-${idRef.current++}`
    const newTask = defaultTask(id)
    setEditingTask(newTask)
    setModalMode('add')
    setIsModalOpen(true)
  }

  function deleteRow(taskId: string) {
    setTasks(prev => prev.filter(t => t.taskId !== taskId))
    setOpenMenuFor(null)
  }

  function openEditModal(task: Task) {
    setEditingTask(task)
    setModalMode('edit')
    setIsModalOpen(true)
    setOpenMenuFor(null)
  }

  function handleSaveEditedTask(updated: Task) {
    if (modalMode === 'edit') {
      // Edit mode: update existing task
      setTasks(prev => prev.map(t => (t.taskId === updated.taskId ? updated : t)))
    } else if (modalMode === 'add') {
      // Add mode: add new task
      setTasks(prev => [updated, ...prev])
    }
    setIsModalOpen(false)
    setEditingTask(null)
    setModalMode('edit')
  }

  function updateTask(taskId: string, patch: Partial<Task>) {
    setTasks(prev => prev.map(t => (t.taskId === taskId ? { ...t, ...patch } : t)))
  }

  return (
    <div className="p-4 bg-white rounded shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Backlog</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={addRow}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            aria-label="Add task"
          >
            + Add task
          </button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-600 border-b">
              <th className="p-2">Name</th>
              <th className="p-2">ID</th>
              <th className="p-2">Description</th>
              <th className="p-2">Type</th>
              <th className="p-2">Done</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.taskId} className="border-b hover:bg-gray-50">
                <td className="p-2 align-top">
                  <div className="text-sm font-medium">{task.taskName || '-'}</div>
                </td>
                <td className="p-2 align-top text-sm text-gray-700">{task.taskId}</td>
                <td className="p-2 align-top">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{task.description || '-'}</div>
                </td>
                <td className="p-2 align-top">
                  <div className="text-sm">{task.taskType || '-'}</div>
                </td>
                <td className="p-2 align-top text-center">
                  <div className="text-sm">{task.isDone ? 'Yes' : 'No'}</div>
                </td>
                <td className="p-2 align-top">
                  <div className="text-sm">{task.startDate || '-'}</div>
                </td>
                <td className="p-2 align-top">
                  <div className="text-sm">{task.endDate || '-'}</div>
                </td>
                <td className="p-2 align-top">
                  <div className="text-sm">{task.status || '-'}</div>
                </td>
                <td className="p-2 align-top text-right relative">
                  <button
                    onClick={e => {
                      // open the portal menu positioned near this button
                      e.stopPropagation()
                      const btn = e.currentTarget as HTMLElement
                      const rect = btn.getBoundingClientRect()
                      const menuWidth = 144 // approx w-36
                      const left = Math.max(8, rect.right - menuWidth + window.scrollX)
                      const top = rect.bottom + window.scrollY + 6
                      setMenuPos({ left, top })
                      setOpenMenuFor(prev => (prev === task.taskId ? null : task.taskId))
                    }}
                    aria-haspopup="true"
                    aria-expanded={openMenuFor === task.taskId}
                    className="blt-menu-button px-2 py-1 rounded hover:bg-gray-100 text-gray-600"
                    title="More"
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-sm text-gray-500">
                  No tasks — click Add task to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Portal menu (renders into body) */}
      {openMenuFor && menuPos && (() => {
        const task = tasks.find(t => t.taskId === openMenuFor)
        if (!task) return null
        return createPortal(
          <div
            className="blt-row-menu z-50 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded shadow-md w-36"
            style={{ position: 'absolute', top: menuPos.top, left: menuPos.left }}
            onClick={e => e.stopPropagation()}
          >
            <ul className="p-1 text-sm">
              <li>
                <button
                  onClick={() => {
                    openEditModal(task)
                    setMenuPos(null)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
                >
                  Edit
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    // open move modal (stubbed)
                    setMoveTaskId(task.taskId)
                    setMoveModalOpen(true)
                    setMenuPos(null)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
                >
                  Move To Sprint
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    deleteRow(task.taskId)
                    setMenuPos(null)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-slate-700 text-red-600 dark:text-red-400"
                >
                  Delete task
                </button>
              </li>
            </ul>
          </div>,
          document.body
        )
      })()}

      {/* Move modal (stubbed) */}
      <BacklogMoveModal
        open={moveModalOpen}
        taskId={moveTaskId}
        onClose={() => {
          setMoveModalOpen(false)
          setMoveTaskId(null)
        }}
        onConfirm={sprint => {
          // stubbed: no-op for now; close handled in modal
          console.log('Move confirmed to', sprint, 'for', moveTaskId)
        }}
      />

      {/* Edit/Add modal */}
      <BacklogEditModal
        open={isModalOpen}
        task={editingTask}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
          setModalMode('edit')
        }}
        onSave={handleSaveEditedTask}
        mode={modalMode}
      />
    </div>
  )
}

export default BacklogListTable;
