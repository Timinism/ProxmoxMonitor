import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

export function ResourceCharts() {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Resource Usage</h3>
            <Select defaultValue="24h">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-64 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-2 opacity-50" size={48} />
              <p>Resource Usage Chart</p>
              <p className="text-sm">(Chart integration available)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
