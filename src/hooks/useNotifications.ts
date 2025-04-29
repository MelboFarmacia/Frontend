// src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { getProducts } from '../features/products/services/productService';
import { 
  Notification, 
  getNotifications, 
  markNotificationAsRead,
  createNotification 
} from '../features/notifications/services/notificationService';

const LOW_STOCK_THRESHOLD = 10;
const EXPIRATION_WARNING_MONTHS = 6;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const notificationsData = await getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };

  useEffect(() => {
    const checkProductsStatus = async () => {
      try {
        const products = await getProducts();
        const today = new Date();
        const notificationPromises: Promise<Notification>[] = [];
        
        products.forEach(product => {
          // Verificar stock bajo
          if (product.sellOptions.unit && product.stock.units <= LOW_STOCK_THRESHOLD) {
            notificationPromises.push(
              createNotification({
                productId: product._id,
                type: 'stock-low',
                title: 'Stock Bajo',
                message: `El producto ${product.name} tiene stock bajo (${product.stock.units} unidades).`
              })
            );
          }

          // Verificar fecha de vencimiento
          const expirationDate = new Date(product.expirationDate);
          const monthsUntilExpiration = (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

          if (monthsUntilExpiration <= 0) {
            notificationPromises.push(
              createNotification({
                productId: product._id,
                type: 'expired',
                title: 'Producto Vencido',
                message: `El producto ${product.name} ha vencido.`
              })
            );
          } else if (monthsUntilExpiration <= EXPIRATION_WARNING_MONTHS) {
            notificationPromises.push(
              createNotification({
                productId: product._id,
                type: 'expiring-soon',
                title: 'Próximo a Vencer',
                message: `El producto ${product.name} vencerá en ${Math.ceil(monthsUntilExpiration)} meses.`
              })
            );
          }
        });

        // Esperar a que todas las notificaciones se creen
        await Promise.all(notificationPromises);
        await fetchNotifications();
      } catch (error) {
        console.error('Error checking products status:', error);
      }
    };

    checkProductsStatus();
    const interval = setInterval(checkProductsStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      await fetchNotifications();
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  return {
    notifications,
    markAsRead: handleMarkAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  };
}
