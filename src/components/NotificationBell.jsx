import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications/me');
      setNotifications(data.filter(n => !n.is_read));
    } catch (err) {
      // Silently fail if not authed
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          background: 'none', border: 'none', color: '#e0e0e5',
          fontSize: '1.2rem', cursor: 'pointer'
        }}
      >
        🔔
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-8px',
            background: '#ff6b6b', color: 'white',
            borderRadius: '50%', width: '16px', height: '16px',
            fontSize: '0.7rem', display: 'flex', alignItems: 'center',
            justifyContent: 'center'
          }}>
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {showPanel && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
          background: '#1a1a1d', border: '1px solid #333', borderRadius: '4px',
          width: '300px', maxHeight: '400px', overflowY: 'auto',
          zIndex: 1000
        }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '0.8rem', color: '#888' }}>No new whispers</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} style={{ padding: '0.6rem', borderBottom: '1px solid #2a2a2e' }}>
                <div>{n.source_display_name} {n.type === 'mention' ? 'mentioned you' : 'reacted'}</div>
                <button
                  onClick={() => markAsRead(n.id)}
                  style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: '#4a6b78', background: 'none', border: 'none' }}
                >
                  Dismiss
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}