/**
 * SummarySection.tsx - Componente de sección de resumen con pestañas
 * 
 * Renderiza:
 * - Pestañas de navegación (Overview, Gates, Zones, Details, Checkpoints)
 * - Contenido de cada pestaña
 * - Estados vacíos para cada sección
 * - Métricas y estadísticas generales
 * - Breadcrumb navigation
 */

import React from 'react';
import { Button } from '@vaadin/react-components';
import { Box, Typography, Chip, Breadcrumbs, Link } from '@mui/material';
import { 
  LocationOn, 
  Security, 
  MeetingRoom, 
  NavigateNext
} from '@mui/icons-material';
import { ZoneType, Checkpoint } from '../types';

// ========== TIPOS ==========
type SummaryView = 'overview' | 'gates' | 'zones' | 'details' | 'checkpoints';

interface Summary {
  totalGates: number;
  totalVenues: number;
  totalZones: number;
  totalSubzones: number;
  totalCheckpoints: number;
}

// ========== PROPS INTERFACE ==========
interface SummarySectionProps {
  summaryView: SummaryView;
  setSummaryView: (view: SummaryView) => void;
  gates: ZoneType[];
  venues: ZoneType[];
  zones: ZoneType[];
  subzones: ZoneType[];
  allCheckpoints: (Checkpoint & { zoneName: string; zoneType: string })[];
  summary: Summary;
  currentPath: string[];
  onBreadcrumbClick: (pathIndex: number) => void;
  getBreadcrumbIcon: (index: number) => string;
}

// ========== COMPONENTE PRINCIPAL ==========
const SummarySection: React.FC<SummarySectionProps> = ({
  summaryView,
  setSummaryView,
  gates,
  venues,
  zones,
  subzones,
  allCheckpoints,
  summary,
  currentPath,
  onBreadcrumbClick,
  getBreadcrumbIcon
}) => {
  // Helper para renderizar íconos
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Security': return <Security fontSize="small" />;
      case 'LocationOn': return <LocationOn fontSize="small" />;
      case 'MeetingRoom': return <MeetingRoom fontSize="small" />;
      case 'NavigateNext': return <NavigateNext fontSize="small" />;
      default: return <Security fontSize="small" />;
    }
  };

  return (
    <Box>
      {/* Breadcrumb Navigation */}
      {currentPath.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ 
            mb: 2, 
            p: 1, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 1,
            '& .MuiBreadcrumbs-li': {
              display: 'flex',
              alignItems: 'center'
            }
          }}
        >
          <Link 
            color="inherit" 
            href="#" 
            onClick={() => onBreadcrumbClick(0)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {renderIcon('Security')}
            <Typography sx={{ ml: 0.5 }}>Zones Management</Typography>
          </Link>
          {currentPath.map((pathItem, index) => (
            <Link
              key={index}
              color="inherit"
              href="#"
              onClick={() => onBreadcrumbClick(index + 1)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {renderIcon(getBreadcrumbIcon(index + 1))}
              <Typography sx={{ ml: 0.5 }}>{pathItem}</Typography>
            </Link>
          ))}
        </Breadcrumbs>
      )}

      {/* Infrastructure Overview Header */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
        Infrastructure Overview:
      </Typography>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Button
          theme={summaryView === 'gates' ? 'primary' : 'tertiary'}
          onClick={() => setSummaryView(summaryView === 'gates' ? 'overview' : 'gates')}
        >
          Gates ({summary.totalGates})
        </Button>
        
        <Button
          theme={summaryView === 'zones' ? 'primary' : 'tertiary'}
          onClick={() => setSummaryView(summaryView === 'zones' ? 'overview' : 'zones')}
        >
          Zones ({summary.totalZones})
        </Button>

        <Button
          theme={summaryView === 'zones' ? 'primary' : 'tertiary'}
          onClick={() => setSummaryView(summaryView === 'zones' ? 'overview' : 'zones')}
        >
          Venues ({summary.totalVenues})
        </Button>

        <Button
          theme={summaryView === 'details' ? 'primary' : 'tertiary'}
          onClick={() => setSummaryView(summaryView === 'details' ? 'overview' : 'details')}
        >
          Subzones ({summary.totalSubzones})
        </Button>

        <Button
          theme={summaryView === 'checkpoints' ? 'primary' : 'tertiary'}
          onClick={() => setSummaryView(summaryView === 'checkpoints' ? 'overview' : 'checkpoints')}
        >
          Checkpoints ({summary.totalCheckpoints})
        </Button>
      </Box>

      {/* Live Data Display */}
      <Box sx={{ 
        mt: 1.5, 
        p: 1.5, 
        backgroundColor: '#f0f8ff', 
        borderRadius: 0.5, 
        border: '1px solid #b3d9ff' 
      }}>
        <Typography variant="caption" color="primary" sx={{ 
          fontWeight: 600, 
          display: 'block', 
          mb: 1 
        }}>
          Current Configuration Status:
        </Typography>
        
        {/* Gates View */}
        {summaryView === 'gates' && (
          <Box>
            <Typography variant="caption" color="text.primary" sx={{ 
              fontWeight: 500, 
              display: 'block', 
              mb: 0.5 
            }}>
              Gates Configuration:
            </Typography>
            {gates.length > 0 ? gates.map(gate => (
              <Typography key={gate.zoneId} variant="caption" color="text.secondary" sx={{ 
                display: 'block', 
                ml: 1 
              }}>
                - {gate.name}: {Object.values(gate.checkPoints || {}).length} checkpoints, {gate.maxCapacity} capacity
              </Typography>
            )) : (
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: 'block', 
                ml: 1, 
                fontStyle: 'italic' 
              }}>
                No gates configured yet. Add your first gate to get started.
              </Typography>
            )}
          </Box>
        )}

        {/* Zones & Venues View */}
        {summaryView === 'zones' && (
          <Box>
            <Typography variant="caption" color="text.primary" sx={{ 
              fontWeight: 500, 
              display: 'block', 
              mb: 0.5 
            }}>
              Zones & Venues Status:
            </Typography>
            {[...zones, ...venues].length > 0 ? [...zones, ...venues].map(zone => (
              <Typography key={zone.zoneId} variant="caption" color="text.secondary" sx={{ 
                display: 'block', 
                ml: 1 
              }}>
                - {zone.name} ({zone.type}): {zone.currentOccupancy || 0}/{zone.maxCapacity} occupancy
              </Typography>
            )) : (
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: 'block', 
                ml: 1, 
                fontStyle: 'italic' 
              }}>
                No zones configured yet. Add zones to manage your event areas.
              </Typography>
            )}
          </Box>
        )}

        {/* Subzones Details View */}
        {summaryView === 'details' && (
          <Box>
            <Typography variant="caption" color="text.primary" sx={{ 
              fontWeight: 500, 
              display: 'block', 
              mb: 0.5 
            }}>
              Subzones Details:
            </Typography>
            {subzones.length > 0 ? subzones.map(subzone => (
              <Typography key={subzone.zoneId} variant="caption" color="text.secondary" sx={{ 
                display: 'block', 
                ml: 1 
              }}>
                - {subzone.name} (Parent: {'parentZoneId' in subzone ? subzone.parentZoneId : 'N/A'}): {subzone.currentOccupancy || 0}/{subzone.maxCapacity}
              </Typography>
            )) : (
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: 'block', 
                ml: 1, 
                fontStyle: 'italic' 
              }}>
                No subzones configured yet. Create subzones within existing zones for better organization.
              </Typography>
            )}
          </Box>
        )}

        {/* Checkpoints Overview */}
        {summaryView === 'checkpoints' && (
          <Box>
            <Typography variant="caption" color="text.primary" sx={{ 
              fontWeight: 500, 
              display: 'block', 
              mb: 0.5 
            }}>
              All Checkpoints Status:
            </Typography>
            {allCheckpoints.length > 0 ? allCheckpoints.map(checkpoint => (
              <Box key={checkpoint.checkpointId} sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1, mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  - {checkpoint.name} ({checkpoint.zoneName})
                </Typography>
                <Chip 
                  label={checkpoint.type}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    height: '16px',
                    fontSize: '0.6rem',
                    color: checkpoint.type === 'IN' ? '#1976d2' : '#f57c00',
                    borderColor: checkpoint.type === 'IN' ? '#1976d2' : '#f57c00'
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                  {checkpoint.role}
                </Typography>
              </Box>
            )) : (
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: 'block', 
                ml: 1, 
                fontStyle: 'italic' 
              }}>
                No checkpoints configured yet. Add checkpoints to control access and monitor flow.
              </Typography>
            )}
          </Box>
        )}

        {/* Overview Default */}
        {summaryView === 'overview' && (
          <Box>
            <Typography variant="caption" color="text.primary" sx={{ 
              fontWeight: 500, 
              display: 'block', 
              mb: 0.5 
            }}>
              Complete Infrastructure Summary:
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
              • {summary.totalGates} Gates configured
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
              • {summary.totalVenues} Venues available
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
              • {summary.totalZones} Zones active
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
              • {summary.totalSubzones} Subzones defined
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
              • {summary.totalCheckpoints} Checkpoints operational
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SummarySection;
