# Dialogs

Sistema de formularios inline para la gestión de entidades de zonas en eventos. Proporciona formularios especializados y reutilizables para crear Gates, Zones, Venues, Checkpoints y Subzones con validación en tiempo real y gestión de estado independiente.

## Descripción

El módulo Dialogs es un componente React especializado que actúa como el centro de control para todos los formularios de creación y edición de entidades relacionadas con la gestión de zonas de eventos. Su diseño modular permite:

- **Formularios Especializados**: Cada tipo de entidad (Gate, Zone, Venue, Checkpoint, Subzone) tiene su formulario optimizado
- **Estado Independiente**: Cada formulario mantiene su propio estado local para evitar conflictos
- **Validación en Tiempo Real**: Validaciones automáticas y deshabilitación inteligente de botones
- **Integración Seamless**: Comunicación fluida con el componente padre ZonesManagement
- **UX Optimizada**: Formularios inline que aparecen contextualmente según la acción del usuario

El componente utiliza Vaadin React Components para garantizar consistencia visual y accesibilidad, mientras mantiene una arquitectura escalable y mantenible.

## Instalación y Configuración

### Dependencias Necesarias

```json
{
  "@vaadin/react-components": "^24.x.x",
  "react": "^18.x.x",
  "typescript": "^5.x.x"
}
```

### Instalación

1. **Instalar Vaadin React Components:**
```bash
npm install @vaadin/react-components
```

2. **Verificar dependencias de React:**
```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

3. **Configurar tipos TypeScript:**
```bash
npm install --save-dev @types/react @types/react-dom
```

### Configuración Inicial

1. **Importar el componente:**
```tsx
import Dialogs from './src/components/EventDetails/Steps/Dialogs';
```

2. **Configurar tipos de datos:**
```tsx
// Los tipos están definidos en el mismo archivo del componente
// y son compatibles con ZonesManagement.tsx
```

### Configuración de Vaadin

Asegúrate de que Vaadin esté correctamente configurado en tu proyecto:

```tsx
// En tu archivo principal (main.tsx o App.tsx)
import '@vaadin/vaadin-lumo-styles/color.js';
import '@vaadin/vaadin-lumo-styles/typography.js';
import '@vaadin/vaadin-lumo-styles/sizing.js';
import '@vaadin/vaadin-lumo-styles/spacing.js';
```

## Ejemplos de Uso

### Uso Básico con ZonesManagement

```tsx
import React, { useState } from 'react';
import Dialogs from './Dialogs';

function ZonesManagementExample() {
  const [gateDialogOpen, setGateDialogOpen] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <div>
      <button onClick={() => setGateDialogOpen(true)}>
        Add New Gate
      </button>
      
      <Dialogs
        gateDialogOpen={gateDialogOpen}
        setGateDialogOpen={setGateDialogOpen}
        zoneDialogOpen={false}
        setZoneDialogOpen={() => {}}
        checkpointDialogOpen={false}
        setCheckpointDialogOpen={() => {}}
        subzoneDialogOpen={false}
        setSubzoneDialogOpen={() => {}}
        selectedZone={selectedZone}
        eventData={eventData}
        setEventData={setEventData}
      />
    </div>
  );
}
```

### Formulario de Gate (Puerta Principal)

```tsx
function GateCreationExample() {
  const [gateDialogOpen, setGateDialogOpen] = useState(false);
  const [eventData, setEventData] = useState({
    eventId: 'EVENT_001',
    operation: 'zonesDefinition',
    data: { zones: {} }
  });

  const handleCreateGate = () => {
    setGateDialogOpen(true);
  };

  return (
    <div>
      <h3>Gestión de Puertas Principales</h3>
      <button onClick={handleCreateGate}>
        Crear Nueva Puerta
      </button>
      
      <Dialogs
        gateDialogOpen={gateDialogOpen}
        setGateDialogOpen={setGateDialogOpen}
        // Otros formularios cerrados
        zoneDialogOpen={false}
        setZoneDialogOpen={() => {}}
        checkpointDialogOpen={false}
        setCheckpointDialogOpen={() => {}}
        subzoneDialogOpen={false}
        setSubzoneDialogOpen={() => {}}
        selectedZone={null}
        eventData={eventData}
        setEventData={setEventData}
      />
    </div>
  );
}
```

### Formulario de Zone con Tipos de Acceso

```tsx
function ZoneCreationExample() {
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [eventData, setEventData] = useState({
    eventId: 'EVENT_001',
    operation: 'zonesDefinition',
    data: { zones: {} }
  });

  return (
    <div>
      <h3>Crear Zona Personalizada</h3>
      <p>Configure los tipos de acceso y capacidad</p>
      
      <button onClick={() => setZoneDialogOpen(true)}>
        Añadir Zona
      </button>
      
      <Dialogs
        gateDialogOpen={false}
        setGateDialogOpen={() => {}}
        zoneDialogOpen={zoneDialogOpen}
        setZoneDialogOpen={setZoneDialogOpen}
        checkpointDialogOpen={false}
        setCheckpointDialogOpen={() => {}}
        subzoneDialogOpen={false}
        setSubzoneDialogOpen={() => {}}
        selectedZone={null}
        eventData={eventData}
        setEventData={setEventData}
      />
    </div>
  );
}
```

### Formulario de Checkpoint Contextual

```tsx
function CheckpointManagementExample() {
  const [checkpointDialogOpen, setCheckpointDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState({
    zoneId: 'zone_001',
    name: 'VIP Area',
    type: 'ZONE'
  });
  
  const [eventData, setEventData] = useState({
    eventId: 'EVENT_001',
    operation: 'zonesDefinition',
    data: {
      zones: {
        'zone_001': selectedZone
      }
    }
  });

  return (
    <div>
      <h3>Añadir Checkpoint a {selectedZone.name}</h3>
      
      <button onClick={() => setCheckpointDialogOpen(true)}>
        Crear Punto de Control
      </button>
      
      <Dialogs
        gateDialogOpen={false}
        setGateDialogOpen={() => {}}
        zoneDialogOpen={false}
        setZoneDialogOpen={() => {}}
        checkpointDialogOpen={checkpointDialogOpen}
        setCheckpointDialogOpen={setCheckpointDialogOpen}
        subzoneDialogOpen={false}
        setSubzoneDialogOpen={() => {}}
        selectedZone={selectedZone}
        eventData={eventData}
        setEventData={setEventData}
      />
    </div>
  );
}
```

### Múltiples Formularios Simultáneos

```tsx
function MultipleFormsExample() {
  // Estados para múltiples formularios
  const [gateDialogOpen, setGateDialogOpen] = useState(false);
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [venueDialogOpen, setVenueDialogOpen] = useState(false);
  
  const [eventData, setEventData] = useState({
    eventId: 'EVENT_001',
    operation: 'zonesDefinition',
    data: { zones: {} }
  });

  return (
    <div>
      <h3>Panel de Control de Zonas</h3>
      
      <div className="action-buttons">
        <button onClick={() => setGateDialogOpen(true)}>
          Añadir Puerta
        </button>
        <button onClick={() => setZoneDialogOpen(true)}>
          Añadir Zona
        </button>
        <button onClick={() => setVenueDialogOpen(true)}>
          Añadir Recinto
        </button>
      </div>
      
      {/* Los formularios pueden estar abiertos simultáneamente */}
      <Dialogs
        gateDialogOpen={gateDialogOpen}
        setGateDialogOpen={setGateDialogOpen}
        zoneDialogOpen={zoneDialogOpen}
        setZoneDialogOpen={setZoneDialogOpen}
        venueDialogOpen={venueDialogOpen}
        setVenueDialogOpen={setVenueDialogOpen}
        checkpointDialogOpen={false}
        setCheckpointDialogOpen={() => {}}
        subzoneDialogOpen={false}
        setSubzoneDialogOpen={() => {}}
        selectedZone={null}
        eventData={eventData}
        setEventData={setEventData}
      />
    </div>
  );
}
```

### Formulario de Subzone con Relación Jerárquica

```tsx
function SubzoneCreationExample() {
  const [subzoneDialogOpen, setSubzoneDialogOpen] = useState(false);
  const [parentZone] = useState({
    zoneId: 'zone_main',
    name: 'Main Concert Area',
    type: 'ZONE',
    maxCapacity: 1000
  });
  
  const [eventData, setEventData] = useState({
    eventId: 'EVENT_001',
    operation: 'zonesDefinition',
    data: {
      zones: {
        'zone_main': parentZone
      }
    }
  });

  return (
    <div>
      <h3>Crear Subzona en: {parentZone.name}</h3>
      <p>Las subzonas heredan configuraciones de la zona padre</p>
      
      <button onClick={() => setSubzoneDialogOpen(true)}>
        Añadir Subzona
      </button>
      
      <Dialogs
        gateDialogOpen={false}
        setGateDialogOpen={() => {}}
        zoneDialogOpen={false}
        setZoneDialogOpen={() => {}}
        checkpointDialogOpen={false}
        setCheckpointDialogOpen={() => {}}
        subzoneDialogOpen={subzoneDialogOpen}
        setSubzoneDialogOpen={setSubzoneDialogOpen}
        selectedZone={parentZone}  // Zona padre seleccionada
        eventData={eventData}
        setEventData={setEventData}
      />
    </div>
  );
}
```

### Manejo de Validaciones y Estados

```tsx
function ValidationExample() {
  const [eventData, setEventData] = useState({
    eventId: 'EVENT_001',
    operation: 'zonesDefinition',
    data: { zones: {} }
  });

  // Callback para manejar cambios y validar datos
  const handleEventDataChange = (newEventData) => {
    // Validaciones personalizadas antes de actualizar
    if (newEventData.data.zones) {
      console.log('Zonas actualizadas:', Object.keys(newEventData.data.zones).length);
    }
    
    setEventData(newEventData);
  };

  return (
    <div>
      <h3>Gestión con Validaciones</h3>
      
      {/* El componente maneja validaciones internas automáticamente */}
      <Dialogs
        gateDialogOpen={true}
        setGateDialogOpen={() => {}}
        zoneDialogOpen={false}
        setZoneDialogOpen={() => {}}
        checkpointDialogOpen={false}
        setCheckpointDialogOpen={() => {}}
        subzoneDialogOpen={false}
        setSubzoneDialogOpen={() => {}}
        selectedZone={null}
        eventData={eventData}
        setEventData={handleEventDataChange}  // Callback personalizado
      />
      
      <div className="validation-info">
        <p>Total de zonas configuradas: {Object.keys(eventData.data.zones).length}</p>
      </div>
    </div>
  );
}
```

## Características Principales

### Formularios Especializados
- **Gate Form**: Creación de puertas con checkpoint 
- **Zone/Venue Form**: Configuración de espacios con tipos de acceso
- **Checkpoint Form**: Puntos de control con roles de dispositivos
- **Subzone Form**: Sub-divisiones con relaciones jerárquicas

### Gestión de Estado
- Estado local independiente por formulario
- Prevención de conflictos entre formularios simultáneos
- Reset automático tras operaciones exitosas
- Validaciones en tiempo real

### Integración de Datos
- Generación automática de IDs únicos
- Links de acceso y códigos QR automáticos
- Actualización inmutable del estado global
- Sincronización con componente padre

### Experiencia de Usuario
- Formularios inline contextuales
- Validación visual inmediata
- Campos obligatorios claramente marcados
- Mensajes informativos y guías

### Arquitectura Extensible
- Fácil adición de nuevos tipos de formularios
- Reutilización de componentes Vaadin
- Compatibilidad con sistemas de validación externos
- Soporte para internacionalización (i18n)

## Configuración Avanzada

### Personalización de Estilos
Los formularios utilizan estilos inline configurables que pueden ser sobrescritos:

```tsx
const customStyles = {
  formContainer: {
    backgroundColor: '#f0f8ff',
    padding: '20px',
    borderRadius: '12px',
    margin: '10px 0',
    border: '2px solid #4285f4'
  }
};
```

### Integración con Sistemas de Validación

### Soporte para Temas
Compatible con el sistema de temas de Vaadin para mantener consistencia visual en toda la aplicación.


ESTE ARCHIVO NO ES DEFINITIVO 
