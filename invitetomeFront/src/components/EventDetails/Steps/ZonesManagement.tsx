// Componente principal para gestión de zonas con migas de pan - VERSIÓN LIMPIA SIN DATOS MOCK
// Esta versión está preparada para conectar con datos reales del backend
// Muestra estados vacíos informativos cuando no hay datos configurados
import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  VerticalLayout,
  HorizontalLayout,
  Grid,
  GridColumn,
  Checkbox,
  Notification,
} from '@vaadin/react-components';
import { Icon } from '@vaadin/react-components/Icon';
import Dialogs from './Dialogs'; // Componente para formularios inline - reutilizado del original
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
import { 
  Breadcrumbs, 
  Link, 
  Typography, 
  Box, 
  Chip, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  IconButton 
} from '@mui/material';
import { 
  LocationOn, 
  Security, 
  MeetingRoom, 
  NavigateNext,
  Close
} from '@mui/icons-material';

// ========== PLACEHOLDER PARA ENDPOINT REAL ==========
// EventItemEndpoint sin datos mock - listo para conectar con backend real
const EventItemEndpoint = {
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
const createInitialData = (eventId: string): EventData => ({
  eventId,
  operation: 'zonesDefinition',
  data: {
    zones: {      "zone#AA#GATE": {
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
      },      "zone#00#VENUE": {
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

// Función para detectar si es la primera visita
const isFirstVisit = (eventData: EventData | null): boolean => {
  return !eventData || 
         !eventData.operation || 
         eventData.operation !== 'zonesDefinition' ||
         !eventData.data?.zones ||
         Object.keys(eventData.data.zones).length === 0;
};

// ========== DEFINICIONES DE TIPOS ==========
// Misma estructura que ZonesBreadcrumbsNew para compatibilidad
interface AccessTypes {
  GENERAL: boolean;
  BACKSTAGE: boolean;
  STAGE: boolean;
  COMPROMIS: boolean;
  VIP: boolean;
}

interface Checkpoint {
  checkpointId: string;
  name: string;
  type: "IN" | "OUT";
  role: string;
  shareLink: string;
  qrShareLink: string;
  deviceImei?: string;
}

interface Gate {
  zoneId: string;
  name: string;
  type: "GATE";
  parentZoneId: null;
  maxCapacity: number;
  currentOccupancy?: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}

interface Zone {
  zoneId: string;
  name: string;
  type: "ZONE" | "VENUE";
  parentZoneId: null;
  maxCapacity: number;
  currentOccupancy: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}

interface Subzone {
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

type ZoneType = Gate | Zone | Subzone;

interface EventData {
  eventId: string;
  operation: string;
  data: {
    zones: { [key: string]: ZoneType };
  };
}

const eventId = 'EVENT_050';
const operation = 'zonesDefinition';

// ========== COMPONENTES UI REUTILIZABLES ==========

// Badges de tipos de acceso - mismo componente que en la versión con datos
const AccessTypeBadges = ({ accessTypes }: { accessTypes: AccessTypes }) => (
  <HorizontalLayout theme="spacing-xs">
    {accessTypes.GENERAL && (
      <Chip 
        label="GENERAL"
        size="small"
        variant="filled"
        sx={{ 
          backgroundColor: '#ff9800', 
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 600 
        }}
      />
    )}
    {accessTypes.BACKSTAGE && (
      <Chip 
        label="BACKSTAGE"
        size="small"
        variant="filled"
        sx={{ 
          backgroundColor: '#4caf50', 
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 600 
        }}
      />
    )}
    {accessTypes.STAGE && (
      <Chip 
        label="STAGE"
        size="small"
        variant="filled"
        sx={{ 
          backgroundColor: '#9c27b0', 
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 600 
        }}
      />
    )}
    {accessTypes.COMPROMIS && (
      <Chip 
        label="COMPROMIS"
        size="small"
        variant="filled"
        sx={{ 
          backgroundColor: '#2196f3', 
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 600 
        }}
      />
    )}
    {accessTypes.VIP && (
      <Chip 
        label="VIP"
        size="small"
        variant="filled"
        sx={{ 
          backgroundColor: '#f44336', 
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 600 
        }}
      />
    )}  </HorizontalLayout>
);

// Componente del botón de Update Zone Policy
const PolicyButton = ({ zoneId, isActive, onClick }: { 
  zoneId: string; 
  isActive: boolean; 
  onClick: (zoneId: string, event: React.MouseEvent) => void; 
}) => (
  <Box
    onClick={(event) => onClick(zoneId, event)}
    sx={{
      width: 16,
      height: 16,
      borderRadius: '50%',
      backgroundColor: isActive ? '#4caf50' : '#f44336',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '2px solid #ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      '&:hover': {
        backgroundColor: isActive ? '#45a049' : '#d32f2f',
        transform: 'scale(1.1)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
    title={isActive ? 'Update Zone Policy: ACTIVE (Click to disable)' : 'Update Zone Policy: INACTIVE (Click to enable)'}
  />
);

// Tabla de checkpoints - idéntica al componente original para consistencia
const CheckpointTable = ({
  checkpoints,
  onDelete,
  onUpdate,
}: {
  checkpoints: Checkpoint[];
  onDelete: (checkpoint: Checkpoint) => void;
  onUpdate: (checkpoint: Checkpoint) => void;
}) => (
  <Grid items={checkpoints} allRowsVisible style={{ width: '100%' }}>
    <GridColumn header="" renderer={() => <Checkbox />} />
    <GridColumn header="CheckPoint" path="name" />
    <GridColumn header="Type" path="type" />
    <GridColumn header="Device IMEI" path="deviceImei" />
    <GridColumn header="Device Role" renderer={({ item }) => (
      <DeviceRoleTabs
        currentRole={item.role}
        entityType={item.type === 'GATE' ? 'gate' : 'zone'}
        onRoleChange={(newRole) => {
          console.log(`Updating checkpoint ${item.name} role from ${item.role} to ${newRole}`);
          // Aquí se podría implementar la lógica para actualizar el rol en el backend
        }}
      />
    )} />
    <GridColumn
      header="Actions"
      renderer={({ item }) => (
        <HorizontalLayout theme="spacing">
          <Button theme="tertiary" onClick={() => onUpdate(item as Checkpoint)}>
            Edit
          </Button>
          <Button theme="error tertiary" onClick={() => onDelete(item as Checkpoint)}>
            Delete
          </Button>
        </HorizontalLayout>
      )}
    />
  </Grid>
);

// Componente de sección de zona con mejores estados vacíos y mensajes informativos
const ZoneSection = ({
  zone,
  isSubzone = false,
  parentZoneName = '',
  onAddCheckpoint,
  onDeleteCheckpoint,
  onUpdateCheckpoint,
  updatePolicies = {},
  onToggleUpdatePolicy,
}: {
  zone: ZoneType;
  isSubzone?: boolean;
  parentZoneName?: string;
  onAddCheckpoint: (zone: ZoneType) => void;
  onDeleteCheckpoint: (zone: ZoneType, checkpoint: Checkpoint) => void;
  onUpdateCheckpoint: (zone: ZoneType, checkpoint: Checkpoint) => void;
  updatePolicies?: { [zoneId: string]: boolean };
  onToggleUpdatePolicy?: (zoneId: string, event: React.MouseEvent) => void;
}) => {
  const checkpoints = zone.checkPoints ? Object.values(zone.checkPoints) : [];
  return (
    <div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '8px' }}>
      <HorizontalLayout style={{ alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        {isSubzone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ margin: 0, color: '#6c757d' }}>
              {zone.name}
              {parentZoneName && (
                <span style={{ fontSize: '12px', color: '#adb5bd', marginLeft: '8px' }}>
                  (Subzone of {parentZoneName})
                </span>
              )}
            </h4>            {onToggleUpdatePolicy && (
              <PolicyButton 
                zoneId={zone.zoneId}
                isActive={updatePolicies[zone.zoneId] ?? true}
                onClick={onToggleUpdatePolicy}
              />
            )}
          </div>
        )}
        <Button 
          theme="primary small"
          onClick={() => onAddCheckpoint(zone)}
          style={{ marginLeft: 'auto' }}
        >
          Add Checkpoint
        </Button>
      </HorizontalLayout>

      {/* Renderizado condicional: tabla de checkpoints o mensaje informativo */}
      {checkpoints.length > 0 ? (
        <CheckpointTable
          checkpoints={checkpoints}
          onDelete={(checkpoint) => onDeleteCheckpoint(zone, checkpoint)}
          onUpdate={(checkpoint) => onUpdateCheckpoint(zone, checkpoint)}
        />
      ) : (
        // Estado vacío más informativo que en la versión original
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#6c757d',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          border: '1px dashed #dee2e6'
        }}>
          <Icon icon="vaadin:info-circle" style={{ marginRight: '8px' }} />
          No checkpoints configured for this {zone.type.toLowerCase()}
        </div>
      )}
    </div>
  );
};

// ========== CONSTANTES DE ROLES DE DISPOSITIVOS ==========
// Roles específicos para Gates
const GATE_DEVICE_ROLES = [
  'STEWARD-CHECKIN',    // Control de entrada principal
  'STEWARD-CHECKOUT'    // Control de salida principal
];

// Roles específicos para Zones y Subzones  
const ZONE_DEVICE_ROLES = [
  'STEWARD-ZONEIN',     // Control de entrada a zona
  'STEWARD-ZONEOUT'     // Control de salida de zona
];

// Componente para mostrar roles de dispositivos como pestañas clicables
const DeviceRoleTabs = ({ 
  currentRole, 
  entityType,
  onRoleChange 
}: { 
  currentRole: string; 
  entityType: 'gate' | 'zone' | 'subzone';
  onRoleChange: (role: string) => void;
}) => {
  // Seleccionar roles disponibles según el tipo de entidad
  const availableRoles = entityType === 'gate' ? GATE_DEVICE_ROLES : ZONE_DEVICE_ROLES;
  
  const handleRoleChange = (_event: React.SyntheticEvent, newRole: string) => {
    onRoleChange(newRole);
  };

  return (
    <Tabs
      value={currentRole}
      onChange={handleRoleChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        minHeight: 'unset',
        '& .MuiTab-root': {
          minHeight: '28px',
          fontSize: '0.7rem',
          padding: '4px 8px',
          minWidth: 'auto'
        }
      }}
    >
      {availableRoles.map((role) => (
        <Tab
          key={role}
          value={role}
          label={role}
          sx={{
            fontSize: '0.7rem',
            fontWeight: currentRole === role ? 600 : 400,
            textTransform: 'none'
          }}
        />
      ))}
    </Tabs>
  );
};

// ========== COMPONENTE PRINCIPAL ==========
const ZonesManagementDefinitivo: React.FC = () => {
  // ========== HOOKS DE ESTADO ==========
  // Misma estructura de estado que el componente original para consistencia
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [initialDataCreated, setInitialDataCreated] = useState(false);
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  // Estados de diálogos - control granular de formularios inline
  const [gateDialogOpen, setGateDialogOpen] = useState(false);
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [venueDialogOpen, setVenueDialogOpen] = useState(false);
  const [checkpointDialogOpen, setCheckpointDialogOpen] = useState(false);
  const [subzoneDialogOpen, setSubzoneDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneType | null>(null);
  
  // Estados de breadcrumbs y navegación
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [activeBreadcrumbZone, setActiveBreadcrumbZone] = useState<string | null>(null);
  const [summaryView, setSummaryView] = useState<'overview' | 'gates' | 'zones' | 'details' | 'checkpoints'>('overview');
    // Estados de expansión de acordeones
  const [expandedGates, setExpandedGates] = useState(false);
  const [expandedVenues, setExpandedVenues] = useState(false);
  const [expandedZones, setExpandedZones] = useState(false);
  const [expandedIndividualGates, setExpandedIndividualGates] = useState<{ [zoneId: string]: boolean }>({});
  const [expandedIndividualVenues, setExpandedIndividualVenues] = useState<{ [zoneId: string]: boolean }>({});
  const [expandedIndividualZones, setExpandedIndividualZones] = useState<{ [zoneId: string]: boolean }>({});
  const [expandedSubzones, setExpandedSubzones] = useState<{ [zoneId: string]: boolean }>({});
  const [updatePolicies, setUpdatePolicies] = useState<{ [zoneId: string]: boolean }>({});

  // ========== HANDLERS CRUD ==========
  // Lógica idéntica al componente original pero sin datos mock iniciales
  
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
  // ========== HOOK DE CARGA INICIAL ==========
  // Carga inicial con creación automática de datos iniciales
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
  // Misma lógica de clasificación que el componente original
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
    const totalVenues = Object.values(eventData?.data?.zones || {}).filter(zone => zone.type === 'VENUE').length;
    const totalZones = zones.filter(zone => zone.type === 'ZONE').length;
    const totalSubzones = subzones.length;
    const totalCheckpoints = Object.values(eventData?.data?.zones || {}).reduce((acc, zone) => 
      acc + (zone.checkPoints ? Object.keys(zone.checkPoints).length : 0), 0
    );
    
    return {
      totalGates,
      totalVenues,
      totalZones,
      totalSubzones,
      totalCheckpoints
    };
  }, [gates, eventData, zones, subzones]);

  // Agrupación jerárquica de subzonas
  const subzonesByParent = useMemo(() => {
    const map: { [parentZoneId: string]: Subzone[] } = {};
    subzones.forEach(sz => {
      if (sz.type === 'SUBZONE') {
        if (!map[sz.parentZoneId]) map[sz.parentZoneId] = [];
        map[sz.parentZoneId].push(sz);
      }
    });
    return map;
  }, [subzones]);
  // ========== HANDLERS DE UI Y NAVEGACIÓN ==========
  
 
  // Misma lógica de handlers que el componente original
  
  const handleAddCheckpoint = (zone: ZoneType) => {
    setSelectedZone(zone);
    setCheckpointDialogOpen(true);
  };
  const handleAddSubzoneToZone = (parentZone: ZoneType) => {
    setSelectedZone(parentZone);
    setSubzoneDialogOpen(true);
  };

  // Función para toggle del Update Zone Policy
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

  // Lógica de breadcrumbs - idéntica al componente original
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
    switch (index) {
      case 0: return <Security fontSize="small" />;
      case 1: return activeBreadcrumbZone?.includes('GATE') ? <LocationOn fontSize="small" /> : 
                   activeBreadcrumbZone?.includes('VIP') ? <MeetingRoom fontSize="small" /> : 
                   <Security fontSize="small" />;
      default: return <NavigateNext fontSize="small" />;
    }
  };

  

  // ========== RENDER CONDICIONAL ==========
  // Mensaje de carga personalizado para esta versión
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px',
        gap: '16px'
      }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h3 style={{ color: '#666' }}>Configurando tu evento por primera vez...</h3>
        <p style={{ color: '#999' }}>Creando Gate y Venue iniciales</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }
  // ========== RENDER PRINCIPAL ==========
  // Estructura idéntica pero con mejores estados vacíos y mensajes informativos
  return (
    <VerticalLayout
      theme="spacing padding"
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {notification && (
        <Notification
          duration={3000}
          position="top-end"
          opened
          onOpenedChanged={e => !e.detail.value && setNotification(null)}
        >
          {notification}
        </Notification>
      )}
      
      {/* BREADCRUMBS NAVIGATION CARD */}
      <Card sx={{ mb: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', width: '100%', maxWidth: '1200px' }}>
        <CardContent sx={{ py: 2 }}>          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Visual Summary
            </Typography>
            {activeBreadcrumbZone && (
              <Chip 
                label={`Current: ${activeBreadcrumbZone}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>

          {/* Visual Summary of ZonesManagement Data */}
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#ffffff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
              Infrastructure Overview:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
              <Chip
                icon={<MeetingRoom />}
                label={`${summary.totalGates} Gates`}
                size="small"
                color="primary"
                variant={summaryView === 'gates' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
                onClick={() => setSummaryView(summaryView === 'gates' ? 'overview' : 'gates')}
              />
              <Chip
                icon={<LocationOn />}
                label={`${summary.totalVenues} Venues`}
                size="small"
                color="secondary"
                variant={summaryView === 'zones' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
                onClick={() => setSummaryView(summaryView === 'zones' ? 'overview' : 'zones')}
              />
              <Chip
                label={`${summary.totalZones} Zones`}
                size="small"
                color="warning"
                variant={summaryView === 'zones' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
                onClick={() => setSummaryView(summaryView === 'zones' ? 'overview' : 'zones')}
              />
              <Chip
                label={`${summary.totalSubzones} Subzones`}
                size="small"
                color="info"
                variant={summaryView === 'details' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
                onClick={() => setSummaryView(summaryView === 'details' ? 'overview' : 'details')}
              />
              <Chip
                label={`${summary.totalCheckpoints} Checkpoints`}
                size="small"
                color="success"
                variant={summaryView === 'checkpoints' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
                onClick={() => setSummaryView(summaryView === 'checkpoints' ? 'overview' : 'checkpoints')}
              />
            </Box>

            {/* Live Data Display */}
            <Box sx={{ mt: 1.5, p: 1.5, backgroundColor: '#f0f8ff', borderRadius: 0.5, border: '1px solid #b3d9ff' }}>
              <Typography variant="caption" color="primary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                Current Configuration Status:
              </Typography>
              
              {summaryView === 'gates' && (
                <Box>
                  <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Gates Configuration:
                  </Typography>
                  {gates.length > 0 ? gates.map(gate => (
                    <Typography key={gate.zoneId} variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      - {gate.name}: {Object.values(gate.checkPoints || {}).length} checkpoints, {gate.maxCapacity} capacity
                    </Typography>
                  )) : (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1, fontStyle: 'italic' }}>
                      No gates configured yet. Add your first gate to get started.
                    </Typography>
                  )}
                </Box>
              )}

              {summaryView === 'zones' && (
                <Box>
                  <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Zones & Venues Status:
                  </Typography>
                  {zones.length > 0 ? zones.map(zone => (
                    <Typography key={zone.zoneId} variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      - {zone.name} ({zone.type}): {zone.currentOccupancy || 0}/{zone.maxCapacity} occupancy
                    </Typography>
                  )) : (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1, fontStyle: 'italic' }}>
                      No zones configured yet. Add zones to manage your event areas.
                    </Typography>
                  )}
                </Box>
              )}

              {summaryView === 'details' && (
                <Box>
                  <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Subzones Details:
                  </Typography>
                  {subzones.length > 0 ? subzones.map(subzone => (
                    <Typography key={subzone.zoneId} variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      - {subzone.name} (Parent: {subzone.parentZoneId || 'N/A'}): {subzone.currentOccupancy || 0}/{subzone.maxCapacity}
                    </Typography>
                  )) : (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1, fontStyle: 'italic' }}>
                      No subzones configured yet. Create subzones within existing zones for better organization.
                    </Typography>
                  )}
                </Box>
              )}

              {summaryView === 'checkpoints' && (
                <Box>
                  <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
                    All Checkpoints Status:
                  </Typography>
                  {allCheckpoints.length > 0 ? allCheckpoints.map(checkpoint => (
                    <Typography key={checkpoint.checkpointId} variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      - {checkpoint.name} ({checkpoint.type}) in {checkpoint.zoneName} ({checkpoint.zoneType}) - {checkpoint.role}
                    </Typography>
                  )) : (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1, fontStyle: 'italic' }}>
                      No checkpoints configured yet. Add checkpoints to your gates and zones for access control.
                    </Typography>
                  )}
                </Box>
              )}              {summaryView === 'overview' && (
                <Box>
                  {initialDataCreated && showInitialMessage ? (
                    <Box sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: '#e8f5e8', 
                      borderRadius: 1, 
                      border: '1px solid #4caf50',
                      position: 'relative'
                    }}>
                      <IconButton
                        size="small"
                        onClick={() => setShowInitialMessage(false)}
                        sx={{ 
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'success.main'
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                        Initial Configuration Complete!
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Automatically created:
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1, mb: 0.5 }}>
                        1 Main Gate - Entry/exit control for the event
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1, mb: 1 }}>
                        1 Main Venue - Main event space
                      </Typography>
                      <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Tip:
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                        Configure checkpoints for Gates and Venues according to your access control and people flow needs.
                      </Typography>
                    </Box>
                  ) : null}
                  <Typography variant="caption" color="text.secondary">
                    {zonesArray.length === 0 ? (
                      "Welcome! Start by adding gates, zones, and checkpoints to configure your event infrastructure. Click on any category above to see detailed information."
                    ) : (
                      "Click on any category above to see detailed information from your zones configuration. This shows the current state of your festival infrastructure including capacity, occupancy, and access types."
                    )}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Navigation Breadcrumbs */}
          {currentPath.length > 0 && (
            <Breadcrumbs 
              separator={<NavigateNext fontSize="small" />}
              aria-label="zones navigation breadcrumb"
              sx={{ mt: 1 }}
            >
              {currentPath.map((pathItem, index) => (
                <Link
                  key={index}
                  component="button"
                  variant="body2"
                  onClick={() => handleBreadcrumbClick(index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    textDecoration: 'none',
                    color: index === currentPath.length - 1 ? 'text.primary' : 'primary.main',
                    fontWeight: index === currentPath.length - 1 ? 600 : 400,
                    fontSize: '0.875rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {getBreadcrumbIcon(index)}
                  {pathItem}
                </Link>
              ))}
            </Breadcrumbs>
          )}
        </CardContent>
      </Card>
      
      {/* GATES SECTION */}
      <Accordion 
        expanded={expandedGates} 
        onChange={(_event, isExpanded) => setExpandedGates(isExpanded)}
        style={{ marginBottom: '16px', width: '100%', maxWidth: '1200px' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <HorizontalLayout style={{ alignItems: 'center', gap: '16px', width: '100%' }}>
            <h2 style={{ margin: 0, color: '#343a40' }}>Gates</h2>
            <Button 
              theme="primary" 
              onClick={(e) => {
                e.stopPropagation();
                setGateDialogOpen(true);
              }}
            >
              Add Gate
            </Button>
          </HorizontalLayout>
        </AccordionSummary>
        <AccordionDetails>
          <Fade in={expandedGates}>
            <div style={{ width: '100%' }}>
              {/* Gate Form - Inline */}
              {gateDialogOpen && eventData && (
                <div style={{ marginBottom: '16px' }}>                  <Dialogs
                    gateDialogOpen={gateDialogOpen}
                    setGateDialogOpen={setGateDialogOpen}
                    zoneDialogOpen={false}
                    setZoneDialogOpen={setZoneDialogOpen}
                    venueDialogOpen={false}
                    setVenueDialogOpen={setVenueDialogOpen}
                    checkpointDialogOpen={false}
                    setCheckpointDialogOpen={setCheckpointDialogOpen}
                    subzoneDialogOpen={false}
                    setSubzoneDialogOpen={setSubzoneDialogOpen}
                    selectedZone={selectedZone}
                    eventData={eventData}
                    setEventData={setEventData}
                  />
                </div>
              )}
              
              {gates.length > 0 ? gates.map(gate => (
                <Accordion 
                  key={gate.zoneId}
                  expanded={expandedIndividualGates[gate.zoneId] || false} 
                  onChange={() => handleIndividualGateExpansion(gate.zoneId)}
                  style={{ marginBottom: '16px' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <HorizontalLayout style={{ alignItems: 'center', gap: '16px', width: '100%' }}>
                      <h3 style={{ margin: 0, color: '#495057', fontSize: '18px' }}>
                        {gate.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>                         <PolicyButton 
                         zoneId={gate.zoneId}
                         isActive={updatePolicies[gate.zoneId] ?? true}
                         onClick={toggleUpdatePolicy}
                       />
                        
                        <AccessTypeBadges accessTypes={gate.accessTypes} />
                        <Chip 
                          label={`Capacity: ${gate.maxCapacity}`}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      
                      </div>
                    </HorizontalLayout>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Fade in={expandedIndividualGates[gate.zoneId] || false}>
                      <div style={{ width: '100%' }}>                        <ZoneSection
                          zone={gate}
                          onAddCheckpoint={handleAddCheckpoint}
                          onDeleteCheckpoint={handleDeleteCheckpoint}
                          onUpdateCheckpoint={handleUpdateCheckpoint}
                          updatePolicies={updatePolicies}
                          onToggleUpdatePolicy={toggleUpdatePolicy}
                        />
                          {/* Checkpoint Form for this Gate - Inline */}
                        {checkpointDialogOpen && selectedZone?.zoneId === gate.zoneId && eventData && (
                          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                            <Dialogs
                              gateDialogOpen={false}
                              setGateDialogOpen={setGateDialogOpen}
                              zoneDialogOpen={false}
                              setZoneDialogOpen={setZoneDialogOpen}
                              venueDialogOpen={false}
                              setVenueDialogOpen={setVenueDialogOpen}
                              checkpointDialogOpen={checkpointDialogOpen}
                              setCheckpointDialogOpen={setCheckpointDialogOpen}
                              subzoneDialogOpen={false}
                              setSubzoneDialogOpen={setSubzoneDialogOpen}
                              selectedZone={selectedZone}
                              eventData={eventData}
                              setEventData={setEventData}
                            />
                          </div>
                        )}
                      </div>
                    </Fade>
                  </AccordionDetails>
                </Accordion>
              )) : (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  color: '#6c757d',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <LocationOn style={{ fontSize: 48, color: '#adb5bd', marginBottom: '16px' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Gates Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Gates are the main entry and exit points for your event. Start by adding your first gate.
                  </Typography>
                  <Button 
                    theme="primary"
                    onClick={() => setGateDialogOpen(true)}
                  >
                    Add Your First Gate
                  </Button>
                </div>
              )}
            </div>
          </Fade>
        </AccordionDetails>      </Accordion>
      
      {/* VENUES SECTION */}
      <Accordion 
        expanded={expandedVenues} 
        onChange={(_event, isExpanded) => setExpandedVenues(isExpanded)}
        style={{ marginBottom: '16px', width: '100%', maxWidth: '1200px' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <HorizontalLayout style={{ alignItems: 'center', gap: '16px', width: '100%' }}>
            <h2 style={{ margin: 0, color: '#343a40' }}>Venues</h2>            <Button 
              theme="primary" 
              onClick={(e) => {
                e.stopPropagation();
                setVenueDialogOpen(true);
              }}
            >
              Add Venue
            </Button>
          </HorizontalLayout>
        </AccordionSummary>        <AccordionDetails>
          <Fade in={expandedVenues}>
            <div style={{ width: '100%' }}>              {/* Venue Form - Inline */}
              {venueDialogOpen && eventData && (
                <div style={{ marginBottom: '16px' }}>
                  <Dialogs
                    gateDialogOpen={false}
                    setGateDialogOpen={setGateDialogOpen}
                    zoneDialogOpen={false}
                    setZoneDialogOpen={setZoneDialogOpen}
                    venueDialogOpen={venueDialogOpen}
                    setVenueDialogOpen={setVenueDialogOpen}
                    checkpointDialogOpen={false}
                    setCheckpointDialogOpen={setCheckpointDialogOpen}
                    subzoneDialogOpen={false}
                    setSubzoneDialogOpen={setSubzoneDialogOpen}
                    selectedZone={selectedZone}
                    eventData={eventData}
                    setEventData={setEventData}
                  />
                </div>
              )}
              
              {venues.length > 0 ? venues.map(venue => (
                <Accordion 
                  key={venue.zoneId}
                  expanded={expandedIndividualVenues[venue.zoneId] || false} 
                  onChange={() => handleIndividualVenueExpansion(venue.zoneId)}
                  style={{ marginBottom: '16px' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <HorizontalLayout style={{ alignItems: 'center', gap: '16px', width: '100%' }}>
                      <h3 style={{ margin: 0, color: '#495057', fontSize: '18px' }}>
                        {venue.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>                        <PolicyButton 
                          zoneId={venue.zoneId}
                          isActive={updatePolicies[venue.zoneId] ?? true}
                          onClick={toggleUpdatePolicy}
                          />
                        <AccessTypeBadges accessTypes={venue.accessTypes} />
                        <Chip 
                          label={`Capacity: ${venue.maxCapacity}`}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{ fontSize: '0.75rem' }}
                        />
                       
                       
                      </div>
                    </HorizontalLayout>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Fade in={expandedIndividualVenues[venue.zoneId] || false}>
                      <div style={{ width: '100%' }}>                        <ZoneSection
                          zone={venue}
                          onAddCheckpoint={handleAddCheckpoint}
                          onDeleteCheckpoint={handleDeleteCheckpoint}
                          onUpdateCheckpoint={handleUpdateCheckpoint}
                          updatePolicies={updatePolicies}
                          onToggleUpdatePolicy={toggleUpdatePolicy}
                        />
                          {/* Checkpoint Form for this Venue - Inline */}
                        {checkpointDialogOpen && selectedZone?.zoneId === venue.zoneId && eventData && (
                          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                            <Dialogs
                              gateDialogOpen={false}
                              setGateDialogOpen={setGateDialogOpen}
                              zoneDialogOpen={false}
                              setZoneDialogOpen={setZoneDialogOpen}
                              venueDialogOpen={false}
                              setVenueDialogOpen={setVenueDialogOpen}
                              checkpointDialogOpen={checkpointDialogOpen}
                              setCheckpointDialogOpen={setCheckpointDialogOpen}
                              subzoneDialogOpen={false}
                              setSubzoneDialogOpen={setSubzoneDialogOpen}
                              selectedZone={selectedZone}
                              eventData={eventData}
                              setEventData={setEventData}
                            />
                          </div>
                        )}
                        
                        {/* Subzone Form for this Venue - Inline */}
                        {subzoneDialogOpen && selectedZone?.zoneId === venue.zoneId && eventData && (
                          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                            <Dialogs
                              gateDialogOpen={false}
                              setGateDialogOpen={setGateDialogOpen}
                              zoneDialogOpen={false}
                              setZoneDialogOpen={setZoneDialogOpen}
                              venueDialogOpen={false}
                              setVenueDialogOpen={setVenueDialogOpen}
                              checkpointDialogOpen={false}
                              setCheckpointDialogOpen={setCheckpointDialogOpen}
                              subzoneDialogOpen={subzoneDialogOpen}
                              setSubzoneDialogOpen={setSubzoneDialogOpen}
                              selectedZone={selectedZone}
                              eventData={eventData}
                              setEventData={setEventData}
                            />
                          </div>
                        )}
                        
                        {/* SUBZONES - Rendered within their parent venue as collapsible accordions */}
                        {subzonesByParent[venue.zoneId] && subzonesByParent[venue.zoneId].length > 0 && (
                          <div style={{ marginTop: '16px' }}>
                            <Accordion 
                              expanded={expandedSubzones[venue.zoneId] || false} 
                              onChange={() => handleSubzoneExpansion(venue.zoneId)}
                              style={{ marginLeft: '20px', marginBottom: '8px' }}
                            >
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <h4 style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
                                  Subzones of {venue.name} ({subzonesByParent[venue.zoneId].length})
                                </h4>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Fade in={expandedSubzones[venue.zoneId] || false}>
                                  <div style={{ width: '100%' }}>
                                    {subzonesByParent[venue.zoneId].map(subzone => (
                                      <div key={subzone.zoneId} style={{ marginBottom: '16px' }}>                                        <ZoneSection
                                          zone={subzone}
                                          isSubzone
                                          parentZoneName={venue.name}
                                          onAddCheckpoint={handleAddCheckpoint}
                                          onDeleteCheckpoint={handleDeleteCheckpoint}
                                          onUpdateCheckpoint={handleUpdateCheckpoint}
                                          updatePolicies={updatePolicies}
                                          onToggleUpdatePolicy={toggleUpdatePolicy}
                                        />
                                        
                                        {/* Checkpoint Form for this Subzone - Inline */}
                                        {checkpointDialogOpen && selectedZone?.zoneId === subzone.zoneId && eventData && (
                                          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                                            <Dialogs
                                              gateDialogOpen={false}
                                              setGateDialogOpen={setGateDialogOpen}
                                              zoneDialogOpen={false}
                                              setZoneDialogOpen={setZoneDialogOpen}
                                              checkpointDialogOpen={checkpointDialogOpen}
                                              setCheckpointDialogOpen={setCheckpointDialogOpen}
                                              subzoneDialogOpen={false}
                                              setSubzoneDialogOpen={setSubzoneDialogOpen}
                                              selectedZone={selectedZone}
                                              eventData={eventData}
                                              setEventData={setEventData}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </Fade>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        )}
                      </div>
                    </Fade>
                  </AccordionDetails>
                </Accordion>
              )) : (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  color: '#6c757d',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <MeetingRoom style={{ fontSize: 48, color: '#adb5bd', marginBottom: '16px' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Venues Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Venues are the main event spaces like stages, halls, or performance areas. Add venues to organize your event infrastructure.
                  </Typography>                  <Button 
                    theme="primary"
                    onClick={() => setVenueDialogOpen(true)}
                  >
                    Add Your First Venue
                  </Button>
                </div>
              )}
            </div>
          </Fade>
        </AccordionDetails>
      </Accordion>
      
      {/* ZONES SECTION */}
      <Accordion 
        expanded={expandedZones} 
        onChange={(_event, isExpanded) => setExpandedZones(isExpanded)}
        style={{ marginBottom: '16px', width: '100%', maxWidth: '1200px' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <HorizontalLayout style={{ alignItems: 'center', gap: '16px', width: '100%' }}>
            <h2 style={{ margin: 0, color: '#343a40' }}>Zones</h2>
            <Button 
              theme="primary" 
              onClick={(e) => {
                e.stopPropagation();
                setZoneDialogOpen(true);
              }}
            >
              Add Zone
            </Button>
          </HorizontalLayout>
        </AccordionSummary>
        <AccordionDetails>
          <Fade in={expandedZones}>
            <div style={{ width: '100%' }}>
              {/* Zone Form - Inline */}
              {zoneDialogOpen && eventData && (
                <div style={{ marginBottom: '16px' }}>
                  <Dialogs
                    gateDialogOpen={false}
                    setGateDialogOpen={setGateDialogOpen}
                    zoneDialogOpen={zoneDialogOpen}
                    setZoneDialogOpen={setZoneDialogOpen}
                    checkpointDialogOpen={false}
                    setCheckpointDialogOpen={setCheckpointDialogOpen}
                    subzoneDialogOpen={false}
                    setSubzoneDialogOpen={setSubzoneDialogOpen}
                    selectedZone={selectedZone}
                    eventData={eventData}
                    setEventData={setEventData}
                  />
                </div>
              )}
              
              {zones.length > 0 ? zones.map(zone => (
                <Accordion 
                  key={zone.zoneId}
                  expanded={expandedIndividualZones[zone.zoneId] || false} 
                  onChange={() => handleIndividualZoneExpansion(zone.zoneId)}
                  style={{ marginBottom: '16px' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <HorizontalLayout style={{ alignItems: 'center', gap: '16px', width: '100%' }}>
                      <h3 style={{ margin: 0, color: '#495057', fontSize: '18px' }}>
                        {zone.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>                        <PolicyButton 
                          zoneId={zone.zoneId}
                          isActive={updatePolicies[zone.zoneId] ?? true}
                          onClick={toggleUpdatePolicy}
                        />
                        <AccessTypeBadges accessTypes={zone.accessTypes} />
                        <Chip 
                          label={`Capacity: ${zone.maxCapacity}`}
                          size="small"
                          variant="outlined"
                          color="default"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      
                        <Button 
                          theme="secondary small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSubzoneToZone(zone);
                          }}
                          style={{ marginLeft: '8px' }}
                        >
                          Add Subzone
                        </Button>
                      </div>
                    </HorizontalLayout>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Fade in={expandedIndividualZones[zone.zoneId] || false}>
                      <div style={{ width: '100%' }}>                        <ZoneSection
                          zone={zone}
                          onAddCheckpoint={handleAddCheckpoint}
                          onDeleteCheckpoint={handleDeleteCheckpoint}
                          onUpdateCheckpoint={handleUpdateCheckpoint}
                          updatePolicies={updatePolicies}
                          onToggleUpdatePolicy={toggleUpdatePolicy}
                        />
                        
                        {/* Checkpoint Form for this Zone - Inline */}
                        {checkpointDialogOpen && selectedZone?.zoneId === zone.zoneId && eventData && (
                          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                            <Dialogs
                              gateDialogOpen={false}
                              setGateDialogOpen={setGateDialogOpen}
                              zoneDialogOpen={false}
                              setZoneDialogOpen={setZoneDialogOpen}
                              checkpointDialogOpen={checkpointDialogOpen}
                              setCheckpointDialogOpen={setCheckpointDialogOpen}
                              subzoneDialogOpen={false}
                              setSubzoneDialogOpen={setSubzoneDialogOpen}
                              selectedZone={selectedZone}
                              eventData={eventData}
                              setEventData={setEventData}
                            />
                          </div>
                        )}
                        
                        {/* Subzone Form for this Zone - Inline */}
                        {subzoneDialogOpen && selectedZone?.zoneId === zone.zoneId && eventData && (
                          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                            <Dialogs
                              gateDialogOpen={false}
                              setGateDialogOpen={setGateDialogOpen}
                              zoneDialogOpen={false}
                              setZoneDialogOpen={setZoneDialogOpen}
                              checkpointDialogOpen={false}
                              setCheckpointDialogOpen={setCheckpointDialogOpen}
                              subzoneDialogOpen={subzoneDialogOpen}
                              setSubzoneDialogOpen={setSubzoneDialogOpen}
                              selectedZone={selectedZone}
                              eventData={eventData}
                              setEventData={setEventData}
                            />
                          </div>
                        )}
                        
                        {/* SUBZONES - Rendered within their parent zone as collapsible accordions */}
                        {subzonesByParent[zone.zoneId] && subzonesByParent[zone.zoneId].length > 0 && (
                          <div style={{ marginTop: '16px' }}>
                            <Accordion 
                              expanded={expandedSubzones[zone.zoneId] || false} 
                              onChange={() => handleSubzoneExpansion(zone.zoneId)}
                              style={{ marginLeft: '20px', marginBottom: '8px' }}
                            >
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <h4 style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
                                  Subzones of {zone.name} ({subzonesByParent[zone.zoneId].length})
                                </h4>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Fade in={expandedSubzones[zone.zoneId] || false}>
                                  <div style={{ width: '100%' }}>
                                    {subzonesByParent[zone.zoneId].map(subzone => (
                                      <div key={subzone.zoneId} style={{ marginBottom: '16px' }}>                                        <ZoneSection
                                          zone={subzone}
                                          isSubzone
                                          parentZoneName={zone.name}
                                          onAddCheckpoint={handleAddCheckpoint}
                                          onDeleteCheckpoint={handleDeleteCheckpoint}
                                          onUpdateCheckpoint={handleUpdateCheckpoint}
                                          updatePolicies={updatePolicies}
                                          onToggleUpdatePolicy={toggleUpdatePolicy}
                                        />
                                        
                                        {/* Checkpoint Form for this Subzone - Inline */}
                                        {checkpointDialogOpen && selectedZone?.zoneId === subzone.zoneId && eventData && (
                                          <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                                            <Dialogs
                                              gateDialogOpen={false}
                                              setGateDialogOpen={setGateDialogOpen}
                                              zoneDialogOpen={false}
                                              setZoneDialogOpen={setZoneDialogOpen}
                                              checkpointDialogOpen={checkpointDialogOpen}
                                              setCheckpointDialogOpen={setCheckpointDialogOpen}
                                              subzoneDialogOpen={false}
                                              setSubzoneDialogOpen={setSubzoneDialogOpen}
                                              selectedZone={selectedZone}
                                              eventData={eventData}
                                              setEventData={setEventData}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </Fade>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        )}
                      </div>
                    </Fade>
                  </AccordionDetails>
                </Accordion>
              )) : (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  color: '#6c757d',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <MeetingRoom style={{ fontSize: 48, color: '#adb5bd', marginBottom: '16px' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Zones Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Zones help organize different areas within your event. Add zones for better crowd management and access control.
                  </Typography>
                  <Button 
                    theme="primary"
                    onClick={() => setZoneDialogOpen(true)}
                  >
                    Add Your First Zone
                  </Button>
                </div>
              )}
            </div>
          </Fade>
        </AccordionDetails>
      </Accordion>
    </VerticalLayout>
  );
};

export default ZonesManagementDefinitivo;
