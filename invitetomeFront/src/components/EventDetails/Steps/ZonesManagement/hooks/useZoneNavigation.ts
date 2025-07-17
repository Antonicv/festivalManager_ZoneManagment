/**
 * useZoneNavigation.ts - Hook customizado para navegación y estado de UI
 * 
 * Maneja:
 * - Estados de diálogos (abrir/cerrar formularios)
 * - Estados de navegación (breadcrumbs, ruta actual)
 * - Estados de expansión (acordeones de secciones)
 * - Funciones de navegación entre zonas
 * - Estado de vista de resumen (tabs)
 */

import { useState } from 'react';
import { ZoneType } from '../types';

// ========== TIPOS PARA EL HOOK ==========
type SummaryView = 'overview' | 'gates' | 'zones' | 'details' | 'checkpoints';

// ========== HOOK PRINCIPAL ==========
export const useZoneNavigation = (gates: ZoneType[], venues: ZoneType[], zones: ZoneType[]) => {
  // ========== ESTADOS DE DIÁLOGOS ==========
  const [gateDialogOpen, setGateDialogOpen] = useState(false);
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [venueDialogOpen, setVenueDialogOpen] = useState(false);
  const [checkpointDialogOpen, setCheckpointDialogOpen] = useState(false);
  const [subzoneDialogOpen, setSubzoneDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneType | null>(null);

  // ========== ESTADOS DE NAVEGACIÓN ==========
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [activeBreadcrumbZone, setActiveBreadcrumbZone] = useState<string | null>(null);
  const [summaryView, setSummaryView] = useState<SummaryView>('overview');
  const [showInitialMessage, setShowInitialMessage] = useState(true);

  // ========== ESTADOS DE EXPANSIÓN ==========
  const [expandedGates, setExpandedGates] = useState(false);
  const [expandedVenues, setExpandedVenues] = useState(false);
  const [expandedZones, setExpandedZones] = useState(false);
  const [expandedIndividualGates, setExpandedIndividualGates] = useState<{ [zoneId: string]: boolean }>({});
  const [expandedIndividualVenues, setExpandedIndividualVenues] = useState<{ [zoneId: string]: boolean }>({});
  const [expandedIndividualZones, setExpandedIndividualZones] = useState<{ [zoneId: string]: boolean }>({});
  const [expandedSubzones, setExpandedSubzones] = useState<{ [zoneId: string]: boolean }>({});
  const [updatePolicies, setUpdatePolicies] = useState<{ [zoneId: string]: boolean }>({});

  // ========== HANDLERS DE DIÁLOGOS ==========
  const handleAddCheckpoint = (zone: ZoneType) => {
    setSelectedZone(zone);
    setCheckpointDialogOpen(true);
  };

  const handleAddSubzoneToZone = (parentZone: ZoneType) => {
    setSelectedZone(parentZone);
    setSubzoneDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setGateDialogOpen(false);
    setZoneDialogOpen(false);
    setVenueDialogOpen(false);
    setCheckpointDialogOpen(false);
    setSubzoneDialogOpen(false);
    setSelectedZone(null);
  };

  // ========== HANDLERS DE EXPANSIÓN ==========
  const toggleUpdatePolicy = (zoneId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setUpdatePolicies(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
  };

  const handleSubzoneExpansion = (zoneId: string) => {
    setExpandedSubzones(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
  };

  const handleIndividualZoneExpansion = (zoneId: string) => {
    setExpandedIndividualZones(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
    
    // Auto-update breadcrumbs on expansion
    if (!expandedIndividualZones[zoneId]) {
      const zone = zones.find(z => z.zoneId === zoneId);
      if (zone) {
        updateBreadcrumbPath(zone.name, zone.type);
        setSummaryView('zones');
      }
    }
  };

  const handleIndividualGateExpansion = (zoneId: string) => {
    setExpandedIndividualGates(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
    
    // Auto-update breadcrumbs on expansion
    if (!expandedIndividualGates[zoneId]) {
      const gate = gates.find(g => g.zoneId === zoneId);
      if (gate) {
        updateBreadcrumbPath(gate.name, gate.type);
        setSummaryView('gates');
      }
    }
  };

  const handleIndividualVenueExpansion = (zoneId: string) => {
    setExpandedIndividualVenues(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
    
    // Auto-update breadcrumbs on expansion
    if (!expandedIndividualVenues[zoneId]) {
      const venue = venues.find(v => v.zoneId === zoneId);
      if (venue) {
        updateBreadcrumbPath(venue.name, venue.type);
        setSummaryView('zones');
      }
    }
  };

  // ========== NAVEGACIÓN BREADCRUMBS ==========
  const handleBreadcrumbClick = (pathIndex: number) => {
    setCurrentPath(prev => prev.slice(0, pathIndex + 1));
    if (pathIndex === 0) {
      setActiveBreadcrumbZone(null);
      setSummaryView('overview');
    }
  };

  const updateBreadcrumbPath = (zoneName: string, zoneType: string) => {
    const newPath = [`${zoneType}: ${zoneName}`];
    setCurrentPath(newPath);
    setActiveBreadcrumbZone(zoneName);
  };

  const getBreadcrumbIcon = (index: number) => {
    // Icons will be imported where this hook is used
    switch (index) {
      case 0: return 'Security';
      case 1: return activeBreadcrumbZone?.includes('GATE') ? 'LocationOn' : 
                   activeBreadcrumbZone?.includes('VIP') ? 'MeetingRoom' : 
                   'Security';
      default: return 'NavigateNext';
    }
  };

  // ========== HELPERS ==========
  const resetNavigation = () => {
    setCurrentPath([]);
    setActiveBreadcrumbZone(null);
    setSummaryView('overview');
  };

  const dismissInitialMessage = () => {
    setShowInitialMessage(false);
  };

  // ========== RETURN API ==========
  return {
    // Estados de diálogos
    gateDialogOpen,
    zoneDialogOpen,
    venueDialogOpen,
    checkpointDialogOpen,
    subzoneDialogOpen,
    selectedZone,
    setGateDialogOpen,
    setZoneDialogOpen,
    setVenueDialogOpen,
    setCheckpointDialogOpen,
    setSubzoneDialogOpen,
    setSelectedZone,

    // Estados de navegación
    currentPath,
    activeBreadcrumbZone,
    summaryView,
    showInitialMessage,
    setSummaryView,

    // Estados de expansión
    expandedGates,
    expandedVenues,
    expandedZones,
    expandedIndividualGates,
    expandedIndividualVenues,
    expandedIndividualZones,
    expandedSubzones,
    updatePolicies,
    setExpandedGates,
    setExpandedVenues,
    setExpandedZones,

    // Handlers
    handleAddCheckpoint,
    handleAddSubzoneToZone,
    closeAllDialogs,
    toggleUpdatePolicy,
    handleSubzoneExpansion,
    handleIndividualZoneExpansion,
    handleIndividualGateExpansion,
    handleIndividualVenueExpansion,
    handleBreadcrumbClick,
    updateBreadcrumbPath,
    getBreadcrumbIcon,
    resetNavigation,
    dismissInitialMessage
  };
};
