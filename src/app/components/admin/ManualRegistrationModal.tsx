'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, UserPlus, CheckCircle } from 'lucide-react'
import { adminFetch } from '@/src/lib/adminFetch'
import toast from 'react-hot-toast'

interface Course {
  _id: string
  title: string
  courseSymbol: string
}

interface ManualRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ManualRegistrationModal({ isOpen, onClose, onSuccess }: ManualRegistrationModalProps) {
  const [loading, setLoading] = useState(false)
  const [fetchingCourses, setFetchingCourses] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState({
    name: '',
    gurdianName: '',
    gurdianPhoneNumber: '',
    phoneNumber: '',
    email: '',
    gender: '',
    course: '',
    schoolBoardName: '',
    permanentAddress: '',
    state: '',
    district: '',
    pin: '',
  })

  useEffect(() => {
    if (isOpen) {
      fetchCourses()
    }
  }, [isOpen])

  const fetchCourses = async () => {
    setFetchingCourses(true)
    try {
      const res = await adminFetch('/api/course/fetch-all')
      const data = await res.json()
      if (data.success) {
        setCourses(data.data || [])
      } else {
        toast.error('Failed to load courses')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setFetchingCourses(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await adminFetch('/api/admin/manual-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(data.message)
        onSuccess()
        onClose()
        // Reset form
        setFormData({
          name: '',
          gurdianName: '',
          gurdianPhoneNumber: '',
          phoneNumber: '',
          email: '',
          gender: '',
          course: '',
          schoolBoardName: '',
          permanentAddress: '',
          state: '',
          district: '',
          pin: '',
        })
      } else {
        toast.error(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to register student')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="size-6 text-primary" />
            <div>
              <h2 className="font-heading text-xl font-bold text-card-foreground">
                Manual Student Registration
              </h2>
              <p className="text-sm text-muted-foreground">
                Register a student after payment is verified only.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-secondary"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Student Name */}
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Student Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                placeholder="Enter student name"
              />
            </div>

            {/* Guardian Name */}
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Guardian Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="gurdianName"
                value={formData.gurdianName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                placeholder="Enter guardian name"
              />
            </div>

            {/* Student Phone */}
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Student Phone <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                placeholder="Enter phone number"
              />
            </div>

            {/* Guardian Phone */}
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Guardian Phone <span className="text-destructive">*</span>
              </label>
              <input
                type="tel"
                name="gurdianPhoneNumber"
                value={formData.gurdianPhoneNumber}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                placeholder="Enter guardian phone"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                placeholder="Enter email address"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Gender <span className="text-destructive">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="text-sm font-medium text-card-foreground">
                Course <span className="text-destructive">*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                disabled={fetchingCourses}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">{fetchingCourses ? 'Loading...' : 'Select course'}</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* School Board */}
            <div>
              <label className="text-sm font-medium text-card-foreground">
                School Board <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="schoolBoardName"
                value={formData.schoolBoardName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                placeholder="Enter school board name"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t border-border pt-4">
            <p className="mb-3 text-sm font-medium text-card-foreground">Address Details</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-card-foreground">
                  Permanent Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                  placeholder="Enter permanent address"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground">
                  State <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground">
                  District <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                  placeholder="Enter district"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground">
                  PIN Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/40"
                  placeholder="Enter PIN code"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="size-4" />
                  Register Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}