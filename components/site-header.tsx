"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type Course = {
  _id: string;
  title: string;
};

export function SiteHeader() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const [issueAdmitCard, setIssueAdmitCard] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCourses() {
      try {
        const res = await fetch("/api/course/fetch-all", {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await res.json();

        if (!controller.signal.aborted && data.success) {
          setCourses(data.data || []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load courses for nav", error);
        }
      }
    }

    void fetchCourses();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAdmitCardPermission() {
      try {
        const response = await fetch(
          "/api/scholarship/admit-card/status",
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch admit card status");
        }

        const data: { issueAdmitCard?: boolean } =
          await response.json();

        if (!controller.signal.aborted) {
          setIssueAdmitCard(data.issueAdmitCard === true);
        }
      } catch {
        if (!controller.signal.aborted) {
          setIssueAdmitCard(false);
        }
      }
    }

    void fetchAdmitCardPermission();
    window.addEventListener("focus", fetchAdmitCardPermission);

    return () => {
      controller.abort();
      window.removeEventListener(
        "focus",
        fetchAdmitCardPermission
      );
    };
  }, []);

  const navItems = [
    ...NAV.filter(
      (item) => item.href !== "/scholarship/admit-card"
    ),
    ...(issueAdmitCard
      ? [
          {
            label: "Admit Card",
            href: "/scholarship/admit-card",
          },
        ]
      : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    if (
      href === "/scholarship" &&
      pathname.startsWith("/scholarship/admit-card")
    ) {
      return false;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setCoursesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={SITE.name}
          onClick={closeMobileMenu}
        >
          <span className="relative size-11 overflow-hidden rounded-full ring-1 ring-border lg:size-12">
            <Image
              src={SITE.logo || "/placeholder.svg"}
              alt={`${SITE.name} logo`}
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </span>

          <span className="flex flex-col leading-none">
            <span className="font-heading text-base font-extrabold tracking-tight text-foreground lg:text-lg">
              ALIG FOUNDATION
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {SITE.tagline}
            </span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) =>
            item.href === "/courses" ? (
              <div
                key={item.href}
                className="group relative"
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-foreground",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}

                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                </Link>

                <div className="invisible absolute left-0 top-full z-50 w-56 translate-y-1 rounded-xl border border-border bg-popover p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <Link
                    href="/courses"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-popover-foreground transition-colors hover:bg-[#a8324c] hover:text-white"
                  >
                    All Courses
                  </Link>

                  {courses.length === 0 ? (
                    <span className="block px-3 py-2 text-sm text-muted-foreground">
                      No courses yet
                    </span>
                  ) : (
                    courses.map((course) => (
                      <Link
                        key={course._id}
                        href={`/courses/${course._id}`}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-popover-foreground transition-colors hover:bg-[#a8324c] hover:text-white"
                      >
                        {course.title}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive(item.href) ? "page" : undefined
                }
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:text-foreground",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>


        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-md text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>


      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-border bg-background lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
          >
            {navItems.map((item) =>
              item.href === "/courses" ? (
                <div key={item.href}>
                  <button
                    type="button"
                    onClick={() =>
                      setCoursesOpen((v) => !v)
                    }
                    aria-expanded={coursesOpen}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-base font-semibold text-foreground"
                  >
                    {item.label}

                    <ChevronDown
                      className={cn(
                        "size-5 transition-transform",
                        coursesOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {coursesOpen && (
                    <div className="ml-3 flex flex-col border-l border-border pl-3">
                      <Link
                        href="/courses"
                        onClick={closeMobileMenu}
                        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
                      >
                        All Courses
                      </Link>

                      {courses.length === 0 ? (
                        <span className="rounded-md px-3 py-2 text-sm text-muted-foreground">
                          No courses yet
                        </span>
                      ) : (
                        courses.map((course) => (
                          <Link
                            key={course._id}
                            href={`/courses/${course._id}`}
                            onClick={closeMobileMenu}
                            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground"
                          >
                            {course.title}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={
                    isActive(item.href) ? "page" : undefined
                  }
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-semibold transition-colors hover:bg-secondary",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}