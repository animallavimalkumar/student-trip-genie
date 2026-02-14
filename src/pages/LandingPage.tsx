import { Plane, MapPin, Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Plans",
    description: "Get personalized itineraries crafted by AI for your budget and interests.",
  },
  {
    icon: Wallet,
    title: "Budget Optimized",
    description: "Every plan is designed for student wallets — no overspending.",
  },
  {
    icon: MapPin,
    title: "Hidden Gems",
    description: "Discover off-beat destinations and local street food spots.",
  },
  {
    icon: Plane,
    title: "Complete Routes",
    description: "Day-wise breakdown with transport, stay, and activity costs.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">WanderAI</span>
          </div>
          <Button variant="hero" size="sm" onClick={() => navigate("/plan")}>
            Plan a Trip
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Backpacker on a mountain road at sunset"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-28 md:py-40 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 animate-slide-up">
            Travel Smart.
            <br />
            <span className="text-gradient-warm">Spend Less.</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in font-body">
            AI-powered trip planning built for students. Enter your budget, and let us craft the perfect adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button variant="warm" size="lg" onClick={() => navigate("/plan")} className="text-base px-8 py-6">
              Start Planning — It's Free
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
            Why Students Love <span className="text-gradient-hero">WanderAI</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            No fake budgets. No generic plans. Real AI that understands student travel.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-xl bg-card shadow-card border border-border hover:shadow-elevated transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-card-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready for your next adventure?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join thousands of students planning smarter trips with AI.
          </p>
          <Button
            variant="warm"
            size="lg"
            onClick={() => navigate("/plan")}
            className="text-base px-8 py-6"
          >
            Plan My Trip Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © 2026 WanderAI — Built for student explorers 🎒
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
