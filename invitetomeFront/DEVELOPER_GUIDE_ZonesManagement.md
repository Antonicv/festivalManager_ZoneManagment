# ZonesManagement - Developer Guide (Modular Architecture)

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Modular Structure](#modular-structure)
- [Hooks Documentation](#hooks-documentation)
- [Components Documentation](#components-documentation)
- [Type System](#type-system)
- [Services & Utilities](#services--utilities)
- [Integration Guide](#integration-guide)
- [Best Practices](#best-practices)



###  Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZonesManagement/                            │
├─────────────────────────────────────────────────────────────────┤
│ index.tsx          ← Re-exports & public API                   │
│ ZonesManagement.tsx ← Main coordinator component (~400 lines)  │
├─────────────────────────────────────────────────────────────────┤
│ types.ts           ← All interfaces & type definitions         │
│ services.ts        ← API calls, utilities & constants          │
├─────────────────────────────────────────────────────────────────┤
│ hooks/                                                          │
│  ├── useZoneData.ts      ← Data management & CRUD operations   │
│  └── useZoneNavigation.ts ← UI state & navigation logic        │
├─────────────────────────────────────────────────────────────────┤
│ components/                                                     │
│  ├── CheckpointTable.tsx  ← Checkpoint management UI           │
│  ├── ZoneSection.tsx      ← Individual zone rendering          │
│  └── SummarySection.tsx   ← Overview & navigation UI           │
└─────────────────────────────────────────────────────────────────┘
```

## Modular Structure

### File Organization

```bash
src/components/EventDetails/Steps/ZonesManagement/
├── index.tsx                    # Main export & public API
├── ZonesManagement.tsx          # Coordinator component
├── types.ts                     # Type definitions
├── services.ts                  # Business services
├── hooks/
│   ├── useZoneData.ts          # Data management hook
│   └── useZoneNavigation.ts    # Navigation hook
└── components/
    ├── CheckpointTable.tsx     # Checkpoint UI
    ├── ZoneSection.tsx         # Zone rendering
    └── SummarySection.tsx      # Summary & overview
```

### Responsibility Matrix

| **Module** | **Responsibility** | **Lines** | **Dependencies** |
|------------|-------------------|-----------|------------------|
| **index.tsx** | Public API & re-exports | ~20 | None |
| **ZonesManagement.tsx** | Coordination & rendering | ~400 | Hooks, Components |
| **types.ts** | Type definitions | ~80 | None |
| **services.ts** | Business logic & utilities | ~150 | Types |
| **useZoneData.ts** | Data CRUD & state | ~230 | Types, Services |
| **useZoneNavigation.ts** | UI state & navigation | ~180 | Types |
| **CheckpointTable.tsx** | Checkpoint UI | ~180 | Types |
| **ZoneSection.tsx** | Zone rendering | ~200 | Types, Hooks |
| **SummarySection.tsx** | Summary UI | ~250 | Types |

## Hooks Documentation

### useZoneData Hook

**Purpose**: Manages all data-related operations and CRUD functionality.

```tsx
const {
  // State
  eventData,
  loading,
  notification,
  initialDataCreated,
  
  // Classified Data
  gates,
  venues, 
  zones,
  subzones,
  allCheckpoints,
  summary,
  
  // CRUD Operations
  handleAddZone,
  handleDeleteZone,
  handleAddCheckpoint,
  handleDeleteCheckpoint,
  handleUpdateCheckpoint,
  FALTA AÑADIR CRUD PARA EDITAR Y BORRAR GATES ZONAS Y SUBZONAS (ESPERANDO A L BACK END)
  
  // Utilities
  clearNotification
} = useZoneData();
```

#### Key Features:
- **Automatic data loading** and initialization
- **Optimized selectors** with useMemo for derived data
- **CRUD operations** with proper error handling
- **Notification management** for user feedback
- **Data classification** (gates, venues, zones, subzones)

#### Internal Architecture:
```tsx
// Data classification with memoization
const gates = useMemo(() => 
  zonesArray.filter(zone => zone.type === 'GATE'), 
  [zonesArray]
);

// CRUD with optimistic updates
const handleAddZone = useCallback(async (newZone: ZoneType) => {
  try {
    // Update state immediately
    setEventData(prev => /* ... */);
    // Sync with backend
    await EventItemEndpoint.save(/* ... */);
    setNotification('Zone added successfully');
  } catch (error) {
    // Rollback on error
    handleError(error);
  }
}, [eventData]);
```

### useZoneNavigation Hook

**Purpose**: Manages UI state, dialogs, navigation, and accordion expansion.

```tsx
const {
  // Dialog States
  gateDialogOpen,
  zoneDialogOpen,
  venueDialogOpen,
  checkpointDialogOpen,
  subzoneDialogOpen,
  selectedZone,
  
  // Dialog Controls
  setGateDialogOpen,
  setZoneDialogOpen,
  /* ... more setters ... */
  
  // Navigation State
  currentPath,
  summaryView,
  showInitialMessage,
  setSummaryView,
  
  // Expansion State
  expandedGates,
  expandedZones,
  expandedIndividualGates,
  /* ... more expansion states ... */
  
  // Handlers
  handleAddCheckpoint,
  toggleUpdatePolicy,
  handleBreadcrumbClick,
  getBreadcrumbIcon,
  dismissInitialMessage
} = useZoneNavigation(gates, venues, zones);
```

#### Key Features:
- **Dialog state management** for all forms
- **Accordion expansion control** with persistent state
- **Breadcrumb navigation** with dynamic path building
- **Summary view states** (overview, details, analytics)
- **First-time user experience** with guided messaging

## Components Documentation

### CheckpointTable Component

**Purpose**: Dedicated checkpoint management with device role filtering.

```tsx
interface CheckpointTableProps {
  checkpoints: Checkpoint[];
  zoneId: string;
  onAdd: (zoneId: string, type: 'ENTRY' | 'EXIT') => void;
  onDelete: (checkpoint: Checkpoint) => void;
  onUpdate: (checkpoint: Checkpoint) => void;
}
```

#### Features:
- **Device role tabs** (STEWARD-CHECKIN, STEWARD-ZONEIN, etc.)
- **Vaadin Grid** with sorting and filtering
- **Empty states** with helpful CTAs
- **Inline actions** (edit, delete, view QR codes)

### ZoneSection Component

**Purpose**: Renders individual zone with all controls and information.

```tsx
interface ZoneSectionProps {
  zone: ZoneType;
  isSubzone?: boolean;
  parentZoneName?: string;
  onAddCheckpoint: (zone: ZoneType) => void;
  onDeleteCheckpoint: (checkpoint: Checkpoint) => void;
  onUpdateCheckpoint: (checkpoint: Checkpoint) => void;
  onDeleteZone: (zoneId: string) => void;
  updatePolicies: { [zoneId: string]: boolean };
  onToggleUpdatePolicy: (zoneId: string) => void;
}
```

#### Features:
- **Zone information display** (name, type, capacity, occupancy)
- **Access type badges** with color coding
- **Policy management** buttons
- **Integrated checkpoint table**
- **Subzone support** with indentation

### SummarySection Component

**Purpose**: Overview navigation and summary statistics.

```tsx
interface SummarySectionProps {
  summaryView: 'overview' | 'gates' | 'zones' | 'venues' | 'checkpoints';
  setSummaryView: (view: string) => void;
  gates: Gate[];
  venues: Venue[];
  zones: Zone[];
  subzones: Subzone[];
  allCheckpoints: Checkpoint[];
  summary: Summary;
  currentPath: string[];
  onBreadcrumbClick: (index: number) => void;
  getBreadcrumbIcon: (item: string) => ReactNode;
}
```

#### Features:
- **Tabbed navigation** (Overview, Gates, Zones, Venues, Checkpoints)
- **Dynamic breadcrumbs** with clickable navigation
- **Statistics summary** cards
- **Quick actions** and shortcuts

## Type System

### Core Interfaces

```tsx
// Main zone types
interface Gate extends BaseZone {
  type: 'GATE';
  deviceId?: string;
  deviceRole?: string;
}

interface Zone extends BaseZone {
  type: 'ZONE';
  parentZoneId?: string;
}

interface Venue extends BaseZone {
  type: 'VENUE';
}

interface Subzone extends BaseZone {
  type: 'SUBZONE';
  parentZoneId: string;
}

// Unified zone type
type ZoneType = Gate | Zone | Venue | Subzone;

// Event data structure
interface EventData {
  data: {
    zones: { [key: string]: ZoneType };
  };
}
```

### Utility Types

```tsx
// Access control
interface AccessTypes {
  GENERAL: boolean;
  BACKSTAGE: boolean;
  STAGE: boolean;
  COMPROMIS: boolean;
  VIP: boolean;
}

// Checkpoint management
interface Checkpoint {
  checkpointId: string;
  name: string;
  type: "IN" | "OUT";
  role: string;
  shareLink: string;
  qrShareLink: string;
  deviceImei?: string;
}
```

## Services & Utilities

### services.ts Module

```tsx
// API endpoint
export const EventItemEndpoint = {
  save: async (eventData: EventData): Promise<void> => {
    // Implementation for saving data
  },
  load: async (): Promise<EventData> => {
    // Implementation for loading data
  }
};

// Utilities
export const createInitialData = (): EventData => {
  // Creates default zones for new events
};

export const isFirstVisit = (eventData: EventData): boolean => {
  // Determines if this is user's first visit
};

// Constants
export const DEVICE_ROLES = [
  'STEWARD-CHECKIN',
  'STEWARD-ZONEIN',
  'STEWARD-ZONEOUT',
  'ADMIN'
] as const;
```

## Integration Guide

### Basic Usage

```tsx
import ZonesManagement from './components/EventDetails/Steps/ZonesManagement';

// Simple integration
function EventManagement() {
  return (
    <div>
      <ZonesManagement />
    </div>
  );
}
```

### Advanced Integration

```tsx
import { 
  ZonesManagement,
  type EventData,
  type ZoneType 
} from './components/EventDetails/Steps/ZonesManagement';

// With external data source
function CustomEventManagement() {
  const [externalData, setExternalData] = useState<EventData | null>(null);

  return (
    <ZonesManagement 
      initialData={externalData}
      onDataChange={setExternalData}
    />
  );
}
```

## Best Practices

### Component Development

1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: Well-defined TypeScript interfaces
3. **Error Boundaries**: Wrap components in error boundaries
4. **Memorization**: Use useMemo/useCallback for expensive operations

### Data Management

1. **Immutable Updates**: Always create new objects
2. **Optimistic Updates**: Update UI immediately, sync later
3. **Error Handling**: Graceful fallbacks and user feedback
4. **Data Validation**: Validate all inputs and API responses

### UI/UX Guidelines

1. **Progressive Disclosure**: Show relevant information at the right time
2. **Loading States**: Provide feedback during async operations
3. **Empty States**: Guide users when no data exists
4. **Accessibility**: Proper ARIA labels and keyboard navigation

## Performance Optimizations

### Implemented Optimizations

1. **useMemo for Derived Data**:
   ```tsx
   const gates = useMemo(() => 
     zonesArray.filter(zone => zone.type === 'GATE'), 
     [zonesArray]
   );
   ```

2. **useCallback for Event Handlers**:
   ```tsx
   const handleAddZone = useCallback(async (newZone: ZoneType) => {
     // Implementation
   }, [eventData]);
   ```

3. **Lazy Loading**:
   ```tsx
   const CheckpointTable = lazy(() => import('./components/CheckpointTable'));
   ```

4. **Conditional Rendering**:
   ```tsx
   {eventData && (
     <Dialogs eventData={eventData} />
   )}
   ```



## Debugging & Troubleshooting

### Common Issues

1. **"Hook called outside component"**
   ```tsx
   ❌ Wrong: const data = useZoneData(); // Outside component
   ✅ Correct: Use inside React component only
   ```

2. **"Cannot read property of undefined"**
   ```tsx
   ❌ Wrong: eventData.data.zones[zoneId].name
   ✅ Correct: eventData?.data?.zones?.[zoneId]?.name
   ```

3. **"State not updating"**
   ```tsx
   ❌ Wrong: eventData.data.zones[id] = newZone; // Mutation
   ✅ Correct: setEventData(prev => ({ ...prev, ... })); // Immutable
   ```

### Debug Tools



## Extension & Customization

### Adding New Zone Types

1. **Extend the ZoneType union**:
   ```tsx
   interface CustomZone extends BaseZone {
     type: 'CUSTOM';
     customProperty: string;
   }
   
   type ZoneType = Gate | Zone | Venue | Subzone | CustomZone;
   ```

2. **Update the UI Components**:
   ```tsx
   // In ZoneSection.tsx
   {zone.type === 'CUSTOM' && (
     <CustomZoneRenderer zone={zone} />
   )}
   ```

### Custom Hooks

```tsx
// Create custom data hooks
export const useCustomZoneData = () => {
  const { eventData } = useZoneData();
  
  const customZones = useMemo(() => 
    Object.values(eventData?.data?.zones || {})
      .filter(zone => zone.type === 'CUSTOM'),
    [eventData]
  );
  
  return { customZones };
};
```

### UI Theming

```tsx
// Custom theme provider
const CustomZonesTheme = {
  primaryColor: '#your-color',
  spacing: 'your-spacing',
  // ... more theme properties
};

<ThemeProvider theme={CustomZonesTheme}>
  <ZonesManagement />
</ThemeProvider>
```

---



## Type Definitions

### Core Interfaces

#### `AccessTypes`
```tsx
interface AccessTypes {
  GENERAL: boolean;
  BACKSTAGE: boolean;
  STAGE: boolean;
  COMPROMIS: boolean;  // New access type for special arrangements
  VIP: boolean;
}
```

**Access Type Colors:**
- `GENERAL`: Orange (#ff9800)
- `BACKSTAGE`: Green (#4caf50) 
- `STAGE`: Purple (#9c27b0)
- `COMPROMIS`: Blue (#2196f3) - New addition
- `VIP`: Red (#f44336)

#### `Checkpoint`
```tsx
interface Checkpoint {
  checkpointId: string;
  name: string;
  type: "IN" | "OUT";
  role: string;
  shareLink: string;
  qrShareLink: string;
  deviceImei?: string;
}
```

#### `Gate`
```tsx
interface Gate {
  zoneId: string;
  name: string;
  type: "GATE";
  parentZoneId: null;
  maxCapacity: number;
  currentOccupancy?: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}
```

#### `Zone`
```tsx
interface Zone {
  zoneId: string;
  name: string;
  type: "ZONE" | "VENUE";
  parentZoneId: null;
  maxCapacity: number;
  currentOccupancy: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}
```

#### `Subzone`
```tsx
interface Subzone {
  zoneId: string;
  name: string;
  type: "SUBZONE";
  parentZoneId: string;
  parentZoneName: string;
  maxCapacity: number;
  currentOccupancy?: number;
  accessTypes: AccessTypes;
  checkPoints?: { [key: string]: Checkpoint };
}
```

#### Union Types
```tsx
type ZoneType = Gate | Zone | Subzone;
```

## Hooks & Lifecycle

### useState Hooks

#### Event Data Management
```tsx
const [eventData, setEventData] = useState<EventData>({
  eventId: 'event_001',
  operation: 'CREATE_EVENT',
  data: { zones: {} },
});
```

#### UI State Management
```tsx
const [selectedZone, setSelectedZone] = useState<ZoneType | null>(null);
const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
```

#### Dialog States
```tsx
const [gateDialogOpen, setGateDialogOpen] = useState(false);
const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
const [venueDialogOpen, setVenueDialogOpen] = useState(false);
const [checkpointDialogOpen, setCheckpointDialogOpen] = useState(false);
const [subzoneDialogOpen, setSubzoneDialogOpen] = useState(false);
```

### useEffect Hook

```tsx
useEffect(() => {
  console.log('Event data updated:', eventData);
}, [eventData]);
```

**Purpose**: Debug logging for state changes
**Dependencies**: `[eventData]`
**Triggers**: Every time event data is modified

### useMemo Optimizations

The component uses multiple `useMemo` hooks to prevent unnecessary recalculations:

1. **Zone filtering**: Main zones, subzones lookup
2. **Statistics**: Capacity totals, counts by type
3. **Derived data**: Access type summaries, checkpoint counts

## UI Components

### Accordion Structure

The main UI uses Vaadin's `Accordion` component for hierarchical navigation:

```tsx
<Accordion>
  {mainZones.map((zone) => (
    <AccordionPanel key={zone.zoneId} summaryText={zone.name}>
      {/* Zone content */}
    </AccordionPanel>
  ))}
</Accordion>
```

### Zone Cards

Each zone is rendered as a card with:
- Header with name and type badge
- Capacity information
- Access types display
- Update Zone Policy button (green/red indicator)
- Action buttons
- Checkpoints list
- Subzones list (if applicable)

### Update Zone Policy Button

The `PolicyButton` component provides visual feedback for automatic capacity update policies:

```tsx
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
      backgroundColor: isActive ? '#4caf50' : '#f44336', // Green: Active, Red: Inactive
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '2px solid #ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      '&:hover': {
        backgroundColor: isActive ? '#45a049' : '#d32f2f',
        transform: 'scale(1.1)',
      },
    }}
    title={isActive ? 'Update Zone Policy: ACTIVE' : 'Update Zone Policy: INACTIVE'}
  />
);
```

**Button States:**
- 🟢 **Green (Active)**: Zone capacity updates automatically from external application
- 🔴 **Red (Inactive)**: Zone capacity does NOT update automatically
- **Default**: All zones start with policy ACTIVE (green)

**Usage in Headers:**
```tsx
<PolicyButton 
  zoneId={zone.zoneId}
  isActive={updatePolicies[zone.zoneId] ?? true}
  onClick={toggleUpdatePolicy}
/>
```

**State Management:**
```tsx
const [updatePolicies, setUpdatePolicies] = useState<{ [zoneId: string]: boolean }>({});

const toggleUpdatePolicy = (zoneId: string, event: React.MouseEvent) => {
  event.stopPropagation(); // Prevent accordion toggle
  setUpdatePolicies(prev => ({
    ...prev,
    [zoneId]: !prev[zoneId]
  }));
};
```

### Styling Approach

The component uses inline styles with a consistent design system:

```tsx
const styles = {
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px 0',
    border: '1px solid #dee2e6'
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  }
};
```

## Best Practices

### State Management
1. **Always use immutable updates**: Spread operators for nested objects
2. **Batch related state changes**: Update multiple pieces of state together when related
3. **Use functional updates for complex state**: When new state depends on previous state

### Performance
1. **Memorize expensive calculations**: Use `useMemo` for filtering and computations
2. **Optimize re-renders**: Use proper keys in lists
3. **Lazy loading**: Consider implementing for large datasets

### Code Organization
1. **Separate concerns**: Keep data logic separate from UI logic
2. **Extract reusable utilities**: Common operations into separate functions
3. **Type safety**: Always use TypeScript interfaces

### Error Handling
1. **Validate data structures**: Check for required properties before rendering
2. **Graceful degradation**: Handle missing data elegantly
3. **User feedback**: Provide clear error messages






```

### Integration Points


---

This developer guide provides comprehensive documentation for the ZonesManagement component. For user-facing documentation, see `README_ZonesManagement.md`.
WORK IN PROGRESS