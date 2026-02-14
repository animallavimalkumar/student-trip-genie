import type { Itinerary, TripFormData } from "@/types/travel";

export interface SavedTrip {
  id: string;
  savedAt: string;
  formData: TripFormData;
  itinerary: Itinerary;
}

const STORAGE_KEY = "travelApp.savedTrips.v1";

export function getSavedTrips(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedTrip[];
  } catch (e) {
    console.error("Failed to read saved trips", e);
    return [];
  }
}

export function saveTrip(formData: TripFormData, itinerary: Itinerary): SavedTrip {
  const trips = getSavedTrips();
  const saved: SavedTrip = {
    id: String(Date.now()),
    savedAt: new Date().toISOString(),
    formData,
    itinerary,
  };

  trips.unshift(saved);
  const slice = trips.slice(0, 50);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slice));
  } catch (e) {
    console.error("Failed to save trip", e);
  }

  return saved;
}

export function deleteSavedTrip(id: string) {
  try {
    const trips = getSavedTrips().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return true;
  } catch (e) {
    console.error("Failed to delete saved trip", e);
    return false;
  }
}
