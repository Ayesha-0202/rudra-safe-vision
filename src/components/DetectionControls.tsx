import React from 'react';
import { Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface PPEDetectionSettings {
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
  const handleTogglePPE = (key: keyof PPEDetectionSettings, checked: boolean) => {
    onSettingsChange({ ...settings, [key]: checked });
  };

  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">PPE Detection</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ppeItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2 bg-muted/20 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', item.color)} />
                <Label htmlFor={`ppe-${item.key}`} className="text-xs cursor-pointer">
                  {item.label}
                </Label>
              </div>
              <Switch
                id={`ppe-${item.key}`}
                checked={settings[item.key]}
                onCheckedChange={(checked) => handleTogglePPE(item.key, checked)}
                className="scale-75"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="w-4 h-4 text-primary" />
          PPE Detection Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-3">
          {ppeItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className={cn('w-2.5 h-2.5 rounded-full', item.color)} />
                <Label htmlFor={`ppe-card-${item.key}`} className="text-sm cursor-pointer">
                  {item.label}
                </Label>
              </div>
              <Switch
                id={`ppe-card-${item.key}`}
                checked={settings[item.key]}
                onCheckedChange={(checked) => handleTogglePPE(item.key, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionControls;
