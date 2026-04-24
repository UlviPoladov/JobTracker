import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getJobs, getStats, createJob, updateJob, deleteJob } from '../api/jobs';
import StatusBadge from '../components/StatusBadge';
import JobModal from '../components/JobModal';
import type { Job, JobStatus, Stats } from '../types';

const STATUS_ORDER: JobStatus[] = [
  'Applied', 'Interview', 'TechnicalTest', 'Offer', 'Rejected', 'Ghosted'
];

const STAT_COLORS: Record<string, string> = {
  Applied:       'bg-blue-50 text-blue-700 border-blue-100',
  Interview:     'bg-purple-50 text-purple-700 border-purple-100',
  TechnicalTest: 'bg-amber-50 text-amber-700 border-amber-100',
  Offer:         'bg-green-50 text-green-700 border-green-100',
  Rejected:      'bg-red-50 text-red-700 border-red-100',
  Ghosted:       'bg-gray-50 text-gray-600 border-gray-100',
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [filter, setFilter] = useState<JobStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; job?: Job | null }>({ open: false });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [jobsRes, statsRes] = await Promise.all([getJobs(), getStats()]);
    setJobs(jobsRes.data);
    setStats(statsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: Partial<Job>) => {
    if (modal.job) {
      await updateJob(modal.job.id, data);
    } else {
      await createJob(data);
    }
    setModal({ open: false });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this application?')) return;
    setDeleting(id);
    await deleteJob(id);
    setDeleting(null);
    fetchData();
  };

  const filtered = jobs.filter(j => {
    const matchStatus = filter === 'All' || j.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || j.companyName.toLowerCase().includes(q) ||
      j.position.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalApps = Object.values(stats).reduce((a, b) => a + b, 0);
  const offerRate = totalApps > 0
    ? Math.round(((stats.Offer ?? 0) / totalApps) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center
                            justify-center text-white text-sm">💼</div>
            <span className="font-bold text-gray-900">JobTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">
              Hi, {user?.fullName} 👋
            </span>
            <button onClick={() => { logout(); navigate('/login'); }}
              className="text-sm text-gray-500 hover:text-gray-700 transition">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-gray-900">{totalApps}</p>
            <p className="text-sm text-gray-500 mt-1">Total applications</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-purple-600">
              {stats.Interview ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Interviews</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-green-600">{stats.Offer ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Offers</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-violet-600">{offerRate}%</p>
            <p className="text-sm text-gray-500 mt-1">Offer rate</p>
          </div>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {(['All', ...STATUS_ORDER] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition border
                ${filter === s
                  ? 'bg-violet-600 text-white border-violet-600'
                  : s === 'All'
                    ? 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    : `${STAT_COLORS[s]} border`
                }`}>
              {s === 'All' ? `All (${totalApps})` : `${s} (${stats[s] ?? 0})`}
            </button>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex gap-3 mb-6">
          <input
            type="search"
            placeholder="Search company or position..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-violet-400 transition bg-white"
          />
          <button onClick={() => setModal({ open: true, job: null })}
            className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm
                       font-medium hover:bg-violet-700 transition whitespace-nowrap">
            + Add application
          </button>
        </div>

        {/* Job list */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🗂️</p>
            <p className="text-gray-500 text-sm">No applications yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(job => (
              <div key={job.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5
                           hover:shadow-sm transition group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {job.companyName}
                      </h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-sm text-gray-600">{job.position}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {job.location && <span>📍 {job.location}</span>}
                      <span>Applied {new Date(job.appliedAt).toLocaleDateString()}</span>
                    </div>
                    {job.notes && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                        📝 {job.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    {job.jobUrl && (
                      <a href={job.jobUrl} target="_blank" rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50
                                   rounded-lg transition text-sm">🔗</a>
                    )}
                    <button onClick={() => setModal({ open: true, job })}
                      className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50
                                 rounded-lg transition text-sm">✏️</button>
                    <button onClick={() => handleDelete(job.id)}
                      disabled={deleting === job.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
                                 rounded-lg transition text-sm disabled:opacity-50">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal.open && (
        <JobModal
          job={modal.job}
          onClose={() => setModal({ open: false })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}