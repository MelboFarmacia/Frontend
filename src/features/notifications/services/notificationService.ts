import { api } from '../../../lib/api';

export interface Notification {
  _id: string;
  productId: string;
  type: 'stock-low' | 'expired' | 'expiring-soon' | 'out-of-stock';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const createNotification = async (notification: Omit<Notification, '_id' | 'read' | 'createdAt'>) => {
  try {
    const response = await api.post('/notifications', notification);
    return response.data;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    throw error;
  }
}; 