export function PageHero({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <section className="bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#312e81_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="font-heading text-3xl font-extrabold text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base font-medium text-primary-foreground/80 leading-relaxed text-white">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
