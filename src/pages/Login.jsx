import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            let user;
            if (isRegistering) {
                user = await register(name, email, password);
            } else {
                user = await login(email, password);
            }

            // Redirect based on role
            if (user.role === 'translator') {
                navigate('/translator/tasks');
            } else if (user.role === 'linguist' || user.role === 'expert') {
                navigate('/linguist/tasks');
            } else if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || (isRegistering ? 'Failed to create account' : 'Failed to login'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="auth-title">{isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>

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
                    {isRegistering && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your Name"
                            />
                        </div>
                    )}

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
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Lock
                                size={18}
                                color="var(--text-secondary)"
                                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? (isRegistering ? 'Creating Account...' : 'Signing in...') : (isRegistering ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    {isRegistering ? (
                        <span>
                            Already have an account?{' '}
                            <button
                                onClick={() => { setIsRegistering(false); setError(''); }}
                                style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 500, padding: 0 }}
                            >
                                Sign In
                            </button>
                        </span>
                    ) : (
                        <span>
                            Don't have an account?{' '}
                            <button
                                onClick={() => { setIsRegistering(true); setError(''); }}
                                style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 500, padding: 0 }}
                            >
                                Sign Up
                            </button>
                        </span>
                    )}
                </div>

                {!isRegistering && (
                    <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                        <Link to="/forgot-password" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                            Forgot password?
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
