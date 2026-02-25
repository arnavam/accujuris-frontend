import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User } from 'lucide-react';
import api from '../api/axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [toast, setToast] = useState('');
    const prevUnreadRef = useRef(0);

    const roleConfig = {
        submitter: { label: 'User', bg: '#dbeafe', color: '#1e40af' },
        user: { label: 'User', bg: '#dbeafe', color: '#1e40af' },
        admin: { label: 'Admin', bg: '#fee2e2', color: '#991b1b' },
        expert: { label: 'Expert', bg: '#ede9fe', color: '#5b21b6' },
        linguist: { label: 'Linguist', bg: '#d1fae5', color: '#065f46' },
        translator: { label: 'Translator', bg: '#fef3c7', color: '#92400e' },
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const response = await api.get('/api/notifications/unread-count');
            const nextCount = response.data.count || 0;
            if (nextCount > prevUnreadRef.current && prevUnreadRef.current > 0) {
                setToast('You have new notifications.');
                setTimeout(() => setToast(''), 2500);
            }
            prevUnreadRef.current = nextCount;
            setUnreadCount(nextCount);
        } catch (_) {
            // ignore
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/api/notifications', { params: { limit: 6 } });
            setNotifications(response.data || []);
        } catch (_) {
            setNotifications([]);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const timer = setInterval(fetchUnreadCount, 20000);
        return () => clearInterval(timer);
    }, [user?.id]);

    const toggleNotifications = async () => {
        const next = !showNotifications;
        setShowNotifications(next);
        if (next) {
            await fetchNotifications();
        }
    };

    const markAllRead = async () => {
        try {
            await api.post('/api/notifications/mark-all-read');
            setUnreadCount(0);
            prevUnreadRef.current = 0;
            await fetchNotifications();
        } catch (_) {
            // ignore
        }
    };

    return (
        <nav className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    AccuJuris
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user && user.role === 'admin' && (
                        <>
                            <Link to="/admin/dashboard" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-secondary)' }}>
                                Admin
                            </Link>
                            <Link to="/admin/documents" className="btn btn-outline" style={{ border: 'none', color: 'var(--text-secondary)' }}>
                                Documents
                            </Link>
                        </>
                    )}

                    {user && ['linguist', 'translator', 'expert'].includes(user.role) && (
                        <Link
                            to={user.role === 'translator' ? '/translator/tasks' : '/linguist/tasks'}
                            className="btn btn-outline"
                            style={{ border: 'none', color: 'var(--text-secondary)' }}
                        >
                            Review Tasks
                        </Link>
                    )}

                    {user && (
                        <div style={{ position: 'relative' }}>
                            <button onClick={toggleNotifications} className="btn btn-outline" style={{ position: 'relative' }}>
                                <Bell size={17} />
                                {unreadCount > 0 && (
                                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', minWidth: '18px', height: '18px', padding: '0 4px', borderRadius: '999px', fontSize: '0.7rem', backgroundColor: '#ef4444', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            {showNotifications && (
                                <div style={{ position: 'absolute', right: 0, top: '2.3rem', width: '320px', zIndex: 20, backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '0.5rem', boxShadow: 'var(--shadow)', padding: '0.6rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <strong style={{ fontSize: '0.9rem' }}>Notifications</strong>
                                        <button className="btn btn-outline" style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem' }} onClick={markAllRead}>Mark all read</button>
                                    </div>
                                    <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'grid', gap: '0.4rem' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No notifications.</div>
                                        ) : notifications.map((item) => (
                                            <div key={item.id} style={{ padding: '0.45rem', borderRadius: '0.4rem', backgroundColor: item.is_read ? '#f8fafc' : '#eff6ff' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.title}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {user && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <User size={18} />
                            <span style={{ fontWeight: 500 }}>{user.name}</span>
                            <span style={{ fontSize: '0.75rem', backgroundColor: (roleConfig[user.role] || { bg: '#e2e8f0' }).bg, color: (roleConfig[user.role] || { color: '#475569' }).color, padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                                {(roleConfig[user.role] || { label: user.role }).label}
                            </span>
                        </div>
                    )}

                    <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem' }}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
            {toast && (
                <div style={{ position: 'fixed', right: '1rem', bottom: '1rem', backgroundColor: '#0f172a', color: '#fff', padding: '0.65rem 0.9rem', borderRadius: '0.5rem', boxShadow: 'var(--shadow)', zIndex: 50 }}>
                    {toast}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
