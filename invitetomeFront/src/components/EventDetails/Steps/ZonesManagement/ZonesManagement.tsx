/**
 * ZonesManagement.tsx - Componente principal refactorizado
 * 
 * Versión modular y organizada del componente de gestión de zonas.
 * Utiliza hooks customizados y componentes separados para mejor mantenibilidad.
 * 
 * Este archivo contiene solo:
 * - Lógica de coordinación entre componentes
 * - Renderizado principal
 * - Integración de hooks customizados
 */

import React from 'react';
import {
  Button,
  VerticalLayout,
  HorizontalLayout,
  Notification,
} from '@vaadin/react-components';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent,
  IconButton 
} from '@mui/material';
import { 
  LocationOn, 
  Security, 
  MeetingRoom, 
  Close
} from '@mui/icons-material';

// Imports de nuestros hooks y componentes modulares
import { useZoneData } from './hooks/useZoneData';
import { useZoneNavigation } from './hooks/useZoneNavigation';
import ZoneSection from './components/ZoneSection';
import SummarySection from './components/SummarySection';
import { EventData } from './types';
import Dialogs from '../Dialogs'; // Componente existente

// ========== COMPONENTE PRINCIPAL ==========
const ZonesManagement: React.FC = () => {
  // ========== HOOKS CUSTOMIZADOS ==========
  const {
    // Estado
    eventData,
    loading,
    notification,
    initialDataCreated,
    
    // Datos clasificados
    gates,
    venues,
    zones,
    subzones,
    allCheckpoints,
    summary,
    
    // Funciones CRUD
    handleDeleteZone,
    handleDeleteCheckpoint,
    handleUpdateCheckpoint,
    
    // Helpers
    clearNotification
  } = useZoneData();

  const {
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

    // Estados de navegación
    currentPath,
    summaryView,
    showInitialMessage,
    setSummaryView,

    // Estados de expansión
    expandedGates,
    expandedZones,
    expandedIndividualGates,
    expandedIndividualVenues,
    expandedIndividualZones,
    updatePolicies,
    setExpandedGates,
    setExpandedZones,

    // Handlers
    handleAddCheckpoint: handleAddCheckpointDialog,
    toggleUpdatePolicy,
    handleIndividualZoneExpansion,
    handleIndividualGateExpansion,
    handleIndividualVenueExpansion,
    handleBreadcrumbClick,
    getBreadcrumbIcon,
    dismissInitialMessage
  } = useZoneNavigation(gates, venues, zones);

  // ========== RENDER CONDICIONAL DE CARGA ==========
  if (loading) {
    return (
      <VerticalLayout style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h6">Loading zones configuration...</Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we initialize your event zones
        </Typography>
      </VerticalLayout>
    );
  }

  // ========== MENSAJE INICIAL ==========
  if (showInitialMessage && initialDataCreated) {
    return (
      <Card sx={{ margin: '20px', padding: '20px' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Security sx={{ fontSize: 48, color: '#1976d2', mr: 2 }} />
            <IconButton onClick={dismissInitialMessage} size="small">
              <Close />
            </IconButton>
          </Box>
          
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
            Welcome to Zones Management!
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            We've created initial zones to get you started:
          </Typography>
          
          <Box sx={{ ml: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>Main Gate</strong> - Entry/exit control with 1000 capacity
            </Typography>
            <Typography variant="body2">
              • <strong>Main Venue</strong> - Event space with 500 capacity
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You can customize these zones, add checkpoints, and create additional zones as needed.
          </Typography>
          
          <Button theme="primary" onClick={dismissInitialMessage}>
            Get Started
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ========== RENDER PRINCIPAL ==========
  return (
    <VerticalLayout style={{ width: '100%', padding: '0' }}>
      {/* Notificación */}
      {notification && (
        <Notification
          opened={!!notification}
          duration={4000}
          onOpenedChanged={(e) => !e.detail.value && clearNotification()}
        >
          {notification}
        </Notification>
      )}

      {/* Resumen con pestañas */}
      <SummarySection
        summaryView={summaryView}
        setSummaryView={setSummaryView}
        gates={gates}
        venues={venues}
        zones={zones}
        subzones={subzones}
        allCheckpoints={allCheckpoints}
        summary={summary}
        currentPath={currentPath}
        onBreadcrumbClick={handleBreadcrumbClick}
        getBreadcrumbIcon={getBreadcrumbIcon}
      />

      {/* Sección de Gates */}
      <Accordion 
        expanded={expandedGates} 
        onChange={() => setExpandedGates(!expandedGates)}
        sx={{ marginBottom: '16px' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <HorizontalLayout style={{ alignItems: 'center', gap: '12px', width: '100%' }}>
            <LocationOn color="primary" />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Gates ({gates.length})
            </Typography>
            <Button 
              theme="primary small"
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
            <div>
              {gates.length > 0 ? (
                gates.map(gate => (
                  <Accordion
                    key={gate.zoneId}
                    expanded={expandedIndividualGates[gate.zoneId] || false}
                    onChange={() => handleIndividualGateExpansion(gate.zoneId)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{gate.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ZoneSection
                        zone={gate}
                        onAddCheckpoint={handleAddCheckpointDialog}
                        onDeleteCheckpoint={handleDeleteCheckpoint}
                        onUpdateCheckpoint={handleUpdateCheckpoint}
                        onDeleteZone={handleDeleteZone}
                        updatePolicies={updatePolicies}
                        onToggleUpdatePolicy={toggleUpdatePolicy}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <LocationOn style={{ fontSize: 48, color: '#adb5bd', marginBottom: '16px' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Gates Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Gates control main entry and exit points for your event.
                  </Typography>
                  <Button 
                    theme="primary"
                    onClick={() => setGateDialogOpen(true)}
                  >
                    Add Your First Gate
                  </Button>
                </Box>
              )}
            </div>
          </Fade>
        </AccordionDetails>
      </Accordion>

      {/* Sección de Venues y Zones */}
      <Accordion 
        expanded={expandedZones} 
        onChange={() => setExpandedZones(!expandedZones)}
        sx={{ marginBottom: '16px' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <HorizontalLayout style={{ alignItems: 'center', gap: '12px', width: '100%' }}>
            <MeetingRoom color="primary" />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Zones & Venues ({zones.length + venues.length})
            </Typography>
            <Button 
              theme="primary small"
              onClick={(e) => {
                e.stopPropagation();
                setZoneDialogOpen(true);
              }}
              style={{ marginRight: '8px' }}
            >
              Add Zone
            </Button>
            <Button 
              theme="primary small"
              onClick={(e) => {
                e.stopPropagation();
                setVenueDialogOpen(true);
              }}
            >
              Add Venue
            </Button>
          </HorizontalLayout>
        </AccordionSummary>
        <AccordionDetails>
          <Fade in={expandedZones}>
            <div>
              {[...zones, ...venues].length > 0 ? (
                [...zones, ...venues].map(zone => (
                  <Accordion
                    key={zone.zoneId}
                    expanded={zone.type === 'VENUE' ? 
                      (expandedIndividualVenues[zone.zoneId] || false) : 
                      (expandedIndividualZones[zone.zoneId] || false)
                    }
                    onChange={() => {
                      if (zone.type === 'VENUE') {
                        handleIndividualVenueExpansion(zone.zoneId);
                      } else {
                        handleIndividualZoneExpansion(zone.zoneId);
                      }
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">
                        {zone.name} ({zone.type})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ZoneSection
                        zone={zone}
                        onAddCheckpoint={handleAddCheckpointDialog}
                        onDeleteCheckpoint={handleDeleteCheckpoint}
                        onUpdateCheckpoint={handleUpdateCheckpoint}
                        onDeleteZone={handleDeleteZone}
                        updatePolicies={updatePolicies}
                        onToggleUpdatePolicy={toggleUpdatePolicy}
                      />

                      {/* Subzonas si existen */}
                      {subzones
                        .filter(sub => 'parentZoneId' in sub && sub.parentZoneId === zone.zoneId)
                        .map(subzone => (
                          <Box key={subzone.zoneId} sx={{ mt: 2, ml: 2 }}>
                            <ZoneSection
                              zone={subzone}
                              isSubzone={true}
                              parentZoneName={zone.name}
                              onAddCheckpoint={handleAddCheckpointDialog}
                              onDeleteCheckpoint={handleDeleteCheckpoint}
                              onUpdateCheckpoint={handleUpdateCheckpoint}
                              onDeleteZone={handleDeleteZone}
                              updatePolicies={updatePolicies}
                              onToggleUpdatePolicy={toggleUpdatePolicy}
                            />
                          </Box>
                        ))
                      }
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <MeetingRoom style={{ fontSize: 48, color: '#adb5bd', marginBottom: '16px' }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No Zones Configured
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Zones help organize different areas within your event.
                  </Typography>
                  <Button 
                    theme="primary"
                    onClick={() => setZoneDialogOpen(true)}
                  >
                    Add Your First Zone
                  </Button>
                </Box>
              )}
            </div>
          </Fade>
        </AccordionDetails>
      </Accordion>

      {/* Componente de Diálogos reutilizado */}
      {eventData && (
        <Dialogs
          eventData={eventData}
          setEventData={(newData: EventData) => {
            // Esta función será manejada por useZoneData internamente
            console.log('Event data updated via dialog:', newData);
          }}
          gateDialogOpen={gateDialogOpen}
          setGateDialogOpen={setGateDialogOpen}
          zoneDialogOpen={zoneDialogOpen}
          setZoneDialogOpen={setZoneDialogOpen}
          venueDialogOpen={venueDialogOpen}
          setVenueDialogOpen={setVenueDialogOpen}
          checkpointDialogOpen={checkpointDialogOpen}
          setCheckpointDialogOpen={setCheckpointDialogOpen}
          subzoneDialogOpen={subzoneDialogOpen}
          setSubzoneDialogOpen={setSubzoneDialogOpen}
          selectedZone={selectedZone}
        />
      )}
    </VerticalLayout>
  );
};

export default ZonesManagement;
