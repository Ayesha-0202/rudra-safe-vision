import React, { useState } from 'react';
import { Film, Search, Calendar, Camera, Download, Play, Clock, MapPin } from 'lucide-react';
import { cameras } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FootageResult {
  id: string;
  cameraId: string;
  location: string;
  startTime: string;
  endTime: string;
  duration: string;
  thumbnail: string;
  hasViolation: boolean;
}

const mockFootageResults: FootageResult[] = [
  {
    id: 'FT-001',
    cameraId: 'CAM-002',
    location: 'Assembly Line 1',
    startTime: '2024-01-19 09:00:00',
    endTime: '2024-01-19 09:30:00',
    duration: '30 min',
    thumbnail: '',
    hasViolation: true,
  },
  {
    id: 'FT-002',
    cameraId: 'CAM-004',
    location: 'Warehouse Section A',
    startTime: '2024-01-19 10:15:00',
    endTime: '2024-01-19 10:45:00',
    duration: '30 min',
    thumbnail: '',
    hasViolation: true,
  },
  {
    id: 'FT-003',
    cameraId: 'CAM-006',
    location: 'Loading Dock 1',
    startTime: '2024-01-19 11:00:00',
    endTime: '2024-01-19 11:30:00',
    duration: '30 min',
    thumbnail: '',
    hasViolation: false,
  },
  {
    id: 'FT-004',
    cameraId: 'CAM-008',
    location: 'Chemical Storage',
    startTime: '2024-01-19 12:00:00',
    endTime: '2024-01-19 12:30:00',
    duration: '30 min',
    thumbnail: '',
    hasViolation: true,
  },
  {
    id: 'FT-005',
    cameraId: 'CAM-001',
    location: 'Main Entrance Gate',
    startTime: '2024-01-19 13:00:00',
    endTime: '2024-01-19 13:30:00',
    duration: '30 min',
    thumbnail: '',
    hasViolation: false,
  },
  {
    id: 'FT-006',
    cameraId: 'CAM-009',
    location: 'Welding Station',
    startTime: '2024-01-19 14:00:00',
    endTime: '2024-01-19 14:30:00',
    duration: '30 min',
    thumbnail: '',
    hasViolation: true,
  },
];

const Footage: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('2024-01-19');
  const [dateTo, setDateTo] = useState('2024-01-19');
  const [timeFrom, setTimeFrom] = useState('00:00');
  const [timeTo, setTimeTo] = useState('23:59');
  const [violationsOnly, setViolationsOnly] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(true);
  const [selectedFootage, setSelectedFootage] = useState<FootageResult | null>(null);

  const filteredResults = mockFootageResults.filter((f) => {
    const matchesCamera = selectedCamera === 'all' || f.cameraId === selectedCamera;
    const matchesViolation = !violationsOnly || f.hasViolation;
    return matchesCamera && matchesViolation;
  });

  const handleSearch = () => {
    setSearchPerformed(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Footage Retrieval</h1>
        <p className="text-muted-foreground">Search and retrieve historical CCTV recordings</p>
      </div>

      {/* Search Filters */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="space-y-2">
            <Label>Camera</Label>
            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
              <SelectTrigger>
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cameras</SelectItem>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.id} - {camera.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date From</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Date To</Label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Time From</Label>
            <Input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Time To</Label>
            <Input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={violationsOnly}
              onChange={(e) => setViolationsOnly(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">Show violations only</span>
          </label>
        </div>
      </div>

      {/* Results Section */}
      {searchPerformed && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Search Results ({filteredResults.length})
            </h3>
          </div>

          {filteredResults.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Film className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">No footage found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((footage, index) => (
                <div
                  key={footage.id}
                  onClick={() => setSelectedFootage(footage)}
                  className="camera-tile animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative flex items-center justify-center group">
                    <Film className="w-10 h-10 text-muted-foreground/50" />
                    {footage.hasViolation && (
                      <div className="absolute top-2 left-2">
                        <span className="status-badge status-violation">
                          PPE Violation
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-foreground/70 text-background px-2 py-1 rounded text-xs font-medium">
                      {footage.duration}
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-background/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-5 h-5 text-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Camera className="w-4 h-4" />
                        {footage.cameraId}
                      </div>
                      <span className="text-xs text-muted-foreground">{footage.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {footage.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {footage.startTime.split(' ')[1]} - {footage.endTime.split(' ')[1]}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFootage(footage);
                        }}
                      >
                        <Play className="w-3.5 h-3.5 mr-1" />
                        Play
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedFootage && (
        <div
          className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFootage(null)}
        >
          <div
            className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-[90vh] overflow-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {selectedFootage.cameraId} - {selectedFootage.location}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedFootage.startTime} to {selectedFootage.endTime}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFootage(null)}>
                ✕
              </Button>
            </div>
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <div className="text-center">
                <Film className="w-16 h-16 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">Video Player Placeholder</p>
              </div>
            </div>
            <div className="p-4 flex gap-3">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Footage
              </Button>
              <Button variant="outline" onClick={() => setSelectedFootage(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footage;
