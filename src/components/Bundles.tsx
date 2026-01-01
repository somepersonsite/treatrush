import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart } from "lucide-react";
import bundle3Image from "@/assets/bundle-3.jpeg";
import bundle5Image from "@/assets/bundle-5.jpeg";
import bundle7Image from "@/assets/bundle-7.jpeg";
import OrderDialog from "./OrderDialog";

const Bundles = () => {
  const [orderDialog, setOrderDialog] = useState<{
    isOpen: boolean;
    size: string;
    pack: number;
    price: number;
  }>({
    isOpen: false,
    size: "",
    pack: 0,
    price: 0
  });

  const bundleImages: { [key: number]: string } = {
    3: bundle3Image,
    5: bundle5Image,
    7: bundle7Image
  };

  const mediumBundles = [
    { pack: 3, price: 399, description: "Perfect for trying out our flavors" },
    { pack: 5, price: 699, description: "Great for small gatherings" },
    { pack: 7, price: 899, description: "Best value for families" }
  ];

  const largeBundles = [
    { pack: 3, price: 499, description: "Perfect for a small gathering" },
    { pack: 5, price: 799, description: "Great for family fun" },
    { pack: 7, price: 999, description: "Best value for parties" }
  ];

  const handleBuyNow = (size: string, pack: number, price: number) => {
    setOrderDialog({ isOpen: true, size, pack, price });
  };

  return (
    <>
      <section id="bundles" className="py-12 sm:py-20 bg-gradient-subtle overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Our Bundles</span> 🎁
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium px-2">
              Choose from our premium cotton candy bundles. Available in medium and large sizes!
            </p>
          </div>

          <Tabs defaultValue="large" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-xs sm:max-w-md mx-auto grid-cols-2 mb-8 sm:mb-12 h-12 sm:h-14 bg-gradient-card shadow-soft border-2 border-primary/10">
              <TabsTrigger value="large" className="rounded-xl font-semibold text-xs sm:text-sm data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Large Bundles</TabsTrigger>
              <TabsTrigger value="medium" className="rounded-xl font-semibold text-xs sm:text-sm data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Medium Bundles</TabsTrigger>
            </TabsList>

            <TabsContent value="large">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {largeBundles.map((bundle, index) => (
                  <Card 
                    key={index}
                    className="bg-gradient-card backdrop-blur-sm border-primary/20 hover:shadow-glow hover:scale-105 hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                    }}
                  >
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img 
                        src={bundleImages[bundle.pack]} 
                        alt={`Pack of ${bundle.pack} cotton candies`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader className="pb-2 sm:pb-4">
                      <div className="text-center text-xs sm:text-sm font-medium text-primary mb-1 sm:mb-2">16 oz</div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-center">Pack of {bundle.pack}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground text-center font-medium">{bundle.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 pt-0">
                      <div className="text-center">
                        <span className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                          {bundle.price}
                        </span>
                        <span className="text-base sm:text-lg text-muted-foreground ml-1">PKR</span>
                      </div>
                      <Button 
                        className="w-full shadow-glow hover:shadow-glow group text-sm sm:text-base"
                        onClick={() => handleBuyNow("Large", bundle.pack, bundle.price)}
                      >
                        <ShoppingCart className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {mediumBundles.map((bundle, index) => (
                  <Card 
                    key={index}
                    className="bg-gradient-card backdrop-blur-sm border-primary/20 hover:shadow-glow hover:scale-105 hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                    }}
                  >
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img 
                        src={bundleImages[bundle.pack]} 
                        alt={`Pack of ${bundle.pack} cotton candies`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader className="pb-2 sm:pb-4">
                      <div className="text-center text-xs sm:text-sm font-medium text-primary mb-1 sm:mb-2">14 oz</div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-center">Pack of {bundle.pack}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground text-center font-medium">{bundle.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 pt-0">
                      <div className="text-center">
                        <span className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                          {bundle.price}
                        </span>
                        <span className="text-base sm:text-lg text-muted-foreground ml-1">PKR</span>
                      </div>
                      <Button 
                        className="w-full shadow-glow hover:shadow-glow group text-sm sm:text-base"
                        onClick={() => handleBuyNow("Medium", bundle.pack, bundle.price)}
                      >
                        <ShoppingCart className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {orderDialog.isOpen && (
        <OrderDialog
          isOpen={orderDialog.isOpen}
          onClose={() => setOrderDialog({ ...orderDialog, isOpen: false })}
          size={orderDialog.size}
          pack={orderDialog.pack}
          price={orderDialog.price}
        />
      )}
    </>
  );
};

export default Bundles;