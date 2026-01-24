import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Camera,
  Search,
  CheckCircle,
} from 'lucide-react';
import { violations, Violation } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Alerts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  // Filter violations by search only
  const filteredViolations = violations.filter((violation) => {
    const matchesSearch =
      violation.cameraId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalToday = violations.length;
  const acknowledgedCount = violations.filter((v) => v.status === 'acknowledged').length;

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">PPE Violation Alerts</h1>
        <p className="text-muted-foreground">Monitor and manage safety violations</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by camera, location, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-card border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Violations Today</span>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalToday}</p>
        </div>
        <div className="p-4 rounded-lg border bg-card border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Acknowledged</span>
            <CheckCircle className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{acknowledgedCount}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredViolations.map((violation, index) => (
          <div
            key={violation.id}
            onClick={() => setSelectedViolation(violation)}
            className="rounded-lg border border-border bg-card p-4 cursor-pointer transition-all hover:shadow-md animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2.5 rounded-lg flex-shrink-0 bg-destructive/10 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">{violation.type}</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
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
          <p className="text-muted-foreground">No violations found matching your search</p>
        </div>
      )}

      {/* Violation Detail Dialog */}
      <Dialog open={!!selectedViolation} onOpenChange={() => setSelectedViolation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Violation Details
            </DialogTitle>
          </DialogHeader>
          {selectedViolation && (
            <div className="space-y-4">
              {/* Compact snapshot placeholder */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                <Camera className="w-12 h-12 text-muted-foreground/30" />
              </div>

              {/* Details Grid - Compact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Violation Type</p>
                  <p className="font-medium text-foreground text-sm">{selectedViolation.type}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Camera</p>
                  <p className="font-medium text-foreground text-sm">{selectedViolation.cameraId}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground text-sm">{selectedViolation.location}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p className="font-medium text-foreground text-sm">{selectedViolation.timestamp}</p>
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
