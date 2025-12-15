// src/components/ui/StatsWidget.tsx
'use client';

// Sử dụng cùng interface với page.tsx
interface Todo {
  id: string;
  name: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not started' | 'In progress' | 'Done';
}

interface StatsWidgetProps {
  todos: Todo[];
}

export default function StatsWidget({ todos }: StatsWidgetProps) {
  const total = todos.length;
  const completed = todos.filter(t => t.status === 'Done').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-800">{percentage}%</div>
        <div className="text-sm text-gray-500">Completion Rate</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-600">{completed}</div>
          <div className="text-xs text-gray-500">Done</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-600">
            {todos.filter(t => t.status === 'In progress').length}
          </div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
      </div>
    </div>
  );
}