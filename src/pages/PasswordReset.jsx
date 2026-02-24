import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const PasswordReset = () => {
    const [params] = useSearchParams();
    const token = params.get('token');
    const hasToken = useMemo(() => !!token, [token]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const requestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await api.post('/api/auth/password-reset/request', { email });
            setMessage(response.data.message || 'If your email exists, a reset link has been sent.');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to request reset.');
        } finally {
            setLoading(false);
        }
    };

    const confirmReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await api.post('/api/auth/password-reset/confirm', {
                token,
                new_password: password,
            });
            setMessage(response.data.message || 'Password has been reset.');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="auth-title">{hasToken ? 'Set New Password' : 'Reset Password'}</h2>
                {error && <div style={{ marginBottom: '0.75rem', color: '#b91c1c' }}>{error}</div>}
                {message && <div style={{ marginBottom: '0.75rem', color: '#166534' }}>{message}</div>}

                {!hasToken ? (
                    <form onSubmit={requestReset}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={confirmReset}>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input className="form-input" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--primary-color)' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
