import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="auth-title">Create Account</h2>
                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                    fontSize: '0.95rem'
                }}>
                    Get started with 2 free trial submissions
                </p>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="John Doe"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <User
                                size={18}
                                color="var(--text-secondary)"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Mail
                                size={18}
                                color="var(--text-secondary)"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                minLength={6}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Lock
                                size={18}
                                color="var(--text-secondary)"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </div>
                        {password.length > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                marginTop: '0.35rem',
                                fontSize: '0.8rem',
                                color: password.length >= 6 ? '#22c55e' : 'var(--text-secondary)'
                            }}>
                                <CheckCircle size={14} />
                                <span>At least 6 characters</span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Lock
                                size={18}
                                color="var(--text-secondary)"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </div>
                        {confirmPassword.length > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                marginTop: '0.35rem',
                                fontSize: '0.8rem',
                                color: password === confirmPassword ? '#22c55e' : '#ef4444'
                            }}>
                                <CheckCircle size={14} />
                                <span>{password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}</span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 500 }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
