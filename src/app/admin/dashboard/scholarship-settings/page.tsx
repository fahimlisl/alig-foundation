"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
} from "lucide-react";
import { adminFetch } from "@/src/lib/adminFetch";

type Permission = {
  scholarshipOpen: boolean;
  scholarshipFee: number;
  scholarshipLastDate: string | null;
  issueAdmitCard: boolean;
};

type Status = {
  type: "success" | "error";
  message: string;
};

const DEFAULT_PERMISSION: Permission = {
  scholarshipOpen: true,
  scholarshipFee: 0,
  scholarshipLastDate: null,
  issueAdmitCard: false,
};

export default function ScholarshipSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [permission, setPermission] =
    useState<Permission>(DEFAULT_PERMISSION);

  const [status, setStatus] =
    useState<Status | null>(null);

  useEffect(() => {
    void fetchPermission();
  }, []);

  async function fetchPermission() {
    setLoading(true);
    setStatus(null);

    try {
      const res = await adminFetch(
        "/api/scholarship/permission/fetch",
        { cache: "no-store" }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load settings."
        );
      }

      setPermission({
        scholarshipOpen:
          data.data?.scholarshipOpen ?? true,

        scholarshipFee:
          data.data?.scholarshipFee ?? 0,

        scholarshipLastDate:
          data.data?.scholarshipLastDate ?? null,

        issueAdmitCard:
          data.data?.issueAdmitCard === true,
      });
    } catch (error) {
      console.error(
        "Failed to fetch scholarship permission",
        error
      );

      setStatus({
        type: "error",
        message:
          "Unable to load scholarship settings.",
      });
    } finally {
      setLoading(false);
    }
  }

  function updatePermission(
    key: keyof Permission,
    value: boolean | number | string | null
  ) {
    setPermission((previous) => ({
      ...previous,
      [key]: value,
    }));

    // Clear previous status when editing
    setStatus(null);
  }

  async function handleSave() {
    if (saving) return;

    if (
      !Number.isFinite(permission.scholarshipFee) ||
      permission.scholarshipFee < 0
    ) {
      setStatus({
        type: "error",
        message: "Enter a valid scholarship fee.",
      });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const res = await adminFetch(
        "/api/scholarship/permission",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scholarshipOpen:
              permission.scholarshipOpen,

            scholarshipFee:
              permission.scholarshipFee,

            scholarshipLastDate:
              permission.scholarshipLastDate,

            // New field
            issueAdmitCard:
              permission.issueAdmitCard,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save settings."
        );
      }

      setStatus({
        type: "success",
        message:
          "Scholarship settings updated successfully.",
      });
    } catch (error) {
      console.error(
        "Failed to save scholarship permission",
        error
      );

      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to save settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-sm">
          Loading scholarship settings...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="font-heading text-2xl font-bold text-card-foreground sm:text-3xl">
          Scholarship Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage scholarship registrations, fees,
          deadlines, and admit card availability.
        </p>
      </div>

      <div className="space-y-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">

        {/* SECTION 1: REGISTRATION */}

        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-card-foreground">
                Scholarship Registration
              </h2>

              <p className="text-xs text-muted-foreground">
                Control new scholarship applications
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/40 p-4">
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Scholarship Registrations
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {permission.scholarshipOpen
                  ? "Open — students can register"
                  : "Closed — registration form is hidden"}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-label="Scholarship registrations"
              aria-checked={permission.scholarshipOpen}
              disabled={saving}
              onClick={() =>
                updatePermission(
                  "scholarshipOpen",
                  !permission.scholarshipOpen
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 ${
                permission.scholarshipOpen
                  ? "bg-emerald-600"
                  : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
                  permission.scholarshipOpen
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label
              htmlFor="scholarship-fee"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Scholarship Fee (₹)
            </label>

            <input
              id="scholarship-fee"
              type="number"
              min={0}
              step="0.01"
              value={permission.scholarshipFee}
              disabled={saving}
              onChange={(event) =>
                updatePermission(
                  "scholarshipFee",
                  Number(event.target.value)
                )
              }
              placeholder="0"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Set to ₹0 for free registration.
              Payment is skipped when the fee is zero.
            </p>
          </div>

          <div>
            <label
              htmlFor="scholarship-last-date"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Last Date to Apply
            </label>
            <input
              id="scholarship-last-date"
              type="date"
              disabled={saving}
              value={
                permission.scholarshipLastDate
                  ? permission.scholarshipLastDate.slice(
                      0,
                      10
                    )
                  : ""
              }
              onChange={(event) =>
                updatePermission(
                  "scholarshipLastDate",
                  event.target.value
                    ? `${event.target.value}T00:00:00.000Z`
                    : null
                )
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
            />

            <p className="mt-1 text-xs text-muted-foreground">
              Leave empty to hide the application deadline.
            </p>
          </div>
        </section>

        <div className="border-t border-border" />

        {/* SECTION 2: ADMIT CARD */}

        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCheck2 className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-card-foreground">
                Admit Card Management
              </h2>

              <p className="text-xs text-muted-foreground">
                Control examination admit card availability
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/40 p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-foreground">
                Enable Admit Card Generation
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {permission.issueAdmitCard
                  ? "Enabled — students can access their admit cards"
                  : "Disabled — admit card generation is unavailable"}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-label="Admit card generation"
              aria-checked={permission.issueAdmitCard}
              disabled={saving}
              onClick={() =>
                updatePermission(
                  "issueAdmitCard",
                  !permission.issueAdmitCard
                )
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 ${
                permission.issueAdmitCard
                  ? "bg-emerald-600"
                  : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
                  permission.issueAdmitCard
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div
            className={`rounded-xl border p-4 ${
              permission.issueAdmitCard
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-border bg-secondary/30"
            }`}
          >
            <div className="flex items-start gap-3">
              {permission.issueAdmitCard ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              )}

              <div>
                <p className="text-sm font-semibold text-card-foreground">
                  {permission.issueAdmitCard
                    ? "Admit Cards Enabled"
                    : "Admit Cards Disabled"}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {permission.issueAdmitCard
                    ? "Once saved, students will be able to generate and download their admit cards."
                    : "Once saved, the Admit Card option will be hidden from the public navigation and generation will remain disabled."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATUS MESSAGE */}

        {status && (
          <div
            role="status"
            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-emerald-600/30 bg-emerald-600/10 text-emerald-700"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
            )}

            <span>{status.message}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
