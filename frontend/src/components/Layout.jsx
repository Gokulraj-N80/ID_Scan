import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Users, 
  CheckSquare, 
  Trophy, 
  History, 
  QrCode, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X,
  LayoutDashboard,
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
    { name: 'Leaderboard', path: '/admin/performance', icon: Trophy },
    { name: 'Activity Logs', path: '/admin/logs', icon: History },
  ];

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/employee/tasks', icon: CheckSquare },
    { name: 'My Profile', path: '/employee/profile', icon: UserIcon },
  ];

  const publicLinks = [
    { name: 'QR Scanner', path: '/scan', icon: QrCode },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 p-5 sticky top-0 h-screen justify-between z-30">
        <div>
          {/* Company Branding Header */}
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-xl shadow-md shadow-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-none">NexusCorp</h1>
              <span className="text-[11px] text-slate-500 font-medium">Enterprise Management</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isAdmin ? 'Admin Console' : 'Employee Portal'}
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {link.name}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-500" />}
                </Link>
              );
            })}

            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">
              Verification & QR
            </div>
            {publicLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {link.name}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-900 truncate leading-tight">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200/80 p-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-base text-slate-900 tracking-tight">NexusCorp Identity</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm pt-20 px-4 pb-6 flex flex-col justify-between">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xl space-y-4">
            <nav className="space-y-1.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {isAdmin ? 'Admin Console' : 'Employee Portal'}
              </p>
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-50 text-slate-800 border border-slate-200/60"
                  >
                    <Icon className="w-5 h-5 text-indigo-600" />
                    {link.name}
                  </Link>
                );
              })}

              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">
                Verification & QR
              </p>
              {publicLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-50 text-slate-800 border border-slate-200/60"
                  >
                    <Icon className="w-5 h-5 text-indigo-600" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;
