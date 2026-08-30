import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  QrCode,
  Lock
} from 'lucide-react';

const PublicVerification = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/employees/verify/${employeeId}`);
        setEmployee(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Employee record not found or link is invalid.');
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchVerification();
    }
  }, [employeeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-500 text-sm font-medium">Verifying Employee Identity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col items-center justify-center p-4 md:p-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-4">
        {/* Corporate Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-none text-slate-900 tracking-tight">NexusCorp</h1>
              <span className="text-xs text-slate-500 font-medium">Corporate Verification Portal</span>
            </div>
          </div>
          <Link
            to="/scan"
            className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            Scan QR
          </Link>
        </div>

        {error ? (
          <div className="bg-white rounded-2xl p-8 text-center space-y-4 border border-rose-200 shadow-xl">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Verification Failed</h2>
            <p className="text-sm text-slate-600">{error}</p>
            <p className="text-xs text-slate-400 font-mono">ID Ref: {employeeId}</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xl space-y-6 relative overflow-hidden animate-fade-in-up">
            {/* Status Banner Pill */}
            <div className={`p-4 rounded-2xl flex items-center gap-3.5 border ${
              employee?.status === 'Active'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}>
              {employee?.status === 'Active' ? (
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 bg-rose-600 text-white rounded-xl shadow-sm shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Employment Status</span>
                <span className="text-base font-extrabold">
                  {employee?.status === 'Active' ? 'Active Employee' : 'Inactive Employee'}
                </span>
              </div>
            </div>

            {/* Inactive Notice */}
            {employee?.status !== 'Active' && (
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 text-center font-semibold">
                ⚠️ This employee is no longer associated with the organization.
              </div>
            )}

            {/* Profile Avatar & Header */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                {employee?.profilePhoto ? (
                  <img 
                    src={employee.profilePhoto} 
                    alt={employee.name} 
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg">
                    {employee?.name?.[0]}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-md">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{employee?.name}</h2>
                <p className="text-sm font-semibold text-indigo-600 mt-0.5">{employee?.designation}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-slate-100 border border-slate-200 text-xs font-mono font-bold rounded-lg text-slate-700">
                  ID: {employee?.employeeId}
                </span>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-xs uppercase tracking-wider">Department</span>
                </div>
                <span className="font-bold text-slate-900">{employee?.department}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-xs uppercase tracking-wider">Email</span>
                </div>
                <span className="font-semibold text-slate-800 truncate max-w-[200px]">{employee?.email}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-xs uppercase tracking-wider">Phone</span>
                </div>
                <span className="font-semibold text-slate-800">{employee?.phone}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-xs uppercase tracking-wider">Date of Joining</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {new Date(employee?.joiningDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Verification Footer Notice */}
            <div className="text-center pt-4 border-t border-slate-100 space-y-1">
              <p className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Live via NexusCorp Corporate Security
              </p>
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                Protected identity verification portal
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicVerification;
