import React, { useState } from 'react';
import { Upload, Video, MapPin, Calendar, Clock, CheckCircle, AlertCircle, X, FileVideo } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cameras } from '@/data/mockData';

interface UploadedVideo {
  id: string;
  fileName: string;
  cameraId: string;
  location: string;
  date: string;
  time: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  size: string;
}

const VideoUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cameraId, setCameraId] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([
    {
      id: '1',
      fileName: 'warehouse_footage_01.mp4',
      cameraId: 'CAM-001',
      location: 'Warehouse A - North',
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      progress: 100,
      size: '256 MB',
    },
    {
      id: '2',
      fileName: 'assembly_line_review.mp4',
      cameraId: 'CAM-003',
      location: 'Assembly Line 1',
      date: '2024-01-14',
      time: '09:15',
      status: 'completed',
      progress: 100,
      size: '412 MB',
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const locations = [...new Set(cameras.map(c => c.location))];

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
    if (!selectedFile || !cameraId || !location || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const newVideo: UploadedVideo = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      cameraId,
      location,
      date,
      time,
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
      
      // Simulate processing completion
      setTimeout(() => {
        setUploadedVideos(prev =>
          prev.map(v =>
            v.id === newVideo.id ? { ...v, status: 'completed' } : v
          )
        );
        setIsUploading(false);
        setSelectedFile(null);
        setCameraId('');
        setLocation('');
        setDate('');
        setTime('');
        setUploadProgress(0);
      }, 2000);
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

  const getStatusText = (status: UploadedVideo['status']) => {
    switch (status) {
      case 'completed':
        return 'PPE Analysis Complete';
      case 'failed':
        return 'Processing Failed';
      case 'processing':
        return 'Analyzing for PPE Violations...';
      case 'uploading':
        return 'Uploading...';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Video Upload</h1>
        <p className="text-muted-foreground mt-1">
          Upload recorded CCTV footage for PPE compliance analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Video
            </CardTitle>
            <CardDescription>
              Select a video file and associate it with camera details for PPE analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
                    style={{ position: 'absolute', top: 0, left: 0 }}
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

            {/* Video Details Form */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-medium text-foreground">Video Details</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cameraId">Camera ID</Label>
                  <Select value={cameraId} onValueChange={setCameraId}>
                    <SelectTrigger id="cameraId">
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {cameras.map(camera => (
                        <SelectItem key={camera.id} value={camera.id}>
                          {camera.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Recording Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Recording Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

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
              disabled={!selectedFile || !cameraId || !location || !date || !time || isUploading}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload & Analyze'}
            </Button>
          </CardContent>
        </Card>

        {/* Upload History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="w-5 h-5 text-primary" />
              Upload History
            </CardTitle>
            <CardDescription>
              Previously uploaded videos and their analysis status
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
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground truncate">
                            {video.fileName}
                          </p>
                          {getStatusIcon(video.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {video.cameraId}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {video.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {video.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.time}
                          </span>
                          <span>{video.size}</span>
                        </div>
                        <p className={`text-xs mt-2 ${
                          video.status === 'completed' ? 'text-green-600 dark:text-green-500' :
                          video.status === 'failed' ? 'text-destructive' :
                          'text-primary'
                        }`}>
                          {getStatusText(video.status)}
                        </p>
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
