import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const popularPages = [
  { page: "首页", visits: "45,678", percentage: "45.2%" },
  { page: "关于我们", visits: "23,456", percentage: "32.8%" },
  { page: "联系我们", visits: "18,234", percentage: "18.8%" },
  { page: "关于我们", visits: "12,345", percentage: "12.3%" },
];

export function PopularPages() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">热门页面</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularPages.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{item.page}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{item.visits}</span>
                <span className="text-xs text-gray-500">{item.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
