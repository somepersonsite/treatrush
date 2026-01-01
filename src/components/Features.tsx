import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Leaf,
      title: "100% Organic",
      description: "Made with pure organic ingredients for a healthier treat"
    },
    {
      icon: ShieldCheck,
      title: "No Preservatives",
      description: "Fresh and natural with absolutely no artificial preservatives"
    },
    {
      icon: Sparkles,
      title: "Pakistan's First",
      description: "Pioneering flavored cotton candy in Pakistan"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick delivery to keep your cotton candy fresh"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-gradient-card border-primary/20 hover:shadow-glow hover:scale-110 hover:-translate-y-2 transition-all duration-500 group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
