"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { isAdmitCardData, type AdmitCardData } from "@/src/lib/admit-card/types";

interface ApiError {
  message?: string;
}

function safeFilename(value: string) {
  const cleaned = value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50);
  return `ALIG-Admit-Card-${cleaned || "Student"}.pdf`;
}

async function findStudent(identifier: string): Promise<AdmitCardData> {
  const response = await fetch("/api/scholarship/admit-card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify({ identifier }),
  });
  const raw: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const failure: ApiError = raw && typeof raw === "object" ? raw as ApiError : {};
    throw new Error(failure.message || "Unable to find the admit card.");
  }
  if (!isAdmitCardData(raw)) throw new Error("The server returned incomplete admit card details.");
  return raw;
}

export default function AdmitCardClient() {
  const [identifier, setIdentifier] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState("ALIG-Admit-Card.pdf");
  const [studentName, setStudentName] = useState("");
  const urlRef = useRef<string | null>(null);

  function releasePdf() {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setPdfUrl(null);
    setStudentName("");
  }

  // Release any preview Blob URL when navigating away or closing this page.
  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    releasePdf();

    try {
      const data = await findStudent(identifier.trim());
      // Keep pdf-lib out of the initial page bundle. This executes ONLY in the browser.
      const { createAdmitCardPdf } = await import("@/src/lib/admit-card/create-pdf");
      const blob = await createAdmitCardPdf(data);
      const nextUrl = URL.createObjectURL(blob);
      urlRef.current = nextUrl;
      setPdfUrl(nextUrl);
      setFilename(safeFilename(data.rollNo));
      setStudentName(data.candidateName);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-7 flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2.5h9l4 4v15H6z" /><path d="M15 2.5v4.5h4M9 12h7M9 16h7" />
            </svg>
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-card-foreground">Get Your Admit Card</h2>
            <p className="mt-1 text-sm text-muted-foreground">Scholarship Entrance Examination</p>
          </div>
        </div>

        <form onSubmit={generate} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="lookup-identifier" className="block text-sm font-semibold text-card-foreground">
              Registered mobile number or email address
            </label>
            <input
              id="lookup-identifier"
              name="identifier"
              type="text"
              autoComplete="off"
              required
              maxLength={254}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="e.g. 9876543210 or name@example.com"
              aria-describedby="lookup-help"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
              disabled={busy}
            />
            <p id="lookup-help" className="text-xs leading-relaxed text-muted-foreground">
              Use exactly the mobile number or email address entered during scholarship registration.
            </p>
          </div>

          <button
            type="submit"
            disabled={busy || !identifier.trim()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <><span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> Generating admit card...</>
            ) : (
              <><svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M6 3h9l4 4v14H6zM15 3v5h4M12 11v6m-3-3 3 3 3-3" /></svg> Generate Admit Card</>
            )}
          </button>
        </form>

        {error && (
          <div role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-destructive">
            {error}
          </div>
        )}
        {pdfUrl && (
          <div role="status" className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-card-foreground">
            <strong>Admit card ready.</strong>
            <p className="mt-1">{studentName} - your PDF was generated on this device.</p>
            <a href={pdfUrl} download={filename} className="mt-3 inline-flex items-center rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90">
              Download PDF
            </a>
          </div>
        )}
        <div className="mt-7 border-t border-border pt-5">
          {/* <p className="text-xs leading-relaxed text-muted-foreground">
            Your admit card is created locally in this browser. No generated PDF is uploaded or stored on our server. If you download it, a copy is saved on your device.
          </p> */}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-bold text-card-foreground">Admit Card Preview</h3>
            <p className="mt-1 text-xs text-muted-foreground">Official A4 format · Print-ready PDF</p>
          </div>
          {pdfUrl && (
            <div className="flex flex-wrap gap-2">
              <a href={pdfUrl} download={filename} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">Download</a>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-card-foreground hover:bg-secondary">Open / Print</a>
            </div>
          )}
        </div>

        {pdfUrl ? (
          <iframe
            title="ALIG Foundation admit card PDF preview"
            src={pdfUrl}
            className="h-[620px] w-full rounded-lg border border-border bg-white sm:h-[740px]"
          />
        ) : (
          <div className="flex min-h-[430px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 p-6 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-card text-muted-foreground shadow-sm" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 2h9l4 4v16H6zM15 2v5h4M9 12h7M9 16h6M9 20h6" /></svg>
            </div>
            <p className="font-heading text-lg font-semibold text-card-foreground">Your admit card preview appears here</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Enter your registered mobile number or email address and select Generate Admit Card to create a new PDF.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
