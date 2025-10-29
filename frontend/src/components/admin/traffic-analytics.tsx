import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TrafficAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">流量来源分析</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="mb-2">🥧</div>
            <p>流量来源饼图</p>
            <p className="text-sm text-gray-400">将集成图表库显示数据</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
