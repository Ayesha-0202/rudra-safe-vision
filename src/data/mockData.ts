export interface Camera {
  id: string;
  location: string;
  zone: string;
  status: 'online' | 'offline';
  lastUpdate: string;
}

export interface Violation {
  id: string;
  cameraId: string;
  location: string;
  timestamp: string;
  type: 'Helmet Missing' | 'Safety Vest Missing' | 'Goggles Missing' | 'Gloves Missing' | 'Safety Boots Missing';
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved' | 'acknowledged';
  employeeId?: string;
}

export interface ReportData {
  date: string;
  totalViolations: number;
  complianceRate: number;
  helmetViolations: number;
  vestViolations: number;
  otherViolations: number;
}

export const cameras: Camera[] = [
  { id: 'CAM-001', location: 'Main Entrance Gate', zone: 'Zone A', status: 'online', lastUpdate: '2 min ago' },
  { id: 'CAM-002', location: 'Assembly Line 1', zone: 'Zone B', status: 'online', lastUpdate: '1 min ago' },
  { id: 'CAM-003', location: 'Assembly Line 2', zone: 'Zone B', status: 'online', lastUpdate: '30 sec ago' },
  { id: 'CAM-004', location: 'Warehouse Section A', zone: 'Zone C', status: 'online', lastUpdate: '1 min ago' },
  { id: 'CAM-005', location: 'Warehouse Section B', zone: 'Zone C', status: 'offline', lastUpdate: '15 min ago' },
  { id: 'CAM-006', location: 'Loading Dock 1', zone: 'Zone D', status: 'online', lastUpdate: '45 sec ago' },
  { id: 'CAM-007', location: 'Loading Dock 2', zone: 'Zone D', status: 'online', lastUpdate: '2 min ago' },
  { id: 'CAM-008', location: 'Chemical Storage', zone: 'Zone E', status: 'online', lastUpdate: '1 min ago' },
  { id: 'CAM-009', location: 'Welding Station', zone: 'Zone F', status: 'online', lastUpdate: '30 sec ago' },
  { id: 'CAM-010', location: 'Quality Control', zone: 'Zone G', status: 'online', lastUpdate: '1 min ago' },
  { id: 'CAM-011', location: 'Parking Area', zone: 'Zone H', status: 'online', lastUpdate: '3 min ago' },
  { id: 'CAM-012', location: 'Emergency Exit', zone: 'Zone A', status: 'offline', lastUpdate: '20 min ago' },
];

export const violations: Violation[] = [
  { id: 'VIO-001', cameraId: 'CAM-002', location: 'Assembly Line 1', timestamp: '2024-01-19 14:32:15', type: 'Helmet Missing', severity: 'high', status: 'active', employeeId: 'EMP-1234' },
  { id: 'VIO-002', cameraId: 'CAM-004', location: 'Warehouse Section A', timestamp: '2024-01-19 14:28:42', type: 'Safety Vest Missing', severity: 'medium', status: 'active', employeeId: 'EMP-5678' },
  { id: 'VIO-003', cameraId: 'CAM-006', location: 'Loading Dock 1', timestamp: '2024-01-19 14:25:10', type: 'Goggles Missing', severity: 'medium', status: 'acknowledged' },
  { id: 'VIO-004', cameraId: 'CAM-008', location: 'Chemical Storage', timestamp: '2024-01-19 14:20:33', type: 'Gloves Missing', severity: 'high', status: 'active', employeeId: 'EMP-9012' },
  { id: 'VIO-005', cameraId: 'CAM-009', location: 'Welding Station', timestamp: '2024-01-19 14:15:55', type: 'Safety Boots Missing', severity: 'low', status: 'resolved' },
  { id: 'VIO-006', cameraId: 'CAM-002', location: 'Assembly Line 1', timestamp: '2024-01-19 14:10:22', type: 'Helmet Missing', severity: 'high', status: 'active' },
  { id: 'VIO-007', cameraId: 'CAM-003', location: 'Assembly Line 2', timestamp: '2024-01-19 14:05:18', type: 'Safety Vest Missing', severity: 'medium', status: 'acknowledged' },
  { id: 'VIO-008', cameraId: 'CAM-007', location: 'Loading Dock 2', timestamp: '2024-01-19 13:58:44', type: 'Helmet Missing', severity: 'high', status: 'resolved' },
];

export const reportData: ReportData[] = [
  { date: '2024-01-13', totalViolations: 45, complianceRate: 92.5, helmetViolations: 18, vestViolations: 15, otherViolations: 12 },
  { date: '2024-01-14', totalViolations: 38, complianceRate: 94.2, helmetViolations: 14, vestViolations: 12, otherViolations: 12 },
  { date: '2024-01-15', totalViolations: 52, complianceRate: 91.0, helmetViolations: 22, vestViolations: 18, otherViolations: 12 },
  { date: '2024-01-16', totalViolations: 29, complianceRate: 95.8, helmetViolations: 10, vestViolations: 11, otherViolations: 8 },
  { date: '2024-01-17', totalViolations: 41, complianceRate: 93.1, helmetViolations: 16, vestViolations: 14, otherViolations: 11 },
  { date: '2024-01-18', totalViolations: 35, complianceRate: 94.5, helmetViolations: 12, vestViolations: 13, otherViolations: 10 },
  { date: '2024-01-19', totalViolations: 28, complianceRate: 96.2, helmetViolations: 8, vestViolations: 10, otherViolations: 10 },
];

export const getStatistics = () => {
  const totalCameras = cameras.length;
  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const activeViolations = violations.filter(v => v.status === 'active').length;
  const todayViolations = violations.length;
  const complianceRate = 94.8;
  
  return {
    totalCameras,
    onlineCameras,
    offlineCameras: totalCameras - onlineCameras,
    activeViolations,
    todayViolations,
    complianceRate,
  };
};
