'use client'

import { useState } from 'react'
import { Check, Clock, Trash2, Edit, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface TodoItemProps {
  todo: {
    id: string
    text: string
    deadline: string
    status: 'pending' | 'done'
    finishedTime?: string
  }
  onUpdate: () => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [loading, setLoading] = useState(false)

  const handleStatusToggle = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: todo.status === 'pending' ? 'done' : 'pending',
        }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editText.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: editText,
        }),
      })

      if (response.ok) {
        setIsEditing(false)
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      setLoading(true)
      try {
        const response = await fetch(`/api/todos/${todo.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          onDelete(todo.id)
        }
      } catch (error) {
        console.error('Error deleting todo:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const deadlineDate = new Date(todo.deadline)
  const isOverdue = todo.status === 'pending' && deadlineDate < new Date()

  return (
    <div className={`p-4 rounded-lg border ${todo.status === 'done' ? 'bg-muted' : 'bg-card'} ${isOverdue ? 'border-destructive/50' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleStatusToggle}
              disabled={loading}
              className={`w-6 h-6 rounded-full border flex items-center justify-center ${todo.status === 'done' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
            >
              {todo.status === 'done' && <Check className="h-4 w-4 text-white" />}
            </button>
            
            {isEditing ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSaveEdit} disabled={loading}>
                  Lưu
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className={`flex-1 ${todo.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.text}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-8">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {format(deadlineDate, "dd/MM/yyyy HH:mm", { locale: vi })}
              </span>
              {isOverdue && (
                <span className="text-destructive ml-2">(Quá hạn)</span>
              )}
            </div>
            
            {todo.status === 'done' && todo.finishedTime && (
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                <span>
                  Hoàn thành: {format(new Date(todo.finishedTime), "dd/MM/yyyy HH:mm", { locale: vi })}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          disabled={loading}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}