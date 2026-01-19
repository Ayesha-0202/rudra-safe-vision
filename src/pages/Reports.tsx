import React, { useState } from 'react';
import { FileText, Download, TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import { reportData } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const Reports: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2024-01-13');
  const [dateTo, setDateTo] = useState('2024-01-19');
  const [reportType, setReportType] = useState('compliance');

  // Calculate summary stats
  const avgCompliance = (
    reportData.reduce((sum, d) => sum + d.complianceRate, 0) / reportData.length
  ).toFixed(1);
  const totalViolations = reportData.reduce((sum, d) => sum + d.totalViolations, 0);
  const complianceTrend =
    reportData[reportData.length - 1].complianceRate - reportData[0].complianceRate;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Reports</h1>
          <p className="text-muted-foreground">Historical PPE compliance and violation data</p>
        </div>
        <Button variant="default">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>From Date</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>To Date</Label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compliance">Compliance Overview</SelectItem>
                <SelectItem value="violations">Violation Breakdown</SelectItem>
                <SelectItem value="cameras">By Camera</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Compliance</p>
              <p className="text-3xl font-bold text-foreground">{avgCompliance}%</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
          <p className="text-sm text-success mt-2">
            {complianceTrend > 0 ? '↑' : '↓'} {Math.abs(complianceTrend).toFixed(1)}% trend
          </p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Violations</p>
              <p className="text-3xl font-bold text-foreground">{totalViolations}</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Past 7 days</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Report Period</p>
              <p className="text-xl font-bold text-foreground">7 Days</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {dateFrom} to {dateTo}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Compliance Trend Chart */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Rate Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis
                  domain={[85, 100]}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Compliance Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="complianceRate"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Type Chart */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-lg font-semibold text-foreground mb-4">Violations by Type</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="helmetViolations" name="Helmet" fill="hsl(var(--destructive))" />
                <Bar dataKey="vestViolations" name="Vest" fill="hsl(var(--warning))" />
                <Bar dataKey="otherViolations" name="Other" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Daily Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Total Violations
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Helmet
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Vest
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Other
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Compliance Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reportData.map((row) => (
                <tr key={row.date} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{row.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{row.totalViolations}</td>
                  <td className="px-4 py-3 text-sm text-destructive">{row.helmetViolations}</td>
                  <td className="px-4 py-3 text-sm text-warning">{row.vestViolations}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {row.otherViolations}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`font-medium ${row.complianceRate >= 95 ? 'text-success' : row.complianceRate >= 92 ? 'text-warning' : 'text-destructive'}`}
                    >
                      {row.complianceRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
