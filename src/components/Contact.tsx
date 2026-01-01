import { Card } from "@/components/ui/card";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 hover:shadow-elegant transition-all duration-300 bg-card/50 backdrop-blur-sm border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <a
                  href="mailto:treatrush5@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  treatrush5@gmail.com
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-elegant transition-all duration-300 bg-card/50 backdrop-blur-sm border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <a
                  href="tel:+923196850846"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +92 319 6850846
                </a>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h3 className="font-semibold text-xl mb-6">Follow Us</h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/treat.rush/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center hover:shadow-glow transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61581459630963"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center hover:shadow-glow transition-all duration-300 hover:scale-110"
            >
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.tiktok.com/@treat.rush"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center hover:shadow-glow transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
