import { ContactForm } from "./components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We'd love to hear from you. Whether you have a question about our
            products, your order, or just want to say hello, our team is ready
            to assist you.
          </p>
        </section>

        <section className="mt-16 md:mt-24 grid md:grid-cols-2 gap-12">
          <div className="bg-card p-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-headline mb-6">Send us a Message</h2>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-headline mb-6">Contact Information</h2>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email</h3>
                <p className="text-muted-foreground">
                  Send us an email for any inquiry.
                </p>
                <a
                  href="mailto:support@glowandflourish.com"
                  className="text-primary hover:underline"
                >
                  support@glowandflourish.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Phone</h3>
                <p className="text-muted-foreground">
                  Our team is available Mon-Fri, 9am-5pm EST.
                </p>
                <a href="tel:+1234567890" className="text-primary hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="bg-primary/10 text-primary p-3 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Our Office</h3>
                <p className="text-muted-foreground">
                  123 Beauty Lane,
                  <br />
                  Los Angeles, CA 90210
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
