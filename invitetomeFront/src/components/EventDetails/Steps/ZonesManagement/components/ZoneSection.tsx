/**
 * ZoneSection.tsx - Componente para sección individual de zona/gate/venue
 * 
 * Renderiza una sección individual que puede ser:
 * - Gate (puerta de entrada/salida)
 * - Zone (zona de evento)
 * - Venue (recinto/espacio)
 * 
 * Incluye:
 * - Información básica de la zona
 * - Acordeón expandible
 * - Botones de acción (editar, eliminar, políticas)
 * - Lista de checkpoints
 * - Capacidad y ocupación
 */

import React from 'react';
import {
  Button,
  HorizontalLayout,
} from '@vaadin/react-components';
import { Box, Typography, Chip } from '@mui/material';
import { ZoneType, Checkpoint, AccessTypes } from '../types';
import CheckpointTable from './CheckpointTable';

// ========== COMPONENTE ACCESS TYPE BADGES ==========
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
    )}
  </HorizontalLayout>
);

// ========== COMPONENTE POLICY BUTTON ==========
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

// ========== PROPS INTERFACE ==========
interface ZoneSectionProps {
  zone: ZoneType;
  isSubzone?: boolean;
  parentZoneName?: string;
  onAddCheckpoint: (zone: ZoneType) => void;
  onDeleteCheckpoint: (zone: ZoneType, checkpoint: Checkpoint) => void;
  onUpdateCheckpoint: (zone: ZoneType, checkpoint: Checkpoint) => void;
  onEditZone?: (zone: ZoneType) => void;
  onDeleteZone?: (zoneId: string) => void;
  updatePolicies?: { [zoneId: string]: boolean };
  onToggleUpdatePolicy?: (zoneId: string, event: React.MouseEvent) => void;
}

// ========== COMPONENTE PRINCIPAL ==========
const ZoneSection: React.FC<ZoneSectionProps> = ({
  zone,
  isSubzone = false,
  parentZoneName = '',
  onAddCheckpoint,
  onDeleteCheckpoint,
  onUpdateCheckpoint,
  onEditZone,
  onDeleteZone,
  updatePolicies = {},
  onToggleUpdatePolicy,
}) => {
  const checkpoints = zone.checkPoints ? Object.values(zone.checkPoints) : [];

  return (
    <Box sx={{ 
      padding: '16px', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      marginBottom: '8px',
      backgroundColor: isSubzone ? '#fafafa' : '#ffffff'
    }}>
      {/* Header de la zona */}
      <HorizontalLayout style={{ 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '16px',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {/* Título y info */}
          <Box>
            <Typography variant={isSubzone ? "subtitle1" : "h6"} sx={{ 
              margin: 0, 
              color: isSubzone ? '#6c757d' : 'text.primary',
              fontWeight: isSubzone ? 500 : 600
            }}>
              {zone.name}
              {isSubzone && parentZoneName && (
                <Typography component="span" sx={{ 
                  fontSize: '12px', 
                  color: '#adb5bd', 
                  marginLeft: '8px' 
                }}>
                  (Subzone of {parentZoneName})
                </Typography>
              )}
            </Typography>
            
            {/* Type badge */}
            <Typography variant="caption" sx={{ 
              backgroundColor: zone.type === 'GATE' ? '#e3f2fd' : zone.type === 'VENUE' ? '#fff3e0' : '#e8f5e8',
              color: zone.type === 'GATE' ? '#1976d2' : zone.type === 'VENUE' ? '#f57c00' : '#2e7d32',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              marginRight: '8px'
            }}>
              {zone.type}
            </Typography>

            {/* Capacidad */}
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Capacity: {zone.currentOccupancy || 0}/{zone.maxCapacity}
            </Typography>
          </Box>

          {/* Access types */}
          <AccessTypeBadges accessTypes={zone.accessTypes} />

          {/* Policy button */}
          {onToggleUpdatePolicy && (
            <PolicyButton 
              zoneId={zone.zoneId}
              isActive={updatePolicies[zone.zoneId] ?? true}
              onClick={onToggleUpdatePolicy}
            />
          )}
        </Box>

        {/* Botones de acción */}
        <HorizontalLayout theme="spacing-s">
          {onEditZone && (
            <Button 
              theme="tertiary small"
              onClick={() => onEditZone(zone)}
            >
              Edit
            </Button>
          )}
          
          {onDeleteZone && (
            <Button 
              theme="error tertiary small"
              onClick={() => onDeleteZone(zone.zoneId)}
            >
              Delete
            </Button>
          )}
        </HorizontalLayout>
      </HorizontalLayout>

      {/* Tabla de checkpoints */}
      <CheckpointTable
        checkpoints={checkpoints}
        onAdd={() => onAddCheckpoint(zone)}
        onDelete={(checkpoint) => onDeleteCheckpoint(zone, checkpoint)}
        onUpdate={(checkpoint) => onUpdateCheckpoint(zone, checkpoint)}
        zoneType={zone.type}
      />
    </Box>
  );
};

export default ZoneSection;
