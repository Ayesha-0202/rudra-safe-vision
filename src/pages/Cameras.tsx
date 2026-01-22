import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Video, Wifi, WifiOff, MapPin, AlertTriangle, Clock, ChevronRight, ChevronDown, HardHat, Shirt, Glasses, Hand, Stethoscope, Play, Square } from 'lucide-react';
import { cameras, violations, Camera } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DetectionControls, { PPEDetectionSettings } from '@/components/DetectionControls';

const violationTypeIcons: Record<string, React.ReactNode> = {
  'Helmet Missing': <HardHat className="w-4 h-4" />,
  'Safety Vest Missing': <Shirt className="w-4 h-4" />,
  'Goggles Missing': <Glasses className="w-4 h-4" />,
  'Gloves Missing': <Hand className="w-4 h-4" />,
  'Mask Missing': <Stethoscope className="w-4 h-4" />,
};

const Cameras: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCamera, setSelectedCamera] = useState<Camera>(cameras[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionSettings, setDetectionSettings] = useState<PPEDetectionSettings>({
    helmet: true,
    goggles: true,
    vest: true,
    gloves: true,
    boots: true,
    mask: true,
  });

  // Get violations for selected camera
  const cameraViolations = violations.filter(
    (v) => v.cameraId === selectedCamera.id && v.status === 'active'
  );

  // Check for URL-selected camera
  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      const camera = cameras.find((c) => c.id === selectedId);
      if (camera) {
        setSelectedCamera(camera);
        setSearchParams({});
      }
    }
  }, [searchParams, setSearchParams]);

  const handleCameraSelect = (cameraId: string) => {
    const camera = cameras.find((c) => c.id === cameraId);
    if (camera) {
      setSelectedCamera(camera);
      setIsAnalyzing(false);
    }
  };

  const toggleAnalysis = () => {
    setIsAnalyzing(!isAnalyzing);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Main Camera View */}
      <div className="flex-1 flex flex-col">
        {/* Top Section: Camera Dropdown + Analyze Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Live Cameras</h1>
              <p className="text-muted-foreground">Real-time CCTV monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedCamera.id} onValueChange={handleCameraSelect}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        camera.status === 'online' ? 'bg-success' : 'bg-muted-foreground'
                      )} />
                      {camera.id} - {camera.location}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={toggleAnalysis}
              variant={isAnalyzing ? "destructive" : "default"}
              disabled={selectedCamera.status === 'offline'}
            >
              {isAnalyzing ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Primary Camera Feed */}
        <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="h-full flex flex-col">
            {/* Camera Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={cn(
                    'font-mono',
                    selectedCamera.status === 'online'
                      ? 'bg-success/10 text-success border-success/30'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {selectedCamera.status === 'online' ? (
                    <Wifi className="w-3 h-3 mr-1" />
                  ) : (
                    <WifiOff className="w-3 h-3 mr-1" />
                  )}
                  {selectedCamera.status === 'online' ? 'LIVE' : 'OFFLINE'}
                </Badge>
                <div>
                  <h2 className="font-semibold text-foreground">{selectedCamera.id}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCamera.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {selectedCamera.zone}
              </div>
            </div>

            {/* Camera Feed Area */}
            <div className="flex-1 bg-gradient-to-br from-muted to-muted/30 flex items-center justify-center relative">
              <Video className="w-24 h-24 text-muted-foreground/20" />
              {selectedCamera.status === 'offline' && (
                <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center">
                  <div className="text-center">
                    <WifiOff className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-muted-foreground font-medium">Camera Offline</p>
                    <p className="text-sm text-muted-foreground/70">Last seen: {selectedCamera.lastUpdate}</p>
                  </div>
                </div>
              )}
              {/* Detection status overlay */}
              {isAnalyzing && selectedCamera.status === 'online' && (
                <div className="absolute top-4 left-4 bg-foreground/70 text-background px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Detection Active
                </div>
              )}
              {/* Timestamp overlay */}
              <div className="absolute bottom-4 left-4 bg-foreground/70 text-background px-3 py-1.5 rounded text-sm font-mono">
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Context Information Panel */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Detection Controls */}
          <DetectionControls
            settings={detectionSettings}
            onSettingsChange={setDetectionSettings}
            compact
          />

          {/* PPE Status */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">PPE Status</h3>
            <div className="flex items-center gap-2">
              {cameraViolations.length === 0 ? (
                <Badge className="bg-success/10 text-success border-success/30">
                  All Compliant
                </Badge>
              ) : (
                <Badge className="bg-destructive/10 text-destructive border-destructive/30">
                  {cameraViolations.length} Active Violation{cameraViolations.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {/* Current Violations */}
          <div className="bg-card rounded-lg border border-border p-4 md:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Current Violations</h3>
            {cameraViolations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active violations detected</p>
            ) : (
              <div className="space-y-2">
                {cameraViolations.slice(0, 3).map((violation) => (
                  <div
                    key={violation.id}
                    className="flex items-center justify-between text-sm p-2 bg-destructive/5 rounded-lg border border-destructive/10"
                  >
                    <div className="flex items-center gap-2">
                      {violationTypeIcons[violation.type] || <AlertTriangle className="w-4 h-4" />}
                      <span className="text-foreground">{violation.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {violation.timestamp.split(' ')[1]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel: PPE Detection Settings */}
      <div className="w-72 flex flex-col">
        <div className="mb-3">
          <h3 className="font-semibold text-foreground">Detection Settings</h3>
          <p className="text-xs text-muted-foreground">Configure PPE monitoring</p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4">
          <DetectionControls
            settings={detectionSettings}
            onSettingsChange={setDetectionSettings}
            compact
          />
        </div>

        {/* Camera Quick List */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Quick Select</h4>
          <ScrollArea className="h-[calc(100vh-24rem)]">
            <div className="space-y-2 pr-3">
              {cameras.map((camera) => (
                <div
                  key={camera.id}
                  onClick={() => handleCameraSelect(camera.id)}
                  className={cn(
                    'p-2 rounded-lg border cursor-pointer transition-all text-sm',
                    selectedCamera.id === camera.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        camera.status === 'online' ? 'bg-success' : 'bg-muted-foreground/50'
                      )} />
                      <span className="font-medium text-foreground">{camera.id}</span>
                    </div>
                    {selectedCamera.id === camera.id && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">Selected</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{camera.location}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Cameras;
