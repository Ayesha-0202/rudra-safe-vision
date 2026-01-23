import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, MapPin, Camera, ChevronRight } from 'lucide-react';
import { Violation } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AlertsListProps {
  violations: Violation[];
  maxDisplay?: number;
  showViewAll?: boolean;
}

const AlertsList: React.FC<AlertsListProps> = ({
  violations,
  maxDisplay = 5,
  showViewAll = true,
}) => {
  const navigate = useNavigate();
  const displayViolations = violations
    .filter((v) => v.status === 'active' || v.status === 'acknowledged')
    .slice(0, maxDisplay);

  const handleAlertClick = (violationId: string) => {
    navigate(`/alerts?selected=${violationId}`);
  };

  return (
    <div className="space-y-3">
      {displayViolations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active violations</p>
        </div>
      ) : (
        displayViolations.map((violation, index) => (
          <div
            key={violation.id}
            onClick={() => handleAlertClick(violation.id)}
            className={cn(
              'alert-card cursor-pointer animate-fade-in border-l-4',
              violation.status === 'active' ? 'border-l-destructive' : 'border-l-warning'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg flex-shrink-0 bg-destructive/10 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{violation.type}</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      {violation.cameraId}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {violation.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {violation.timestamp.split(' ')[1]}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        ))
      )}

      {showViewAll && displayViolations.length > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/alerts')}
        >
          View All Alerts
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default AlertsList;
