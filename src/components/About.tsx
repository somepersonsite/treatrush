import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            About <span className="bg-gradient-primary bg-clip-text text-transparent drop-shadow-sm">Treat Rush</span> 💖
          </h2>
          
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're proud to be <strong className="text-foreground">Pakistan's first flavored cotton candy brand</strong>, 
              bringing you a unique sweet experience that combines tradition with innovation.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Treat Rush, we believe in quality over everything. That's why our cotton candy is 
              <strong className="text-foreground"> 100% organic</strong> with 
              <strong className="text-foreground"> absolutely no preservatives</strong>. 
              Each batch is freshly spun with love, ensuring you get the fluffiest, most delicious cotton candy every time.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our commitment to hygiene and premium quality means you're not just buying cotton candy – 
              you're buying an experience. From our carefully selected ingredients to our meticulous preparation process, 
              every step is designed to bring pure joy to your taste buds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 max-w-md mx-auto">
            <Card className="bg-gradient-card border-primary/20 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">100%</div>
                <div className="text-sm text-muted-foreground font-semibold">Organic Ingredients 🌱</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card border-primary/20 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">0</div>
                <div className="text-sm text-muted-foreground font-semibold">Preservatives ✨</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;