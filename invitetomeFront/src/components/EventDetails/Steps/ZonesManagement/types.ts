/**
 * types.ts - Definiciones de tipos para ZonesManagement
 * 
 * Contiene todas las interfaces y tipos utilizados en el sistema de gestión de zonas:
 * - AccessTypes: Tipos de acceso a zonas
 * - Checkpoint: Puntos de control
 * - Gate, Zone, Subzone: Diferentes tipos de zonas
 * - EventData: Estructura principal de datos del evento
 */

// ========== TIPOS DE ACCESO ==========
export interface AccessTypes {
  GENERAL: boolean;
  BACKSTAGE: boolean;
  STAGE: boolean;
  COMPROMIS: boolean;
  VIP: boolean;
}

// ========== CHECKPOINT ==========
export interface Checkpoint {
  checkpointId: string;
  name: string;
  type: "IN" | "OUT";
  role: string;
  shareLink: string;
  qrShareLink: string;
  deviceImei?: string;
}

// ========== TIPOS DE ZONAS ==========
export interface Gate {
  zoneId: string;
  name: string;
  type: "GATE";
  parentZoneId: null;
  maxCapacity: number;
  currentOccupancy?: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}

export interface Zone {
  zoneId: string;
  name: string;
  type: "ZONE" | "VENUE";
  parentZoneId: null;
  maxCapacity: number;
  currentOccupancy: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}

export interface Subzone {
  zoneId: string;
  name: string;
  type: "SUBZONE";
  parentZoneId: string;
  parentZoneName: string;
  maxCapacity: number;
  currentOccupancy?: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}

// ========== UNION TYPES ==========
export type ZoneType = Gate | Zone | Subzone;

// ========== ESTRUCTURA PRINCIPAL ==========
export interface EventData {
  eventId: string;
  operation: string;
  data: {
    zones: { [key: string]: ZoneType };
  };
}
