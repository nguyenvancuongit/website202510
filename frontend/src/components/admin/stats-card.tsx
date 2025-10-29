import { LucideIcon, TrendingDown,TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

export function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  const isPositive = trend === "up";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={cn(
              "p-2 rounded-lg flex-shrink-0",
              isPositive ? "bg-blue-50" : "bg-gray-50"
            )}>
              <Icon className={cn(
                "h-4 w-4 md:h-5 md:w-5",
                isPositive ? "text-blue-600" : "text-gray-600"
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1 truncate">{title}</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">{value}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <div className={cn(
              "flex items-center space-x-1 text-xs md:text-sm",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              )}
              <span className="whitespace-nowrap">{change}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
