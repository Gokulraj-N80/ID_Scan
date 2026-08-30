import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { 
  Trophy, 
  Award, 
  Search, 
  Medal,
  Users
} from 'lucide-react';

const PerformanceLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/performance/leaderboard');
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = leaderboard.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white border-2 border-amber-300 flex items-center justify-center font-bold shadow-md shadow-amber-500/25">
            <Trophy className="w-5 h-5 text-white" />
          </div>
        );
      case 1:
        return (
          <div className="w-10 h-10 rounded-2xl bg-slate-400 text-white border-2 border-slate-200 flex items-center justify-center font-bold shadow-md">
            <Medal className="w-5 h-5 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-700 text-white border-2 border-amber-500 flex items-center justify-center font-bold shadow-md">
            <Award className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center font-mono font-extrabold text-sm">
            #{index + 1}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Performance Leaderboard</h1>
        <p className="text-sm text-slate-500 mt-1">Recognizing top-performing employees based on completed task points.</p>
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-slate-200">
        <div className="md:col-span-2 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search leaderboard by employee name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11 text-sm"
          />
        </div>

        <div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input-field text-sm font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="card text-center py-12 space-y-3">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No leaderboard entries</h3>
          <p className="text-sm text-slate-500">Complete tasks to award points to active employees.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredData.map((emp, index) => (
            <div
              key={emp._id}
              className={`card flex items-center justify-between p-4 border-slate-200 transition-all ${
                index === 0 ? 'bg-gradient-to-r from-amber-500/10 via-white to-white border-amber-300' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {getRankBadge(index)}

                <div className="flex items-center gap-3">
                  {emp.profilePhoto ? (
                    <img
                      src={emp.profilePhoto}
                      alt={emp.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-lg border border-indigo-100">
                      {emp.name[0]}
                    </div>
                  )}

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      {emp.name}
                      <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-bold">
                        {emp.employeeId}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {emp.designation} • <span className="text-slate-700">{emp.department}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl font-extrabold font-mono text-sm shadow-sm">
                  <Award className="w-4 h-4 text-amber-600" />
                  {emp.totalPoints} Points
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceLeaderboard;
