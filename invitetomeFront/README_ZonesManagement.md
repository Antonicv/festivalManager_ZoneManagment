# Zones Management

Sistema completo de gestión de zonas para eventos que permite crear, administrar y controlar diferentes tipos de espacios dentro de un evento, incluyendo puertas principales, recintos, zonas específicas y puntos de control de acceso.

## Descripción

El módulo Zones Management es un componente React avanzado diseñado para la gestión integral de infraestructura de eventos. Proporciona una interfaz intuitiva para:

- **Gates**: Puertas principales de entrada/salida al evento
- **Venues**: Espacio de la sala/evento
- **Zones**: Áreas específicas dentro del evento (VIP, backstage, etc.)
- **Subzones**: Divisiones menores dentro de zonas principales
- **Checkpoints**: Puntos de control de acceso y monitoreo

El sistema incluye visualización en tiempo real de ocupación, control de capacidad, gestión de tipos de acceso, navegación con breadcrumbs y estados informativos para una experiencia de usuario optimizada.

## Instalación y Configuración

### Dependencias Necesarias

El módulo requiere las siguientes dependencias principales:

```json
{
  "@mui/material": "^5.x.x",
  "@mui/icons-material": "^5.x.x",
  "@vaadin/react-components": "^24.x.x",
  "react": "^18.x.x",
  "typescript": "^5.x.x"
}
```

### Instalación

1. **Instalar dependencias de Material-UI:**
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

2. **Instalar Vaadin React Components:**
```bash
npm install @vaadin/react-components
```

3. **Configurar tipos TypeScript (si es necesario):**
```bash
npm install --save-dev @types/react @types/react-dom
```

### Configuración Inicial

1. **Importar el componente en tu aplicación:**
```tsx
import ZonesManagement from './src/components/EventDetails/Steps/ZonesManagement';
```

2. **Configurar el tema Material-UI (opcional):**
```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  // Tu configuración de tema personalizada
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ZonesManagement />
    </ThemeProvider>
  );
}
```

### Variables de Entorno

El módulo utiliza las siguientes constantes configurables:

```typescript
// Configurables en src/components/EventDetails/Steps/ZonesManagement.tsx
const eventId = 'EVENT_050'; // ID del evento
const operation = 'zonesDefinition'; // Tipo de operación
```

Para conexión con backend real, configure:

```typescript
// En EventItemEndpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

## Ejemplos de Uso

### Uso Básico

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

### Integración con Sistema de Routing

```tsx
import { Routes, Route } from 'react-router-dom';
import ZonesManagement from './src/components/EventDetails/Steps/ZonesManagement';

function EventRoutes() {
  return (
    <Routes>
      <Route path="/event/:id/zones" element={<ZonesManagement />} />
    </Routes>
  );
}
```

### Uso con Context Provider

```tsx
import React from 'react';
import { EventDetailProvider } from './EventContext/EventDetailContext';
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

