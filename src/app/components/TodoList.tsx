'use client'

import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Search, Filter, ArrowUpDown, RefreshCw, ListTodo } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'

interface Todo {
  id: string
  text: string
  deadline: string
  status: 'pending' | 'done'
  finishedTime?: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('deadline')

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (search) params.append('search', search)
      params.append('sortBy', sortBy)

      const response = await fetch(`/api/todos?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [statusFilter, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTodos()
  }

  const handleTodoUpdate = () => {
    fetchTodos()
  }

  const handleTodoDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const pendingCount = todos.filter(t => t.status === 'pending').length
  const doneCount = todos.filter(t => t.status === 'done').length

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý công việc</h1>
          <p className="text-muted-foreground">
            {pendingCount} công việc chờ xử lý • {doneCount} công việc đã hoàn thành
          </p>
        </div>
        <Button onClick={fetchTodos} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      <TodoForm onAdd={fetchTodos} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Danh sách công việc
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Tìm kiếm công việc..."
                  value={search}
                  onChange={(e ) => setSearch(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Button type="submit" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="done">Đã hoàn thành</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadline">Thời hạn</SelectItem>
                    <SelectItem value="status">Trạng thái</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <ListTodo className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Không có công việc nào</h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== 'all' 
                  ? 'Thử thay đổi bộ lọc tìm kiếm' 
                  : 'Hãy thêm công việc mới để bắt đầu'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleTodoUpdate}
                  onDelete={handleTodoDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}