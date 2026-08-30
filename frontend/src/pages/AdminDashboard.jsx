import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { 
  Users, 
  CheckSquare, 
  Award, 
  History,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes] = await Promise.all([
          API.get('/dashboard/stats'),
          API.get('/activity-logs')
        ]);
        setStats(statsRes.data);
        setActivities(activityRes.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Data for Charts
  const employeeStatusData = [
    { name: 'Active', value: stats?.activeEmployees || 0, colorUrl: 'url(#activeGrad)' },
    { name: 'Inactive', value: stats?.inactiveEmployees || 0, colorUrl: 'url(#inactiveGrad)' },
  ];

  const taskStatusData = [
    { name: 'Pending', count: stats?.pendingTasks || 0, fillUrl: 'url(#pendingGrad)' },
    { name: 'In Progress', count: stats?.inProgressTasks || 0, fillUrl: 'url(#progressGrad)' },
    { name: 'Completed', count: stats?.completedTasks || 0, fillUrl: 'url(#completeGrad)' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">High-level operations, staff verification status, and task progress metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/employees?add=true" className="btn-primary text-xs font-bold shadow-xs">
            + Add Employee
          </Link>
          <Link to="/admin/tasks?add=true" className="btn-secondary text-xs font-bold">
            New Task
          </Link>
        </div>
      </div>

      {/* Streamlined Stats Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active vs Total Staff */}
        <div className="card border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workforce Status</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {stats?.activeEmployees} <span className="text-sm font-semibold text-slate-400">/ {stats?.totalEmployees} Active</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Current active company members</p>
          </div>
        </div>

        {/* Card 2: Task Execution Progress */}
        <div className="card border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Progress</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {stats?.completedTasks} <span className="text-sm font-semibold text-slate-400">/ {stats?.totalTasks} Done</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Completed company tasks</p>
          </div>
        </div>

        {/* Card 3: Active Operations */}
        <div className="card border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Operations</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {stats?.inProgressTasks} <span className="text-sm font-semibold text-slate-400">In Progress</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">{stats?.pendingTasks} tasks are currently pending</p>
          </div>
        </div>

        {/* Card 4: Total Points Awarded */}
        <div className="card border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Points</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-amber-600 font-mono">
              {stats?.totalPoints} <span className="text-xs font-semibold text-slate-400">Pts</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Accumulated workforce score</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics with Redesigned Premium Gradients & Fit Size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie Chart Card */}
        <div className="card border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Workforce Distribution
            </h3>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="inactiveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                </defs>
                <Pie
                  data={employeeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {employeeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.colorUrl} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="card border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Task Breakdown
            </h3>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData}>
                <defs>
                  <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="completeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fillUrl} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="card border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Recent Activity Logs</h3>
          </div>
          <Link to="/admin/logs" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-0.5">
            Full Audit <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No recent activity logs.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((log) => (
              <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/50 hover:bg-slate-100/50 transition-colors">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 border border-indigo-100">
                  <History className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{log.action}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
