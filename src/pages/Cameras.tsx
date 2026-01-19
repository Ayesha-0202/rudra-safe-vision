import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Video, Wifi, WifiOff, MapPin, Maximize2, X, RefreshCw } from 'lucide-react';
import { cameras, Camera } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const Cameras: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  // Get unique zones
  const zones = [...new Set(cameras.map((c) => c.zone))];

  // Filter cameras
  const filteredCameras = cameras.filter((camera) => {
    const matchesSearch =
      camera.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
    const matchesZone = zoneFilter === 'all' || camera.zone === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  // Check for URL-selected camera
  React.useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      const camera = cameras.find((c) => c.id === selectedId);
      if (camera) {
        setSelectedCamera(camera);
        setSearchParams({});
      }
    }
  }, [searchParams, setSearchParams]);

  const handleCameraClick = (camera: Camera) => {
    setSelectedCamera(camera);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Cameras</h1>
          <p className="text-muted-foreground">Monitor all CCTV feeds in real-time</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by ID or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {zones.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCameras.map((camera, index) => (
          <div
            key={camera.id}
            onClick={() => handleCameraClick(camera)}
            className="camera-tile animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {/* Camera Feed */}
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative flex items-center justify-center group">
              <Video className="w-10 h-10 text-muted-foreground/50" />
              <div className="absolute top-2 left-2">
                <span
                  className={cn(
                    'status-badge',
                    camera.status === 'online' ? 'status-online' : 'status-offline'
                  )}
                >
                  {camera.status === 'online' ? (
                    <Wifi className="w-3 h-3" />
                  ) : (
                    <WifiOff className="w-3 h-3" />
                  )}
                  {camera.status === 'online' ? 'Live' : 'Offline'}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 bg-foreground/70 text-background px-2 py-1 rounded text-xs font-medium">
                {camera.id}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Camera Info */}
            <div className="p-3">
              <h4 className="font-medium text-foreground text-sm truncate">{camera.location}</h4>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {camera.zone}
                </div>
                <span className="text-xs text-muted-foreground">{camera.lastUpdate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCameras.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground">No cameras found matching your filters</p>
        </div>
      )}

      {/* Camera Detail Dialog */}
      <Dialog open={!!selectedCamera} onOpenChange={() => setSelectedCamera(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              {selectedCamera?.id} - {selectedCamera?.location}
            </DialogTitle>
          </DialogHeader>
          {selectedCamera && (
            <div className="space-y-4">
              {/* Large Camera View */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg relative flex items-center justify-center">
                <Video className="w-20 h-20 text-muted-foreground/30" />
                <div className="absolute top-3 left-3">
                  <span
                    className={cn(
                      'status-badge',
                      selectedCamera.status === 'online' ? 'status-online' : 'status-offline'
                    )}
                  >
                    {selectedCamera.status === 'online' ? (
                      <Wifi className="w-3 h-3" />
                    ) : (
                      <WifiOff className="w-3 h-3" />
                    )}
                    {selectedCamera.status === 'online' ? 'Live Feed' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Camera Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Camera ID</p>
                  <p className="font-medium text-foreground">{selectedCamera.id}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Zone</p>
                  <p className="font-medium text-foreground">{selectedCamera.zone}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">{selectedCamera.location}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Last Update</p>
                  <p className="font-medium text-foreground">{selectedCamera.lastUpdate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cameras;
