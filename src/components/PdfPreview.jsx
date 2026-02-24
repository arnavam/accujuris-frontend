import React, { useEffect, useRef, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const PdfPreview = ({ fileUrl }) => {
    const canvasRef = useRef(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        setPdfDoc(null);
        setNumPages(0);
        setPageNumber(1);

        const task = getDocument(fileUrl);
        task.promise
            .then((doc) => {
                if (cancelled) return;
                setPdfDoc(doc);
                setNumPages(doc.numPages || 0);
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err?.message || 'Failed to load PDF');
                setLoading(false);
            });

        return () => {
            cancelled = true;
            task.destroy();
        };
    }, [fileUrl]);

    useEffect(() => {
        let renderTask;
        const render = async () => {
            if (!pdfDoc || !canvasRef.current) return;
            try {
                const page = await pdfDoc.getPage(pageNumber);
                const viewport = page.getViewport({ scale });
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                canvas.width = Math.floor(viewport.width);
                canvas.height = Math.floor(viewport.height);
                renderTask = page.render({ canvasContext: context, viewport });
                await renderTask.promise;
            } catch (_) {
                // Render cancellation is expected on rapid page/zoom changes.
            }
        };
        render();
        return () => {
            if (renderTask) {
                renderTask.cancel();
            }
        };
    }, [pdfDoc, pageNumber, scale]);

    if (loading) {
        return <div style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Loading PDF...</div>;
    }

    if (error) {
        return <div style={{ padding: '0.75rem', color: 'var(--error-color)' }}>PDF preview error: {error}</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button
                    className="btn btn-outline"
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    disabled={pageNumber <= 1}
                >
                    Prev
                </button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Page {pageNumber} / {numPages}
                </span>
                <button
                    className="btn btn-outline"
                    onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                    disabled={pageNumber >= numPages}
                >
                    Next
                </button>
                <button className="btn btn-outline" onClick={() => setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(2)))}>
                    -
                </button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{Math.round(scale * 100)}%</span>
                <button className="btn btn-outline" onClick={() => setScale((s) => Math.min(2.5, +(s + 0.1).toFixed(2)))}>
                    +
                </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', overscrollBehavior: 'contain', backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.5rem' }}>
                <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }} />
            </div>
        </div>
    );
};

export default PdfPreview;
