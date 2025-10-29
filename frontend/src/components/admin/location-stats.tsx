import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const locationStats = [
  { location: "北京", percentage: "28.5%" },
  { location: "上海", percentage: "18.3%" },
  { location: "广州", percentage: "12.3%" },
  { location: "深圳", percentage: "10.2%" },
  { location: "杭州", percentage: "8.7%" },
  { location: "成都", percentage: "7.5%" },
  { location: "武汉", percentage: "10.2%" },
];

export function LocationStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">地域分布</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locationStats.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.location}</span>
              <span className="text-sm font-medium">{item.percentage}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
