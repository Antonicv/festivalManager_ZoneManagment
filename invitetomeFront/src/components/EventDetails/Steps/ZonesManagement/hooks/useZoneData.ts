/**
 * useZoneData.ts - Hook customizado para gestión de datos de zonas
 * 
 * Maneja:
 * - Estado de datos del evento (eventData, loading)
 * - Operaciones CRUD (crear, leer, actualizar, eliminar zonas/checkpoints)
 * - Carga inicial de datos desde el backend
 * - Manejo de notificaciones y errores
 * - Persistencia de datos
 */

import { useState, useEffect, useMemo } from 'react';
import { EventData, ZoneType, Checkpoint } from '../types';
import { EventItemEndpoint, createInitialData, isFirstVisit } from '../services';

// ========== CONSTANTES ==========
const eventId = 'EVENT_050';
const operation = 'zonesDefinition';

// ========== HOOK PRINCIPAL ==========
export const useZoneData = () => {
  // ========== ESTADO ==========
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [initialDataCreated, setInitialDataCreated] = useState(false);

  // ========== FUNCIONES CRUD ==========
  const handleDeleteCheckpoint = async (zone: ZoneType, checkpoint: Checkpoint) => {
    if (!eventData) return;

    // Clonado profundo para mantener inmutabilidad del estado
    const zonesCopy = { ...eventData.data.zones };
    const zoneCopy = { ...zonesCopy[zone.zoneId] };

    if (zoneCopy.checkPoints) {
      delete zoneCopy.checkPoints[checkpoint.checkpointId];
    }

    zonesCopy[zone.zoneId] = zoneCopy;

    const newEventData = {
      ...eventData,
      data: { zones: zonesCopy },
    };

    try {
      await EventItemEndpoint.updateEventData(newEventData);
      setEventData(newEventData);
      setNotification('Checkpoint deleted successfully!');
    } catch (error) {
      console.error('Failed to delete checkpoint:', error);
      setNotification('Failed to delete checkpoint.');
    }
  };

  const handleUpdateCheckpoint = async (zone: ZoneType, updatedCheckpoint: Checkpoint) => {
    if (!eventData) return;

    const zonesCopy = { ...eventData.data.zones };
    const zoneCopy = { ...zonesCopy[zone.zoneId] };

    if (zoneCopy.checkPoints && updatedCheckpoint.checkpointId in zoneCopy.checkPoints) {
      zoneCopy.checkPoints[updatedCheckpoint.checkpointId] = { ...updatedCheckpoint };
    }

    zonesCopy[zone.zoneId] = zoneCopy;

    const newEventData = {
      ...eventData,
      data: {
        ...eventData.data,
        zones: zonesCopy,
      },
    };

    try {
      await EventItemEndpoint.saveEventItem({
        eventId,
        operation,
        data: newEventData.data,
      });
      setEventData(newEventData);
      setNotification('Checkpoint updated successfully!');
    } catch (error) {
      console.error('Failed to update checkpoint:', error);
      setNotification('Failed to update checkpoint.');
    }
  };

  const handleAddZone = async (newZone: ZoneType) => {
    if (!eventData) return;

    const zonesCopy = { ...eventData.data.zones };
    zonesCopy[newZone.zoneId] = newZone;

    const newEventData = {
      ...eventData,
      data: { zones: zonesCopy },
    };

    try {
      await EventItemEndpoint.updateEventData(newEventData);
      setEventData(newEventData);
      setNotification(`${newZone.type} created successfully!`);
    } catch (error) {
      console.error('Failed to add zone:', error);
      setNotification('Failed to create zone.');
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!eventData) return;

    const zonesCopy = { ...eventData.data.zones };
    delete zonesCopy[zoneId];

    const newEventData = {
      ...eventData,
      data: { zones: zonesCopy },
    };

    try {
      await EventItemEndpoint.updateEventData(newEventData);
      setEventData(newEventData);
      setNotification('Zone deleted successfully!');
    } catch (error) {
      console.error('Failed to delete zone:', error);
      setNotification('Failed to delete zone.');
    }
  };

  const handleAddCheckpoint = async (zone: ZoneType, newCheckpoint: Checkpoint) => {
    if (!eventData) return;

    const zonesCopy = { ...eventData.data.zones };
    const zoneCopy = { ...zonesCopy[zone.zoneId] };

    if (!zoneCopy.checkPoints) {
      zoneCopy.checkPoints = {};
    }

    zoneCopy.checkPoints[newCheckpoint.checkpointId] = newCheckpoint;
    zonesCopy[zone.zoneId] = zoneCopy;

    const newEventData = {
      ...eventData,
      data: { zones: zonesCopy },
    };

    try {
      await EventItemEndpoint.updateEventData(newEventData);
      setEventData(newEventData);
      setNotification('Checkpoint added successfully!');
    } catch (error) {
      console.error('Failed to add checkpoint:', error);
      setNotification('Failed to add checkpoint.');
    }
  };

  // ========== HOOK DE CARGA INICIAL ==========
  useEffect(() => {
    const initializeEventZones = async () => {
      setLoading(true);
      
      try {
        // Primero intentar obtener datos existentes
        const existingData = await EventItemEndpoint.getEventData(eventId);
        
        // Si es la primera visita, crear datos iniciales
        if (isFirstVisit(existingData)) {
          console.log('Primera visita detectada - creando datos iniciales');
          const initialData = createInitialData(eventId);
          
          // Guardar en backend
          await EventItemEndpoint.saveEventItem(initialData);
          
          // Actualizar estado local
          setEventData(initialData);
          setInitialDataCreated(true);
        } else {
          // Usar datos existentes
          setEventData(existingData);
          setInitialDataCreated(false);
        }
      } catch (error) {
        console.error('Error initializing event zones:', error);
        setNotification('Error al inicializar las zonas del evento');
      } finally {
        setLoading(false);
      }
    };
    
    initializeEventZones();
  }, []);

  // ========== MEMOS PARA CLASIFICACIÓN DE DATOS ==========
  const zonesArray = useMemo(() => eventData ? Object.values(eventData.data.zones) : [], [eventData]);
  const gates = useMemo(() => zonesArray.filter(z => z.type === 'GATE'), [zonesArray]);
  const venues = useMemo(() => zonesArray.filter(z => z.type === 'VENUE'), [zonesArray]);
  const zones = useMemo(() => zonesArray.filter(z => z.type === 'ZONE' && !('parentZoneId' in z && z.parentZoneId)), [zonesArray]);
  const subzones = useMemo(() => zonesArray.filter(z => z.type === 'SUBZONE'), [zonesArray]);

  // Agregación de checkpoints para vista global
  const allCheckpoints = useMemo(() => {
    const checkpoints: (Checkpoint & { zoneName: string; zoneType: string })[] = [];
    zonesArray.forEach(zone => {
      if (zone.checkPoints) {
        Object.values(zone.checkPoints).forEach(checkpoint => {
          checkpoints.push({
            ...checkpoint,
            zoneName: zone.name,
            zoneType: zone.type
          });
        });
      }
    });
    return checkpoints;
  }, [zonesArray]);

  // Cálculo de estadísticas para dashboard
  const summary = useMemo(() => {
    const totalGates = gates.length;
    const totalVenues = venues.length;
    const totalZones = zones.filter(zone => zone.type === 'ZONE').length;
    const totalSubzones = subzones.length;
    const totalCheckpoints = allCheckpoints.length;
    
    return {
      totalGates,
      totalVenues, 
      totalZones,
      totalSubzones,
      totalCheckpoints
    };
  }, [gates, venues, zones, subzones, allCheckpoints]);

  // ========== HELPERS ==========
  const clearNotification = () => setNotification(null);

  // ========== RETURN API ==========
  return {
    // Estado
    eventData,
    loading,
    notification,
    initialDataCreated,
    
    // Datos clasificados
    zonesArray,
    gates,
    venues,
    zones,
    subzones,
    allCheckpoints,
    summary,
    
    // Funciones CRUD
    handleAddZone,
    handleDeleteZone,
    handleAddCheckpoint,
    handleDeleteCheckpoint,
    handleUpdateCheckpoint,
    
    // Helpers
    clearNotification
  };
};
