import React, { useState } from 'react';
import { Upload, Video, CheckCircle, AlertCircle, X, FileVideo, Clock, AlertTriangle, HardHat, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import DetectionControls, { PPEDetectionSettings } from '@/components/DetectionControls';

interface UploadedVideo {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  size: string;
  violations?: { type: string; count: number }[];
}

const VideoUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectionSettings, setDetectionSettings] = useState<PPEDetectionSettings>({
    helmet: true,
    goggles: true,
    vest: true,
    gloves: true,
    boots: true,
    mask: true,
  });
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([
    {
      id: '1',
      fileName: 'warehouse_footage_01.mp4',
      uploadedAt: '2024-01-15 14:30',
      status: 'completed',
      progress: 100,
      size: '256 MB',
      violations: [
        { type: 'Helmet Missing', count: 3 },
        { type: 'Safety Vest Missing', count: 2 },
      ],
    },
    {
      id: '2',
      fileName: 'assembly_line_review.mp4',
      uploadedAt: '2024-01-14 09:15',
      status: 'completed',
      progress: 100,
      size: '412 MB',
      violations: [
        { type: 'Mask Missing', count: 4 },
        { type: 'Safety Goggles Missing', count: 5 },
      ],
    },
    {
      id: '3',
      fileName: 'entrance_cam_morning.mp4',
      uploadedAt: '2024-01-13 08:00',
      status: 'failed',
      progress: 100,
      size: '128 MB',
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/quicktime', 'video/webm'];
      if (validTypes.includes(file.type) || file.name.endsWith('.avi')) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid video file (MP4, AVI, MOV, or WebM)');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = ['video/mp4', 'video/avi', 'video/x-msvideo', 'video/quicktime', 'video/webm'];
      if (validTypes.includes(file.type) || file.name.endsWith('.avi')) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid video file (MP4, AVI, MOV, or WebM)');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1073741824) {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    } else {
      return (bytes / 1024).toFixed(2) + ' KB';
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    const newVideo: UploadedVideo = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      uploadedAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'uploading',
      progress: 0,
      size: formatFileSize(selectedFile.size),
    };

    setUploadedVideos(prev => [newVideo, ...prev]);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate upload completion
    setTimeout(() => {
      setUploadedVideos(prev =>
        prev.map(v =>
          v.id === newVideo.id ? { ...v, status: 'processing', progress: 100 } : v
        )
      );
      
      // Simulate processing completion with random violations based on enabled detection settings
      setTimeout(() => {
        const possibleViolations = [];
        if (detectionSettings.helmet) possibleViolations.push({ type: 'Helmet Missing', count: Math.floor(Math.random() * 5) + 1 });
        if (detectionSettings.vest) possibleViolations.push({ type: 'Safety Vest Missing', count: Math.floor(Math.random() * 3) + 1 });
        if (detectionSettings.mask) possibleViolations.push({ type: 'Mask Missing', count: Math.floor(Math.random() * 4) + 1 });
        if (detectionSettings.goggles) possibleViolations.push({ type: 'Goggles Missing', count: Math.floor(Math.random() * 2) + 1 });

        const randomViolations = Math.random() > 0.3 ? possibleViolations.slice(0, 2) : [];

        setUploadedVideos(prev =>
          prev.map(v =>
            v.id === newVideo.id ? { 
              ...v, 
              status: 'completed',
              violations: randomViolations 
            } : v
          )
        );
        setIsUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
      }, 3000);
    }, 3000);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const getStatusIcon = (status: UploadedVideo['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'uploading':
        return <Upload className="w-5 h-5 text-primary animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: UploadedVideo['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Processing</Badge>;
      case 'uploading':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Uploading</Badge>;
      default:
        return null;
    }
  };

  const getViolationIcon = (type: string) => {
    if (type.toLowerCase().includes('mask')) {
      return <Stethoscope className="w-3 h-3" />;
    }
    return <HardHat className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Video Upload</h1>
        <p className="text-muted-foreground mt-1">
          Upload video files for automatic PPE compliance analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Video
              </CardTitle>
              <CardDescription>
                Select a video file to analyze for PPE violations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors relative ${
                  selectedFile
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <FileVideo className="w-10 h-10 text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="ml-auto"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Video className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-foreground font-medium">
                        Drag and drop your video file here
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: MP4, AVI, MOV, WebM
                    </p>
                    <input
                      type="file"
                      accept="video/mp4,video/avi,video/x-msvideo,video/quicktime,video/webm,.avi"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* File Input (visible button) */}
              {!selectedFile && (
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Browse Files
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="video/mp4,video/avi,video/x-msvideo,video/quicktime,video/webm,.avi"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium text-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Detection Controls */}
          <DetectionControls
            settings={detectionSettings}
            onSettingsChange={setDetectionSettings}
          />
        </div>

        {/* Upload History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="w-5 h-5 text-primary" />
              Upload History
            </CardTitle>
            <CardDescription>
              Previously uploaded videos and their analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedVideos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No videos uploaded yet</p>
                </div>
              ) : (
                uploadedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileVideo className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground truncate">
                            {video.fileName}
                          </p>
                          {getStatusBadge(video.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.uploadedAt}
                          </span>
                          <span>{video.size}</span>
                        </div>

                        {/* Violations Summary */}
                        {video.status === 'completed' && video.violations && video.violations.length > 0 && (
                          <div className="mt-3 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              Detected Violations:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {video.violations.map((v, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                >
                                  {getViolationIcon(v.type)}
                                  {v.type}: {v.count}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {video.status === 'completed' && (!video.violations || video.violations.length === 0) && (
                          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            No violations detected
                          </p>
                        )}

                        {video.status === 'failed' && (
                          <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Analysis failed - please try again
                          </p>
                        )}

                        {video.status === 'processing' && (
                          <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                            <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Analyzing for PPE violations...
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusIcon(video.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoUpload;
