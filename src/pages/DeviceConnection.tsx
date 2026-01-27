import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  MonitorPlay, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Play,
  Square,
  AlertTriangle,
  Shield,
  HardHat,
  Eye,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DetectionControls, { PPEDetectionSettings } from '@/components/DetectionControls';

type ConnectionStatus = 'disconnected' | 'connecting' | 'awaiting_approval' | 'connected' | 'failed';
type AnalysisStatus = 'idle' | 'running' | 'stopped';

interface DetectedViolation {
  id: string;
  type: string;
  timestamp: string;
}

const DeviceConnection: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [pendingIp, setPendingIp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [connectedDeviceIp, setConnectedDeviceIp] = useState('');
  const [violations, setViolations] = useState<DetectedViolation[]>([]);
  const [detectionSettings, setDetectionSettings] = useState<PPEDetectionSettings>({
    helmet: true,
    vest: true,
    gloves: true,
    mask: true,
  });

  // Simulate incoming connection request (for demo purposes)
  useEffect(() => {
    const handleStorageChange = () => {
      const request = localStorage.getItem('connection_request');
      if (request) {
        const { ip, timestamp } = JSON.parse(request);
        if (Date.now() - timestamp < 30000) {
          setPendingIp(ip);
          setShowApprovalDialog(true);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simulate PPE violations when analysis is running based on detection settings
  useEffect(() => {
    if (analysisStatus !== 'running') return;

    const violationTypes: string[] = [];
    if (detectionSettings.helmet) violationTypes.push('Helmet Missing');
    if (detectionSettings.vest) violationTypes.push('Safety Vest Missing');
    if (detectionSettings.gloves) violationTypes.push('Gloves Missing');
    if (detectionSettings.mask) violationTypes.push('Mask Missing');

    if (violationTypes.length === 0) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newViolation: DetectedViolation = {
          id: Date.now().toString(),
          type: violationTypes[Math.floor(Math.random() * violationTypes.length)],
          timestamp: new Date().toLocaleTimeString(),
        };
        setViolations(prev => [newViolation, ...prev].slice(0, 10));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [analysisStatus, detectionSettings]);

  const validateIpAddress = (ip: string): boolean => {
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) return false;
    const parts = ip.split('.').map(Number);
    return parts.every(part => part >= 0 && part <= 255);
  };

  const handleConnect = async () => {
    if (!validateIpAddress(ipAddress)) {
      setErrorMessage('Please enter a valid IP address');
      return;
    }

    setErrorMessage('');
    setConnectionStatus('connecting');

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setConnectionStatus('awaiting_approval');

    // Simulate sending connection request to target device
    localStorage.setItem('connection_request', JSON.stringify({
      ip: '192.168.1.100', // Current device IP (simulated)
      timestamp: Date.now()
    }));

    // Simulate waiting for approval with timeout
    const timeout = setTimeout(() => {
      if (connectionStatus === 'awaiting_approval') {
        setConnectionStatus('failed');
        setErrorMessage('Connection request timed out. The target device did not respond.');
      }
    }, 15000);

    // Simulate approval after some time (for demo)
    setTimeout(() => {
      clearTimeout(timeout);
      setConnectionStatus('connected');
      setConnectedDeviceIp(ipAddress);
    }, 3000);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setAnalysisStatus('idle');
    setConnectedDeviceIp('');
    setViolations([]);
    setIpAddress('');
  };

  const handleApproveConnection = () => {
    setShowApprovalDialog(false);
    localStorage.removeItem('connection_request');
    // In a real app, this would send an approval response
  };

  const handleRejectConnection = () => {
    setShowApprovalDialog(false);
    localStorage.removeItem('connection_request');
    // In a real app, this would send a rejection response
  };

  const handleStartAnalysis = () => {
    setAnalysisStatus('running');
  };

  const handleStopAnalysis = () => {
    setAnalysisStatus('stopped');
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Connected</Badge>;
      case 'connecting':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Connecting...</Badge>;
      case 'awaiting_approval':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Awaiting Approval</Badge>;
      case 'failed':
        return <Badge variant="destructive">Connection Failed</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  const getViolationIcon = (type: string) => {
    if (type.toLowerCase().includes('mask')) {
      return <Stethoscope className="w-4 h-4 text-amber-600" />;
    }
    return <HardHat className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Device Connection</h1>
        <p className="text-muted-foreground mt-1">
          Connect to remote devices on your network for live PPE monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary" />
                Network Connection
              </CardTitle>
              <CardDescription>
                Enter the IP address of the target device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ip">Target Device IP Address</Label>
                <Input
                  id="ip"
                  type="text"
                  placeholder="192.168.1.100"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  disabled={connectionStatus !== 'disconnected' && connectionStatus !== 'failed'}
                />
                {errorMessage && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                {getStatusBadge()}
              </div>

              {connectionStatus === 'disconnected' || connectionStatus === 'failed' ? (
                <Button 
                  onClick={handleConnect} 
                  className="w-full"
                  disabled={!ipAddress}
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              ) : connectionStatus === 'connecting' || connectionStatus === 'awaiting_approval' ? (
                <Button disabled className="w-full">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {connectionStatus === 'connecting' ? 'Connecting...' : 'Awaiting Approval...'}
                </Button>
              ) : (
                <Button onClick={handleDisconnect} variant="destructive" className="w-full">
                  <WifiOff className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              )}

              {connectionStatus === 'connected' && (
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-foreground">Connected to {connectedDeviceIp}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>PPE Analysis Control</Label>
                    <div className="flex gap-2">
                      {analysisStatus !== 'running' ? (
                        <Button 
                          onClick={handleStartAnalysis} 
                          className="flex-1" 
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Analysis
                        </Button>
                      ) : (
                        <Button onClick={handleStopAnalysis} variant="destructive" className="flex-1" size="sm">
                          <Square className="w-4 h-4 mr-2" />
                          Stop Analysis
                        </Button>
                      )}
                    </div>
                    {analysisStatus === 'running' && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Analysis Running
                      </div>
                    )}
                  </div>
                </div>
              )}

              {connectionStatus === 'failed' && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Connection Failed</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {errorMessage || 'Unable to connect to the target device. Please verify the IP address and try again.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detection Controls */}
          <DetectionControls
            settings={detectionSettings}
            onSettingsChange={setDetectionSettings}
          />
        </div>

        {/* Live Feed Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-primary" />
              Remote Device Feed
            </CardTitle>
            <CardDescription>
              {connectionStatus === 'connected' 
                ? `Live feed from ${connectedDeviceIp}`
                : 'Connect to a device to view live feed'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectionStatus === 'connected' ? (
              <div className="space-y-4">
                {/* Simulated Video Feed */}
                <div className="aspect-video bg-muted rounded-lg relative overflow-hidden border border-border">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                    <div className="text-center space-y-3">
                      <Eye className="w-16 h-16 text-slate-600 mx-auto" />
                      <p className="text-slate-400 text-sm">Live Camera Feed</p>
                      <p className="text-slate-500 text-xs">{connectedDeviceIp}</p>
                    </div>
                    
                    {/* Status overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${analysisStatus === 'running' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <span className="text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded">
                        {analysisStatus === 'running' ? 'REC • Analyzing' : 'LIVE'}
                      </span>
                    </div>

                    {/* Timestamp overlay */}
                    <div className="absolute bottom-3 right-3">
                      <span className="text-white text-xs font-mono bg-black/50 px-2 py-0.5 rounded">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detected Violations */}
                {analysisStatus === 'running' && violations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Detected Violations
                    </h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {violations.map((violation) => (
                        <div
                          key={violation.id}
                          className="p-3 rounded-lg bg-[hsl(var(--alert-highlight))] border-l-4 border-l-destructive/60 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            {getViolationIcon(violation.type)}
                            <span className="text-sm font-medium text-foreground">{violation.type}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{violation.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisStatus === 'running' && violations.length === 0 && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-700 dark:text-emerald-400">All Clear</p>
                      <p className="text-sm text-muted-foreground">No PPE violations detected</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border border-border">
                <div className="text-center space-y-3">
                  <WifiOff className="w-16 h-16 text-muted-foreground/50 mx-auto" />
                  <p className="text-muted-foreground">No device connected</p>
                  <p className="text-sm text-muted-foreground/70">
                    Enter an IP address and click Connect to view remote camera feed
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Connection Approval Dialog (for target device) */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              Incoming Connection Request
            </DialogTitle>
            <DialogDescription>
              A device is requesting to connect to your camera feed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Request from IP:</p>
              <p className="font-mono font-medium text-foreground">{pendingIp}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Do you want to allow this device to access your camera feed and enable PPE detection?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleRejectConnection}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApproveConnection}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceConnection;
