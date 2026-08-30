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
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-xs font-bold rounded-xl px-2.5 py-1.5 text-slate-800 focus:ring-indigo-500/20"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
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
