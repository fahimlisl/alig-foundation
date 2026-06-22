"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Course = {
  _id: string;
  title: string;
};

type FormState = {
  name: string;
  gurdianName: string;
  phoneNumber: string;
  email: string;
  gurdianPhoneNumber: string;
  gender: string;
  course: string;
  schoolBoardName: string;
  permanentAddress: string;
  state: string;
  district: string;
  pin: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  gurdianName: "",
  phoneNumber: "",
  email: "",
  gurdianPhoneNumber: "",
  gender: "",
  course: "",
  schoolBoardName: "",
  permanentAddress: "",
  state: "",
  district: "",
  pin: "",
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

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [pinLookupStatus, setPinLookupStatus] = useState<
    "idle" | "loading" | "found" | "not-found"
  >("idle");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    return () => clearWatchdog();
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/course/fetch-all");
        const data = await res.json();
        if (data.success) {
          setCourses(data.data || []);
        }
      } catch (err) {
        console.error("failed to load courses", err);
      } finally {
        setCoursesLoading(false);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    const pin = form.pin.trim();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPinLookupStatus("idle");
      return;
    }

    let cancelled = false;
    setPinLookupStatus("loading");

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (cancelled) return;

        const result = data?.[0];
        if (result?.Status === "Success" && result.PostOffice?.length) {
          const office = result.PostOffice[0];
          setForm((prev) => ({
            ...prev,
            state: office.State || prev.state,
            district: office.District || prev.district,
          }));
          setPinLookupStatus("found");
        } else {
          setPinLookupStatus("not-found");
        }
      } catch (err) {
        console.error("pincode lookup failed", err);
        if (!cancelled) setPinLookupStatus("not-found");
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [form.pin]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) errors.name = "Required";
    if (!form.gurdianName.trim()) errors.gurdianName = "Required";
    if (!/^\d{10}$/.test(form.phoneNumber.trim()))
      errors.phoneNumber = "Enter a valid 10-digit number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errors.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(form.gurdianPhoneNumber.trim()))
      errors.gurdianPhoneNumber = "Enter a valid 10-digit number";
    if (!form.gender) errors.gender = "Required";
    if (!form.course) errors.course = "Required";
    if (!form.schoolBoardName.trim()) errors.schoolBoardName = "Required";
    if (!form.permanentAddress.trim()) errors.permanentAddress = "Required";
    if (!form.state.trim()) errors.state = "Required";
    if (!form.district.trim()) errors.district = "Required";
    if (!/^\d{6}$/.test(form.pin.trim()))
      errors.pin = "Enter a valid 6-digit pincode";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!validate()) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before continuing.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        stopSubmitting(
          "Could not load the payment gateway. Check your connection and try again.",
        );
        return;
      }

      const orderRes = await fetch("/api/payments/create-order/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: form.phoneNumber,
          email: form.email,
          course: form.course,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        stopSubmitting(
          orderData.message || "Could not initiate payment. Please try again.",
        );
        return;
      }

      const order = orderData.order;

      watchdogRef.current = setTimeout(() => {
        stopSubmitting(
          "The payment window did not open. Please check your connection and try again.",
        );
      }, 8000);

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Alig Foundation",
        description: "Registration Fee",
        order_id: order.id,
        prefill: {
          name: form.name,
          contact: form.phoneNumber,
          email: form.email,
        },
        theme: { color: "#0f172a" },
        handler: async (response: any) => {
          clearWatchdog();
          try {
            const registerRes = await fetch("/api/application/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...form,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const registerData = await registerRes.json();

            if (registerData.success) {
              setSubmitting(false);
              setStatus({ type: "success", message: registerData.message });
              setForm(INITIAL_FORM);
            } else {
              stopSubmitting(
                `${registerData.message} Your payment was successful — please contact support with this reference: ${response.razorpay_payment_id}`,
              );
            }
          } catch (err) {
            console.error("registration failed after payment", err);
            stopSubmitting(
              `Payment succeeded but registration failed. Please contact support with this reference: ${response.razorpay_payment_id}`,
            );
          }
        },
        modal: {
          ondismiss: () => {
            stopSubmitting("Payment was cancelled.");
          },
        },
      });

      razorpay.on("payment.failed", (resp: any) => {
        stopSubmitting(
          resp?.error?.description || "Payment failed. Please try again.",
        );
      });

      razorpay.open();
      clearWatchdog();
    } catch (err) {
      console.error("submission failed", err);
      stopSubmitting("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h3 className="font-heading text-xl font-bold text-card-foreground">
        Registration Form
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        ₹100 registration fee applies. Fill in your details to reserve a seat.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Student Name" error={fieldErrors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass(!!fieldErrors.name)}
              placeholder="Full name"
            />
          </Field>

          <Field label="Student Email" error={fieldErrors.email}>
            <input
              type="text"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass(!!fieldErrors.email)}
              placeholder="Email address"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Guardian Name" error={fieldErrors.gurdianName}>
            <input
              type="text"
              value={form.gurdianName}
              onChange={(e) => updateField("gurdianName", e.target.value)}
              className={inputClass(!!fieldErrors.gurdianName)}
              placeholder="Parent / guardian name"
            />
          </Field>

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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Student Phone Number" error={fieldErrors.phoneNumber}>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) =>
                updateField("phoneNumber", e.target.value.replace(/\D/g, ""))
              }
              className={inputClass(!!fieldErrors.phoneNumber)}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
          </Field>

          <Field
            label="Guardian Phone Number"
            error={fieldErrors.gurdianPhoneNumber}
          >
            <input
              type="tel"
              value={form.gurdianPhoneNumber}
              onChange={(e) =>
                updateField(
                  "gurdianPhoneNumber",
                  e.target.value.replace(/\D/g, ""),
                )
              }
              className={inputClass(!!fieldErrors.gurdianPhoneNumber)}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
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

        <Field
          label="School Board (Class 12th)"
          error={fieldErrors.schoolBoardName}
        >
          <input
            type="text"
            value={form.schoolBoardName}
            onChange={(e) => updateField("schoolBoardName", e.target.value)}
            className={inputClass(!!fieldErrors.schoolBoardName)}
            placeholder="e.g. CBSE, ICSE, State Board"
          />
        </Field>

        <Field label="Permanent Address" error={fieldErrors.permanentAddress}>
          <textarea
            value={form.permanentAddress}
            onChange={(e) => updateField("permanentAddress", e.target.value)}
            className={
              inputClass(!!fieldErrors.permanentAddress) +
              " min-h-[80px] resize-none"
            }
            placeholder="House no, street, locality"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Pincode" error={fieldErrors.pin}>
            <input
              type="text"
              value={form.pin}
              onChange={(e) =>
                updateField("pin", e.target.value.replace(/\D/g, ""))
              }
              className={inputClass(!!fieldErrors.pin)}
              placeholder="6-digit pincode"
              maxLength={6}
            />
            {pinLookupStatus === "loading" && (
              <p className="mt-1 text-xs text-muted-foreground">
                Looking up location…
              </p>
            )}
            {pinLookupStatus === "not-found" && (
              <p className="mt-1 text-xs text-muted-foreground">
                Couldn't auto-detect. Enter state/district manually.
              </p>
            )}
          </Field>

          <Field label="State" error={fieldErrors.state}>
            <input
              type="text"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className={inputClass(!!fieldErrors.state)}
              placeholder="Auto-filled from pincode"
            />
          </Field>

          <Field label="District" error={fieldErrors.district}>
            <input
              type="text"
              value={form.district}
              onChange={(e) => updateField("district", e.target.value)}
              className={inputClass(!!fieldErrors.district)}
              placeholder="Auto-filled from pincode"
            />
          </Field>
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
            "Pay ₹100 & Register"
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
