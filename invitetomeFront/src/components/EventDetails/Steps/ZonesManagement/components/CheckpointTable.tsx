/**
 * CheckpointTable.tsx - Componente tabla de checkpoints
 * 
 * Renderiza tabla con:
 * - Lista de checkpoints de una zona
 * - Columnas: Name, Type (IN/OUT), Role, Actions
 * - Botones para agregar, editar, eliminar checkpoints
 * - Estado vacío cuando no hay checkpoints
 * - Integración con formularios de Dialogs
 */

import React from 'react';
import {
  Grid,
  GridColumn,
  Checkbox,
  Button,
  HorizontalLayout,
} from '@vaadin/react-components';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import { Checkpoint } from '../types';
import { GATE_DEVICE_ROLES, ZONE_DEVICE_ROLES } from '../services';

// ========== COMPONENTE DEVICE ROLE TABS ==========
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

// ========== PROPS INTERFACE ==========
interface CheckpointTableProps {
  checkpoints: Checkpoint[];
  onAdd: () => void;
  onDelete: (checkpoint: Checkpoint) => void;
  onUpdate: (checkpoint: Checkpoint) => void;
  onRoleChange?: (checkpoint: Checkpoint, newRole: string) => void;
  zoneType?: 'GATE' | 'ZONE' | 'VENUE' | 'SUBZONE';
}

// ========== COMPONENTE PRINCIPAL ==========
const CheckpointTable: React.FC<CheckpointTableProps> = ({
  checkpoints,
  onAdd,
  onDelete,
  onUpdate,
  onRoleChange,
  zoneType = 'ZONE'
}) => {
  // Estado vacío
  if (checkpoints.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6',
          margin: '16px 0'
        }}
      >
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No Checkpoints Configured
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Checkpoints help control access and monitor flow in this {zoneType.toLowerCase()}.
        </Typography>
        <Button theme="primary" onClick={onAdd}>
          Add Your First Checkpoint
        </Button>
      </Box>
    );
  }

  // Tabla con datos
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header con botón agregar */}
      <HorizontalLayout theme="spacing" style={{ 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <Typography variant="h6">
          Checkpoints ({checkpoints.length})
        </Typography>
        <Button theme="primary" onClick={onAdd}>
          Add Checkpoint
        </Button>
      </HorizontalLayout>

      {/* Tabla */}
      <Grid items={checkpoints} allRowsVisible style={{ width: '100%' }}>
        <GridColumn 
          header="" 
          renderer={() => <Checkbox />} 
          width="60px"
        />
        
        <GridColumn 
          header="CheckPoint" 
          path="name"
          width="200px"
        />
        
        <GridColumn 
          header="Type" 
          path="type"
          width="80px"
          renderer={({ item }) => (
            <Box sx={{ 
              backgroundColor: item.type === 'IN' ? '#e3f2fd' : '#fff3e0',
              color: item.type === 'IN' ? '#1976d2' : '#f57c00',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {item.type}
            </Box>
          )}
        />
        
        <GridColumn 
          header="Device IMEI" 
          path="deviceImei"
          width="150px"
          renderer={({ item }) => (
            <Typography variant="body2" sx={{ 
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: item.deviceImei ? 'text.primary' : 'text.secondary'
            }}>
              {item.deviceImei || 'Not assigned'}
            </Typography>
          )}
        />
        
        <GridColumn 
          header="Device Role" 
          width="200px"
          renderer={({ item }) => (
            <DeviceRoleTabs
              currentRole={item.role}
              entityType={zoneType === 'GATE' ? 'gate' : 'zone'}
              onRoleChange={(newRole) => {
                console.log(`Updating checkpoint ${item.name} role from ${item.role} to ${newRole}`);
                if (onRoleChange) {
                  onRoleChange(item as Checkpoint, newRole);
                }
              }}
            />
          )} 
        />
        
        <GridColumn
          header="Actions"
          width="150px"
          renderer={({ item }) => (
            <HorizontalLayout theme="spacing">
              <Button 
                theme="tertiary" 
                onClick={() => onUpdate(item as Checkpoint)}
              >
                Edit
              </Button>
              <Button 
                theme="error tertiary" 
                onClick={() => onDelete(item as Checkpoint)}
              >
                Delete
              </Button>
            </HorizontalLayout>
          )}
        />
      </Grid>
    </Box>
  );
};

export default CheckpointTable;
