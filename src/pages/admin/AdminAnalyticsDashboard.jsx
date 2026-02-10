
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Eye, TrendingUp } from 'lucide-react';

const SimpleChart = ({ data, labels }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data, 1);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end gap-2 px-2">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 group min-w-[20px]">
            <div className="relative w-full h-full flex items-end bg-slate-50 rounded-t-sm overflow-hidden">
              <div 
                className="w-full bg-sky-500 hover:bg-sky-600 transition-all duration-500 ease-out rounded-t-sm"
                style={{ height: `${(value / maxValue) * 100}%` }}
              >
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-slate-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                  {value} Visits
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 px-2 border-t pt-2">
        {labels.map((label, index) => (
          // Show only some labels to avoid crowding if many days
          (index % Math.ceil(labels.length / 6) === 0 || index === labels.length - 1) && (
            <span key={index} className="text-[10px] text-muted-foreground">
              {label}
            </span>
          )
        ))}
      </div>
    </div>
  );
};

const AdminAnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    visitsByPage: [],
    recentVisitors: [],
    dailyVisits: { labels: [], datasets: [] }
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // 1. Total Visits
      const { count } = await supabase.from('page_visitors').select('*', { count: 'exact', head: true });
      
      // 2. Recent Visitors
      const { data: recent } = await supabase
        .from('page_visitors')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      // 3. Aggregate Visits by Page (Client-side aggregation as raw SQL is restricted)
      const { data: allVisits } = await supabase.from('page_visitors').select('page_path, timestamp');
      
      const pageCounts = {};
      const dailyCounts = {};

      if (allVisits) {
        allVisits.forEach(v => {
          // Page Count
          pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
          
          // Daily Count
          const date = new Date(v.timestamp).toLocaleDateString();
          dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });
      }

      const sortedPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Prepare Chart Data
      const sortedDates = Object.keys(dailyCounts).sort((a, b) => new Date(a) - new Date(b));
      
      setStats({
        totalVisits: count || 0,
        recentVisitors: recent || [],
        visitsByPage: sortedPages,
        dailyVisits: {
          labels: sortedDates,
          datasets: [
            {
              label: 'Daily Visits',
              data: sortedDates.map(d => dailyCounts[d]),
            }
          ]
        }
      });

    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <BarChart className="w-8 h-8 text-sky-600" /> Traffic Analytics
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
            <Eye className="w-4 h-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time page views</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            Visit Trend
          </CardTitle>
        </CardHeader>
        <div className="h-[300px] w-full">
          {stats.dailyVisits.datasets.length > 0 && (
            <SimpleChart 
              data={stats.dailyVisits.datasets[0].data} 
              labels={stats.dailyVisits.labels} 
            />
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Visited Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Path</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.visitsByPage.map((page, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sky-700">{page.path}</TableCell>
                    <TableCell className="text-right">{page.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Visitors */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>User Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentVisitors.map((v, i) => (
                  <TableRow key={i}>
                    <TableCell className="whitespace-nowrap text-xs text-gray-500">
                      {new Date(v.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{v.page_path}</TableCell>
                    <TableCell className="text-xs text-gray-400 max-w-[200px] truncate" title={v.user_agent}>
                      {v.user_agent}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
