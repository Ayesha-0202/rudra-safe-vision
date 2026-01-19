import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Camera,
  Eye,
  X,
} from 'lucide-react';
import { violations, Violation } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const severityBadgeStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-muted text-muted-foreground border-muted-foreground/20',
};

const statusBadgeStyles = {
  active: 'bg-destructive/10 text-destructive',
  acknowledged: 'bg-warning/10 text-warning',
  resolved: 'bg-success/10 text-success',
};

const Alerts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  // Filter violations
  const filteredViolations = violations.filter((violation) => {
    const matchesSearch =
      violation.cameraId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || violation.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const activeCount = violations.filter((v) => v.status === 'active').length;
  const totalToday = violations.length;

  // Check for URL-selected violation
  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      const violation = violations.find((v) => v.id === selectedId);
      if (violation) {
        setSelectedViolation(violation);
        setSearchParams({});
      }
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">PPE Violation Alerts</h1>
          <p className="text-muted-foreground">
            {activeCount} active alerts • {totalToday} total today
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStatusFilter('active')}
          className={cn(
            'p-4 rounded-lg border cursor-pointer transition-all',
            statusFilter === 'active'
              ? 'bg-destructive/10 border-destructive'
              : 'bg-card border-border hover:border-destructive/50'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Active Alerts</span>
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{activeCount}</p>
        </div>
        <div
          onClick={() => setSeverityFilter('high')}
          className={cn(
            'p-4 rounded-lg border cursor-pointer transition-all',
            severityFilter === 'high'
              ? 'bg-destructive/10 border-destructive'
              : 'bg-card border-border hover:border-destructive/50'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">High Severity</span>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            {violations.filter((v) => v.severity === 'high').length}
          </p>
        </div>
        <div
          onClick={() => {
            setStatusFilter('all');
            setSeverityFilter('all');
          }}
          className={cn(
            'p-4 rounded-lg border cursor-pointer transition-all',
            statusFilter === 'all' && severityFilter === 'all'
              ? 'bg-primary/10 border-primary'
              : 'bg-card border-border hover:border-primary/50'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Today</span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalToday}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by camera, location, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:w-72"
        />
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        {(severityFilter !== 'all' || statusFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSeverityFilter('all');
              setStatusFilter('all');
            }}
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredViolations.map((violation, index) => (
          <div
            key={violation.id}
            onClick={() => setSelectedViolation(violation)}
            className={cn(
              'rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md animate-fade-in',
              violation.status === 'active' 
                ? 'bg-[hsl(var(--alert-highlight))] border-l-4 border-l-destructive/60 border-t-border border-r-border border-b-border'
                : 'bg-card border-border'
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={cn(
                    'p-2.5 rounded-lg flex-shrink-0',
                    severityBadgeStyles[violation.severity]
                  )}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">{violation.type}</h4>
                    <Badge variant="outline" className={severityBadgeStyles[violation.severity]}>
                      {violation.severity}
                    </Badge>
                    <Badge variant="secondary" className={statusBadgeStyles[violation.status]}>
                      {violation.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Camera className="w-4 h-4 flex-shrink-0" />
                      <span>{violation.cameraId}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{violation.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{violation.timestamp}</span>
                    </div>
                    {violation.employeeId && (
                      <div className="text-muted-foreground">
                        <span className="text-xs">Employee: {violation.employeeId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredViolations.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">No violations found matching your filters</p>
        </div>
      )}

      {/* Violation Detail Dialog */}
      <Dialog open={!!selectedViolation} onOpenChange={() => setSelectedViolation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Violation Details
            </DialogTitle>
          </DialogHeader>
          {selectedViolation && (
            <div className="space-y-4">
              {/* Snapshot placeholder */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                <Camera className="w-16 h-16 text-muted-foreground/30" />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Violation Type</p>
                  <p className="font-medium text-foreground">{selectedViolation.type}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <Badge className={severityBadgeStyles[selectedViolation.severity]}>
                    {selectedViolation.severity}
                  </Badge>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Camera</p>
                  <p className="font-medium text-foreground">{selectedViolation.cameraId}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{selectedViolation.location}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="font-medium text-foreground">{selectedViolation.timestamp}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusBadgeStyles[selectedViolation.status]}>
                    {selectedViolation.status}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  View Camera
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Alerts;
