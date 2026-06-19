import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'
import { SITE } from '@/lib/site'

const INFO = [
  { icon: MapPin, title: 'Visit Us', value: SITE.address },
  { icon: Phone, title: 'Call Us', value: SITE.phone, href: `tel:${SITE.phone}` },
  { icon: Mail, title: 'Email Us', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Clock, title: 'Office Hours', value: 'Mon – Sat, 9:00 AM – 7:00 PM' },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have a question about our courses or admissions? We'd love to hear from you."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground">
              Get in touch
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Reach out to us through any of the channels below or fill out the form and
              our team will respond as soon as possible.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {INFO.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-3 font-heading font-bold text-card-foreground">
                    {item.title}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
