import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import type { TripFormData } from "@/types/travel";
import { saveTrip } from "@/lib/tripStorage";

const INTERESTS = ["Nature", "Beaches", "History", "Adventure", "Nightlife", "Culture", "Food", "Trekking", "Wildlife", "Architecture"];

const TripPlannerForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TripFormData>({
    source: "",
    destination: "",
    dates: "",
    duration: 3,
    budget: 5000,
    interests: [],
    groupSize: 2,
    transport: "train",
    accommodation: "hostel",
  });

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate itinerary");
      }

      const data = await res.json();
      try {
        if (data?.itinerary) {
          saveTrip(form, data.itinerary);
        }
      } catch (e) {
        console.warn("Could not save trip locally", e);
      }
      navigate("/results", { state: { itinerary: data.itinerary, formData: form } });
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display font-bold text-lg text-foreground">Plan Your Trip</h1>
          <Button variant="outline" className="ml-auto" onClick={() => navigate("/saved-trips")}>
            Previous Trips
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location */}
          <div className="p-6 rounded-xl bg-card shadow-card border border-border space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Where to?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">From</Label>
                <Input
                  id="source"
                  placeholder="e.g. Hyderabad"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destination">To (optional — AI can suggest)</Label>
                <Input
                  id="destination"
                  placeholder="e.g. Goa"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Duration & Dates */}
          <div className="p-6 rounded-xl bg-card shadow-card border border-border space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">When & How Long?</h2>
            </div>
            <div>
              <Label htmlFor="dates">Travel Dates (optional)</Label>
              <Input
                id="dates"
                type="date"
                value={form.dates}
                onChange={(e) => setForm({ ...form, dates: e.target.value })}
              />
            </div>
            <div>
              <Label>Duration: {form.duration} days</Label>
              <Slider
                value={[form.duration]}
                onValueChange={([val]) => setForm({ ...form, duration: val })}
                min={1}
                max={14}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Budget */}
          <div className="p-6 rounded-xl bg-card shadow-card border border-border space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Budget</h2>
            </div>
            <div>
              <Label>Budget: ₹{form.budget.toLocaleString()}</Label>
              <Slider
                value={[form.budget]}
                onValueChange={([val]) => setForm({ ...form, budget: val })}
                min={1000}
                max={30000}
                step={500}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹1,000</span>
                <span>₹30,000</span>
              </div>
            </div>
          </div>

          {/* Group & Transport */}
          <div className="p-6 rounded-xl bg-card shadow-card border border-border space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Travel Details</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Group Size</Label>
                <Select value={String(form.groupSize)} onValueChange={(v) => setForm({ ...form, groupSize: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "person" : "people"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transport</Label>
                <Select value={form.transport} onValueChange={(v) => setForm({ ...form, transport: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Accommodation</Label>
                <Select value={form.accommodation} onValueChange={(v) => setForm({ ...form, accommodation: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="hotel">Budget Hotel</SelectItem>
                    <SelectItem value="pg">PG / Guest House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="p-6 rounded-xl bg-card shadow-card border border-border space-y-4">
            <h2 className="font-display font-semibold text-foreground">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <Badge
                  key={interest}
                  variant={form.interests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer text-sm px-4 py-2 transition-all hover:scale-105"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full text-base py-6"
            disabled={loading || !form.source}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                AI is planning your trip...
              </>
            ) : (
              "Generate My Itinerary ✨"
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default TripPlannerForm;
