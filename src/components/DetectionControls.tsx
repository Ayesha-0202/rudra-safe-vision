import React from 'react';
import { Shield, Power } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface PPEDetectionSettings {
  enabled: boolean;
  helmet: boolean;
  goggles: boolean;
  vest: boolean;
  gloves: boolean;
  boots: boolean;
  mask: boolean;
}

interface DetectionControlsProps {
  settings: PPEDetectionSettings;
  onSettingsChange: (settings: PPEDetectionSettings) => void;
  className?: string;
  compact?: boolean;
}

const ppeItems = [
  { key: 'helmet', label: 'Helmet', color: 'bg-destructive' },
  { key: 'goggles', label: 'Goggles', color: 'bg-info' },
  { key: 'vest', label: 'Safety Vest', color: 'bg-warning' },
  { key: 'gloves', label: 'Gloves', color: 'bg-primary' },
  { key: 'boots', label: 'Safety Boots', color: 'bg-muted-foreground' },
  { key: 'mask', label: 'Mask', color: 'bg-violet-500' },
] as const;

const DetectionControls: React.FC<DetectionControlsProps> = ({
  settings,
  onSettingsChange,
  className,
  compact = false,
}) => {
  const handleToggleEnabled = (checked: boolean) => {
    onSettingsChange({ ...settings, enabled: checked });
  };

  const handleTogglePPE = (key: keyof Omit<PPEDetectionSettings, 'enabled'>, checked: boolean) => {
    onSettingsChange({ ...settings, [key]: checked });
  };

  if (compact) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Power className="w-4 h-4 text-primary" />
            <Label className="text-sm font-medium">Detection</Label>
          </div>
          <Switch checked={settings.enabled} onCheckedChange={handleToggleEnabled} />
        </div>
        
        {settings.enabled && (
          <div className="grid grid-cols-2 gap-2">
            {ppeItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg"
              >
                <Checkbox
                  id={`ppe-${item.key}`}
                  checked={settings[item.key]}
                  onCheckedChange={(checked) =>
                    handleTogglePPE(item.key, checked as boolean)
                  }
                />
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', item.color)} />
                  <Label htmlFor={`ppe-${item.key}`} className="text-xs cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            PPE Detection
          </div>
          <Switch checked={settings.enabled} onCheckedChange={handleToggleEnabled} />
        </CardTitle>
      </CardHeader>
      {settings.enabled && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ppeItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-2 p-2.5 bg-muted/30 rounded-lg"
              >
                <Checkbox
                  id={`ppe-card-${item.key}`}
                  checked={settings[item.key]}
                  onCheckedChange={(checked) =>
                    handleTogglePPE(item.key, checked as boolean)
                  }
                />
                <div className="flex items-center gap-2">
                  <div className={cn('w-2.5 h-2.5 rounded-full', item.color)} />
                  <Label htmlFor={`ppe-card-${item.key}`} className="text-sm cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DetectionControls;
