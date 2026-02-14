export interface TripFormData {
  source: string;
  destination: string;
  dates: string;
  duration: number;
  budget: number;
  interests: string[];
  groupSize: number;
  transport: string;
  accommodation: string;
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  cost: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}

export interface BudgetBreakdown {
  travel: number;
  stay: number;
  food: number;
  activities: number;
  total: number;
}

export interface AccommodationInfo {
  name: string;
  type: string;
  costPerNight: number;
}

export interface Itinerary {
  destination: string;
  summary: string;
  days: ItineraryDay[];
  budget: BudgetBreakdown;
  tips: string[];
  foodRecommendations: string[];
  accommodation: AccommodationInfo;
}
