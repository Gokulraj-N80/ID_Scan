import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { 
  CheckSquare, 
  Award, 
  Calendar
} from 'lucide-react';

const EmployeeMyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeDropdownTaskId, setActiveDropdownTaskId] = useState(null);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80';
      case 'Cancelled': return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80';
      default: return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80';
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Cancelled': return 'bg-slate-500';
      default: return 'bg-amber-500';
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/tasks/employee');
      setTasks(data);
    } catch (err) {
      console.error('Failed to load employee tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchMyTasks();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const filteredTasks = tasks.filter(t => statusFilter === 'All' || t.status === statusFilter);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Assigned Tasks</h1>
        <p className="text-sm text-slate-500 mt-1">Update your assigned task status to Completed to earn performance points.</p>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-200">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-sm text-slate-900">Filter Tasks by Status:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card text-center py-12 space-y-3">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No tasks found in this category</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <div key={task._id} className="card space-y-4 border-slate-200 hover:border-slate-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    +{task.points} Points
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>

                 <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">Status:</span>
                  <div className="relative">
                    <button
                      onClick={() => setActiveDropdownTaskId(activeDropdownTaskId === task._id ? null : task._id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${getStatusStyle(task.status)}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${getStatusDotColor(task.status)}`}></span>
                      {task.status}
                    </button>
                    
                    {activeDropdownTaskId === task._id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveDropdownTaskId(null)}
                        />
                        <div className="absolute right-0 bottom-full mb-2 z-20 w-36 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-fade-in-up">
                          {['Pending', 'In Progress', 'Completed'].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => {
                                handleStatusChange(task._id, status);
                                setActiveDropdownTaskId(null);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                                task.status === status 
                                  ? 'bg-indigo-50 text-indigo-700' 
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(status)}`}></span>
                              {status}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeMyTasks;
