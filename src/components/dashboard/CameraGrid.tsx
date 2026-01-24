import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Wifi, WifiOff, MapPin } from 'lucide-react';
import { Camera } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CameraGridProps {
  cameras: Camera[];
  maxDisplay?: number;
}

const CameraGrid: React.FC<CameraGridProps> = ({ cameras, maxDisplay = 6 }) => {
  const navigate = useNavigate();
  const displayCameras = cameras.slice(0, maxDisplay);

  const handleCameraClick = (cameraId: string) => {
    navigate(`/cameras?selected=${cameraId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayCameras.map((camera, index) => (
        <div
          key={camera.id}
          onClick={() => handleCameraClick(camera.id)}
          className="camera-tile animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Camera Feed Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative flex items-center justify-center">
            <Video className="w-12 h-12 text-muted-foreground/50" />
            <div className="absolute top-2 left-2">
              <span className={cn(
                'status-badge',
                camera.status === 'online' ? 'status-online' : 'status-offline'
              )}>
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
          </div>
          
          {/* Camera Info */}
          <div className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-foreground text-sm">{camera.location}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  {camera.id}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{camera.lastUpdate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CameraGrid;
