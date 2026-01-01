import { Mail, Phone, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg mb-3 sm:mb-4">Treat Rush</h3>
            <p className="text-sm text-white/90">
              Pakistan's first flavored cotton candy brand. Fresh, organic, and delicious treats delivered to your door!
            </p>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <a href="#home" className="text-sm text-white/80 hover:text-white transition-colors">Home</a>
              <a href="#bundles" className="text-sm text-white/80 hover:text-white transition-colors">Bundles</a>
              <a href="#about" className="text-sm text-white/80 hover:text-white transition-colors">About</a>
              <a href="#events" className="text-sm text-white/80 hover:text-white transition-colors">Events</a>
              <a href="#contact" className="text-sm text-white/80 hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="font-semibold mb-3 sm:mb-4">Contact</h4>
            <div className="space-y-2">
              <a href="tel:+923196850846" className="flex items-center justify-center sm:justify-start gap-2 text-sm text-white/80 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                +92 319 6850846
              </a>
              <a href="mailto:treatrush5@gmail.com" className="flex items-center justify-center sm:justify-start gap-2 text-sm text-white/80 hover:text-white transition-colors break-all">
                <Mail className="w-4 h-4 flex-shrink-0" />
                treatrush5@gmail.com
              </a>
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="font-semibold mb-3 sm:mb-4">Follow Us</h4>
            <div className="flex gap-4 justify-center sm:justify-start">
              <a 
                href="https://www.facebook.com/profile.php?id=61581459630963" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/treat.rush/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@treat.rush" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-white/80 space-y-2">
          <p>&copy; {new Date().getFullYear()} Treat Rush. All rights reserved.</p>
          <p>
            Managed by{" "}
            <a 
              href="https://www.trizentic.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:underline font-medium"
            >
              https://www.trizentic.com/
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
