import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const size = searchParams.get("size") || "Medium";
  const pack = searchParams.get("pack") || "3";
  const price = searchParams.get("price") || "0";
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
  });

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey, { db: { schema: "tr_info" } })
    : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      if (!supabase) {
        toast.error("Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      } else {
        const packNum = Number(pack);
        const priceNum = Number(price);
        const { data: bundleRow, error: bundleErr } = await supabase
          .from("bundles")
          .select("id")
          .eq("size", size)
          .eq("packcount", packNum)
          .maybeSingle();
        if (bundleErr) throw bundleErr;

        const bundleId = bundleRow?.id;
        if (!bundleId) throw new Error("Bundle not found. Please seed bundles.");

        const { error } = await supabase
          .from("orders")
          .insert({
            customername: formData.name,
            phone: formData.phone,
            address: formData.address,
            bundle: bundleId,
            price: priceNum,
            deliverycharge: 0,
            total: priceNum,
            status: "pending",
          });
        if (error) throw error;
      }
      toast.success("Order placed successfully! We'll contact you soon.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save credentials";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Bundles
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-semibold">{size} Bundle</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-semibold">Pack of {pack}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Cup Size:</span>
                  <span className="font-semibold">{size === "Medium" ? "14 oz" : "16 oz"}</span>
                </div>
                <div className="flex justify-between py-4 text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">PKR {price}</span>
                </div>
                <div className="bg-primary/10 rounded-lg p-4 text-sm text-muted-foreground">
                  <p>✓ 100% Organic Cotton Candy</p>
                  <p>✓ No Preservatives</p>
                  <p>✓ Freshly Spun</p>
                  <p>✓ Fast Delivery (24-48 hours)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Street address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="City name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Any special instructions?"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    Place Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
