import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import IDCardModal from '../components/IDCardModal';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  Award, 
  X,
  AlertTriangle,
  UserCheck,
  UserX,
  Eye,
  CheckSquare,
  Mail,
  Phone,
  Calendar,
  Upload,
  Trash2,
  Image as ImageIcon,
  User,
  Heart,
  Briefcase,
  ShieldAlert
} from 'lucide-react';

const EmployeeManagement = () => {
  const [searchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals state
  const [selectedIDCardEmp, setSelectedIDCardEmp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [confirmStatusEmp, setConfirmStatusEmp] = useState(null);
  
  // Profile Detail Modal State
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    dateOfBirth: '',
    joiningDate: '',
    address: '',
    emergencyContact: '',
    bloodGroup: 'O+',
    profilePhoto: ''
  });

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchEmployees();
    if (searchParams.get('add') === 'true') {
      setShowAddModal(true);
    }
  }, [searchParams]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/employees');
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!confirmStatusEmp) return;
    const newStatus = confirmStatusEmp.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await API.patch(`/employees/${confirmStatusEmp._id}/status`, { status: newStatus });
      setConfirmStatusEmp(null);
      setProfileData(null);
      fetchEmployees();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await API.post('/employees', formData);
      setShowAddModal(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await API.put(`/employees/${editEmployee._id}`, formData);
      setEditEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update employee');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Engineering',
      designation: '',
      dateOfBirth: '',
      joiningDate: '',
      address: '',
      emergencyContact: '',
      bloodGroup: 'O+',
      profilePhoto: ''
    });
    setFormError(null);
  };

  const openEditModal = (emp) => {
    setEditEmployee(emp);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      department: emp.department || 'Engineering',
      designation: emp.designation || '',
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
      joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
      address: emp.address || '',
      emergencyContact: emp.emergencyContact || '',
      bloodGroup: emp.bloodGroup || 'O+',
      profilePhoto: emp.profilePhoto || ''
    });
  };

  // Convert uploaded file to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, profilePhoto: '' }));
  };

  const openProfileDetail = async (empId) => {
    try {
      setProfileLoading(true);
      const { data } = await API.get(`/performance/${empId}`);
      setProfileData(data);
    } catch (err) {
      alert('Failed to load employee profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const departments = ['Engineering', 'Design', 'Marketing', 'HR', 'Finance', 'Operations'];

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage employee records, issue corporate digital ID cards, and view detailed profiles/tasks.</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="btn-primary flex items-center gap-2 text-sm font-bold shrink-0 shadow-sm animate-fade-in-up"
        >
          <Plus className="w-4 h-4" />
          Add New Employee
        </button>
      </div>

      {/* Controls Bar */}
      <div className="card grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-slate-200 animate-fade-in-up">
        <div className="md:col-span-2 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by employee name, ID (EMP001), email..."
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
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>

        <div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input-field text-sm font-medium"
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="card text-center py-12 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No employees found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto p-0 border-slate-200 animate-fade-in-up">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase text-slate-400">
                <th className="p-4">Employee</th>
                <th className="p-4">Department & Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Points</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {filteredEmployees.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {emp.profilePhoto ? (
                        <img
                          src={emp.profilePhoto}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center border border-indigo-100 shadow-sm">
                          {emp.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          {emp.name}
                          <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-bold">
                            {emp.employeeId}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-normal">{emp.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900">{emp.designation}</div>
                    <div className="text-xs text-slate-500 font-normal">{emp.department}</div>
                  </td>

                  <td className="p-4 text-xs text-slate-500 font-mono">
                    {new Date(emp.joiningDate).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      emp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {emp.status === 'Active' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      {emp.status}
                    </span>
                  </td>

                  <td className="p-4 text-center font-bold text-amber-600">
                    <span className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      <Award className="w-4 h-4 text-amber-600" />
                      {emp.totalPoints || 0}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openProfileDetail(emp._id)}
                        title="View Detailed Profile & Tasks"
                        className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-xl transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedIDCardEmp(emp)}
                        title="View & Print Digital ID Card"
                        className="p-2 text-slate-600 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openEditModal(emp)}
                        title="Edit Details"
                        className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setConfirmStatusEmp(emp)}
                        title={emp.status === 'Active' ? 'Deactivate Employee' : 'Activate Employee'}
                        className={`p-2 rounded-xl transition-all border ${
                          emp.status === 'Active'
                            ? 'text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border-rose-200'
                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white border-emerald-200'
                        }`}
                      >
                        {emp.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Profile Loading */}
      {profileLoading && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Complete Employee Profile Modal */}
      {profileData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-3xl w-full relative space-y-6 shadow-2xl my-8 animate-fade-in-up">
            <button
              onClick={() => setProfileData(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              {profileData.employee.profilePhoto ? (
                <img
                  src={profileData.employee.profilePhoto}
                  alt={profileData.employee.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-3xl border border-indigo-100">
                  {profileData.employee.name[0]}
                </div>
              )}
              <div className="text-center sm:text-left space-y-1">
                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                  <h2 className="text-2xl font-extrabold text-slate-900">{profileData.employee.name}</h2>
                  <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150 font-bold">
                    {profileData.employee.employeeId}
                  </span>
                </div>
                <p className="text-sm font-bold text-indigo-600">{profileData.employee.designation}</p>
                <p className="text-xs text-slate-500 font-medium">{profileData.employee.department} Department</p>
              </div>
              
              <div className="sm:ml-auto">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  profileData.employee.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {profileData.employee.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Tasks</span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block">{profileData.stats.totalTasks}</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Completed</span>
                <span className="text-xl font-extrabold text-emerald-800 mt-1 block">{profileData.stats.completedTasks}</span>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Pending</span>
                <span className="text-xl font-extrabold text-blue-800 mt-1 block">{profileData.stats.pendingTasks}</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Completion Rate</span>
                <span className="text-xl font-extrabold text-amber-800 mt-1 block">{profileData.stats.completionRate}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium border-t border-slate-100 pt-5">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-500" /> Email</span>
                <span className="text-slate-800 font-bold">{profileData.employee.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-500" /> Phone</span>
                <span className="text-slate-800 font-bold">{profileData.employee.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-500" /> Joined</span>
                <span className="text-slate-800 font-bold">{new Date(profileData.employee.joiningDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-500" /> Total Points</span>
                <span className="text-amber-600 font-extrabold font-mono">{profileData.employee.totalPoints || 0} Pts</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500" /> Blood Group</span>
                <span className="text-rose-600 font-extrabold font-mono">{profileData.employee.bloodGroup || 'O+'}</span>
              </div>
            </div>

            <div className="space-y-3 pt-5 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                Assigned Task History
              </h3>
              
              {profileData.tasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">No tasks assigned yet.</p>
              ) : (
                <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-2">
                  {profileData.tasks.map((task) => (
                    <div key={task._id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span className={`px-1.5 py-0.5 rounded border font-semibold ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                          <span>•</span>
                          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">+{task.points} Pts</span>
                          <span>•</span>
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
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

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedIDCardEmp(profileData.employee)}
                className="btn-secondary text-xs font-bold flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                ID Card
              </button>
              <button
                onClick={() => openEditModal(profileData.employee)}
                className="btn-secondary text-xs font-bold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4 text-slate-600" />
                Edit
              </button>
              <button
                onClick={() => setProfileData(null)}
                className="btn-primary text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID Card Modal */}
      {selectedIDCardEmp && (
        <IDCardModal
          employee={selectedIDCardEmp}
          onClose={() => setSelectedIDCardEmp(null)}
        />
      )}

      {/* Status Toggle Modal */}
      {confirmStatusEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-extrabold text-slate-900">Confirm Status Change</h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to change <span className="font-bold text-slate-900">{confirmStatusEmp.name}</span>'s status to{' '}
              <span className="font-bold text-indigo-600">{confirmStatusEmp.status === 'Active' ? 'Inactive' : 'Active'}</span>?
            </p>
            {confirmStatusEmp.status === 'Active' && (
              <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                Note: Their record and QR code will remain stored for verification, but they will be marked as Inactive.
              </p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmStatusEmp(null)}
                className="btn-secondary text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`btn-primary text-xs font-bold ${
                  confirmStatusEmp.status === 'Active' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm {confirmStatusEmp.status === 'Active' ? 'Deactivation' : 'Activation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Employee Modal - Premium Redesigned Spacing & Layout */}
      {(showAddModal || editEmployee) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-4xl w-full relative space-y-6 shadow-2xl my-8 animate-fade-in-up">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditEmployee(null);
                resetForm();
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                {editEmployee ? `Edit Corporate Profile: ${editEmployee.name}` : 'Register New Employee'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Please provide accurate employee credentials for ID card generation.</p>
            </div>

            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={editEmployee ? handleEditSubmit : handleAddSubmit} className="space-y-5">
              
              {/* Row 1: Photo & Personal Details side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Photo Upload Area */}
                <div className="lg:col-span-1 space-y-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Photo</span>
                  
                  <div className="flex flex-col items-center justify-center p-4 h-[165px] bg-slate-50 border border-dashed border-slate-350 rounded-2xl hover:bg-slate-100/50 transition-colors relative">
                    {formData.profilePhoto ? (
                      <div className="relative">
                        <img 
                          src={formData.profilePhoto} 
                          alt="Profile Preview" 
                          className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-md ring-2 ring-white"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full hover:bg-rose-600 transition-all shadow-md active:scale-95"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <label className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-bold cursor-pointer transition-all shadow-2xs">
                          Upload Photo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-3">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Personal Information</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field text-xs py-2 w-full"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="input-field text-xs py-2 w-full font-semibold"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="input-field text-xs py-2 w-full text-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">Date of Joining</label>
                      <input
                        type="date"
                        required
                        value={formData.joiningDate}
                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                        className="input-field text-xs py-2 w-full text-slate-700"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 2: Corporate Assignments in 3 columns */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Corporate Assignments & Security</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Corporate Email</label>
                    <input
                      type="email"
                      required
                      disabled={!!editEmployee}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field text-xs py-2 w-full disabled:bg-slate-50 disabled:opacity-75"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Contact Number</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field text-xs py-2 w-full"
                      placeholder="9876543210"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Emergency Contact</label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="input-field text-xs py-2 w-full"
                      placeholder="Emergency contact info"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="input-field text-xs py-2 w-full font-semibold"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Designation / Title</label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="input-field text-xs py-2 w-full"
                      placeholder="Senior Engineer"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Residential Address (Single line to save height) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">Residential Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field text-xs py-2.5 w-full"
                    placeholder="Residential street, city, state address details..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditEmployee(null);
                    resetForm();
                  }}
                  className="btn-secondary text-xs font-bold py-2 px-5"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs font-bold py-2 px-6 shadow-md shadow-indigo-600/10">
                  {editEmployee ? 'Update Profile' : 'Register Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
