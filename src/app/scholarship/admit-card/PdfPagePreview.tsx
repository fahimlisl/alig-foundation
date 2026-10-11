
"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfPagePreviewProps {
  url: string;
}

export default function PdfPagePreview({
  url,
}: PdfPagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;

    const updateWidth = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const width = Math.floor(
          container.getBoundingClientRect().width
        );

        setPageWidth(Math.max(0, width));
      });
    };

    updateWidth();

    // Automatically adapt to mobile,
    // desktop, orientation and window resizing
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-w-0 overflow-hidden bg-white"
      aria-label="Admit card document preview"
    >
      {pageWidth > 0 ? (
        <Document
          file={url}
          loading={
            <div className="flex aspect-[210/297] items-center justify-center bg-white text-sm text-muted-foreground">
              Loading admit card...
            </div>
          }
          error={
            <div
              role="alert"
              className="p-8 text-center text-sm text-destructive"
            >
              Unable to display the preview.
              Please use Download PDF instead.
            </div>
          }
        >
          <Page
            pageNumber={1}
            width={pageWidth}
            devicePixelRatio={
              Math.min(window.devicePixelRatio || 1, 2)
            }
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={
              <div className="aspect-[210/297] w-full animate-pulse bg-secondary" />
            }
          />
        </Document>
      ) : (
        <div className="aspect-[210/297] w-full bg-white" />
      )}
    </div>
  );
}
