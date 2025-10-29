import { Monitor, Smartphone, Tablet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const deviceStats = [
  { device: "桌面端", percentage: "65.2%", icon: Monitor },
  { device: "移动端", percentage: "32.8%", icon: Smartphone },
  { device: "平板", percentage: "2.0%", icon: Tablet },
];

export function DeviceStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">设备类型</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deviceStats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{item.device}</span>
                </div>
                <span className="text-sm font-medium">{item.percentage}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
