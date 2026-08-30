import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle, 
  Award, 
  QrCode,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const assignedCount = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const completionRate = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white border-none p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center font-extrabold text-2xl shadow-inner">
            {user?.name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Welcome back, {user?.name}!</h1>
            <p className="text-sm text-indigo-200 mt-0.5 font-medium">
              {user?.designation} • <span className="text-white">{user?.department} Department</span>
            </p>
            <span className="inline-block mt-2 font-mono text-xs text-indigo-100 bg-white/10 px-2.5 py-0.5 rounded border border-white/20 font-bold">
              ID: {user?.employeeId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Link to="/employee/tasks" className="btn-primary bg-white text-indigo-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 shadow-md">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            My Tasks
          </Link>
          <Link to={`/verify/${user?.employeeId}`} target="_blank" className="btn-secondary bg-indigo-950/40 text-white border-white/20 hover:bg-white/10 text-xs font-bold flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-300" />
            Public Verification
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4 border-slate-200">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{assignedCount}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-slate-200">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5">{pendingCount}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-slate-200">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-0.5">{completedCount}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-4 border-slate-200">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Points</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-0.5">{user?.totalPoints || 0}</h3>
          </div>
        </div>
      </div>

      {/* Completion Rate Progress */}
      <div className="card space-y-3 border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Task Completion Rate
          </span>
          <span className="font-mono font-extrabold text-emerald-600">{completionRate}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card space-y-4 border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-base text-slate-900">Recent Tasks Assigned to You</h3>
          <Link to="/employee/tasks" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
            See All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No tasks assigned to you yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task._id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="font-mono font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">+{task.points} Pts</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                  task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
