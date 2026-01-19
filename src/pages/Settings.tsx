import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Camera,
  Shield,
  Users,
  Database,
  Save,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Notification settings
    emailAlerts: true,
    pushNotifications: true,
    soundAlerts: true,
    alertThreshold: 'high',
    
    // Detection settings
    helmetDetection: true,
    vestDetection: true,
    gogglesDetection: true,
    glovesDetection: false,
    bootsDetection: false,
    confidenceThreshold: '80',
    
    // System settings
    retentionDays: '30',
    autoArchive: true,
    compressionLevel: 'medium',
  });

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your configuration has been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and alerts</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-card">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="detection" className="data-[state=active]:bg-card">
            <Shield className="w-4 h-4 mr-2" />
            Detection
          </TabsTrigger>
          <TabsTrigger value="cameras" className="data-[state=active]:bg-card">
            <Camera className="w-4 h-4 mr-2" />
            Cameras
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-card">
            <Database className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Alert Preferences</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive violation alerts via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailAlerts: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, pushNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when violations are detected
                  </p>
                </div>
                <Switch
                  checked={settings.soundAlerts}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, soundAlerts: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alert Threshold</Label>
                <Select
                  value={settings.alertThreshold}
                  onValueChange={(value) =>
                    setSettings({ ...settings, alertThreshold: value })
                  }
                >
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Violations</SelectItem>
                    <SelectItem value="high">High Severity Only</SelectItem>
                    <SelectItem value="medium">Medium and Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Detection Tab */}
        <TabsContent value="detection" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">PPE Detection Settings</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-destructive rounded-full" />
                    <Label>Helmet Detection</Label>
                  </div>
                  <Switch
                    checked={settings.helmetDetection}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, helmetDetection: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-warning rounded-full" />
                    <Label>Safety Vest Detection</Label>
                  </div>
                  <Switch
                    checked={settings.vestDetection}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, vestDetection: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-info rounded-full" />
                    <Label>Goggles Detection</Label>
                  </div>
                  <Switch
                    checked={settings.gogglesDetection}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, gogglesDetection: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <Label>Gloves Detection</Label>
                  </div>
                  <Switch
                    checked={settings.glovesDetection}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, glovesDetection: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-muted-foreground rounded-full" />
                    <Label>Safety Boots Detection</Label>
                  </div>
                  <Switch
                    checked={settings.bootsDetection}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, bootsDetection: checked })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Detection Confidence Threshold (%)</Label>
                <Input
                  type="number"
                  min="50"
                  max="99"
                  value={settings.confidenceThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, confidenceThreshold: e.target.value })
                  }
                  className="w-full sm:w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum confidence level for violation detection (50-99%)
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Cameras Tab */}
        <TabsContent value="cameras" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Camera Configuration</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Camera management and configuration options will be displayed here. Click on any
                camera to modify its settings.
              </p>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Camera List
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Data Management</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Footage Retention Period (Days)</Label>
                <Input
                  type="number"
                  min="7"
                  max="365"
                  value={settings.retentionDays}
                  onChange={(e) =>
                    setSettings({ ...settings, retentionDays: e.target.value })
                  }
                  className="w-full sm:w-32"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-Archive</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically archive footage after retention period
                  </p>
                </div>
                <Switch
                  checked={settings.autoArchive}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoArchive: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Video Compression</Label>
                <Select
                  value={settings.compressionLevel}
                  onValueChange={(value) =>
                    setSettings({ ...settings, compressionLevel: value })
                  }
                >
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Best Quality)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="high">High (Space Efficient)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">System Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-medium text-foreground">1.0.0</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Last Update</p>
                <p className="font-medium text-foreground">January 19, 2024</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="font-medium text-foreground">245 GB / 1 TB</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="font-medium text-foreground">12</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
