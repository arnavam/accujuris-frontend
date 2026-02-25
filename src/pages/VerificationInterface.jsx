import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import {
    ArrowLeft, Save, Check, X, AlertTriangle,
    Users, MessageSquare, Pencil, Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { diff_match_patch as DiffMatchPatch } from 'diff-match-patch';

/* ── helpers ── */

const normalizeDisplayText = (text) => (typeof text === 'string'
    ? text.replace(/\uFEFF/g, '').normalize('NFC')
    : '');

const hasMalayalam = (text) => /[\u0d00-\u0d7f]/i.test(text || '');

const getDiffs = (oldText, newText) => {
    const dmp = new DiffMatchPatch();
    // Configure diff to operate on words for better redability
    dmp.Diff_Timeout = 1;

    // First line-level diff
    const diffs = dmp.diff_main(oldText || '', newText || '');
    dmp.diff_cleanupSemantic(diffs);
    return diffs;
};

/* ── component ── */

const VerificationInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Role-specific labels & colours
    const reviewerRole = user?.role === 'translator' ? 'translator' : 'linguist';
    const reviewerLabel = reviewerRole === 'translator' ? 'Translator' : 'Linguistic Expert';
    const backPath = reviewerRole === 'translator' ? '/translator/tasks' : '/linguist/tasks';
    const myColor = reviewerRole === 'translator' ? '#fed7aa' : '#bfdbfe';
    // const otherColor = reviewerRole === 'translator' ? '#bfdbfe' : '#fed7aa'; // Not strictly needed for unified diff

    // Form state
    const [isCorrect, setIsCorrect] = useState(false);
    const [corrections, setCorrections] = useState('');
    const [notes, setNotes] = useState('');
    const dirtyRef = useRef(false);

    // UI state
    const [activeTab, setActiveTab] = useState('edit');
    const [notesOpen, setNotesOpen] = useState(false);

    const scorePercent = (score) => (score > 1 ? score : score * 100);
    const ocrDisplayText = useMemo(() => normalizeDisplayText(task?.ocr_text), [task?.ocr_text]);
    const ocrHasMalayalam = useMemo(() => hasMalayalam(ocrDisplayText), [ocrDisplayText]);



    /* ── data fetching ── */

    useEffect(() => {
        let active = true;
        const loadTask = async (isInitial = false) => {
            try {
                const response = await api.get(`/api/gig/task/${id}`);
                const payload = response.data;
                if (!active) return;
                setTask(payload);
                if (isInitial) {
                    setCorrections(payload.my_submission?.corrections || payload.translated_text || '');
                    setIsCorrect(Boolean(payload.my_submission?.is_correct));
                    setNotes(payload.my_submission?.notes || '');
                    dirtyRef.current = false;
                } else if (!dirtyRef.current) {
                    setCorrections(payload.my_submission?.corrections || payload.translated_text || '');
                }
            } catch (error) {
                console.error('Failed to load task', error);
                if (isInitial) {
                    alert('Failed to load task or this document is assigned to another reviewer.');
                    navigate(backPath);
                }
            } finally {
                if (isInitial && active) setLoading(false);
            }
        };

        loadTask(true);
        const poll = setInterval(() => loadTask(false), 8000);
        return () => { active = false; clearInterval(poll); };
    }, [id, navigate, backPath]);

    /* ── collaborative highlighting ── */

    const baseTranslation = task?.base_translated_text || '';

    // We compute the diff between the base document and the current editor's corrections.
    const diffs = useMemo(() => {
        return getDiffs(baseTranslation, corrections);
    }, [baseTranslation, corrections]);

    const highlightedTokens = useMemo(() => {
        return diffs.map(([op, text], idx) => {
            // op:  -1 (deletion), 0 (equality), 1 (insertion)
            if (op === 0) {
                return <span key={`eq-${idx}`}>{text}</span>;
            } else if (op === 1) {
                return (
                    <span
                        key={`ins-${idx}`}
                        style={{
                            backgroundColor: myColor,
                            borderRadius: '3px',
                            padding: '0 2px',
                            fontWeight: 500
                        }}
                    >
                        {text}
                    </span>
                );
            } else {
                return (
                    <span
                        key={`del-${idx}`}
                        style={{
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            textDecoration: 'line-through',
                            borderRadius: '3px',
                            padding: '0 2px'
                        }}
                    >
                        {text}
                    </span>
                );
            }
        });
    }, [diffs, myColor]);

    /* ── submit ── */

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await api.post(`/api/gig/verify/${id}`, {
                is_correct: isCorrect,
                corrections: corrections || null,
                notes: notes || null,
            });
            alert('Review submitted successfully.');
            navigate(backPath);
        } catch (error) {
            console.error('Submission failed', error);
            alert(error.response?.data?.detail || 'Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ── render ── */

    if (loading) return <div className="container">Loading task...</div>;
    if (!task) return null;

    return (
        <>
            <Navbar />

            <div className="vi-page">
                {/* ─── Header ─── */}
                <div className="vi-header">
                    <div className="vi-header-left">
                        <Link to={backPath}><ArrowLeft size={18} /></Link>
                        <h1 className="vi-header-title">{reviewerLabel} Review — {task.original_filename}</h1>
                    </div>
                    <div className="vi-header-badges">
                        <span className="vi-badge vi-badge--confidence">
                            <AlertTriangle size={12} />
                            AI {scorePercent(task.confidence_score).toFixed(1)}%
                        </span>
                        <span className="vi-badge vi-badge--linguist">
                            <Users size={11} />
                            {task.assigned_linguist_name || 'Linguist'} {task.linguist_approved ? '✓' : '…'}
                        </span>
                        <span className="vi-badge vi-badge--translator">
                            <Users size={11} />
                            {task.assigned_translator_name || 'Translator'} {task.translator_approved ? '✓' : '…'}
                        </span>
                    </div>
                </div>

                {/* ─── Two-column body ─── */}
                <div className="vi-body">
                    {/* Left: OCR source */}
                    <div className="vi-panel">
                        <div className="vi-panel-header">
                            <Eye size={15} /> OCR Source Text
                        </div>
                        <div className={`vi-panel-body ${ocrHasMalayalam ? 'malayalam-text' : ''}`}>
                            {ocrDisplayText || <span style={{ color: 'var(--text-secondary)' }}>OCR text not available.</span>}
                        </div>
                    </div>

                    {/* Right: Tabbed editor / preview */}
                    <div className="vi-panel">
                        {/* Tab bar */}
                        <div className="vi-tabs">
                            <button
                                className={`vi-tab ${activeTab === 'edit' ? 'vi-tab--active' : ''}`}
                                onClick={() => setActiveTab('edit')}
                            >
                                <Pencil size={14} /> Edit Translation
                            </button>
                            <button
                                className={`vi-tab ${activeTab === 'preview' ? 'vi-tab--active' : ''}`}
                                onClick={() => setActiveTab('preview')}
                            >
                                <Eye size={14} /> Highlight Preview
                            </button>
                        </div>

                        {/* ── Edit tab ── */}
                        {activeTab === 'edit' && (
                            <>
                                {/* Toolbar */}
                                <div className="vi-toolbar">
                                    <div className="vi-toolbar-spacer" />
                                    <button
                                        className={`vi-toolbar-btn ${notesOpen ? 'vi-toolbar-btn--active' : ''}`}
                                        type="button"
                                        onClick={() => setNotesOpen((o) => !o)}
                                    >
                                        <MessageSquare size={13} /> Notes
                                    </button>
                                </div>

                                {/* Editable textarea */}
                                <div className="vi-editor">
                                    <textarea
                                        value={corrections}
                                        onChange={(e) => {
                                            setCorrections(e.target.value);
                                            dirtyRef.current = true;
                                        }}
                                        placeholder="Type your corrected translation here…"
                                    />
                                </div>

                                {/* Collapsible notes */}
                                <div className={`vi-notes ${notesOpen ? 'vi-notes--expanded' : 'vi-notes--collapsed'}`}>
                                    <textarea
                                        rows="3"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add optional notes for the end user or collaborator..."
                                    />

                                    {/* Collaborator Notes Display */}
                                    {task.existing_reviews && task.existing_reviews.filter(r => r.reviewer_role !== reviewerRole && r.notes).length > 0 && (
                                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <MessageSquare size={14} /> Collaborator Notes
                                            </h4>
                                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                                {task.existing_reviews.filter(r => r.reviewer_role !== reviewerRole && r.notes).map((review, idx) => (
                                                    <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600 }}>
                                                            {review.reviewer_name} ({review.reviewer_role === 'linguist' ? 'Linguistic Expert' : 'Translator'})
                                                        </div>
                                                        <div style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', color: 'var(--text-color)' }}>
                                                            {review.notes}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ── Preview tab ── */}
                        {activeTab === 'preview' && (
                            <div className="vi-preview">
                                <div className="vi-preview-legend">
                                    <span>
                                        <span className="vi-preview-legend-dot" style={{ backgroundColor: myColor }} />
                                        Added Text
                                    </span>
                                    <span>
                                        <span className="vi-preview-legend-dot" style={{ backgroundColor: '#fee2e2' }} />
                                        Deleted Text
                                    </span>
                                </div>
                                <div className="vi-preview-text" style={{ whiteSpace: 'pre-wrap' }}>
                                    {highlightedTokens}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Sticky footer ─── */}
                <div className="vi-footer">
                    <div className="vi-approve-group">
                        <button
                            className={`vi-approve-btn ${isCorrect ? 'vi-approve-btn--yes' : ''}`}
                            onClick={() => setIsCorrect(true)}
                        >
                            <Check size={14} /> Approve
                        </button>
                        <button
                            className={`vi-approve-btn ${!isCorrect ? 'vi-approve-btn--no' : ''}`}
                            onClick={() => setIsCorrect(false)}
                        >
                            <X size={14} /> Changes Needed
                        </button>
                    </div>
                    <div className="vi-footer-spacer" />
                    <button
                        className="vi-submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        <Save size={16} />
                        {submitting ? 'Submitting…' : `Submit ${reviewerLabel} Review`}
                    </button>
                </div>
            </div>
        </>
    );
};

export default VerificationInterface;
