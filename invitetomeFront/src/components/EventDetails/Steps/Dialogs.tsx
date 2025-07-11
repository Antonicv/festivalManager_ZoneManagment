import { useState } from 'react';
import {
  VerticalLayout,
  HorizontalLayout,
  TextField,
  NumberField,
  ComboBox,
  Checkbox,
  Button,
} from '@vaadin/react-components';


/**
 * Dialogs.tsx - Componente de formularios inline para gestión de zonas
 * 
 * Este componente contiene todos los formularios modales/inline para crear y gestionar:
 * - Gates (Puertas de entrada/salida principales)
 * - Zones (Zonas de evento)
 * - Venues (Recintos/Espacios)
 * - Checkpoints (Puntos de control dentro de zonas)
 * - Subzones (Sub-zonas dentro de zonas principales)
 * 
 * Utiliza Vaadin React Components para la UI y gestiona el estado local de cada formulario
 * independientemente, permitiendo múltiples formularios abiertos simultáneamente.
 */



// ========== DEFINICIONES DE TIPOS ==========
// Tipos idénticos a ZonesManagement.tsx para mantener consistencia de datos
interface AccessTypes {
  GENERAL: boolean;
  BACKSTAGE: boolean;
  STAGE: boolean;
  VIP: boolean;
}

interface Checkpoint {
  checkpointId: string;
  name: string; // ej: "Main Entry", "Backstage Exit"
  type: "IN" | "OUT";
  role: string; // ej: "STEWARD-CHECKIN", "STEWARD-ZONEIN"
  shareLink: string;
  qrShareLink: string;
  deviceImei?: string;
}

interface Gate {
  zoneId: string;
  name: string; // ej: "Main-GATE"
  type: "GATE";
  parentZoneId: null;
  maxCapacity: number;
  currentOccupancy?: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}

interface Zone {
  zoneId: string;
  name: string; // ej: "VENUE", "BACKSTAGE"
  type: "ZONE" | "VENUE";
  parentZoneId: null;
  maxCapacity: number;
  currentOccupancy: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}

interface Subzone {
  zoneId: string;
  name: string; // ej: "STAGE"
  type: "SUBZONE";
  parentZoneId: string;
  parentZoneName: string;
  maxCapacity: number;
  currentOccupancy?: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}

// Union type for all zone types
type ZoneType = Gate | Zone | Subzone;

interface EventData {
  eventId: string;
  operation: string;
  data: {
    zones: { [key: string]: ZoneType };
  };
}

interface DialogsProps {
  gateDialogOpen: boolean;
  setGateDialogOpen: (open: boolean) => void;
  zoneDialogOpen: boolean;
  setZoneDialogOpen: (open: boolean) => void;
  venueDialogOpen?: boolean;
  setVenueDialogOpen?: (open: boolean) => void;
  checkpointDialogOpen: boolean;
  setCheckpointDialogOpen: (open: boolean) => void;
  subzoneDialogOpen: boolean;
  setSubzoneDialogOpen: (open: boolean) => void;
  selectedZone: ZoneType | null;
  eventData: EventData;
  setEventData: (data: EventData) => void;
}

const Dialogs = ({
  gateDialogOpen,
  setGateDialogOpen,
  zoneDialogOpen,
  setZoneDialogOpen,
  venueDialogOpen,
  setVenueDialogOpen,
  checkpointDialogOpen,
  setCheckpointDialogOpen,
  subzoneDialogOpen,
  setSubzoneDialogOpen,
  selectedZone,
  eventData,
  setEventData,
}: DialogsProps) => {
  // Gate Dialog State
  const [gateName, setGateName] = useState('');
  const [gateDeviceId, setGateDeviceId] = useState('');
  const [gateDeviceRole, setGateDeviceRole] = useState('');

  // Zone Dialog State
  const [zoneName, setZoneName] = useState('');
  const [zoneMaxCapacity, setZoneMaxCapacity] = useState(100);
  const [zoneGeneralAccess, setZoneGeneralAccess] = useState(false);
  const [zoneBackstageAccess, setZoneBackstageAccess] = useState(false);
  const [zoneStageAccess, setZoneStageAccess] = useState(false);

  // Checkpoint Dialog State
  const [checkpointName, setCheckpointName] = useState('');
  const [checkpointType, setCheckpointType] = useState('IN');
  const [checkpointDeviceId, setCheckpointDeviceId] = useState('');
  const [checkpointDeviceRole, setCheckpointDeviceRole] = useState('');

  // Subzone Dialog State
  const [subzoneName, setSubzoneName] = useState('');
  const [subzoneMaxCapacity, setSubzoneMaxCapacity] = useState(100);
  const [subzoneGeneralAccess, setSubzoneGeneralAccess] = useState(false);
  const [subzoneBackstageAccess, setSubzoneBackstageAccess] = useState(false);
  const [subzoneStageAccess, setSubzoneStageAccess] = useState(false);

  const resetGateForm = () => {
    setGateName('');
    setGateDeviceId('');
    setGateDeviceRole('');
  };

  const resetZoneForm = () => {
    setZoneName('');
    setZoneMaxCapacity(100);
    setZoneGeneralAccess(false);
    setZoneBackstageAccess(false);
    setZoneStageAccess(false);
  };

  const resetCheckpointForm = () => {
    setCheckpointName('');
    setCheckpointType('IN');
    setCheckpointDeviceId('');
    setCheckpointDeviceRole('');
  };

  const resetSubzoneForm = () => {
    setSubzoneName('');
    setSubzoneMaxCapacity(100);
    setSubzoneGeneralAccess(false);
    setSubzoneBackstageAccess(false);
    setSubzoneStageAccess(false);
  };

  const handleAddGate = () => {
    const newGate: Gate = {
      zoneId: `gate#${Date.now()}`,
      name: gateName,
      type: 'GATE',
      parentZoneId: null,
      maxCapacity: 1000,
      currentOccupancy: 0,
      accessTypes: {
        GENERAL: true,
        BACKSTAGE: true,
        STAGE: true,
        VIP: true,
      },
      checkPoints: {
        [`checkpoint#${gateName}#IN`]: {
          checkpointId: `checkpoint#${gateName}#IN`,
          name: `${gateName} Entry`,
          type: 'IN',
          role: gateDeviceRole || 'STEWARD-CHECKIN',
          shareLink: `https://invite2me.com/gate/${gateName.toLowerCase().replace(/\s+/g, '-')}`,
          qrShareLink: `https://invite2me.com/qr/gate/${gateName.toLowerCase().replace(/\s+/g, '-')}`,
          deviceImei: gateDeviceId,
        }
      }
    };

    const updatedZones = { ...eventData.data.zones };
    updatedZones[newGate.zoneId] = newGate;

    setEventData({
      ...eventData,
      data: { zones: updatedZones },
    });
    setGateDialogOpen(false);
    resetGateForm();
  };

  const handleAddZone = () => {
    const newZone: Zone = {
      zoneId: `zone#${Date.now()}`,
      name: zoneName,
      type: 'ZONE',
      parentZoneId: null,
      maxCapacity: zoneMaxCapacity,
      currentOccupancy: 0,
      checkPoints: {},
      accessTypes: {
        GENERAL: zoneGeneralAccess,
        BACKSTAGE: zoneBackstageAccess,
        STAGE: zoneStageAccess,
        VIP: false,
      },
    };

    const updatedZones = { ...eventData.data.zones };
    updatedZones[newZone.zoneId] = newZone;

    setEventData({
      ...eventData,
      data: { zones: updatedZones },
    });
    setZoneDialogOpen(false);
    resetZoneForm();
  };

  const handleAddVenue = () => {
    const newVenue: Zone = {
      zoneId: `venue#${Date.now()}`,
      name: zoneName,
      type: 'VENUE',
      parentZoneId: null,
      maxCapacity: zoneMaxCapacity,
      currentOccupancy: 0,
      checkPoints: {},
      accessTypes: {
        GENERAL: zoneGeneralAccess,
        BACKSTAGE: zoneBackstageAccess,
        STAGE: zoneStageAccess,
        VIP: false,
      },
    };

    const updatedZones = { ...eventData.data.zones };
    updatedZones[newVenue.zoneId] = newVenue;

    setEventData({
      ...eventData,
      data: { zones: updatedZones },
    });
    setVenueDialogOpen && setVenueDialogOpen(false);
    resetZoneForm();
  };

  const handleAddCheckpoint = () => {
    if (!selectedZone) return;

    const newCheckpoint: Checkpoint = {
      checkpointId: `checkpoint#${Date.now()}`,
      name: checkpointName,
      type: checkpointType as "IN" | "OUT",
      role: checkpointDeviceRole || 'STEWARD-ZONEIN',
      shareLink: `https://invite2me.com/checkpoint/${checkpointName.toLowerCase().replace(/\s+/g, '-')}`,
      qrShareLink: `https://invite2me.com/qr/checkpoint/${checkpointName.toLowerCase().replace(/\s+/g, '-')}`,
      deviceImei: checkpointDeviceId,
    };

    const updatedZones = { ...eventData.data.zones };
    if (updatedZones[selectedZone.zoneId]) {
      if (!updatedZones[selectedZone.zoneId].checkPoints) {
        updatedZones[selectedZone.zoneId].checkPoints = {};
      }
      updatedZones[selectedZone.zoneId].checkPoints![newCheckpoint.checkpointId] = newCheckpoint;
    }

    setEventData({
      ...eventData,
      data: { zones: updatedZones },
    });
    setCheckpointDialogOpen(false);
    resetCheckpointForm();
  };

  const handleAddSubzone = () => {
    if (!selectedZone) return;

    const newSubzone: Subzone = {
      zoneId: `subzone#${Date.now()}`,
      name: subzoneName,
      type: 'SUBZONE',
      parentZoneId: selectedZone.zoneId,
      parentZoneName: selectedZone.name,
      maxCapacity: subzoneMaxCapacity,
      currentOccupancy: 0,
      checkPoints: {},
      accessTypes: {
        GENERAL: subzoneGeneralAccess,
        BACKSTAGE: subzoneBackstageAccess,
        STAGE: subzoneStageAccess,
        VIP: false,
      },
    };

    const updatedZones = { ...eventData.data.zones };
    updatedZones[newSubzone.zoneId] = newSubzone;

    setEventData({
      ...eventData,
      data: { zones: updatedZones },
    });
    setSubzoneDialogOpen(false);
    resetSubzoneForm();
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Gate Form */}
      {gateDialogOpen && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          margin: '8px 0',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#495057' }}>Add New Gate</h4>
          <VerticalLayout theme="spacing">
            <TextField
              label="Gate Name"
              value={gateName}
              placeholder="e.g., Main Gate"
              onValueChanged={(e: any) => setGateName(e.detail.value)}
            />
            <TextField
              label="Device IMEI"
              value={gateDeviceId}
              placeholder="Device identifier"
              onValueChanged={(e: any) => setGateDeviceId(e.detail.value)}
            />
            <TextField
              label="Device Role"
              value={gateDeviceRole}
              placeholder="STEWARD-CHECKIN"
              onValueChanged={(e: any) => setGateDeviceRole(e.detail.value)}
            />
            <HorizontalLayout theme="spacing" style={{ marginTop: '16px' }}>
              <Button onClick={() => setGateDialogOpen(false)}>Cancel</Button>
              <Button theme="primary" onClick={handleAddGate} disabled={!gateName}>
                Add Gate
              </Button>
            </HorizontalLayout>
          </VerticalLayout>
        </div>
      )}

      {/* Zone Form */}
      {zoneDialogOpen && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          margin: '8px 0',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#495057' }}>Add New Zone</h4>
          <VerticalLayout theme="spacing">
            <TextField
              label="Zone Name"
              value={zoneName}
              placeholder="e.g., VIP Area"
              onValueChanged={(e: any) => setZoneName(e.detail.value)}
            />
            <NumberField
              label="Max Capacity"
              value={zoneMaxCapacity.toString()}
              onValueChanged={(e: any) => setZoneMaxCapacity(parseInt(e.detail.value) || 100)}
            />
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057', fontSize: '14px' }}>Access Types</span>
              <div style={{ marginTop: '8px' }}>
                <Checkbox
                  label="GENERAL"
                  checked={zoneGeneralAccess}
                  onCheckedChanged={(e: any) => setZoneGeneralAccess(e.detail.value)}
                />
                <Checkbox
                  label="BACKSTAGE"
                  checked={zoneBackstageAccess}
                  onCheckedChanged={(e: any) => setZoneBackstageAccess(e.detail.value)}
                />
                <Checkbox
                  label="STAGE"
                  checked={zoneStageAccess}
                  onCheckedChanged={(e: any) => setZoneStageAccess(e.detail.value)}
                />
              </div>
            </div>
            <HorizontalLayout theme="spacing" style={{ marginTop: '16px' }}>
              <Button onClick={() => setZoneDialogOpen(false)}>Cancel</Button>
              <Button theme="primary" onClick={handleAddZone} disabled={!zoneName}>
                Add Zone
              </Button>
            </HorizontalLayout>
          </VerticalLayout>
        </div>
      )}

      {/* Venue Form */}
      {venueDialogOpen && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          margin: '8px 0',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#495057' }}>Add New Venue</h4>
          <VerticalLayout theme="spacing">
            <TextField
              label="Venue Name"
              value={zoneName}
              placeholder="e.g., Main Stage, Concert Hall"
              onValueChanged={(e: any) => setZoneName(e.detail.value)}
            />
            <NumberField
              label="Max Capacity"
              value={zoneMaxCapacity.toString()}
              onValueChanged={(e: any) => setZoneMaxCapacity(parseInt(e.detail.value) || 100)}
            />
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057', fontSize: '14px' }}>Access Types</span>
              <div style={{ marginTop: '8px' }}>
                <Checkbox
                  label="GENERAL"
                  checked={zoneGeneralAccess}
                  onCheckedChanged={(e: any) => setZoneGeneralAccess(e.detail.value)}
                />
                <Checkbox
                  label="BACKSTAGE"
                  checked={zoneBackstageAccess}
                  onCheckedChanged={(e: any) => setZoneBackstageAccess(e.detail.value)}
                />
                <Checkbox
                  label="STAGE"
                  checked={zoneStageAccess}
                  onCheckedChanged={(e: any) => setZoneStageAccess(e.detail.value)}
                />
              </div>
            </div>
            <HorizontalLayout theme="spacing" style={{ marginTop: '16px' }}>
              <Button onClick={() => setVenueDialogOpen && setVenueDialogOpen(false)}>Cancel</Button>
              <Button theme="primary" onClick={handleAddVenue} disabled={!zoneName}>
                Add Venue
              </Button>
            </HorizontalLayout>
          </VerticalLayout>
        </div>
      )}

      {/* Checkpoint Form */}
      {checkpointDialogOpen && selectedZone && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          margin: '8px 0',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#495057' }}>
            Add Checkpoint to {selectedZone.name}
          </h4>
          <VerticalLayout theme="spacing">
            <TextField
              label="Checkpoint Name"
              value={checkpointName}
              placeholder="e.g., Main Entry"
              onValueChanged={(e: any) => setCheckpointName(e.detail.value)}
            />
            <ComboBox
              label="Type"
              value={checkpointType}
              onValueChanged={(e: any) => setCheckpointType(e.detail.value)}
              items={['IN', 'OUT']}
            />
            <TextField
              label="Device IMEI"
              value={checkpointDeviceId}
              placeholder="Device identifier"
              onValueChanged={(e: any) => setCheckpointDeviceId(e.detail.value)}
            />
            <TextField
              label="Device Role"
              value={checkpointDeviceRole}
              placeholder="STEWARD-ZONEIN"
              onValueChanged={(e: any) => setCheckpointDeviceRole(e.detail.value)}
            />
            <HorizontalLayout theme="spacing" style={{ marginTop: '16px' }}>
              <Button onClick={() => setCheckpointDialogOpen(false)}>Cancel</Button>
              <Button theme="primary" onClick={handleAddCheckpoint} disabled={!checkpointName}>
                Add Checkpoint
              </Button>
            </HorizontalLayout>
          </VerticalLayout>
        </div>
      )}

      {/* Subzone Form */}
      {subzoneDialogOpen && selectedZone && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          margin: '8px 0',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#495057' }}>
            Add Subzone to {selectedZone.name}
          </h4>
          <VerticalLayout theme="spacing">
            <TextField
              label="Subzone Name"
              value={subzoneName}
              placeholder="e.g., Stage Area"
              onValueChanged={(e: any) => setSubzoneName(e.detail.value)}
            />
            <NumberField
              label="Max Capacity"
              value={subzoneMaxCapacity.toString()}
              onValueChanged={(e: any) => setSubzoneMaxCapacity(parseInt(e.detail.value) || 100)}
            />
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontWeight: 'bold', color: '#495057', fontSize: '14px' }}>Access Types</span>
              <div style={{ marginTop: '8px' }}>
                <Checkbox
                  label="GENERAL"
                  checked={subzoneGeneralAccess}
                  onCheckedChanged={(e: any) => setSubzoneGeneralAccess(e.detail.value)}
                />
                <Checkbox
                  label="BACKSTAGE"
                  checked={subzoneBackstageAccess}
                  onCheckedChanged={(e: any) => setSubzoneBackstageAccess(e.detail.value)}
                />
                <Checkbox
                  label="STAGE"
                  checked={subzoneStageAccess}
                  onCheckedChanged={(e: any) => setSubzoneStageAccess(e.detail.value)}
                />
              </div>
            </div>
            <HorizontalLayout theme="spacing" style={{ marginTop: '16px' }}>
              <Button onClick={() => setSubzoneDialogOpen(false)}>Cancel</Button>
              <Button theme="primary" onClick={handleAddSubzone} disabled={!subzoneName}>
                Add Subzone
              </Button>
            </HorizontalLayout>
          </VerticalLayout>
        </div>
      )}
    </div>
  );
};

export default Dialogs;