import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    user: "数据库连接失败",
    action: "系统故障",
    time: "2024年8月20日 09:32",
    type: "error"
  },
  {
    id: 2,
    user: "新用户注册 - 张三",
    action: "用户管理",
    time: "2024年8月20日 08:15",
    type: "user"
  },
  {
    id: 3,
    user: "月度数据备份完成",
    action: "系统运行",
    time: "2024年8月19日 23:59",
    type: "system"
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">最近活动</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                  {activity.type === "error" ? "❌" : 
                   activity.type === "user" ? "👤" : "⚙️"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.user}
                </p>
                <p className="text-xs text-gray-500">{activity.action}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
