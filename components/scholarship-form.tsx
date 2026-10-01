"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Upload, X } from "lucide-react";

type Course = { _id: string; title: string };

type FormState = {
  full_name: string;
  gurdianName: string;
  phone: string;
  email: string;
  address: string;
  course: string;
  gender: string;
  mode: "" | "online" | "offline";
};

const INITIAL_FORM: FormState = {
  full_name: "",
  gurdianName: "",
  phone: "",
  email: "",
  address: "",
  course: "",
  gender: "",
  mode: "",
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface ScholarshipFormProps {
  fee?: number;
  lastDate?: string | Date | null;
}

export function ScholarshipForm({ fee = 0, lastDate }: ScholarshipFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    roll_no: string;
    registration_no: string;
    test_centre: string;
  } | null>(null);

  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearWatchdog() {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }

  function stopSubmitting(errorMessage?: string) {
    clearWatchdog();
    setSubmitting(false);
    if (errorMessage) {
      setStatus({ type: "error", message: errorMessage });
    }
  }

  useEffect(() => {
    return () => {
      clearWatchdog();
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/course/fetch-all");
        const data = await res.json();
        if (data.success) setCourses(data.data || []);
      } catch (err) {
        console.error("failed to load courses", err);
      } finally {
        setCoursesLoading(false);
      }
    }
    fetchCourses();
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        avatar: "Image must be under 2 MB",
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({
        ...prev,
        avatar: "Only image files allowed",
      }));
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setFieldErrors((prev) => ({ ...prev, avatar: "" }));
  }

  function clearAvatar() {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatar(null);
    setAvatarPreview(null);
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.full_name.trim()) errors.full_name = "Required";
    if (!form.gurdianName.trim()) errors.gurdianName = "Required";
    if (!/^\d{10}$/.test(form.phone.trim()))
      errors.phone = "Enter a valid 10-digit number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errors.email = "Enter a valid email address";
    if (!form.address.trim()) errors.address = "Required";
    if (!form.course) errors.course = "Required";
    if (!form.gender) errors.gender = "Required";
    if (!form.mode) errors.mode = "Required";
    if (!avatar) errors.avatar = "Profile photo is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function submitRegistration(razorpayResponse?: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const fd = new FormData();
    fd.append("full_name", form.full_name);
    fd.append("gurdianName", form.gurdianName);
    fd.append("phone", form.phone);
    fd.append("email", form.email);
    fd.append("address", form.address);
    fd.append("course", form.course);
    fd.append("gender", form.gender);
    fd.append("mode", form.mode);
    if (avatar) fd.append("avatar", avatar);

    if (razorpayResponse) {
      fd.append("razorpay_order_id", razorpayResponse.razorpay_order_id);
      fd.append("razorpay_payment_id", razorpayResponse.razorpay_payment_id);
      fd.append("razorpay_signature", razorpayResponse.razorpay_signature);
    }

    const res = await fetch("/api/scholarship/register", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    return { ok: res.ok, data };
  }

  async function handleFreeFlow() {
    try {
      const { ok, data } = await submitRegistration();
      if (!ok || !data.success) {
        stopSubmitting(
          data.message || "Registration failed. Please try again."
        );
        return;
      }
      setSubmitting(false);
      setResult(data.data);
      setStatus({ type: "success", message: data.message });
      setForm(INITIAL_FORM);
      clearAvatar();
    } catch (err) {
      console.error("free registration failed", err);
      stopSubmitting("Something went wrong. Please try again.");
    }
  }

  async function handlePaidFlow() {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        stopSubmitting(
          "Could not load payment gateway. Check your connection."
        );
        return;
      }

      const orderRes = await fetch("/api/payments/create-order/scholarship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          gurdianName: form.gurdianName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          course: form.course,
          gender: form.gender,
          mode: form.mode,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        stopSubmitting(orderData.message || "Could not initiate payment.");
        return;
      }

      const order = orderData.order;

      watchdogRef.current = setTimeout(() => {
        stopSubmitting("Payment window did not open. Please try again.");
      }, 8000);

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Alig Foundation",
        description: "Scholarship Test Registration",
        order_id: order.id,
        prefill: {
          name: form.full_name,
          contact: form.phone,
          email: form.email,
        },
        theme: { color: "#0f172a" },
        handler: async (response: any) => {
          clearWatchdog();
          try {
            const { ok, data } = await submitRegistration({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (ok && data.success) {
              setSubmitting(false);
              setResult(data.data);
              setStatus({ type: "success", message: data.message });
              setForm(INITIAL_FORM);
              clearAvatar();
            } else {
              stopSubmitting(
                `${data.message} Your payment succeeded — contact support with ref: ${response.razorpay_payment_id}`
              );
            }
          } catch (err) {
            console.error("registration after payment failed", err);
            stopSubmitting(
              `Payment succeeded but registration failed. Contact support with ref: ${response.razorpay_payment_id}`
            );
          }
        },
        modal: {
          ondismiss: () => stopSubmitting("Payment was cancelled."),
        },
      });

      razorpay.on("payment.failed", (resp: any) => {
        stopSubmitting(resp?.error?.description || "Payment failed. Try again.");
      });

      razorpay.open();
      clearWatchdog();
    } catch (err) {
      console.error("paid flow failed", err);
      stopSubmitting("Something went wrong. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setResult(null);

    if (!validate()) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before continuing.",
      });
      return;
    }

    setSubmitting(true);
    if (fee > 0) {
      await handlePaidFlow();
    } else {
      await handleFreeFlow();
    }
  }

  if (result) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-emerald-300 bg-emerald-50 p-10 text-center">
        <div>
          <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
          <p className="mt-3 font-heading text-lg font-bold text-emerald-800">
            Registration Successful!
          </p>
          <div className="mt-4 space-y-1 text-sm text-emerald-800">
            <p>
              <span className="font-semibold">Roll No:</span> {result.roll_no}
            </p>
            <p>
              <span className="font-semibold">Registration No:</span>{" "}
              {result.registration_no}
            </p>
            <p>
              <span className="font-semibold">Test Centre:</span>{" "}
              {result.test_centre}
            </p>
          </div>
          <p className="mt-4 text-xs text-emerald-700">
            Save these details. We&apos;ll contact you soon.
          </p>
          <button
            onClick={() => {
              setResult(null);
              setStatus(null);
            }}
            className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  const feeLabel = fee > 0 ? `₹${fee}` : "Free";
  const buttonLabel =
    fee > 0 ? `Pay ₹${fee} & Register` : "Register for Scholarship";

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h3 className="font-heading text-xl font-bold text-card-foreground">
        Scholarship Test Registration
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {fee > 0
          ? `${feeLabel} registration fee applies.`
          : "Free registration."}{" "}
        Fill in your details to reserve a seat.
      </p>

      {(fee !== undefined || lastDate) && (
        <div className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">
              Registration Fee:
            </span>{" "}
            {feeLabel}
          </p>
          {lastDate && (
            <p className="mt-1">
              <span className="font-semibold text-foreground">
                Last Date:
              </span>{" "}
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(lastDate))}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Profile Photo" error={fieldErrors.avatar}>
          <div className="flex items-center gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <Upload className="size-5" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                <Upload className="size-4" />
                {avatar ? "Change photo" : "Choose photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              {avatar && (
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="ml-2 inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                >
                  <X className="size-3" />
                  Remove
                </button>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                JPG or PNG, up to 2 MB.
              </p>
            </div>
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" error={fieldErrors.full_name}>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              className={inputClass(!!fieldErrors.full_name)}
              placeholder="Full name"
            />
          </Field>
          <Field label="Guardian Name" error={fieldErrors.gurdianName}>
            <input
              type="text"
              value={form.gurdianName}
              onChange={(e) => updateField("gurdianName", e.target.value)}
              className={inputClass(!!fieldErrors.gurdianName)}
              placeholder="Parent / guardian name"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone Number" error={fieldErrors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                updateField("phone", e.target.value.replace(/\D/g, ""))
              }
              className={inputClass(!!fieldErrors.phone)}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
          </Field>
          <Field label="Email Address" error={fieldErrors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass(!!fieldErrors.email)}
              placeholder="Email address"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gender" error={fieldErrors.gender}>
            <select
              value={form.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className={inputClass(!!fieldErrors.gender)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer Not to Say">Prefer not to say</option>
            </select>
          </Field>
          <Field label="Test Mode" error={fieldErrors.mode}>
            <select
              value={form.mode}
              onChange={(e) =>
                updateField("mode", e.target.value as FormState["mode"])
              }
              className={inputClass(!!fieldErrors.mode)}
            >
              <option value="">Select mode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </Field>
        </div>

        <Field label="Course" error={fieldErrors.course}>
          <select
            value={form.course}
            onChange={(e) => updateField("course", e.target.value)}
            className={inputClass(!!fieldErrors.course)}
            disabled={coursesLoading}
          >
            <option value="">
              {coursesLoading ? "Loading courses…" : "Select a course"}
            </option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Address" error={fieldErrors.address}>
          <textarea
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            className={
              inputClass(!!fieldErrors.address) + " min-h-[80px] resize-none"
            }
            placeholder="House no, street, locality, city"
          />
        </Field>

        <div className="flex items-start gap-2 rounded-xl border border-amber-600/30 bg-amber-600/10 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Important:</strong> Don&apos;t close this browser or press
            back after paying. Wait for the confirmation and your Roll Number
            on screen.
          </span>
        </div>

        {status && (
          <div
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
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-heading text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing…
            </>
          ) : (
            buttonLabel
          )}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40 ${
    hasError ? "border-destructive" : "border-border"
  }`;
}