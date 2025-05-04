
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const baseClasses = 'px-2 py-1 rounded-md text-xs font-medium';
  let colorClasses = '';
  
  switch (status) {
    case 'new':
      colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      break;
    case 'in-progress':
      colorClasses = 'bg-blue-50 text-blue-600 dark:bg-blue-800 dark:text-blue-100';
      break;
    case 'resolved':
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
  
  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
