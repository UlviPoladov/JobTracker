import { useState, useEffect } from 'react';
import type { Job, JobStatus } from '../types';

const STATUSES: JobStatus[] = [
  'Applied', 'Interview', 'TechnicalTest', 'Offer', 'Rejected', 'Ghosted'
];

interface Props {
  job?: Job | null;
  onClose: () => void;
  onSave: (data: Partial<Job>) => Promise<void>;
}

export default function JobModal({ job, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    companyName: '', position: '', location: '',
    jobUrl: '', notes: '', status: 'Applied' as JobStatus,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) setForm({
      companyName: job.companyName, position: job.position,
      location: job.location ?? '', jobUrl: job.jobUrl ?? '',
      notes: job.notes ?? '', status: job.status,
    });
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  await onSave({
    companyName: form.companyName,
    position: form.position,
    location: form.location || undefined,
    jobUrl: form.jobUrl || undefined,
    notes: form.notes || undefined,
    status: form.status,
  });
  setLoading(false);
};

  const field = (label: string, key: keyof typeof form, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        required={required}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm
                   focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center
                    justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
           onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {job ? 'Edit application' : 'New application'}
          </h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('Company *', 'companyName', 'text', true)}
          {field('Position *', 'position', 'text', true)}
          {field('Location', 'location')}
          {field('Job URL', 'jobUrl', 'url')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value as JobStatus }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-violet-400 transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm
                         text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm
                         hover:bg-violet-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}