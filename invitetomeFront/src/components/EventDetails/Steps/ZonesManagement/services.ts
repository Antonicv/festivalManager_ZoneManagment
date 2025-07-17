/**
 * services.ts - Servicios y funciones utilitarias para ZonesManagement
 * 
 * Contiene:
 * - EventItemEndpoint: Servicios de API para comunicación con backend
 * - createInitialData: Función para crear datos iniciales
 * - isFirstVisit: Función helper para detectar primera visita
 * - Device roles constants: Constantes de roles de dispositivos
 */

import { EventData } from './types';

// ========== PLACEHOLDER PARA ENDPOINT REAL ==========
// EventItemEndpoint sin datos mock - listo para conectar con backend real
export const EventItemEndpoint = {
  getEventData: async (eventId: string): Promise<EventData> => {
    try {
      // TODO: Aquí conectar con el backend real usando axios
      // const response = await axios.get(`/api/events/${eventId}/zones`);
      // return response.data;
      
      console.log(`Fetching data for event: ${eventId}`);
      // Por ahora retorna estructura vacía para mostrar estados sin datos
      return {
        eventId,
        operation: "zonesDefinition",
        data: {
          zones: {}
        }
      };
    } catch (error) {
      console.error('Error fetching event data:', error);
      throw error;
    }
  },
  updateEventData: async (eventData: EventData): Promise<EventData> => {
    try {
      console.log('Updating event data:', eventData);
      // TODO: Implementar PUT/PATCH al backend real
      // const response = await axios.put(`/api/events/${eventData.eventId}/zones`, eventData);
      // return response.data;
      
      return eventData;
    } catch (error) {
      console.error('Error updating event data:', error);
      throw error;
    }
  },
  saveEventItem: async (eventData: EventData): Promise<EventData> => {
    return EventItemEndpoint.updateEventData(eventData);
  }
};

// ========== SERVICIO DE DATOS INICIALES ==========
// Función que crea automáticamente 1 Gate y 1 Venue sin checkpoints
export const createInitialData = (eventId: string): EventData => ({
  eventId,
  operation: 'zonesDefinition',
  data: {
    zones: {
      "zone#AA#GATE": {
        zoneId: "zone#AA#GATE",
        name: "Main Gate",
        type: "GATE",
        parentZoneId: null,
        maxCapacity: 1000,
        currentOccupancy: 0,
        accessTypes: {
          BACKSTAGE: true,
          GENERAL: true,
          STAGE: true,
          COMPROMIS: true,
          VIP: true
        },
        checkPoints: {} // Sin checkpoints - usuario debe crearlos
      },
      "zone#00#VENUE": {
        zoneId: "zone#00#VENUE",
        name: "Main Venue",
        type: "VENUE",
        parentZoneId: null,
        maxCapacity: 500,
        currentOccupancy: 0,
        accessTypes: {
          BACKSTAGE: true,
          GENERAL: true,
          STAGE: true,
          COMPROMIS: true,
          VIP: true
        },
        checkPoints: {} // Sin checkpoints - usuario debe crearlos
      }
    }
  }
});

// ========== FUNCIÓN HELPER ==========
// Función para detectar si es la primera visita
export const isFirstVisit = (eventData: EventData | null): boolean => {
  return !eventData || 
         !eventData.operation || 
         eventData.operation !== 'zonesDefinition' ||
         !eventData.data?.zones ||
         Object.keys(eventData.data.zones).length === 0;
};

// ========== CONSTANTES DE ROLES DE DISPOSITIVOS ==========
// Roles específicos para Gates
export const GATE_DEVICE_ROLES = [
  'STEWARD-CHECKIN',    // Control de entrada principal
  'STEWARD-CHECKOUT'    // Control de salida principal
];

// Roles específicos para Zones y Subzones  
export const ZONE_DEVICE_ROLES = [
  'STEWARD-ZONEIN',     // Control de entrada a zona
  'STEWARD-ZONEOUT'     // Control de salida de zona
];
