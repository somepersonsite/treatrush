import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
const logo = "/treatrush.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Treat Rush" className="h-12 w-12 object-contain rounded-full" />
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Treat Rush
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("home")} className="text-foreground hover:text-primary transition-colors">
            Home
          </button>
          <button onClick={() => scrollToSection("bundles")} className="text-foreground hover:text-primary transition-colors">
            Bundles
          </button>
          <button onClick={() => scrollToSection("about")} className="text-foreground hover:text-primary transition-colors">
            About
          </button>
          <button onClick={() => scrollToSection("events")} className="text-foreground hover:text-primary transition-colors">
            Events
          </button>
          <button onClick={() => scrollToSection("contact")} className="text-foreground hover:text-primary transition-colors">
            Contact
          </button>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <button onClick={() => scrollToSection("home")} className="text-left text-foreground hover:text-primary transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection("bundles")} className="text-left text-foreground hover:text-primary transition-colors">
              Bundles
            </button>
            <button onClick={() => scrollToSection("about")} className="text-left text-foreground hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("events")} className="text-left text-foreground hover:text-primary transition-colors">
              Events
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-left text-foreground hover:text-primary transition-colors">
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
