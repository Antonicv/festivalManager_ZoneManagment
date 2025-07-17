/**
 * index.tsx - Re-exportación del componente ZonesManagement refactorizado
 * 
 * Este archivo mantiene la compatibilidad con imports existentes
 * mientras internamente usa la nueva estructura modular.
 * 
 * Estructura modular:
 * - types.ts: Interfaces y tipos
 * - services.ts: Lógica de API y servicios
 * - hooks/: Hooks customizados para datos y navegación
 * - components/: Componentes UI reutilizables
 * - ZonesManagement.tsx: Componente principal refactorizado
 */

export { default } from './ZonesManagement';

// Re-exportaciones opcionales para casos avanzados
export { default as ZonesManagement } from './ZonesManagement';

// Exportar tipos públicos si es necesario
export type {
  AccessTypes,
  Checkpoint,
  Gate,
  Zone,
  Subzone,
  EventData,
  ZoneType
} from './types';
