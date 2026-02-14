import type { ItineraryDay } from "@/types/travel";
import { Clock } from "lucide-react";

interface Props {
  day: ItineraryDay;
}

const DayCard = ({ day }: Props) => {
  return (
    <div className="p-6 rounded-xl bg-card shadow-card border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
          D{day.day}
        </div>
        <h4 className="font-display font-semibold text-foreground">{day.title}</h4>
      </div>
      <div className="space-y-3 ml-2 border-l-2 border-border pl-6">
        {day.activities.map((activity, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[1.85rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-card" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
                <p className="text-sm font-medium text-foreground">{activity.activity}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
              </div>
              {activity.cost > 0 && (
                <span className="text-xs font-display font-semibold text-accent whitespace-nowrap">
                  ₹{activity.cost.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCard;
