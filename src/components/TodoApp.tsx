import React, { useState, useEffect } from 'react';

interface TaskType {
  id: number;
  title: string;
  completed: boolean;
  category: 'daily' | 'weekly' | 'monthly';
  dueDate: Date | null;
}

const TodoApp: React.FC = () => {
  // const [tasks, setTasks] = useState<TaskType[]>(() => {
  //   const saved = localStorage.getItem('todo-tasks');
  //   return saved ? JSON.parse(saved) : [];
  // });
  const [tasks, setTasks] = useState<TaskType[]>(() => {
  try {
    const saved = localStorage.getItem('todo-tasks');
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return parsed.map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
    }));
  } catch (error) {
    console.error('Failed to load tasks from localStorage', error);
    return [];
  }
});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [warnings, setWarnings] = useState<{ [key: number]: string }>({});

  // useEffect(() => {
  //   localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  // }, [tasks]);
  useEffect(() => {
    try {
      localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks', err);
    }
  }, [tasks]);

  useEffect(() => {
    const checkLateness = () => {
      const now = new Date();
      const newWarnings: { [key: number]: string } = {};
      tasks.forEach(task => {
        if (!task.completed && task.dueDate && task.dueDate < now) {
          newWarnings[task.id] = 'Overdue!';
        }
      });
      setWarnings(newWarnings);
    };
    checkLateness();
    const interval = setInterval(checkLateness, 60000);
    return () => clearInterval(interval);
  }, [tasks]);


  const addTask = () => {
    if (!newTitle.trim()) return;
    const due = newDueDate ? new Date(newDueDate) : null;
    const newTask: TaskType = {
      id: Date.now(),
      title: newTitle.trim(),
      completed: false,
      category: newCategory,
      dueDate: due,
    };
    setTasks(prev => [...prev, newTask]);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle('');
    setNewCategory('daily');
    setNewDueDate('');
    setShowAddForm(false);
  };

  const toggleTaskCompleted = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const checkLateness = () => {
      const now = new Date();
      const newWarnings: { [key: number]: string } = {};
      tasks.forEach(task => {
        if (!task.completed && task.dueDate && task.dueDate < now) {
          newWarnings[task.id] = 'Overdue!';
        }
      });
      setWarnings(newWarnings);
    };
    checkLateness();
    const interval = setInterval(checkLateness, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const getCategoryBadge = (cat: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md";
    switch (cat) {
      case 'daily':   return `${base} bg-white/20 border-white/30 text-white`;
      case 'weekly':  return `${base} bg-white/25 border-white/40 text-white`;
      case 'monthly': return `${base} bg-white/30 border-white/50 text-white`;
      default: return base;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="
          backdrop-blur-2xl 
          bg-white/10 
          border 
          border-white/20 
          shadow-2xl 
          rounded-3xl 
          overflow-hidden
          ring-1 ring-white/10
        ">
          <div className="p-8">

           
            <div className="text-center mb-10">
              <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
                My Tasks
              </h1>
              <p className="text-white/80 text-lg mt-2">Stay focused, no matter the time</p>
            </div>

     
            {tasks.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-28 h-28 mx-auto mb-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No tasks yet</h2>
                <p className="text-white/70 text-lg mb-10">Let's make today count</p>

                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-md border border-green-400/30"
                >
                  Add Your First Task
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white drop-shadow">
                    Your Tasks ({tasks.length})
                  </h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-md border border-green-400/30 flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                  </button>
                </div>

 
                <ul className="space-y-5">
                  {tasks.map(task => (
                    <li
                      key={task.id}
                      className="
                        group 
                        bg-white/10 
                        backdrop-blur-xl 
                        border 
                        border-white/20 
                        rounded-2xl 
                        p-6 
                        shadow-lg 
                        hover:shadow-2xl 
                        hover:bg-white/20 
                        transition-all 
                        duration-300 
                        hover:-translate-y-1
                      "
                    >
                      <div className="flex items-start gap-5">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompleted(task.id)}
                          className="mt-1 w-6 h-6 text-green-400 bg-white/20 border-white/30 rounded-lg focus:ring-4 focus:ring-green-500/50 cursor-pointer"
                        />
                        <div className="flex-1">
                          <h3 className={`text-xl font-semibold transition-all ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
                            {task.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className={getCategoryBadge(task.category)}>
                              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                            </span>
                            {task.dueDate && (
                              <span className="text-white/70 text-sm flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {task.dueDate.toLocaleDateString()}
                              </span>
                            )}
                            {warnings[task.id] && (
                              <span className="text-red-400 font-bold text-sm flex items-center gap-1 animate-pulse">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.742-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 022 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {warnings[task.id]}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500 text-white p-3 rounded-xl transition-all duration-200 backdrop-blur-md border border-red-400/30"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2.175 2.175 0 0116.138 21H7.862a2.175 2.175 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>


        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 z-50" onClick={() => setShowAddForm(false)}>
            <div
              className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-8 max-w-lg w-full ring-1 ring-white/20"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold text-white mb-8 drop-shadow">Create New Task</h3>

              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-6 py-5 text-lg bg-white/20 border border-white/30 rounded-2xl placeholder-white/60 text-white focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                autoFocus
              />

              <div className="grid grid-cols-2 gap-5 mt-6">
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="px-6 py-5 text-white bg-white/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  <option value="daily" className="text-gray-800">Daily</option>
                  <option value="weekly" className="text-gray-800">Weekly</option>
                  <option value="monthly" className="text-gray-800">Monthly</option>
                </select>

                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="px-6 py-5 text-white bg-white/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30"
                />
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-red-500/80 hover:bg-red-600 text-white font-bold py-5 rounded-2xl backdrop-blur-md border border-red-400/40 shadow-lg hover:shadow-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  disabled={!newTitle.trim()}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-white/10 text-white font-bold py-5 rounded-2xl backdrop-blur-md border border-green-400/40 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;