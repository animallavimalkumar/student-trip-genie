import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Utensils, BedDouble, Lightbulb, IndianRupee } from "lucide-react";
import type { Itinerary, TripFormData } from "@/types/travel";
import BudgetChart from "@/components/BudgetChart";
import DayCard from "@/components/DayCard";

const ItineraryResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itinerary = location.state?.itinerary as Itinerary | undefined;
  const formData = location.state?.formData as TripFormData | undefined;

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">No itinerary found</h2>
          <p className="text-muted-foreground">Plan a trip first to see your AI-generated itinerary.</p>
          <Button variant="hero" onClick={() => navigate("/plan")}>Plan a Trip</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/plan")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display font-bold text-lg text-foreground">Your Itinerary</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Header */}
        <div className="p-8 rounded-2xl bg-gradient-hero text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-6 w-6" />
            <h2 className="font-display text-3xl font-bold">{itinerary.destination}</h2>
          </div>
          <p className="text-primary-foreground/80 text-lg">{itinerary.summary}</p>
          {formData && (
            <div className="flex flex-wrap gap-3 mt-4 text-sm text-primary-foreground/70">
              <span>{formData.duration} days</span>
              <span>•</span>
              <span>₹{formData.budget.toLocaleString()} budget</span>
              <span>•</span>
              <span>{formData.groupSize} {formData.groupSize === 1 ? "person" : "people"}</span>
            </div>
          )}
        </div>

        {/* Budget */}
        <div className="p-6 rounded-xl bg-card shadow-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-lg text-card-foreground">Budget Breakdown</h3>
          </div>
          <BudgetChart budget={itinerary.budget} />
        </div>

        {/* Day-wise */}
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-xl text-foreground">Day-by-Day Plan</h3>
          {itinerary.days.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>

        {/* Accommodation */}
        {itinerary.accommodation && (
          <div className="p-6 rounded-xl bg-card shadow-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <BedDouble className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold text-lg text-card-foreground">Stay</h3>
            </div>
            <p className="text-foreground font-medium">{itinerary.accommodation.name}</p>
            <p className="text-muted-foreground text-sm">
              {itinerary.accommodation.type} — ₹{itinerary.accommodation.costPerNight}/night
            </p>
          </div>
        )}

        {/* Food */}
        {itinerary.foodRecommendations?.length > 0 && (
          <div className="p-6 rounded-xl bg-card shadow-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold text-lg text-card-foreground">Food Spots</h3>
            </div>
            <ul className="space-y-2">
              {itinerary.foodRecommendations.map((f, i) => (
                <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips */}
        {itinerary.tips?.length > 0 && (
          <div className="p-6 rounded-xl bg-card shadow-card border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h3 className="font-display font-semibold text-lg text-card-foreground">Student Tips</h3>
            </div>
            <ul className="space-y-2">
              {itinerary.tips.map((tip, i) => (
                <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="text-accent mt-0.5">💡</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center pt-4 pb-8">
          <Button variant="hero" size="lg" onClick={() => navigate("/plan")} className="px-8">
            Plan Another Trip
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ItineraryResults;
