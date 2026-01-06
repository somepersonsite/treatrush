import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Truck, MapPin, ChevronDown } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { createOrder } from "@/lib/api";

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  size: string;
  pack: number;
  price: number;
}

// Karachi areas with fixed delivery charges (dispatch from Jamshed Road)
const karachiAreas: { name: string; charge: number }[] = [
  // 300 PKR (0–5 km)
  { name: "Saddar", charge: 300 },
  { name: "Empress Market", charge: 300 },
  { name: "Soldier Bazaar", charge: 300 },
  { name: "Garden East", charge: 300 },
  { name: "Garden West", charge: 300 },
  { name: "Patel Para", charge: 300 },
  { name: "Martin Quarters", charge: 300 },
  { name: "Pakistan Quarters", charge: 300 },
  { name: "Jahangir Road", charge: 300 },
  { name: "Lines Area", charge: 300 },
  { name: "PECHS Block 1", charge: 300 },
  { name: "PECHS Block 2", charge: 300 },
  { name: "PECHS Block 3", charge: 300 },
  { name: "PECHS Block 4", charge: 300 },
  { name: "PECHS Block 5", charge: 300 },
  { name: "PECHS Block 6", charge: 300 },
  { name: "Nursery", charge: 300 },
  { name: "Tariq Road", charge: 300 },
  { name: "Bahadurabad", charge: 300 },
  { name: "Khalid Bin Waleed Road", charge: 300 },
  { name: "Guru Mandir", charge: 300 },
  { name: "Jail Chowrangi", charge: 300 },
  { name: "PIB Colony", charge: 300 },
  { name: "National Stadium", charge: 300 },
  { name: "Civic Center", charge: 300 },
  { name: "KDA Scheme 1", charge: 300 },
  { name: "Jamshed Road", charge: 300 },

  // 350 PKR (5–10 km)
  { name: "Gulshan-e-Iqbal Block 1", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 2", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 3", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 4", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 5", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 6", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 7", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 8", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 9", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 10", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 11", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 12", charge: 350 },
  { name: "Gulshan-e-Iqbal Block 13", charge: 350 },
  { name: "Gulshan Chowrangi", charge: 350 },
  { name: "NIPA", charge: 350 },
  { name: "Dalmia", charge: 350 },
  { name: "Gulshan-e-Jamal", charge: 350 },
  { name: "KDA Scheme 24", charge: 350 },
  { name: "Askari 4", charge: 350 },
  { name: "Nazimabad 1", charge: 350 },
  { name: "Nazimabad 2", charge: 350 },
  { name: "Nazimabad 3", charge: 350 },
  { name: "Nazimabad 4", charge: 350 },
  { name: "Nazimabad 5", charge: 350 },
  { name: "Nazimabad 6", charge: 350 },
  { name: "Nazimabad 7", charge: 350 },
  { name: "Liaquatabad", charge: 350 },
  { name: "Federal B Area Block 1", charge: 350 },
  { name: "Federal B Area Block 2", charge: 350 },
  { name: "Federal B Area Block 3", charge: 350 },
  { name: "Federal B Area Block 4", charge: 350 },
  { name: "Federal B Area Block 5", charge: 350 },
  { name: "Federal B Area Block 6", charge: 350 },
  { name: "Federal B Area Block 7", charge: 350 },
  { name: "Federal B Area Block 8", charge: 350 },
  { name: "Federal B Area Block 9", charge: 350 },
  { name: "Federal B Area Block 10", charge: 350 },
  { name: "Federal B Area Block 11", charge: 350 },
  { name: "Federal B Area Block 12", charge: 350 },
  { name: "Federal B Area Block 13", charge: 350 },
  { name: "Federal B Area Block 14", charge: 350 },
  { name: "Federal B Area Block 15", charge: 350 },
  { name: "Federal B Area Block 16", charge: 350 },
  { name: "Federal B Area Block 17", charge: 350 },
  { name: "Federal B Area Block 18", charge: 350 },
  { name: "Federal B Area Block 19", charge: 350 },
  { name: "Federal B Area Block 20", charge: 350 },
  { name: "Federal B Area Block 21", charge: 350 },
  { name: "Ancholi", charge: 350 },
  { name: "Kareemabad", charge: 350 },
  { name: "Water Pump", charge: 350 },
  { name: "Gulberg", charge: 350 },
  { name: "Sindhi Muslim FB Area", charge: 350 },
  { name: "SITE (near side)", charge: 350 },
  { name: "Gulbai", charge: 350 },
  { name: "Qayyumabad", charge: 350 },
  { name: "Kala Board", charge: 350 },
  { name: "Shah Faisal Colony", charge: 350 },

  // 400 PKR (10–15 km)
  { name: "Johar Block 1", charge: 400 },
  { name: "Johar Block 2", charge: 400 },
  { name: "Johar Block 3", charge: 400 },
  { name: "Johar Block 4", charge: 400 },
  { name: "Johar Block 5", charge: 400 },
  { name: "Johar Block 6", charge: 400 },
  { name: "Johar Block 7", charge: 400 },
  { name: "Johar Block 8", charge: 400 },
  { name: "Johar Block 9", charge: 400 },
  { name: "Johar Block 10", charge: 400 },
  { name: "Johar Block 11", charge: 400 },
  { name: "Johar Block 12", charge: 400 },
  { name: "Johar Block 13", charge: 400 },
  { name: "Johar Block 14", charge: 400 },
  { name: "Johar Block 15", charge: 400 },
  { name: "Johar Block 16", charge: 400 },
  { name: "Johar Block 17", charge: 400 },
  { name: "Johar Block 18", charge: 400 },
  { name: "Johar Block 19", charge: 400 },
  { name: "Johar Block 20", charge: 400 },
  { name: "Perfume Chowk", charge: 400 },
  { name: "Jauhar Morr", charge: 400 },
  { name: "Jauhar Chowrangi", charge: 400 },
  { name: "Kamran Chowrangi", charge: 400 },
  { name: "Mosmiat", charge: 400 },
  { name: "Rabia City", charge: 400 },
  { name: "Metroville Jauhar", charge: 400 },
  { name: "Nazimabad Roundabout Belt", charge: 400 },
  { name: "North Nazimabad Block A", charge: 400 },
  { name: "North Nazimabad Block B", charge: 400 },
  { name: "North Nazimabad Block C", charge: 400 },
  { name: "North Nazimabad Block D", charge: 400 },
  { name: "North Nazimabad Block E", charge: 400 },
  { name: "North Nazimabad Block F", charge: 400 },
  { name: "North Nazimabad Block G", charge: 400 },
  { name: "North Nazimabad Block H", charge: 400 },
  { name: "North Nazimabad Block I", charge: 400 },
  { name: "North Nazimabad Block J", charge: 400 },
  { name: "North Nazimabad Block K", charge: 400 },
  { name: "North Nazimabad Block L", charge: 400 },
  { name: "North Nazimabad Block M", charge: 400 },
  { name: "North Nazimabad Block N", charge: 400 },
  { name: "Hyderi", charge: 400 },
  { name: "North Karachi Sector 5", charge: 400 },
  { name: "North Karachi Sector 6", charge: 400 },
  { name: "North Karachi Sector 7", charge: 400 },
  { name: "Clifton Block 1", charge: 400 },
  { name: "Clifton Block 2", charge: 400 },
  { name: "Clifton Block 3", charge: 400 },
  { name: "Clifton Block 4", charge: 400 },
  { name: "Clifton Block 5", charge: 400 },
  { name: "Clifton Block 6", charge: 400 },
  { name: "Clifton Block 7", charge: 400 },
  { name: "Clifton Block 8", charge: 400 },
  { name: "Clifton Block 9", charge: 400 },
  { name: "Teen Talwar", charge: 400 },
  { name: "Do Talwar", charge: 400 },
  { name: "Boat Basin", charge: 400 },
  { name: "DHA Phase 1", charge: 400 },
  { name: "DHA Phase 2", charge: 400 },
  { name: "DHA Phase 3", charge: 400 },
  { name: "DHA Phase 4", charge: 400 },
  { name: "Korangi 1", charge: 400 },
  { name: "Korangi 2", charge: 400 },
  { name: "Korangi 2.5", charge: 400 },
  { name: "Korangi Industrial Area", charge: 400 },
  { name: "Landhi 1", charge: 400 },
  { name: "Landhi 2", charge: 400 },
  { name: "Landhi 3", charge: 400 },
  { name: "Model Colony", charge: 400 },
  { name: "Airport", charge: 400 },
  { name: "Jinnah Avenue", charge: 400 },

  // 450 PKR (15–20 km)
  { name: "Askari 5 (Gulshan side)", charge: 450 },
  { name: "Saadi Town", charge: 450 },
  { name: "Saadi Garden", charge: 450 },
  { name: "Gulistan-e-Sarmast", charge: 450 },
  { name: "KESC Society", charge: 450 },
  { name: "New Karachi Sector 1", charge: 450 },
  { name: "New Karachi Sector 2", charge: 450 },
  { name: "New Karachi Sector 3", charge: 450 },
  { name: "New Karachi Sector 4", charge: 450 },
  { name: "New Karachi Sector 5", charge: 450 },
  { name: "New Karachi Sector 6", charge: 450 },
  { name: "North Karachi Sector 8", charge: 450 },
  { name: "North Karachi Sector 9", charge: 450 },
  { name: "North Karachi Sector 10", charge: 450 },
  { name: "North Karachi Sector 11", charge: 450 },
  { name: "DHA Phase 5", charge: 450 },
  { name: "DHA Phase 6", charge: 450 },
  { name: "DHA Phase 7 Extension", charge: 450 },
  { name: "Khayaban-e-Ittehad", charge: 450 },
  { name: "Shahbaz", charge: 450 },
  { name: "Bukhari", charge: 450 },
  { name: "Zamzama", charge: 450 },
  { name: "Mehran Town", charge: 450 },
  { name: "Korangi 3", charge: 450 },
  { name: "Korangi 4", charge: 450 },
  { name: "Landhi 4", charge: 450 },
  { name: "Landhi 5", charge: 450 },
  { name: "Landhi 6", charge: 450 },
  { name: "Malir 1", charge: 450 },
  { name: "Malir 2", charge: 450 },
  { name: "Malir 3", charge: 450 },
  { name: "Malir 4", charge: 450 },
  { name: "Malir 5", charge: 450 },
  { name: "Malir 6", charge: 450 },
  { name: "Malir 7", charge: 450 },
  { name: "Malir 8", charge: 450 },
  { name: "Malir 9", charge: 450 },
  { name: "Malir 10", charge: 450 },
  { name: "Malir Model Gate", charge: 450 },
  { name: "Manghopir", charge: 450 },
  { name: "Orangi 1", charge: 450 },
  { name: "Orangi 2", charge: 450 },
  { name: "Orangi 3", charge: 450 },
  { name: "Orangi 4", charge: 450 },
  { name: "Orangi 5", charge: 450 },
  { name: "Orangi 6", charge: 450 },
  { name: "Orangi 7", charge: 450 },
  { name: "Orangi 8", charge: 450 },

  // 500 PKR (20–25 km)
  { name: "Malir Cantt", charge: 500 },
  { name: "Askari 5 (Malir side)", charge: 500 },
  { name: "New Karachi Sector 10", charge: 500 },
  { name: "New Karachi Sector 11", charge: 500 },
  { name: "Power House", charge: 500 },
  { name: "Sir Syed Town", charge: 500 },
  { name: "Orangi 9", charge: 500 },
  { name: "Orangi 10", charge: 500 },
  { name: "Orangi 11", charge: 500 },
  { name: "Orangi 12", charge: 500 },
  { name: "Orangi 13", charge: 500 },
  { name: "Orangi 14", charge: 500 },
  { name: "Orangi 15", charge: 500 },
  { name: "Orangi 16", charge: 500 },
  { name: "Qasba Colony", charge: 500 },
  { name: "Banaras", charge: 500 },
  { name: "Clifton Seaview Belt", charge: 500 },
  { name: "Emaar", charge: 500 },
  { name: "Crescent Bay", charge: 500 },
  { name: "Creek Vista", charge: 500 },
  { name: "Dawood Chowrangi", charge: 500 },
  { name: "Quaidabad", charge: 500 },
  { name: "Future Colony", charge: 500 },

  // 600 PKR (25–30 km)
  { name: "Hawkes Bay Road", charge: 600 },
  { name: "Maripur (near side)", charge: 600 },
  { name: "Sandspit Road", charge: 600 },
  { name: "Manora Approach", charge: 600 },
  { name: "Gulistan Society (far side)", charge: 600 },
  { name: "Malir 15", charge: 600 },
  { name: "Malir 16", charge: 600 },
  { name: "Malir 17", charge: 600 },
  { name: "Malir 18", charge: 600 },
  { name: "Malir 19", charge: 600 },
  { name: "Malir 20", charge: 600 },

  // 700 PKR (30+ km)
  { name: "Hawkes Bay Beach", charge: 700 },
  { name: "Sandspit Beach", charge: 700 },
  { name: "Manora Island", charge: 700 },
  { name: "Port Backside", charge: 700 },
  { name: "Remote Korangi Industrial Back Areas", charge: 700 },
  { name: "Remote Landhi Back Areas", charge: 700 },
  { name: "Remote Malir / Gadap Boundary", charge: 700 },
].sort((a, b) => a.name.localeCompare(b.name));

const OrderDialog = ({ isOpen, onClose, size, pack, price }: OrderDialogProps) => {
  console.log("OrderDialog rendering. isOpen:", isOpen);
  const [selectedArea, setSelectedArea] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const rawSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const siteKey = rawSiteKey ? rawSiteKey.replace(/^['"]|['"]$/g, "").trim() : undefined;
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter areas based on search
  const filteredAreas = karachiAreas.filter(area =>
    area.name.toLowerCase().includes(areaSearch.toLowerCase())
  );

  useEffect(() => {
    if (selectedArea) {
      const area = karachiAreas.find(a => a.name === selectedArea);
      if (area) {
        setDeliveryCharge(area.charge);
      }
    } else {
      setDeliveryCharge(0);
    }
  }, [selectedArea]);

  useEffect(() => {
    window.onTurnstileCallback = (t: unknown) => setCaptchaToken(typeof t === "string" && t ? t : null);
    window.onTurnstileLoad = () => setScriptReady(true);
    return () => {
      window.onTurnstileCallback = undefined;
      window.onTurnstileLoad = undefined;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      renderedRef.current = false;
      setCaptchaToken(null);
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("Turnstile useEffect triggered.");
    console.log("isOpen:", isOpen, "siteKey:", siteKey, "captchaRef.current:", captchaRef.current);

    if (!isOpen || !siteKey) {
      console.log("Turnstile useEffect: Pre-conditions (isOpen or siteKey) not met. Returning.");
      return;
    }

    const renderTurnstile = () => {
      if (renderedRef.current) {
        console.log("Turnstile already rendered. Skipping render.");
        return;
      }

      const ts = window.turnstile;
      if (!ts) {
        console.log("window.turnstile not available yet. Retrying...");
        return;
      }

      if (!captchaRef.current) {
        console.log("captchaRef.current is null. Retrying...");
        return;
      }

      try {
        const el = captchaRef.current as HTMLElement;
        console.log("Attempting to render Turnstile with element:", el);
        ts.render(el, {
          sitekey: siteKey,
          appearance: "always",
          theme: "auto",
          size: "normal",
          callback: (token: string) => {
            setCaptchaToken(token);
            console.log("Turnstile callback: Token received:", token);
          },
          "expired-callback": () => {
            setCaptchaToken(null);
            console.log("Turnstile expired-callback: Token set to null.");
          },
          "error-callback": (e: unknown) => {
            setCaptchaError("captcha_load_error");
            console.error("Turnstile error-callback: captcha_load_error", e);
          },
        });
        setCaptchaError(null);
        renderedRef.current = true;
        console.log("Turnstile rendered successfully with captchaRef.current.");
      } catch (e: unknown) {
        setCaptchaError("captcha_render_exception");
        console.error("Turnstile render failed:", e);
      }
    };

    const intervalId = setInterval(renderTurnstile, 300); // Retry every 300ms

    return () => {
      console.log("Turnstile useEffect cleanup: Clearing interval.");
      clearInterval(intervalId);
    };
  }, [isOpen, siteKey]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAreaSelect = (areaName: string) => {
    setSelectedArea(areaName);
    setAreaSearch(areaName);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit called. Current captchaToken:", captchaToken);
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !selectedArea) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (!supabase) {
        toast.error("Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
        return;
      }
      const { data: bundleRow, error: bundleErr } = await supabase
        .from("bundles")
        .select("id")
        .eq("size", size)
        .eq("packcount", pack)
        .maybeSingle();
      if (bundleErr) throw bundleErr;
      const bundleId = bundleRow?.id as string | undefined;
      if (!bundleId) throw new Error("Bundle not found. Please seed bundles.");
      console.log("Calling createOrder with captchaToken:", captchaToken);
      const res = await createOrder({
        bundleId,
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        deliveryCharge,
        captchaToken: captchaToken || undefined,
      });
      const total = Number((res as { order?: { total?: number } })?.order?.total) || price + deliveryCharge;
      toast.success(`Order placed successfully! Total: PKR ${total}. We'll contact you soon.`);
      setFormData({ name: "", phone: "", address: "", notes: "" });
      setSelectedArea("");
      onClose();
    } catch (err: unknown) {
      const anyErr = err as { message?: string };
      const msg = typeof anyErr?.message === "string" ? anyErr.message : "Failed to place order";
      toast.error(msg);
    }
  };

  const total = price + deliveryCharge;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-card border-primary/20 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Complete Your Order 🍭
          </DialogTitle>
          <DialogDescription className="sr-only">Provide delivery details to place your order</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
          {/* Order Summary */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Order Summary
            </h3>
            <div className="bg-background/50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 border border-primary/10">
              <div className="flex justify-between py-2 border-b border-border text-sm sm:text-base">
                <span className="text-muted-foreground">Bundle:</span>
                <span className="font-semibold">{size} (Pack of {pack})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border text-sm sm:text-base">
                <span className="text-muted-foreground">Cup Size:</span>
                <span className="font-semibold">{size === "Medium" ? "14 oz" : "16 oz"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border text-sm sm:text-base">
                <span className="text-muted-foreground">Bundle Price:</span>
                <span className="font-semibold">PKR {price}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border text-sm sm:text-base">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                  Delivery Charge:
                </span>
                <span className="font-semibold text-primary">
                  {deliveryCharge > 0 ? `PKR ${deliveryCharge}` : "Select area"}
                </span>
              </div>
              <div className="flex justify-between py-2 sm:py-3 text-base sm:text-lg font-bold bg-gradient-subtle rounded-lg px-2 sm:px-3">
                <span>Total:</span>
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  PKR {deliveryCharge > 0 ? total : price}
                </span>
              </div>
            </div>

            <div className="bg-primary/10 rounded-xl p-3 sm:p-4 text-xs sm:text-sm">
              <p className="flex items-center gap-2 font-medium text-primary">
                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                Estimated Delivery Time: 45–55 minutes
              </p>
            </div>
          </div>

          {/* Delivery Form */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Delivery Information
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name"
                  className="bg-background/50 border-primary/20 focus:border-primary text-sm sm:text-base"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+92 300 1234567"
                  className="bg-background/50 border-primary/20 focus:border-primary text-sm sm:text-base"
                  required
                />
              </div>

              <div ref={dropdownRef} className="relative">
                <Label htmlFor="area" className="text-sm">Delivery Area (Karachi Only) *</Label>
                <div className="relative">
                  <Input
                    id="area"
                    value={areaSearch}
                    onChange={(e) => {
                      setAreaSearch(e.target.value);
                      setSelectedArea("");
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Type to search area..."
                    className="bg-background/50 border-primary/20 focus:border-primary pr-10 text-sm sm:text-base"
                    autoComplete="off"
                  />
                  <ChevronDown 
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-card border border-primary/20 rounded-lg shadow-lg max-h-40 sm:max-h-48 overflow-y-auto">
                    {filteredAreas.length > 0 ? (
                      filteredAreas.map((area) => (
                        <button
                          key={area.name}
                          type="button"
                          onClick={() => handleAreaSelect(area.name)}
                          className="w-full px-3 sm:px-4 py-2 text-left hover:bg-primary/10 transition-colors text-xs sm:text-sm"
                        >
                          {area.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-muted-foreground">
                        No areas found
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="address" className="text-sm">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="House/Apartment, Street name"
                  className="bg-background/50 border-primary/20 focus:border-primary text-sm sm:text-base"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-sm">Order Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any special instructions?"
                  className="bg-background/50 border-primary/20 focus:border-primary text-sm sm:text-base"
                />
              </div>
              
              {siteKey && (
                <div id="turnstile-container" ref={captchaRef} className="mb-3 min-h-[65px]" />
              )}
              <Button type="submit" className="w-full shadow-glow text-sm sm:text-base" size="lg" disabled={!!siteKey && !captchaToken}>
                Place Order 🛒
              </Button>
              {siteKey && !captchaToken && (
                <div className="text-xs mt-2 text-muted-foreground">
                  {captchaError ? "CAPTCHA failed to load. Please disable ad-blockers or allow challenges.cloudflare.com and reload." : "Please complete the CAPTCHA to enable submission."}
                </div>
              )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, { db: { schema: "tr_info" } })
  : undefined;
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement | string, opts: unknown) => void;
      reset?: (id?: unknown) => void;
      ready?: (cb: () => void) => void;
    };
    onTurnstileLoad?: () => void;
    onTurnstileCallback?: (token: string) => void;
  }
}
