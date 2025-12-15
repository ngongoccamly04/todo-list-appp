'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import TodoList from '@/app/components/TodoList';
import TodoForm from '@/app/components/TodoForm';
import StatsWidget from '@/app/components/ui/StatsWidget';

type TodoType = {
  id: string;
  name: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not started' | 'In progress' | 'Done';
};

export default function HomePage() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/todos');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setTodos(data);
      } else {
        console.error('API did not return an array:', data);
        setTodos([]);
      }
      
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load tasks');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todo: {
    name: string;
    deadline: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Not started' | 'In progress' | 'Done';
  }) => {
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo),
      });
      fetchTodos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Header />
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center gap-3">
            <i className="fa-regular fa-clipboard text-xl"></i>
            <span className="text-lg font-semibold">Tasks Dashboard</span>
          </div>

          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              <button 
                className={`px-3 py-2 rounded ${activeTab === 'today' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                onClick={() => setActiveTab('today')}
              >
                <i className="fa-regular fa-sun mr-2"></i> Today
              </button>
              <button 
                className={`px-3 py-2 rounded ${activeTab === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                onClick={() => setActiveTab('week')}
              >
                <i className="fa-solid fa-calendar-week mr-2"></i> Week
              </button>
              <button 
                className={`px-3 py-2 rounded ${activeTab === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
                onClick={() => setActiveTab('month')}
              >
                <i className="fa-regular fa-calendar mr-2"></i> Month
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading tasks...</p>
            </div>
          ) : (
            <TodoList 
              todos={todos} 
              filter={activeTab} 
              onUpdate={fetchTodos} 
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center gap-3">
            <i className="fa-solid fa-chart-pie text-xl"></i>
            <span className="text-lg font-semibold">Progress</span>
          </div>
          
          <div className="bg-white rounded-xl shadow p-5">
            <h4 className="font-semibold text-lg mb-4 text-center">
              Tasks Overview
            </h4>
            
            {/* ĐÃ SỬA: StatsWidget thay vì StatsbWidget */}
            <StatsWidget todos={todos} />
            
            <div className="mt-6">
              <TodoForm onSubmit={handleAddTodo} />
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={() => window.location.href = '/api/auth/signout'}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium"
              >
                <i className="fa-solid fa-right-from-bracket mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}