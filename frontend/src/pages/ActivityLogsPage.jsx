import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { History, Search, Clock, Shield } from 'lucide-react';

const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/activity-logs');
      setLogs(data);
    } catch (err) {
      console.error('Failed to load activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    return (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Activity Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Audit log of system actions, employee modifications, and task status updates.</p>
      </div>

      {/* Search Controls */}
      <div className="card p-4 border-slate-200">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search activity log stream..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11 text-sm w-full"
          />
        </div>
      </div>

      {/* Activity Timeline Stream */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="card text-center py-12 space-y-3">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No activity logs recorded</h3>
        </div>
      ) : (
        <div className="card p-6 border-slate-200 space-y-6">
          <div className="relative border-l-2 border-slate-100 ml-4 space-y-6 py-2">
            {filteredLogs.map((log) => (
              <div key={log._id} className="relative pl-6 group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-1.5 top-2 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-xs group-hover:scale-110 transition-transform"></div>
                
                {/* Event Card */}
                <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-1.5 transition-all shadow-2xs hover:shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-sm font-extrabold text-slate-900">{log.action}</span>
                    <span className="text-xs text-slate-400 font-mono font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{log.description}</p>
                  
                  {/* Performer Metadata */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                      <Shield className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider font-mono">
                      {log.performedBy}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogsPage;
