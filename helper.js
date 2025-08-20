// Utility functions with edge case handling
export const formatDate = (date) => {
  if (!date || date === '') {
    throw new Error('Date cannot be null, undefined, or empty');
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format');
  }
  return parsedDate.toLocaleDateString();
};

export const getStatusColor = (status) => {
  if (!status || typeof status !== 'string') {
    return 'default';
  }
  switch (status.trim().toUpperCase()) {
    case 'DELIVERED': return 'success';
    case 'PENDING': return 'warning';
    case 'CANCELLED': return 'error';
    case 'ASSIGNED': return 'info';
    case 'TRANSIT': return 'primary';
    default: return 'default';
  }
};