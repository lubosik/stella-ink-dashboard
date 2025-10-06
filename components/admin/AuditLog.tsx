import React from 'react';
import { BrandCard } from '@/components/brand/BrandCard';
import { cn } from '@/lib/utils';
import { AuditEntry } from '@/lib/audit/logger'; // Import AuditEntry type

interface AuditLogProps {
  entries: AuditEntry[];
  className?: string;
}

export const AuditLog: React.FC<AuditLogProps> = ({ entries, className }) => {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-CA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <BrandCard variant="flat" className={cn('p-lg', className)}>
      <h3 className="text-xl font-heading text-neutral-900 mb-lg">Recent Changes</h3>
      {entries.length === 0 ? (
        <p className="text-neutral-600">No audit entries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Field
                </th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {entries.map((entry, index) => (
                <tr key={entry.timestamp + index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-900">
                    {formatTime(entry.timestamp)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-900">
                    {entry.user}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-900">
                    {entry.field}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-900">
                    {entry.oldValue} → {entry.newValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BrandCard>
  );
};
