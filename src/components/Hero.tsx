import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import happinessCup from "@/assets/happiness-cup.jpeg";

const Hero = () => {
  const scrollToBundles = () => {
    const element = document.getElementById("bundles");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-subtle overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-bounce-slow" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-bounce-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-primary/15 rounded-full blur-lg animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-secondary/15 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left: Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-gradient-primary/20 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-full shadow-soft border border-primary/20">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-wiggle flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent">Pakistan's First Flavored Cotton Candy</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent drop-shadow-sm">
                  Sweet Moments,
                </span>
                <br />
                <span className="text-foreground">Delivered Fresh 🍭</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Experience 100% organic cotton candy with no preservatives. Freshly spun, hygienic, and bursting with flavor. Pure happiness in every bite!
              </p>
            </div>

            {/* Right: Happiness in Every Cup Image */}
            <div className="flex-1 max-w-xs sm:max-w-sm lg:max-w-md animate-float">
              <img 
                src={happinessCup} 
                alt="Happiness in Every Cup - Treat Rush Cotton Candy" 
                className="w-full h-auto rounded-2xl shadow-elegant border-4 border-primary/20 hover:scale-105 transition-transform duration-500 hover:shadow-glow"
              />
            </div>
          </div>

          {/* Buttons and Stats centered below */}
          <div className="text-center space-y-8 mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={scrollToBundles}
              className="shadow-glow group hover:shadow-glow"
            >
              Order Now 
              <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToBundles}
            >
              View Bundles 🛍️
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 pt-6 sm:pt-8">
            <div className="bg-gradient-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-soft border border-primary/10 hover:scale-105 transition-transform flex-1 min-w-[80px] max-w-[140px]">
              <div className="text-2xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">100%</div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Organic 🌱</div>
            </div>
            <div className="bg-gradient-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-soft border border-primary/10 hover:scale-105 transition-transform flex-1 min-w-[80px] max-w-[140px]">
              <div className="text-2xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">0</div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Preservatives ✨</div>
            </div>
            <div className="bg-gradient-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-soft border border-primary/10 hover:scale-105 transition-transform flex-1 min-w-[80px] max-w-[140px]">
              <div className="text-2xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">#1</div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">In Pakistan 🇵🇰</div>
          </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Hero;