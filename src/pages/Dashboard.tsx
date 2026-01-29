import React from 'react';
import { Video, AlertTriangle } from 'lucide-react';
import { cameras, violations, getStatistics } from '@/data/mockData';
import StatCard from '@/components/dashboard/StatCard';
import CameraGrid from '@/components/dashboard/CameraGrid';
import AlertsList from '@/components/dashboard/AlertsList';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const stats = getStatistics();
  const navigate = useNavigate();

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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Camera Grid Section */}
        <div className="xl:col-span-2 bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Live Camera Feeds</h2>
              <p className="text-sm text-muted-foreground">
                {stats.onlineCameras} of {stats.totalCameras} cameras online
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/cameras')}>
              View All
            </Button>
          </div>
          <CameraGrid cameras={cameras} maxDisplay={4} />
        </div>

        {/* Alerts Section */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">PPE Violations</h2>
              <p className="text-sm text-muted-foreground">
                {stats.activeViolations} active alerts
              </p>
            </div>
          </div>
          <AlertsList violations={violations} maxDisplay={5} showViewAll />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
