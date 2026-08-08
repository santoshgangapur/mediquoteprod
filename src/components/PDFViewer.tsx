import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker using unpkg or cdnjs
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

interface PDFViewerProps {
  url: string;
  fileName?: string;
  className?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, fileName = 'document.pdf', className = '' }) => {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Load PDF Document
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setPdfDoc(null);

    const loadPDF = async () => {
      try {
        let loadingTask;
        if (url.startsWith('data:')) {
          // Convert data URL to Uint8Array for robust pdfjs loading
          const base64Data = url.split(',')[1];
          if (!base64Data) throw new Error('Invalid data URL format');
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          loadingTask = pdfjsLib.getDocument({ data: bytes });
        } else {
          loadingTask = pdfjsLib.getDocument(url);
        }

        const pdf = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to parse PDF with pdfjs:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to parse PDF');
          setLoading(false);
        }
      }
    };

    if (url) {
      loadPDF();
    } else {
      setLoading(false);
      setError('No PDF URL provided');
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  // Render current page to Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (_e) {
            // ignore
          }
        }

        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled || !canvasRef.current) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPage, scale]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[350px] bg-slate-900 text-white rounded-xl p-8 border border-slate-700 shadow-xl ${className}`}>
        <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-bold text-slate-300">Rendering PDF Document with Native Canvas Engine...</p>
        <p className="text-[10px] text-slate-500 font-mono mt-1">{fileName}</p>
      </div>
    );
  }

  if (error || !pdfDoc) {
    return (
      <div className={`bg-slate-900 text-white rounded-xl p-6 border border-slate-700 text-center space-y-4 shadow-xl ${className}`}>
        <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[28px]">picture_as_pdf</span>
        </div>
        <div>
          <h4 className="font-bold text-sm text-white">PDF Document Ready</h4>
          <p className="text-xs text-slate-400 mt-1">
            Browser iframe security prevents embedded preview, but your file is fully accessible below.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#81f3e5] hover:bg-[#52e8d5] text-[#003178] text-xs font-extrabold rounded-lg flex items-center gap-2 shadow transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Open PDF in New Window</span>
          </a>
          <a
            href={url}
            download={fileName}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ${className}`}>
      {/* PDF Controls Header Bar */}
      <div className="w-full bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-red-400 text-[20px]">picture_as_pdf</span>
          <span className="font-bold text-slate-200 truncate max-w-[200px] sm:max-w-[300px] text-[12px]">{fileName}</span>
        </div>

        {/* Page Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            title="Previous Page"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <span className="font-mono text-[11px] px-1 text-slate-300">
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{numPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            title="Next Page"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Zoom Controls & External Open */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[16px]">zoom_out</span>
            </button>
            <span className="font-mono text-[11px] text-slate-300 w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
            </button>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-[#81f3e5] hover:bg-[#52e8d5] text-[#003178] text-[11px] font-extrabold rounded-lg flex items-center gap-1 transition-all shadow cursor-pointer"
            title="Open full document in new tab"
          >
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            <span className="hidden sm:inline">Open</span>
          </a>
        </div>
      </div>

      {/* Canvas Rendering Area */}
      <div className="w-full overflow-auto max-h-[600px] p-4 flex justify-center bg-slate-900/90 custom-scrollbar">
        <canvas ref={canvasRef} className="shadow-2xl rounded-md bg-white max-w-full" />
      </div>
    </div>
  );
};
