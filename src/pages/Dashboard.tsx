import React from 'react';
import { Video, AlertTriangle } from 'lucide-react';
import { reportData, getStatistics } from '@/data/mockData';
import StatCard from '@/components/dashboard/StatCard';
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

// Helper to format date as DD/MM/YYYY
const formatDateDDMMYYYY = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const Dashboard: React.FC = () => {
  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Real-time safety monitoring overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Total Cameras"
          value={stats.totalCameras}
          icon={Video}
          variant="default"
          navigateTo="/cameras"
        />
        <StatCard
          title="Today's Violations Count"
          value={stats.todayViolations}
          icon={AlertTriangle}
          variant="danger"
          trend={{ value: 12, isPositive: false }}
          navigateTo="/alerts"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Compliance Rate Trend Chart */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Rate Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => formatDateDDMMYYYY(value).slice(0, 5)}
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
                  labelFormatter={(label) => formatDateDDMMYYYY(label)}
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
                  tickFormatter={(value) => formatDateDDMMYYYY(value).slice(0, 5)}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(label) => formatDateDDMMYYYY(label)}
                />
                <Legend />
                <Bar dataKey="helmetViolations" name="Helmet" fill="hsl(var(--destructive))" />
                <Bar dataKey="vestViolations" name="Vest" fill="hsl(var(--warning))" />
                <Bar dataKey="glovesViolations" name="Gloves" fill="hsl(var(--primary))" />
                <Bar dataKey="maskViolations" name="Mask" fill="hsl(280 60% 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
