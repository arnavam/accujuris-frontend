import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import PdfPreview from '../components/PdfPreview';
import { ArrowLeft, FileText, CheckCircle, Languages, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const normalizeDisplayText = (text) => (typeof text === 'string'
    ? text.replace(/\uFEFF/g, '').normalize('NFC')
    : '');

const hasMalayalam = (text) => /[\u0d00-\u0d7f]/i.test(text || '');

const DocumentView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [document, setDocument] = useState(null);
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(true);
    const [paying, setPaying] = useState(false);

    const fetchDocument = async () => {
        try {
            const response = await api.get(`/api/documents/${id}`);
            setDocument(response.data);
            const versionsResponse = await api.get(`/api/documents/${id}/versions`);
            setVersions(versionsResponse.data || []);
        } catch (err) {
            setError('Failed to load document');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const originalDisplayText = useMemo(
        () => normalizeDisplayText(document?.original_text),
        [document?.original_text],
    );
    const originalHasMalayalam = useMemo(
        () => hasMalayalam(originalDisplayText),
        [originalDisplayText],
    );

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container">{error}</div>;
    if (!document) return <div className="container">Document not found</div>;

    const lowerName = (document.original_filename || '').toLowerCase();
    const isPdf = lowerName.endsWith('.pdf');
    const isImage = lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg');
    const canPreview = isPdf || isImage;
    const canToggleText = isImage;
    const fileToken = localStorage.getItem('access_token');
    const filePreviewUrl = `${api.defaults.baseURL}/api/documents/${id}/file${fileToken ? `?token=${encodeURIComponent(fileToken)}` : ''}`;
    const scorePercent = (score) => (score > 1 ? score : score * 100);
    const isSubmitterLocked = user?.role === 'submitter' && document.payment_required && !document.submitter_paid;
    const canPayUnlock = Boolean((document.linguist_comment || '').trim());




    const markUnlockPaid = async (paymentId) => {
        await api.post(`/api/documents/${id}/unlock`, {
            provider: 'razorpay_demo',
            payment_id: paymentId || null,
        });
        await fetchDocument();
    };

    const handleDemoPayment = async () => {
        setPaying(true);
        try {
            const ok = window.confirm(
                'Demo Payment: ₹99 for unlocking the full translated document.\n\nClick OK to simulate a successful payment.'
            );
            if (ok) {
                await markUnlockPaid(`demo_${Date.now()}`);
                alert('Demo payment successful! Full document unlocked.');
            }
        } catch (err) {
            console.error('Payment failed', err);
            alert('Payment failed. Please try again.');
        } finally {
            setPaying(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ paddingBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>{document.original_filename}</h1>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <span>AI Confidence:</span>
                                <span style={{ fontWeight: 600, color: scorePercent(document.confidence_score) > 80 ? 'var(--success-color)' : 'var(--error-color)' }}>
                                    {scorePercent(document.confidence_score).toFixed(1)}%
                                </span>
                            </div>
                            {document.translation_accuracy != null && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span>Translation Accuracy:</span>
                                    <span style={{ fontWeight: 600, color: document.translation_accuracy > 90 ? 'var(--success-color)' : document.translation_accuracy > 70 ? '#f59e0b' : 'var(--error-color)' }}>
                                        {document.translation_accuracy.toFixed(1)}%
                                    </span>
                                </div>
                            )}
                            {document.fully_verified && (
                                <span className="btn" style={{ backgroundColor: '#ecfdf5', color: '#059669', cursor: 'default' }}>
                                    <CheckCircle size={16} style={{ marginRight: '0.5rem' }} /> Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: 'calc(100vh - 220px)', overflow: 'hidden' }}>
                    {/* Left Pane: Original */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} />
                            <h3 style={{ margin: 0 }}>Original Content</h3>
                        </div>
                        {canToggleText && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <button className={`btn ${showPreview ? 'btn-primary' : 'btn-outline'}`} onClick={() => setShowPreview(true)}>Preview</button>
                                <button className={`btn ${!showPreview ? 'btn-primary' : 'btn-outline'}`} onClick={() => setShowPreview(false)}>Extracted Text</button>
                            </div>
                        )}
                        {isPdf && (
                            <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                PDF is rendered directly in preview.
                            </div>
                        )}
                        {canPreview && showPreview ? (
                            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: '0.5rem', overscrollBehavior: 'contain' }}>
                                {isPdf ? (
                                    <PdfPreview fileUrl={filePreviewUrl} />
                                ) : (
                                    <img src={filePreviewUrl} alt="document-preview" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f8fafc' }} />
                                )}
                            </div>
                        ) : (
                            <div
                                className={originalHasMalayalam ? 'malayalam-text' : ''}
                                style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: originalHasMalayalam ? 1.9 : 1.6, color: '#334155' }}
                            >
                                {originalDisplayText}
                            </div>
                        )}
                    </div>

                    {/* Right Pane: Processed */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ borderBottom: '2px solid var(--primary-color)', padding: '0.5rem 0', color: 'var(--primary-color)', fontWeight: 500 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Languages size={18} /> Translated (English)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: 1.6 }}>
                            {isSubmitterLocked ? (
                                <div style={{ display: 'grid', gap: '0.9rem' }}>
                                    <div className="card" style={{ backgroundColor: '#fff7ed', borderColor: '#fed7aa' }}>
                                        <div style={{ fontWeight: 600, color: '#9a3412', marginBottom: '0.4rem' }}>
                                            Linguist Feedback
                                        </div>
                                        <div style={{ color: '#7c2d12', fontSize: '0.92rem' }}>
                                            Accuracy: <strong>{document.translation_accuracy != null ? `${document.translation_accuracy.toFixed(1)}%` : 'Pending review'}</strong>
                                        </div>
                                        <div style={{ color: '#7c2d12', fontSize: '0.92rem', marginTop: '0.35rem' }}>
                                            Linguist Verdict: <strong>{document.linguist_verdict ? 'Looks accurate' : 'Needs correction / pending'}</strong>
                                        </div>
                                        <div style={{ marginTop: '0.55rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#7c2d12' }}>
                                            {document.linguist_comment || 'Linguist comments are not available yet.'}
                                        </div>
                                    </div>

                                    <div className="card" style={{ border: '1px dashed var(--border-color)' }}>
                                        <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>
                                            Unlock Full Document
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.92rem' }}>
                                            {canPayUnlock
                                                ? 'Complete demo payment to access the full translated document.'
                                                : 'Payment unlock will be enabled after linguist comments are submitted.'}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleDemoPayment}
                                            disabled={paying || !canPayUnlock}
                                        >
                                            {paying ? 'Processing...' : 'Pay ₹99 (Demo)'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Linguist feedback for trial/unlocked users */}
                                    {user?.role === 'submitter' && (
                                        <div className="card" style={{
                                            backgroundColor: document.linguist_comment ? '#f0fdf4' : '#f8fafc',
                                            borderColor: document.linguist_comment ? '#bbf7d0' : 'var(--border-color)',
                                            marginBottom: '1rem',
                                            whiteSpace: 'normal',
                                        }}>
                                            <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: document.linguist_comment ? '#166534' : 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                Linguist Review
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <span style={{ color: 'var(--text-secondary)' }}>Accuracy: </span>
                                                    <strong style={{ color: document.translation_accuracy > 90 ? 'var(--success-color)' : document.translation_accuracy > 70 ? '#f59e0b' : 'var(--error-color)' }}>
                                                        {document.translation_accuracy != null ? `${document.translation_accuracy.toFixed(1)}%` : 'Pending'}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span style={{ color: 'var(--text-secondary)' }}>Verdict: </span>
                                                    <strong style={{ color: document.linguist_approved ? 'var(--success-color)' : '#f59e0b' }}>
                                                        {document.linguist_approved ? '✓ Approved' : document.linguist_verdict === false ? 'Needs correction' : 'Pending'}
                                                    </strong>
                                                </div>
                                            </div>
                                            {document.linguist_comment && (
                                                <div style={{ fontSize: '0.88rem', color: '#334155', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                                                    <strong>Expert Comments:</strong> {document.linguist_comment}
                                                </div>
                                            )}
                                            {!document.linguist_comment && (
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                                    Linguist review is pending. You will see feedback here once reviewed.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {document.translated_text || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Translation pending...</span>}
                                </>
                            )}
                        </div>

                        {/* Version history removed as per user request */}

                        {scorePercent(document.confidence_score) < 60 && !document.fully_verified && (
                            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.375rem', color: '#c2410c', fontSize: '0.875rem', display: 'flex', gap: '0.5rem' }}>
                                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>
                                    Low confidence translation. This document is pending linguist and translator approvals.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentView;
