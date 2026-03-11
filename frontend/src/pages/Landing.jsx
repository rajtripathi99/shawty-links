import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link2, Zap, QrCode, BarChart3 } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            Fast, simple, and free
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Shorten your links,
            <br />
            <span className="text-muted-foreground">track your clicks.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-2">
            Create short links in seconds. Get QR codes automatically.
            See how many people click your links.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">Get Started — it's free</Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Login</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-8 sm:mb-10">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              icon={<Link2 className="h-5 w-5" />}
              title="Short Links"
              description="Turn long URLs into clean, short links that are easy to share."
            />
            <FeatureCard
              icon={<QrCode className="h-5 w-5" />}
              title="QR Codes"
              description="Every link comes with a QR code, ready to download and share."
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Click Tracking"
              description="See how many times your links are clicked, in real time."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="rounded-lg border p-5 sm:p-6 space-y-3">
    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Landing;
