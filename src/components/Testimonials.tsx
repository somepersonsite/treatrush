import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Huzaifa",
      review: "This is just more than cotton candy, and I'm addicted to it",
      rating: 5
    },
    {
      name: "Ahmed",
      review: "I hit my bench press PR after eating Treat Rush cotton candy",
      rating: 5
    },
    {
      name: "Michelle",
      review: "I have tried it and it's amazing",
      rating: 5
    },
    {
      name: "Miss Abbas",
      review: "The taste is really good, definitely worth a try",
      rating: 5
    },
    {
      name: "Hania",
      review: "Really unique and tasty",
      rating: 5
    },
    {
      name: "Yousha",
      review: "It's Awesome",
      rating: 5
    },
    {
      name: "Amna",
      review: "Amazing taste and flavor, I really enjoyed it",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            What Our Customers Say
          </span> 💬
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Don't just take our word for it!
        </p>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="bg-gradient-card backdrop-blur-sm border-primary/20 hover:shadow-glow hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="text-foreground mb-4 italic font-medium">
                        "{testimonial.review}"
                      </p>
                      <p className="font-semibold bg-gradient-primary bg-clip-text text-transparent">
                        — {testimonial.name}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-gradient-card border-primary/20 hover:bg-primary/10" />
          <CarouselNext className="bg-gradient-card border-primary/20 hover:bg-primary/10" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
