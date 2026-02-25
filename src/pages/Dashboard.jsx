import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, FileText, Plus, Search, Trash2, Upload } from 'lucide-react';

const PAGE_SIZE = 12;

const Dashboard = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadJob, setUploadJob] = useState(null);
    const [bulkJob, setBulkJob] = useState(null);
    const [translatedText, setTranslatedText] = useState('');
    const [translatedFile, setTranslatedFile] = useState(null);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        filename: '',
        verification_status: '',
        date_from: '',
        date_to: '',
        min_confidence: '',
        max_confidence: '',
    });

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

    const fetchDocuments = async (targetPage = page, targetFilters = filters) => {
        setLoading(true);
        try {
            const params = {
                page: targetPage,
                page_size: PAGE_SIZE,
            };
            if (targetFilters.filename.trim()) params.filename = targetFilters.filename.trim();
            if (targetFilters.verification_status) params.verification_status = targetFilters.verification_status;
            if (targetFilters.date_from) params.date_from = targetFilters.date_from;
            if (targetFilters.date_to) params.date_to = targetFilters.date_to;
            if (targetFilters.min_confidence !== '') params.min_confidence = Number(targetFilters.min_confidence);
            if (targetFilters.max_confidence !== '') params.max_confidence = Number(targetFilters.max_confidence);

            const response = await api.get('/api/documents', { params });
            setDocuments(response.data.items || []);
            setTotal(response.data.total || 0);
            setPage(response.data.page || targetPage);
        } catch (error) {
            console.error('Failed to fetch documents', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments(1, filters);
    }, []);

    const openSingleJobSocket = (jobId) => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const wsBase = api.defaults.baseURL.replace(/^http/, 'ws');
        const ws = new WebSocket(`${wsBase}/api/documents/jobs/${jobId}/ws?token=${encodeURIComponent(token)}`);

        ws.onmessage = async (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.error) return;
                setUploadJob(payload);
                if (payload.status === 'completed' || payload.status === 'failed') {
                    ws.close();
                    setUploading(false);
                    await fetchDocuments(page, filters);
                }
            } catch (e) {
                console.error('Failed to parse websocket payload', e);
            }
        };
        ws.onerror = () => {
            setUploading(false);
        };
    };

    const openBulkJobSocket = (bulkJobId) => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const wsBase = api.defaults.baseURL.replace(/^http/, 'ws');
        const ws = new WebSocket(`${wsBase}/api/documents/bulk-jobs/${bulkJobId}/ws?token=${encodeURIComponent(token)}`);

        ws.onmessage = async (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.error) return;
                setBulkJob(payload);
                if (payload.status === 'completed' || payload.status === 'partial_failed') {
                    ws.close();
                    await fetchDocuments(page, filters);
                }
            } catch (e) {
                console.error('Failed to parse bulk websocket payload', e);
            }
        };
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (user?.role === 'submitter' && !translatedText.trim() && !translatedFile) {
            alert('Submitter accounts must provide translated text or translated file.');
            e.target.value = '';
            return;
        }

        setUploading(true);
        setUploadJob(null);
        const formData = new FormData();
        formData.append('file', file);
        if (translatedText.trim()) formData.append('translated_text', translatedText.trim());
        if (translatedFile) formData.append('translated_file', translatedFile);
        formData.append('translation_model', 'nllb-600m');
        formData.append('source_lang', 'mal_Mlym');
        formData.append('target_lang', 'eng_Latn');

        try {
            const response = await api.post('/api/documents/upload-async', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadJob(response.data);
            openSingleJobSocket(response.data.job_id);
            setTranslatedText('');
            setTranslatedFile(null);
        } catch (error) {
            alert(error.response?.data?.detail || 'Upload failed');
            setUploading(false);
        } finally {
            e.target.value = '';
        }
    };

    const handleBulkUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('translation_model', 'nllb-600m');
        formData.append('source_lang', 'mal_Mlym');
        formData.append('target_lang', 'eng_Latn');

        try {
            const response = await api.post('/api/documents/upload-bulk-async', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setBulkJob(response.data);
            openBulkJobSocket(response.data.bulk_job_id);
        } catch (error) {
            alert(error.response?.data?.detail || 'Bulk upload failed');
        } finally {
            e.target.value = '';
        }
    };

    const handleDelete = async (doc) => {
        const ok = window.confirm(`Delete "${doc.original_filename}"?`);
        if (!ok) return;
        try {
            await api.delete(`/api/documents/${doc.id}`);
            await fetchDocuments(page, filters);
        } catch (error) {
            alert(error.response?.data?.detail || 'Delete failed');
        }
    };

    const applyFilters = async () => {
        await fetchDocuments(1, filters);
    };

    const formatConfidence = (score) => {
        const percent = score > 1 ? score : score * 100;
        return `${percent.toFixed(1)}%`;
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>My Documents</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            Manage uploads, search, and verification status.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} accept=".txt,.md,.csv,.pdf,.jpg,.jpeg,.png" />
                        <input type="file" id="bulk-upload" style={{ display: 'none' }} onChange={handleBulkUpload} accept=".txt,.md,.csv,.pdf,.jpg,.jpeg,.png" multiple />
                        <label htmlFor="file-upload" className="btn btn-primary" style={{ cursor: uploading ? 'wait' : 'pointer', display: 'inline-flex', gap: '0.5rem' }}>
                            {uploading ? 'Processing...' : <><Plus size={18} /> Upload</>}
                        </label>
                        <label htmlFor="bulk-upload" className="btn btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', gap: '0.5rem' }}>
                            <Upload size={18} /> Bulk Upload
                        </label>
                    </div>
                </div>

                {user?.role === 'submitter' && (
                    <div className="card" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0 }}>Submitter Translation</h3>
                            {(user?.free_submissions_left || 0) > 0 && (
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669', backgroundColor: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    {user.free_submissions_left} trial{user.free_submissions_left !== 1 ? 's' : ''} remaining
                                </span>
                            )}
                        </div>
                        <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                            <textarea
                                className="form-input"
                                rows="4"
                                value={translatedText}
                                onChange={(e) => setTranslatedText(e.target.value)}
                                placeholder="Paste translated text"
                            />
                        </div>
                        <input
                            type="file"
                            className="form-input"
                            accept=".txt,.md,.csv,.docx"
                            onChange={(e) => setTranslatedFile(e.target.files?.[0] || null)}
                        />
                    </div>
                )}

                {(uploadJob || bulkJob) && (
                    <div className="card" style={{ marginBottom: '1rem', display: 'grid', gap: '0.75rem' }}>
                        {uploadJob && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Single Upload</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>{uploadJob.status} ({Math.round(uploadJob.progress)}%)</span>
                                </div>
                                <div style={{ height: '10px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden', marginTop: '0.35rem' }}>
                                    <div style={{ height: '100%', width: `${Math.max(2, uploadJob.progress)}%`, backgroundColor: 'var(--primary-color)' }} />
                                </div>
                            </div>
                        )}
                        {bulkJob && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Bulk Upload</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>
                                        {bulkJob.status} ({Math.round(bulkJob.progress)}%) • {bulkJob.completed_files}/{bulkJob.total_files} done
                                    </span>
                                </div>
                                <div style={{ height: '10px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden', marginTop: '0.35rem' }}>
                                    <div style={{ height: '100%', width: `${Math.max(2, bulkJob.progress)}%`, backgroundColor: 'var(--primary-color)' }} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="card" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '0.5rem' }}>
                        <div style={{ position: 'relative', flex: '1 1 240px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.55rem', top: '0.65rem', color: 'var(--text-secondary)' }} />
                            <input
                                className="form-input"
                                style={{ paddingLeft: '2rem' }}
                                value={filters.filename}
                                onChange={(e) => setFilters({ ...filters, filename: e.target.value })}
                                placeholder="Search filename"
                            />
                        </div>
                        <select
                            className="form-input"
                            style={{ maxWidth: '220px' }}
                            value={filters.verification_status}
                            onChange={(e) => setFilters({ ...filters, verification_status: e.target.value })}
                        >
                            <option value="">All statuses</option>
                            <option value="processing">Processing</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending Verification</option>
                            <option value="verified">Verified</option>
                        </select>
                        <button className="btn btn-primary" onClick={applyFilters}>Apply</button>
                        <input
                            className="form-input"
                            type="date"
                            value={filters.date_from}
                            onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                        />
                        <input
                            className="form-input"
                            type="date"
                            value={filters.date_to}
                            onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                        />
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={filters.min_confidence}
                            onChange={(e) => setFilters({ ...filters, min_confidence: e.target.value })}
                            placeholder="Min confidence %"
                        />
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={filters.max_confidence}
                            onChange={(e) => setFilters({ ...filters, max_confidence: e.target.value })}
                            placeholder="Max confidence %"
                        />
                    </div>
                </div>

                {loading ? (
                    <div>Loading documents...</div>
                ) : documents.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ backgroundColor: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <FileText size={32} color="var(--text-secondary)" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No documents yet</h3>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {documents.map((doc) => (
                                <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '0.375rem', color: 'var(--primary-color)' }}>
                                            <FileText size={20} />
                                        </div>
                                        {doc.fully_verified ? (
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <CheckCircle size={12} /> Verified
                                            </span>
                                        ) : doc.processing_status === 'processing' ? (
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={12} /> Processing
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ca8a04', backgroundColor: '#fef9c3', padding: '0.25rem 0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={12} /> Pending Team Review
                                            </span>
                                        )}
                                    </div>
                                    <h3 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.original_filename}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Confidence</span>
                                        <strong>{formatConfidence(doc.confidence_score)}</strong>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/documents/${doc.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>Open</Link>
                                        <button className="btn btn-outline" onClick={() => handleDelete(doc)} style={{ color: 'var(--error-color)', borderColor: '#fecaca' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Page {page} of {totalPages} • {total} total</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-outline" disabled={page <= 1} onClick={() => fetchDocuments(page - 1, filters)}>Prev</button>
                                <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => fetchDocuments(page + 1, filters)}>Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Dashboard;
