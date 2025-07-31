/**
 * CapacityPolicyChip.tsx - Componente integrado para mostrar capacidad y política de actualización
 * 
 * Combina la funcionalidad del PolicyButton con el Chip de capacidad en un solo componente
 *  3 variantes diferentes para testing:
 * - dot: Indicador circular interno
 * - border: Color de borde indicativo
 * - gradient: Background gradient 
 */

import React from 'react';
import { Chip, Box } from '@mui/material';

// ========== INTERFACES ==========
interface CapacityPolicyChipProps {
  variant: 'dot' | 'border' | 'gradient';
  zoneId: string;
  maxCapacity: number;
  currentOccupancy?: number;
  isActive: boolean;
  onClick: (zoneId: string, event: React.MouseEvent) => void;
  size?: 'small' | 'medium';
  showOccupancy?: boolean;
}

// ========== COMPONENTE PRINCIPAL ==========
const CapacityPolicyChip: React.FC<CapacityPolicyChipProps> = ({
  variant,
  zoneId,
  maxCapacity,
  currentOccupancy = 0,
  isActive,
  onClick,
  size = 'small',
  showOccupancy = false
}) => {
  
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevenir que se active el accordion
    onClick(zoneId, event);
  };

  const getLabel = () => {
    if (showOccupancy) {
      return `Capacity: ${currentOccupancy}/${maxCapacity}`;
    }
    return `Capacity: ${maxCapacity}`;
  };

  const getTooltip = () => {
    return isActive 
      ? 'Update Zone Policy: ACTIVE (Click to disable) - Zone capacity updates automatically from external application'
      : 'Update Zone Policy: INACTIVE (Click to enable) - Zone capacity does NOT update automatically';
  };  // ========== VARIANTE DOT ==========
  if (variant === 'dot') {
    return (
      <Chip
        size={size}
        variant="outlined"
        onClick={handleClick}
        sx={{
          fontSize: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginLeft: '32px', // Separación equivalente a un chip
          '& .MuiChip-label': {
            paddingRight: '8px', // Espacio entre texto y punto
          },
          '&:hover': {
            backgroundColor: isActive ? '#e8f5e8' : '#ffeaea',
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          }
        }}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{getLabel()}</span>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: isActive ? '#4caf50' : '#f44336',
                border: '2px solid #ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
                }
              }}
            />
          </Box>
        }
        title={getTooltip()}
      />
    );
  }
  // ========== VARIANTE BORDER ==========
  if (variant === 'border') {
    return (
      <Chip
        label={getLabel()}
        size={size}
        variant="outlined"
        onClick={handleClick}
        sx={{
          fontSize: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          borderColor: isActive ? '#4caf50' : '#f44336',
          borderWidth: '2px',
          color: isActive ? '#2e7d32' : '#c62828',
          marginLeft: '32px', // Separación equivalente a un chip
          '&:hover': {
            backgroundColor: isActive ? '#e8f5e8' : '#ffeaea',
            borderColor: isActive ? '#45a049' : '#d32f2f',
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          }
        }}
        title={getTooltip()}
      />
    );
  }
  // ========== VARIANTE GRADIENT ==========
  if (variant === 'gradient') {
    return (
      <Chip
        label={getLabel()}
        size={size}
        variant="outlined"
        onClick={handleClick}
        sx={{
          fontSize: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: isActive 
            ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)'
            : 'linear-gradient(135deg, #ffeaea 0%, #ffcccb 100%)',
          borderColor: isActive ? '#4caf50' : '#f44336',
          color: isActive ? '#2e7d32' : '#c62828',
          fontWeight: 600,
          marginLeft: '32px', // Separación equivalente a un chip
          '&:hover': {
            background: isActive 
              ? 'linear-gradient(135deg, #c8e6c8 0%, #a5d6a5 100%)'
              : 'linear-gradient(135deg, #ffcccb 0%, #ffb3ba 100%)',
            transform: 'scale(1.02)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          }
        }}
        title={getTooltip()}
      />
    );
  }

  // Fallback por si no se especifica variante válida
  return null;
};

export default CapacityPolicyChip;
