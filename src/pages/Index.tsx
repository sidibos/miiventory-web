import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Tool, AlertTriangle, History, CheckCircle2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tools"
            value="156"
            icon={Tool}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Alerts"
            value="8"
            icon={AlertTriangle}
            trend={{ value: 2, isPositive: false }}
          />
          <StatsCard
            title="Maintenance Due"
            value="12"
            icon={History}
            trend={{ value: 3, isPositive: false }}
          />
          <StatsCard
            title="Available Tools"
            value="134"
            icon={CheckCircle2}
            trend={{ value: 5, isPositive: true }}
          />
        </div>
        
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-semibold">Recent Activity</h2>
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <p className="text-muted-foreground">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;