import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Award, 
  X, 
  UserCheck,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const TaskManagement = () => {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTaskObj, setDeleteTaskObj] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    points: 20,
    priority: 'Medium',
    dueDate: '',
  });

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchInitialData();
    if (searchParams.get('add') === 'true') {
      setShowAddModal(true);
    }
  }, [searchParams]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [tasksRes, empRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/employees')
      ]);
      setTasks(tasksRes.data);
      const activeEmps = empRes.data.filter(e => e.status === 'Active');
      setEmployees(activeEmps);
      if (activeEmps.length > 0 && !formData.assignedTo) {
        setFormData(prev => ({ ...prev, assignedTo: activeEmps[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await API.post('/tasks', formData);
      setShowAddModal(false);
      resetForm();
      fetchInitialData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await API.put(`/tasks/${editTask._id}`, formData);
      setEditTask(null);
      resetForm();
      fetchInitialData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchInitialData();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskObj) return;
    try {
      await API.delete(`/tasks/${deleteTaskObj._id}`);
      setDeleteTaskObj(null);
      fetchInitialData();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: employees[0]?._id || '',
      points: 20,
      priority: 'Medium',
      dueDate: '',
    });
    setFormError(null);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id || task.assignedTo,
      points: task.points,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.assignedTo?.name && t.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

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
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Management</h1>
          <p className="text-sm text-slate-500 mt-1">Assign task objectives to employees, set points, and track completion progress.</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="btn-primary flex items-center gap-2 text-sm font-bold shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-slate-200">
        <div className="md:col-span-2 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, description or assigned employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11 text-sm"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field text-sm font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field text-sm font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card text-center py-12 space-y-3">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No tasks found</h3>
          <p className="text-sm text-slate-500">Try adjusting your filters or create a new task.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div key={task._id} className="card space-y-4 border-slate-200 hover:border-slate-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>

                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    +{task.points} Pts
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">{task.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{task.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">{task.assignedTo?.name || 'Unassigned'}</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-xs font-bold rounded-xl px-2.5 py-1.5 text-slate-800 focus:ring-indigo-500/20"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTaskObj(task)}
                      className="p-1.5 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTaskObj && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-extrabold text-slate-900">Delete Task</h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete task <span className="font-bold text-slate-900">"{deleteTaskObj.title}"</span>?
            </p>
            {deleteTaskObj.status === 'Completed' && (
              <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                ⚠️ Note: Deleting a completed task will deduct the {deleteTaskObj.points} points awarded to the employee.
              </p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTaskObj(null)}
                className="btn-secondary text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="btn-primary text-xs font-bold bg-rose-600 hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {(showAddModal || editTask) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full relative space-y-4 shadow-2xl">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditTask(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900">
              {editTask ? `Edit Task: ${editTask.title}` : 'Create & Assign Task'}
            </h3>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={editTask ? handleEditTask : handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field text-sm"
                  placeholder="e.g. Develop Login API"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field text-sm resize-none"
                  placeholder="Requirements & guidelines..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Assign Employee</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="input-field text-sm"
                    required
                  >
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Points Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditTask(null);
                  }}
                  className="btn-secondary text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs font-bold">
                  {editTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
