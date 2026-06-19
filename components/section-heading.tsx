import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-heading text-2xl font-extrabold text-foreground text-balance sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
          {description}
        </p>
      )}
    </div>
  )
}
