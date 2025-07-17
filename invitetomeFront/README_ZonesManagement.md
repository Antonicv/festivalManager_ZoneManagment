# Zones Management - Modular System

Sistema **completamente refactorizado** de gestión de zonas para eventos con **arquitectura modular**, **hooks customizados** y **componentes reutilizables**. Evolucionó de un monolito de 1627 líneas a un sistema modular de 8 archivos especializados.



### Características Principales

- **Gates**: Puertas principales de entrada/salida al evento
- **Venues**: Espacios principales del evento (salas, recintos)
- **Zones**: Áreas específicas (VIP, backstage, zonas temáticas)
- **Subzones**: Divisiones menores dentro de zonas principales
- **Checkpoints**: Puntos de control de acceso y monitoreo
- **Analytics**: Visualización en tiempo real de ocupación y estadísticas

### Nuevas Funcionalidades v2.0

- **Arquitectura modular** con separación clara de responsabilidades
- **Performance optimizado** con memoización y renders inteligentes
- **UI mejorada** con estados vacíos, loading y feedback visual
- **Hooks customizados** para reutilización de lógica
- **Responsive design** adaptado a diferentes pantallas
- **Type safety** completo con TypeScript

## Estructura Modular

```bash
ZonesManagement/
├── index.tsx                    # Re-exportación principal
├── ZonesManagement.tsx          # Coordinador principal (~400 líneas)
├── types.ts                     # Definiciones TypeScript
├── services.ts                  # Servicios y utilidades
├── hooks/
│   ├── useZoneData.ts          # Gestión de datos y CRUD
│   └── useZoneNavigation.ts    # Estados UI y navegación
└── components/
    ├── CheckpointTable.tsx     # Tabla de checkpoints
    ├── ZoneSection.tsx         # Renderizado de zonas
    └── SummarySection.tsx      # Resumen y navegación
```

## Instalación y Configuración

### Dependencias

```json
{
  "@mui/material": "^5.x.x",
  "@mui/icons-material": "^5.x.x", 
  "@vaadin/react-components": "^24.x.x",
  "react": "^18.x.x",
  "typescript": "^5.x.x"
}
```

### Instalación Rápida

```bash
# Instalar dependencias UI
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @vaadin/react-components

# Tipos TypeScript (opcional)
npm install --save-dev @types/react @types/react-dom
```

### Configuración Inicial

#### Importación Básica
```tsx
// Importación simple
import ZonesManagement from './src/components/EventDetails/Steps/ZonesManagement';

// Importación con tipos (avanzado)
import ZonesManagement, { 
  type EventData, 
  type ZoneType 
} from './src/components/EventDetails/Steps/ZonesManagement';
```

#### Configuración de Tema (Opcional)
```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  spacing: 8,
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <ZonesManagement />
    </ThemeProvider>
  );
}
```



## Ejemplos de Uso

### Uso Básico (Plug & Play)

```tsx
import React from 'react';
import ZonesManagement from './src/components/EventDetails/Steps/ZonesManagement';

function EventConfiguration() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Configuración del Evento</h1>
      <ZonesManagement />
    </div>
  );
}

export default EventConfiguration;
```

### Integración con React Router

```tsx
import { Routes, Route } from 'react-router-dom';
import ZonesManagement from './src/components/EventDetails/Steps/ZonesManagement';

function EventRoutes() {
  return (
    <Routes>
      <Route 
        path="/event/:id/zones" 
        element={<ZonesManagement />} 
      />
      <Route 
        path="/event/:id/zones/analytics" 
        element={<ZonesManagement initialView="analytics" />} 
      />
    </Routes>
  );
}
```

### Uso de Hooks Individuales

```tsx
import { useZoneData, useZoneNavigation } from './src/components/EventDetails/Steps/ZonesManagement';

function CustomZonesList() {
  const { gates, venues, zones, summary } = useZoneData();
  const { summaryView, setSummaryView } = useZoneNavigation(gates, venues, zones);
  
  return (
    <div>
      <h2>Resumen: {summary.totalZones} zonas</h2>
      {gates.map(gate => (
        <div key={gate.zoneId}>{gate.name}</div>
      ))}
    </div>
  );
}
```

### Componentes Individuales

```tsx
import { 
  CheckpointTable,
  ZoneSection,
  SummarySection 
} from './src/components/EventDetails/Steps/ZonesManagement';

function CustomEventDashboard() {
  return (
    <div>
      {/* Usar solo la tabla de checkpoints */}
      <CheckpointTable 
        checkpoints={checkpoints}
        zoneId="GATE_001"
        onAdd={handleAdd}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      
      {/* Usar solo la sección de resumen */}
      <SummarySection 
        summaryView="overview"
        gates={gates}
        venues={venues}
        zones={zones}
        // ... más props
      />
    </div>
  );
}
```
import ZonesManagement from './Steps/ZonesManagement';

function EventDetailPage() {
  const eventId = useParams().id;
  
  return (
    <EventDetailProvider id={eventId}>
      <div className="event-detail-container">
        <ZonesManagement />
      </div>
    </EventDetailProvider>
  );
}
```

### Personalización de Estilos

```tsx
import ZonesManagement from './src/components/EventDetails/Steps/ZonesManagement';

function CustomizedZonesManagement() {
  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      padding: '24px'
    }}>
      <ZonesManagement />
    </div>
  );
}
```

### Escenario de Primera Configuración

Cuando un usuario accede por primera vez al sistema:

```tsx
// El componente automáticamente detecta primera visita y crea:
// - 1 Gate principal ("Main Gate") con capacidad 1000 (a modificar)
// - 1 Venue principal ("Main Venue") con capacidad 500 (a modificar)
// - Ambos con todos los tipos de acceso habilitados
// - Sin checkpoints (usuario debe crearlos)

function FirstTimeSetup() {
  return (
    <div>
      <h2>Configuración Inicial del Evento</h2>
      <p>El sistema creará automáticamente una estructura básica</p>
      <ZonesManagement />
    </div>
  );
}
```

### Escenario de Gestión Avanzada

Para eventos complejos con múltiples áreas:

```tsx
function ComplexEventManagement() {
  return (
    <div className="complex-event-layout">
      <header>
        <h1>Festival XYZ - Gestión de Zonas</h1>
        <div className="event-stats">
          {/* Estadísticas se muestran automáticamente en el componente */}
        </div>
      </header>
      
      <main>
        <ZonesManagement />
      </main>
      
      <aside>
        {/* Panel adicional para informes o configuraciones */}
      </aside>
    </div>
  );
}
```

### Integración con Sistema de Notificaciones

```tsx
import { toast } from 'react-toastify';

// El componente incluye su propio sistema de notificaciones
// pero puede integrarse con sistemas externos:

function ZonesWithCustomNotifications() {
  useEffect(() => {
    // Escuchar eventos del componente si es necesario
    const handleZoneUpdate = (event) => {
      toast.success(`Zona ${event.zoneName} actualizada`);
    };
    
    // Configurar listeners si es necesario
  }, []);

  return <ZonesManagement />;
}
```

## Características Principales

### Gestión de Gates
- Creación de puertas principales 
- Control de capacidad 
- Configuración de roles de dispositivos específicos

### Gestión de Venues y Zones
- Creación de espacios principales y zonas específicas
- Configuración flexible de tipos de acceso
- Soporte para jerarquías con subzonas

### Sistema de Checkpoints
- Puntos de control IN/OUT configurables
- Asignación de dispositivos IMEI
- Roles específicos por tipo de entidad
- Links de acceso y códigos QR automáticos

### Navegación y UX
- Breadcrumbs dinámicos para navegación
- Acordeones expansibles por categoría
- Estados vacíos informativos y guías de inicio
- Visualización de estadísticas en tiempo real

### Integración Backend


## Soporte y Mantenimiento

### Arquitectura Extensible
El sistema está diseñado para ser fácilmente extensible con nuevos tipos de zonas o funcionalidades adicionales.

### Compatibilidad
- React 18+
- TypeScript 5+
- Material-UI 5+
- Vaadin React Components 24+

### Consideraciones de Rendimiento
- Uso de React.useMemo para cálculos optimizados
- Renderizado condicional para mejor performance
- Estados de carga optimizados para grandes volúmenes de datos



ESTE ARCHIVO NO ES DEFINITIVO

