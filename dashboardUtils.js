export const getOrderStats = (orders) => {
  if (!Array.isArray(orders)) {
    throw new Error('Orders must be an array');
  }
  return {
    total: orders.length,
    pending: orders.filter(o => o && o.status === 'PENDING').length,
    delivered: orders.filter(o => o && o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o && o.status === 'CANCELLED').length
  };
};

export const formatOrderDate = (dateString) => {
  if (!dateString) {
    throw new Error('Date string cannot be null or undefined');
  }
  return new Date(dateString).toLocaleDateString();
};

export const getStatusColor = (status) => {
  if (!status) return 'default';
  switch (status.toString().toUpperCase()) {
    case 'DELIVERED': return 'success';
    case 'PENDING': return 'warning';
    case 'CANCELLED': return 'error';
    case 'ASSIGNED': return 'info';
    case 'TRANSIT': return 'primary';
    case 'PICKUP': return 'secondary';
    default: return 'default';
  }
};

export const filterOrdersByStatus = (orders, status) => {
  if (!Array.isArray(orders)) {
    throw new Error('Orders must be an array');
  }
  if (!status) {
    return [];
  }
  return orders.filter(order => order && order.status === status);
};