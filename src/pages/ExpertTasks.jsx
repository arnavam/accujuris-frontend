import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Briefcase, ArrowRight, Clock, Archive, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ExpertTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [archiveItems, setArchiveItems] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('assigned');

    const reviewerRole = user?.role === 'translator' ? 'translator' : 'linguist';
    const reviewerLabel = reviewerRole === 'translator' ? 'Translator' : 'Linguistic Expert';
    const reviewPathPrefix = reviewerRole === 'translator' ? '/translator/review' : '/linguist/review';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/api/gig/available');
            setTasks(response.data);
            const archiveResponse = await api.get('/api/gig/archive');
            setArchiveItems(archiveResponse.data);
            const metricsResponse = await api.get('/api/gig/metrics/me');
            setMetrics(metricsResponse.data);
        } catch (error) {
            console.error('Failed to fetch review tasks', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{reviewerLabel} Workspace</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Collaborate with your paired reviewer. Final approval requires both linguist and translator.
                        </p>
                    </div>
                </div>

                {metrics && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Reviews Done</div>
                            <strong>{metrics.total_verifications}</strong>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <button
                        className={`btn ${activeTab === 'assigned' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('assigned')}
                    >
                        Assigned
                    </button>
                    <button
                        className={`btn ${activeTab === 'archive' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('archive')}
                    >
                        <Archive size={16} style={{ marginRight: '0.5rem' }} />
                        Archive
                    </button>
                </div>

                {loading ? (
                    <div>Loading tasks...</div>
                ) : activeTab === 'assigned' && tasks.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ backgroundColor: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Briefcase size={32} color="var(--text-secondary)" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No tasks assigned</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            There are currently no documents assigned to you.
                        </p>
                    </div>
                ) : activeTab === 'assigned' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {tasks.map((task) => (
                            <div key={task.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ backgroundColor: '#f0f9ff', padding: '0.5rem', borderRadius: '0.375rem', color: '#0ea5e9' }}>
                                        <Briefcase size={20} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={12} /> {new Date(task.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {task.original_filename}
                                </h3>

                                <div style={{ display: 'grid', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <div>
                                        Linguist: <strong style={{ color: task.linguist_approved ? 'var(--success-color)' : task.linguist_reviewed ? '#f59e0b' : 'var(--text-color)' }}>
                                            {task.assigned_linguist_name === user?.name ? 'You' : (task.assigned_linguist_name || 'Unassigned')} {task.linguist_approved ? '(approved)' : task.linguist_reviewed ? '(reviewed)' : '(pending)'}
                                        </strong>
                                    </div>
                                    <div>
                                        Translator: <strong style={{ color: task.translator_approved ? 'var(--success-color)' : task.translator_reviewed ? '#f59e0b' : 'var(--text-color)' }}>
                                            {task.assigned_translator_name === user?.name ? 'You' : (task.assigned_translator_name || 'Unassigned')} {task.translator_approved ? '(approved)' : task.translator_reviewed ? '(reviewed)' : '(pending)'}
                                        </strong>
                                    </div>
                                    {task.fully_verified && (
                                        <div style={{ color: 'var(--success-color)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle size={14} /> Fully verified
                                        </div>
                                    )}
                                </div>

                                <Link
                                    to={`${reviewPathPrefix}/${task.id}`}
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem', justifyContent: 'center', gap: '0.5rem', display: 'inline-flex' }}
                                >
                                    Open Review <ArrowRight size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : archiveItems.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Archive is empty</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Your completed review submissions will appear here.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {archiveItems.map((item) => (
                            <div key={item.verification_id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>{item.original_filename}</h3>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Reviewed: {item.verified_at ? new Date(item.verified_at).toLocaleString() : '-'}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Role: <strong style={{ color: 'var(--text-color)' }}>{item.reviewer_role || reviewerRole}</strong>
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Total review actions: <strong style={{ color: 'var(--text-color)' }}>{item.verification_count}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ExpertTasks;
