import type { JobStatus } from '../types';

const config: Record<JobStatus, { label: string; classes: string }> = {
  Applied:       { label: 'Applied',        classes: 'bg-blue-100 text-blue-800' },
  Interview:     { label: 'Interview',      classes: 'bg-purple-100 text-purple-800' },
  TechnicalTest: { label: 'Technical Test', classes: 'bg-amber-100 text-amber-800' },
  Offer:         { label: 'Offer 🎉',       classes: 'bg-green-100 text-green-800' },
  Rejected:      { label: 'Rejected',       classes: 'bg-red-100 text-red-800' },
  Ghosted:       { label: 'Ghosted',        classes: 'bg-gray-100 text-gray-600' },
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  const { label, classes } = config[status];
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${classes}`}>
      {label}
    </span>
  );
}