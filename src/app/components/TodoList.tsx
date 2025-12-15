'use client';

import { format } from 'date-fns';

interface Todo {
  id: string;
  name: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not started' | 'In progress' | 'Done';
}

interface TodoListProps {
  todos: Todo[];
  filter: string;
  onUpdate: () => void;
}

export default function TodoList({ todos, filter, onUpdate }: TodoListProps) {
  // Kiểm tra nếu todos không phải array hoặc undefined
  if (!todos || !Array.isArray(todos)) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No tasks available</p>
      </div>
    );
  }

  const getSmartBadge = (todo: Todo) => {
    const today = new Date();
    const deadline = new Date(todo.deadline);
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (todo.status === 'Done') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Done</span>;
    }
    
    if (diffDays < 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Overdue</span>;
    }
    
    if (diffDays === 0) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Today</span>;
    }
    
    return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{diffDays}d left</span>;
  };

  const filterTodos = () => {
    const today = new Date();
    
    // Đảm bảo todos là array
    if (!Array.isArray(todos)) return [];
    
    return todos.filter(todo => {
      if (!todo || !todo.deadline) return false;
      
      const deadline = new Date(todo.deadline);
      
      if (filter === 'today') {
        return deadline.toDateString() === today.toDateString();
      }
      
      if (filter === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return deadline >= weekStart && deadline <= weekEnd;
      }
      
      if (filter === 'month') {
        return deadline.getMonth() === today.getMonth() && 
               deadline.getFullYear() === today.getFullYear();
      }
      
      return true;
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Done' ? 'Not started' : 'Done';
      await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const filteredTodos = filterTodos();

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <i className="fa-regular fa-face-smile text-4xl mb-3"></i>
        <p>No tasks found for {filter}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTodos.map(todo => (
        <div key={todo.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded border">
          <div className="flex items-center gap-3">
            <div 
              className="w-5 h-5 border rounded cursor-pointer flex items-center justify-center"
              onClick={() => handleToggleStatus(todo.id, todo.status)}
            >
              {todo.status === 'Done' && <i className="fa-solid fa-check text-xs text-blue-500"></i>}
            </div>
            <span className={todo.status === 'Done' ? 'line-through text-gray-500' : ''}>
              {todo.name}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {getSmartBadge(todo)}
            <span className="text-sm text-gray-600">
              {format(new Date(todo.deadline), 'MMM dd')}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${
              todo.priority === 'High' ? 'bg-red-100 text-red-800' :
              todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {todo.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}