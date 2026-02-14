import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSavedTrip, getSavedTrips, SavedTrip } from "@/lib/tripStorage";

const SavedTripsPage = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<SavedTrip[]>([]);

  useEffect(() => {
    try {
      setSaved(getSavedTrips());
    } catch (e) {
      setSaved([]);
    }
  }, []);

  const handleViewSaved = (trip: SavedTrip) => {
    navigate("/results", { state: { itinerary: trip.itinerary, formData: trip.formData } });
  };

  const handleDeleteSaved = (id: string) => {
    if (!confirm("Delete this saved trip?")) return;
    if (deleteSavedTrip(id)) {
      setSaved((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display font-bold text-lg text-foreground">Saved Trips</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {saved.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">No saved trips yet</h2>
            <p className="text-muted-foreground">Generate a trip first and it will appear here.</p>
            <Button variant="hero" onClick={() => navigate("/plan")}>Plan a Trip</Button>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-card shadow-card border border-border">
            <h2 className="font-display font-semibold text-xl text-card-foreground mb-4">Your Previous Trips</h2>
            <div className="space-y-3">
              {saved.map((trip) => (
                <div key={trip.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">{trip.itinerary.destination}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Saved {new Date(trip.savedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleViewSaved(trip)}>View</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteSaved(trip.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedTripsPage;
