import { ShoppingCart, Package, Truck, Sparkles } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Choose Your Bundle",
      description: "Pick from our variety of cotton candy bundles"
    },
    {
      icon: Package,
      title: "Select Size",
      description: "Choose between Medium (14 oz) or Large (16 oz)"
    },
    {
      icon: Truck,
      title: "Place Your Order",
      description: "Quick and easy checkout process"
    },
    {
      icon: Sparkles,
      title: "Enjoy Fresh Cotton Candy",
      description: "We deliver freshly spun cotton candy to your door"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          How It Works
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Get your favorite cotton candy delivered fresh in just 4 easy steps
        </p>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary to-primary/20" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
