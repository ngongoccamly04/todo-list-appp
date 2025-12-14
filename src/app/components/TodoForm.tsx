'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Card, CardContent } from '@/app/components/ui/card'
import { Plus, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'

interface TodoFormProps {
  onAdd: () => void
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('')
  const [deadline, setDeadline] = useState(
    format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm")
  )
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !session) return

    setLoading(true)
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          deadline: new Date(deadline).toISOString(),
        }),
      })

      if (response.ok) {
        setText('')
        onAdd()
      }
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nhập công việc mới..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="flex-1"
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              {loading ? 'Đang thêm...' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}