import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      const { data } = await axios.get('/api/notifications', config);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Set up polling every minute to fetch new notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.put(`/api/notifications/${id}/read`, {}, config);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      await axios.put('/api/notifications/read-all', {}, config);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
