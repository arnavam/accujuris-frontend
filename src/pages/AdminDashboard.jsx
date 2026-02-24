import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { UserPlus, Shield, CheckCircle, AlertCircle, Users, Pencil, Trash2, Save, X } from 'lucide-react';

const AdminDashboard = () => {
    const [createForm, setCreateForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);
    const [savingId, setSavingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [message, setMessage] = useState(null);
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        role: 'user',
        is_approved: true,
        password: '',
    });

    const loadUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await api.get('/api/auth/admin/users');
            setUsers(response.data);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to load accounts.' });
        } finally {
            setUsersLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleChange = (e) => {
        setCreateForm({
            ...createForm,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setCreateForm({ name: '', email: '', password: '', role: 'user' });
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setMessage(null);

        try {
            await api.post('/api/auth/admin/users', createForm);
            setMessage({ type: 'success', text: `${createForm.role} account "${createForm.name}" created successfully.` });
            resetForm();
            await loadUsers();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to create account.' });
        } finally {
            setCreateLoading(false);
        }
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        setEditForm({
            name: user.name,
            email: user.email,
            role: user.role,
            is_approved: user.is_approved,
            password: '',
        });
        setMessage(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', email: '', role: 'user', is_approved: true, password: '' });
    };

    const handleUpdateUser = async (userId) => {
        setSavingId(userId);
        try {
            const payload = {
                name: editForm.name,
                email: editForm.email,
                role: editForm.role,
                is_approved: editForm.is_approved,
            };
            if (editForm.password) {
                payload.password = editForm.password;
            }

            await api.patch(`/api/auth/admin/users/${userId}`, payload);
            setMessage({ type: 'success', text: 'Account updated successfully.' });
            cancelEdit();
            await loadUsers();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update account.' });
        } finally {
            setSavingId(null);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        const confirmed = window.confirm(`Delete account "${userName}"? This cannot be undone.`);
        if (!confirmed) return;

        setDeletingId(userId);
        try {
            await api.delete(`/api/auth/admin/users/${userId}`);
            setMessage({ type: 'success', text: 'Account deleted successfully.' });
            if (editingId === userId) {
                cancelEdit();
            }
            await loadUsers();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to delete account.' });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Shield size={32} color="var(--primary-color)" />
                        Admin Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Create, view, edit, and remove platform accounts.
                    </p>
                </div>

                {message && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: message.type === 'success' ? '#065f46' : '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                    <div className="card">
                        <h2 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UserPlus size={20} /> Create Account
                        </h2>
                        <form onSubmit={handleCreateAccount}>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select
                                    name="role"
                                    className="form-input"
                                    value={createForm.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="user">User</option>
                                    <option value="submitter">Submitter</option>
                                    <option value="linguist">Linguist</option>
                                    <option value="translator">Translator</option>
                                    <option value="expert">Expert (Legacy)</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={createForm.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Jane Smith"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={createForm.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. jane@accujuris.com"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Temporary Password</label>
                                <input
                                    type="text"
                                    name="password"
                                    className="form-input"
                                    value={createForm.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    placeholder="Set initial password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '0.5rem' }}
                                disabled={createLoading}
                            >
                                {createLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>

                    <div className="card">
                        <h2 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={20} /> Accounts
                        </h2>

                        {usersLoading ? (
                            <p style={{ color: 'var(--text-secondary)' }}>Loading accounts...</p>
                        ) : users.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No accounts found.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Name</th>
                                            <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Email</th>
                                            <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Role</th>
                                            <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Approved</th>
                                            <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.65rem 0.5rem', minWidth: '160px' }}>
                                                    {editingId === user.id ? (
                                                        <input
                                                            className="form-input"
                                                            value={editForm.name}
                                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        />
                                                    ) : user.name}
                                                </td>
                                                <td style={{ padding: '0.65rem 0.5rem', minWidth: '220px' }}>
                                                    {editingId === user.id ? (
                                                        <input
                                                            className="form-input"
                                                            value={editForm.email}
                                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                        />
                                                    ) : user.email}
                                                </td>
                                                <td style={{ padding: '0.65rem 0.5rem', minWidth: '120px' }}>
                                                    {editingId === user.id ? (
                                                        <select
                                                            className="form-input"
                                                            value={editForm.role}
                                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="submitter">Submitter</option>
                                                            <option value="linguist">Linguist</option>
                                                            <option value="translator">Translator</option>
                                                            <option value="expert">Expert (Legacy)</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    ) : user.role}
                                                </td>
                                                <td style={{ padding: '0.65rem 0.5rem', minWidth: '120px' }}>
                                                    {editingId === user.id ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={editForm.is_approved}
                                                            onChange={(e) => setEditForm({ ...editForm, is_approved: e.target.checked })}
                                                        />
                                                    ) : (user.is_approved ? 'Yes' : 'No')}
                                                </td>
                                                <td style={{ padding: '0.65rem 0.5rem', minWidth: '280px' }}>
                                                    {editingId === user.id ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            <input
                                                                type="text"
                                                                className="form-input"
                                                                placeholder="New password (optional)"
                                                                value={editForm.password}
                                                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                                style={{ minWidth: '180px' }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={() => handleUpdateUser(user.id)}
                                                                disabled={savingId === user.id}
                                                            >
                                                                <Save size={14} /> {savingId === user.id ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                                                                <X size={14} /> Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <button type="button" className="btn btn-outline" onClick={() => startEdit(user)}>
                                                                <Pencil size={14} /> Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline"
                                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                                disabled={deletingId === user.id}
                                                                style={{ color: 'var(--error-color)', borderColor: '#fecaca' }}
                                                            >
                                                                <Trash2 size={14} /> {deletingId === user.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </>
    );
};

export default AdminDashboard;
