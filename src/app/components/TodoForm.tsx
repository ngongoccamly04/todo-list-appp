// src/components/TodoForm.tsx
'use client';

import { useState } from 'react';

// Định nghĩa interface Todo
export interface TodoInput {
  name: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not started' | 'In progress' | 'Done';
}

interface TodoFormProps {
  onSubmit: (todo: {
    name: string;
    deadline: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Not started' | 'In progress' | 'Done';
  }) => void;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [status, setStatus] = useState<'Not started' | 'In progress' | 'Done'>('Not started');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !deadline) {
      alert('Please fill in task name and deadline');
      return;
    }

    onSubmit({
      name,
      deadline,
      priority,
      status,
    });

    // Reset form
    setName('');
    setDeadline('');
    setPriority('Medium');
    setStatus('Not started');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <h4 className="font-semibold text-lg">Add New Task</h4>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Clean the flat..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        <i className="fa-solid fa-plus mr-2"></i>
        Add Task
      </button>
    </form>
  );
}