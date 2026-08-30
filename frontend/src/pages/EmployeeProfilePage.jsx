import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import IDCardModal from '../components/IDCardModal';
import { 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  QrCode 
} from 'lucide-react';

const EmployeeProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [showIDCard, setShowIDCard] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">View your corporate employee details, ID card, and performance score.</p>
      </div>

      <div className="card space-y-6 border-slate-200">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-indigo-600 shadow-md shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-3xl shadow-md shrink-0">
              {user.name?.[0]}
            </div>
          )}

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">{user.name}</h2>
            <p className="text-sm text-indigo-600 font-bold">{user.designation}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="font-mono text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200 font-bold">
                ID: {user.employeeId}
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                Active Employee
              </span>
            </div>
          </div>

          <div className="sm:ml-auto shrink-0">
            <button
              onClick={() => setShowIDCard(true)}
              className="btn-primary text-xs font-bold flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              View ID Card
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Department
            </div>
            <p className="font-extrabold text-slate-900 text-base">{user.department}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-600" />
              Total Points Earned
            </div>
            <p className="font-extrabold text-amber-600 font-mono text-base">{user.totalPoints || 0} Pts</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4 text-indigo-600" />
              Email Address
            </div>
            <p className="font-semibold text-slate-800">{user.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Phone className="w-4 h-4 text-indigo-600" />
              Phone Number
            </div>
            <p className="font-semibold text-slate-800">{user.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      {showIDCard && (
        <IDCardModal
          employee={user}
          onClose={() => setShowIDCard(false)}
        />
      )}
    </div>
  );
};

export default EmployeeProfilePage;
