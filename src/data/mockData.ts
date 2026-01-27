export interface Camera {
  id: string;
  location: string;
  status: 'online' | 'offline';
  lastUpdate: string;
}

export interface Violation {
  id: string;
  cameraId: string;
  location: string;
  timestamp: string;
  type: 'Helmet Missing' | 'Safety Vest Missing' | 'Gloves Missing' | 'Mask Missing';
  status: 'active' | 'resolved' | 'acknowledged';
}

export interface ReportData {
  date: string;
  totalViolations: number;
  complianceRate: number;
  helmetViolations: number;
  vestViolations: number;
  glovesViolations: number;
  maskViolations: number;
}

export const cameras: Camera[] = [
  { id: 'CAM-001', location: 'Main Entrance Gate', status: 'online', lastUpdate: '2 min ago' },
  { id: 'CAM-002', location: 'Assembly Line 1', status: 'online', lastUpdate: '1 min ago' },
  { id: 'CAM-003', location: 'Assembly Line 2', status: 'online', lastUpdate: '30 sec ago' },
  { id: 'CAM-004', location: 'Warehouse Section A', status: 'online', lastUpdate: '1 min ago' },
  { id: 'CAM-005', location: 'Warehouse Section B', status: 'offline', lastUpdate: '15 min ago' },
  { id: 'CAM-006', location: 'Loading Dock 1', status: 'online', lastUpdate: '45 sec ago' },
  { id: 'CAM-007', location: 'Loading Dock 2', status: 'online', lastUpdate: '2 min ago' },
  { id: 'CAM-008', location: 'Chemical Storage', status: 'online', lastUpdate: '1 min ago' },
  { id: 'CAM-009', location: 'Welding Station', status: 'online', lastUpdate: '30 sec ago' },
  { id: 'CAM-010', location: 'Quality Control', status: 'online', lastUpdate: '1 min ago' },
  { id: 'CAM-011', location: 'Parking Area', status: 'online', lastUpdate: '3 min ago' },
  { id: 'CAM-012', location: 'Emergency Exit', status: 'offline', lastUpdate: '20 min ago' },
];

export const violations: Violation[] = [
  { id: 'VIO-001', cameraId: 'CAM-002', location: 'Assembly Line 1', timestamp: '2024-01-19 14:32:15', type: 'Helmet Missing', status: 'active' },
  { id: 'VIO-002', cameraId: 'CAM-004', location: 'Warehouse Section A', timestamp: '2024-01-19 14:28:42', type: 'Safety Vest Missing', status: 'active' },
  { id: 'VIO-003', cameraId: 'CAM-006', location: 'Loading Dock 1', timestamp: '2024-01-19 14:25:10', type: 'Gloves Missing', status: 'acknowledged' },
  { id: 'VIO-004', cameraId: 'CAM-008', location: 'Chemical Storage', timestamp: '2024-01-19 14:20:33', type: 'Gloves Missing', status: 'active' },
  { id: 'VIO-005', cameraId: 'CAM-009', location: 'Welding Station', timestamp: '2024-01-19 14:15:55', type: 'Mask Missing', status: 'resolved' },
  { id: 'VIO-006', cameraId: 'CAM-002', location: 'Assembly Line 1', timestamp: '2024-01-19 14:10:22', type: 'Helmet Missing', status: 'active' },
  { id: 'VIO-007', cameraId: 'CAM-003', location: 'Assembly Line 2', timestamp: '2024-01-19 14:05:18', type: 'Safety Vest Missing', status: 'acknowledged' },
  { id: 'VIO-008', cameraId: 'CAM-007', location: 'Loading Dock 2', timestamp: '2024-01-19 13:58:44', type: 'Mask Missing', status: 'active' },
];

export const reportData: ReportData[] = [
  { date: '2024-01-13', totalViolations: 37, complianceRate: 92.5, helmetViolations: 18, vestViolations: 10, glovesViolations: 5, maskViolations: 4 },
  { date: '2024-01-14', totalViolations: 31, complianceRate: 94.2, helmetViolations: 14, vestViolations: 8, glovesViolations: 5, maskViolations: 4 },
  { date: '2024-01-15', totalViolations: 43, complianceRate: 91.0, helmetViolations: 22, vestViolations: 12, glovesViolations: 5, maskViolations: 4 },
  { date: '2024-01-16', totalViolations: 23, complianceRate: 95.8, helmetViolations: 10, vestViolations: 6, glovesViolations: 4, maskViolations: 3 },
  { date: '2024-01-17', totalViolations: 33, complianceRate: 93.1, helmetViolations: 16, vestViolations: 9, glovesViolations: 5, maskViolations: 3 },
  { date: '2024-01-18', totalViolations: 27, complianceRate: 94.5, helmetViolations: 12, vestViolations: 8, glovesViolations: 4, maskViolations: 3 },
  { date: '2024-01-19', totalViolations: 22, complianceRate: 96.2, helmetViolations: 8, vestViolations: 7, glovesViolations: 4, maskViolations: 3 },
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
