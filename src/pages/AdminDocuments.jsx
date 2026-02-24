import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { FileText } from 'lucide-react';

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showArchived, setShowArchived] = useState(true);

    const loadDocuments = async (includeArchived) => {
        setLoading(true);
        try {
            const response = await api.get('/api/documents/admin/all', {
                params: { page: 1, page_size: 100, include_deleted: includeArchived },
            });
            setDocuments(response.data.items || []);
        } catch (error) {
            console.error('Failed to load documents', error);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments(showArchived);
    }, [showArchived]);

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={30} color="var(--primary-color)" />
                        Admin Documents
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        View all document records across the platform.
                    </p>
                </div>

                <div className="card" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <input
                            type="checkbox"
                            checked={showArchived}
                            onChange={(e) => setShowArchived(e.target.checked)}
                        />
                        Show archived
                    </label>
                </div>

                <div className="card">
                    <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Documents</h2>

                    {loading ? (
                        <p style={{ color: 'var(--text-secondary)' }}>Loading documents...</p>
                    ) : documents.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No documents found.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Filename</th>
                                        <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Owner</th>
                                        <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Assigned Linguist</th>
                                        <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Assigned Translator</th>
                                        <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Verifications</th>
                                        <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Status</th>
                                        <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Created</th>
                                        <th style={{ textAlign: 'left', padding: '0.65rem 0.5rem' }}>Archived At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.65rem 0.5rem', minWidth: '220px' }}>{doc.original_filename}</td>
                                            <td style={{ padding: '0.65rem 0.5rem', minWidth: '180px' }}>{doc.user_id}</td>
                                            <td style={{ padding: '0.65rem 0.5rem', minWidth: '180px' }}>{doc.assigned_linguist_name || doc.assigned_linguist_id || '-'}</td>
                                            <td style={{ padding: '0.65rem 0.5rem', minWidth: '180px' }}>{doc.assigned_translator_name || doc.assigned_translator_id || '-'}</td>
                                            <td style={{ padding: '0.65rem 0.5rem' }}>{doc.verification_count || 0}</td>
                                            <td style={{ padding: '0.65rem 0.5rem' }}>
                                                {doc.is_deleted ? (
                                                    <span style={{ color: 'var(--error-color)', fontWeight: 600 }}>Archived</span>
                                                ) : (
                                                    <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>Active</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '0.65rem 0.5rem', minWidth: '170px' }}>
                                                {doc.created_at ? new Date(doc.created_at).toLocaleString() : '-'}
                                            </td>
                                            <td style={{ padding: '0.65rem 0.5rem', minWidth: '170px' }}>
                                                {doc.deleted_at ? new Date(doc.deleted_at).toLocaleString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminDocuments;
