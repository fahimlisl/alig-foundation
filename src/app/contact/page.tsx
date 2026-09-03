import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { ContactForm } from '@/components/contact-form'
import { SITE } from '@/lib/site'


const INFO = [
  { 
    icon: MapPin, 
    title: 'Visit Us', 
    value: SITE.address 
  },
  { 
    icon: Phone, 
    title: 'Call Us', 
    value: SITE.phone, 
    href: `tel:${SITE.phone}`,
    // For Gmail style: Use Gmail icon specifically
    iconStyle: 'traditional' 
  },
  { 
    icon: Mail, 
    title: 'Email Us', 
    value: SITE.email, 
    href: `mailto:${SITE.email}`,
    // For Gmail style: Use Gmail icon specifically
    iconStyle: 'gmail' 
  },
  { 
    icon: Clock, 
    title: 'Office Hours', 
    value: 'Mon – Sat, 9:00 AM – 7:00 PM' 
  },
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
                    {item.iconStyle === 'gmail' ? (
                      // Traditional Gmail icon - using a div with SVG or custom styling
                      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.649 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.076 3 1.5 3H2l10 7.25L22 3h.5c.425 0 .8.162 1.069.432.269.268.431.643.431 1.068z"/>
                      </svg>
                    ) : item.iconStyle === 'traditional' ? (
                      // Traditional phone icon
                      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    ) : (
                      <item.icon className="size-5" />
                    )}
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