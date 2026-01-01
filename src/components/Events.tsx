import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PartyPopper, Users, Building2, Cake } from "lucide-react";
import eventBanner from "@/assets/event-banner.jpeg";

const Events = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/923196850846", "_blank");
  };

  const eventTypes = [
    { icon: Cake, title: "Birthdays", description: "Make celebrations sweeter" },
    { icon: Users, title: "School Events", description: "Kids love our treats" },
    { icon: Building2, title: "Corporate", description: "Professional events" },
    { icon: PartyPopper, title: "Parties", description: "Any celebration" },
  ];

  const eventFeatures = [
    { emoji: "🎉", text: "Custom flavors and quantities available" },
    { emoji: "🎈", text: "Fast turnaround for event orders" },
    { emoji: "🍭", text: "100% organic and hygienic" },
  ];

  return (
    <section id="events" className="py-12 sm:py-20 bg-gradient-subtle overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
          {/* Top Section: Image Left, Text Right */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left: Event Banner Image */}
            <div className="flex-1 max-w-xs sm:max-w-sm lg:max-w-md animate-float">
              <img 
                src={eventBanner} 
                alt="Make Your Event Sweeter - Book Treat Rush" 
                className="w-full h-auto rounded-2xl shadow-elegant border-4 border-primary/20 hover:scale-105 transition-transform duration-500 hover:shadow-glow"
              />
            </div>

            {/* Right: Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 sm:px-4 py-2 rounded-full">
                <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">Special Orders</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Bulk Orders for Events
                </span>
              </h2>

              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Perfect for birthdays, school events, corporate functions, parties, and celebrations. Order cotton candy in bulk for your special day.
              </p>
            </div>
          </div>

          {/* Bottom Section: Features, Event Types, and CTA */}
          <div className="text-center space-y-6 sm:space-y-8">

          {/* Event Features */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {eventFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg bg-gradient-card px-4 py-2 rounded-full border border-primary/10">
                <span className="text-xl sm:text-2xl">{feature.emoji}</span>
                <span className="text-foreground font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Event Types Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {eventTypes.map((event, index) => (
              <Card
                key={index}
                className="p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-primary/20"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <event.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm sm:text-base">{event.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{event.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button
            size="lg"
            onClick={handleWhatsAppClick}
            className="shadow-glow group bg-gradient-primary hover:opacity-90 text-white border-0 text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Message on WhatsApp
          </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;