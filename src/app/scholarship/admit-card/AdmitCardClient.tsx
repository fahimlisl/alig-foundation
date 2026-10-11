"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  isAdmitCardData,
  type AdmitCardData,
} from "@/src/lib/admit-card/types";

const PdfPagePreview = dynamic(
  () => import("./PdfPagePreview"),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[210/297] w-full animate-pulse bg-white" />
    ),
  }
);

interface ApiError {
  message?: string;
}

function safeFilename(value: string) {
  const cleaned = value
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 50);
  return `ALIG-Admit-Card-${cleaned || "Student"}.pdf`;
}

async function findStudent(
  identifier: string
): Promise<AdmitCardData> {
  const response = await fetch(
    "/api/scholarship/admit-card",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ identifier }),
    }
  );
  const raw: unknown = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const failure: ApiError =
      raw && typeof raw === "object"
        ? (raw as ApiError)
        : {};

    throw new Error(
      failure.message || "Unable to find admit card."
    );
  }

  if (!isAdmitCardData(raw)) {
    throw new Error(
      "The server returned incomplete admit card details."
    );
  }

  return raw;
}

export default function AdmitCardClient() {
  const [identifier, setIdentifier] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [pdfUrl, setPdfUrl] = useState<string | null>(
    null
  );

  const [filename, setFilename] = useState(
    "ALIG-Admit-Card.pdf"
  );

  const [studentName, setStudentName] = useState("");

  const urlRef = useRef<string | null>(null);
  const mountedRef = useRef(false);
  const previewRef = useRef<HTMLElement>(null);

  function releasePdf() {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }

    setPdfUrl(null);
    setStudentName("");
  }

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, []);

  async function generate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (busy || !identifier.trim()) return;

    setBusy(true);
    setError("");
    releasePdf();

    try {
      const student = await findStudent(
        identifier.trim()
      );

      const { createAdmitCardPdf } = await import(
        "@/src/lib/admit-card/create-pdf"
      );
      const blob = await createAdmitCardPdf(student);

      const nextUrl = URL.createObjectURL(blob);

      if (!mountedRef.current) {
        URL.revokeObjectURL(nextUrl);
        return;
      }

      urlRef.current = nextUrl;

      setPdfUrl(nextUrl);
      setFilename(safeFilename(student.rollNo));
      setStudentName(student.candidateName);

      if (
        window.matchMedia("(max-width: 1023px)").matches
      ) {
        requestAnimationFrame(() => {
          previewRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    } catch (failure) {
      if (mountedRef.current) {
        setError(
          failure instanceof Error
            ? failure.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      if (mountedRef.current) {
        setBusy(false);
      }
    }
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,350px)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <section className="mx-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:mx-0 sm:p-7 lg:sticky lg:top-24">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M6 2.5h9l4 4v15H6z" />
              <path d="M15 2.5v4.5h4" />
              <path d="M9 12h7M9 16h7" />
            </svg>
          </div>

          <div className="min-w-0">
            <h2 className="font-heading text-xl font-bold text-card-foreground">
              Get Your Admit Card
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Scholarship Entrance Examination
            </p>
          </div>
        </div>

        <form onSubmit={generate} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="admit-identifier"
              className="block text-sm font-semibold text-card-foreground"
            >
              Mobile number or email
            </label>

            <input
              id="admit-identifier"
              type="text"
              name="identifier"
              autoComplete="off"
              placeholder="Phone number or email"
              value={identifier}
              onChange={(event) =>
                setIdentifier(event.target.value)
              }
              maxLength={254}
              required
              disabled={busy}
              aria-describedby="admit-help"
              className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />

            <p
              id="admit-help"
              className="text-xs leading-relaxed text-muted-foreground"
            >
              Enter the contact details used during your
              scholarship registration.
            </p>
          </div>

          <button
            type="submit"
            disabled={busy || !identifier.trim()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6 3h9l4 4v14H6z" />
                  <path d="M15 3v5h4" />
                  <path d="M12 11v6m-3-3 3 3 3-3" />
                </svg>
                Generate Admit Card
              </>
            )}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {pdfUrl && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m5 12 5 5L19 7" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-card-foreground">
                  Admit Card Ready
                </p>

                <p className="mt-1 break-words text-sm text-muted-foreground">
                  {studentName}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Your PDF has been generated successfully.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-5">
        </div>
      </section>

      <section
        ref={previewRef}
        className="min-w-0 overflow-hidden border-y border-border bg-card shadow-sm sm:rounded-2xl sm:border"
      >
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-heading text-lg font-bold text-card-foreground">
              Admit Card Preview
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Official A4 Document · Print Ready
            </p>
          </div>

          {pdfUrl && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <a
                href={pdfUrl}
                download={filename}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 sm:flex-none"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M12 3v12m-4-4 4 4 4-4" />
                  <path d="M5 17v4h14v-4" />
                </svg>
                Download PDF
              </a>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-semibold text-card-foreground transition hover:bg-secondary sm:flex-none"
              >
                Open / Print
              </a>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-[#e9ebef] p-0 sm:p-5 lg:p-7">
          {pdfUrl ? (
            <div className="mx-auto w-full max-w-[720px] overflow-hidden bg-white shadow-none sm:shadow-xl">
              <PdfPagePreview url={pdfUrl} />
            </div>
          ) : (
            <div className="mx-auto flex min-h-[240px] w-full max-w-[720px] flex-col items-center justify-center bg-white px-5 py-12 text-center sm:min-h-[570px] sm:rounded-lg">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <svg
                  viewBox="0 0 24 24"
                  className="size-9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden="true"
                >
                  <path d="M6 2h9l4 4v16H6z" />
                  <path d="M15 2v5h4" />
                  <path d="M9 12h7M9 16h6M9 20h6" />
                </svg>
              </div>

              <h3 className="font-heading text-lg font-semibold text-card-foreground">
                Your Admit Card Will Appear Here
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Enter your registered phone number or email
                and generate your admit card to preview it.
              </p>
            </div>
          )}
        </div>

        {pdfUrl && (
          <div className="border-t border-border px-4 py-4 text-center sm:px-6">
            <p className="text-xs text-muted-foreground">
              This preview is fitted to your screen.
              The downloaded PDF retains its original A4
              dimensions and print quality.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
