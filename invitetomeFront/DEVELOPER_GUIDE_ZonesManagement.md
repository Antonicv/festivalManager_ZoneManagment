# ZonesManagement - Developer Guide

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Component Structure](#component-structure)
- [Data Flow & State Management](#data-flow--state-management)
- [API Reference](#api-reference)
- [Type Definitions](#type-definitions)
- [Hooks & Lifecycle](#hooks--lifecycle)
- [UI Components](#ui-components)
- [Best Practices](#best-practices)
- [Performance Considerations](#performance-considerations)
- [Debugging Guide](#debugging-guide)
- [Extension Points](#extension-points)

## Architecture Overview

The `ZonesManagement` component follows a hierarchical data management pattern with accordion-based UI for complex venue management. It implements a tree-like structure where Gates, Zones, and Venues can contain Subzones and Checkpoints.

### Core Architectural Patterns

1. **Immutable State Updates**: All state changes create new objects to ensure React re-renders
2. **Derived State with useMemo**: Calculated values are memoized for performance
3. **Conditional Rendering**: Dynamic UI based on data structure and user interactions
4. **Accordion Navigation**: Hierarchical display with breadcrumb-style navigation

### Component Hierarchy
```
ZonesManagement (Main Container)
├── Breadcrumb Navigation
├── Action Buttons Section
├── Zones List (Accordion)
│   ├── Zone Cards
│   │   ├── Zone Details
│   │   ├── Checkpoint List
│   │   └── Subzone List
│   └── Empty State
└── Dialogs Component
```

## Component Structure

### Main Component: `ZonesManagement`

```tsx
const ZonesManagement = () => {
  // State management
  // UI rendering
  // Event handlers
  // Data operations
}
```

### Props Interface
The component is self-contained and doesn't accept external props, managing all state internally.

### Dependencies
- `@vaadin/react-components`: UI component library
- `React.useState`: Local state management
- `React.useMemo`: Performance optimization
- `React.useEffect`: Lifecycle management

## Data Flow & State Management

### State Variables

| State Variable | Type | Purpose |
|---|---|---|
| `eventData` | `EventData` | Complete event configuration with zones |
| `selectedZone` | `ZoneType \| null` | Currently selected zone for operations |
| `activeAccordion` | `string \| null` | Controls accordion expansion |
| Dialog states | `boolean` | Controls visibility of various forms |

### State Update Patterns

#### Adding New Zones
```tsx
const updatedZones = { ...eventData.data.zones };
updatedZones[newZone.zoneId] = newZone;
setEventData({
  ...eventData,
  data: { zones: updatedZones },
});
```

#### Deleting Zones
```tsx
const updatedZones = { ...eventData.data.zones };
delete updatedZones[zoneId];
// Also remove dependent subzones
Object.keys(updatedZones).forEach(key => {
  if (updatedZones[key].parentZoneId === zoneId) {
    delete updatedZones[key];
  }
});
setEventData({
  ...eventData,
  data: { zones: updatedZones },
});
```

## API Reference

### Main Functions

#### `handleDeleteZone(zoneId: string)`
**Purpose**: Removes a zone and all its dependent subzones
**Parameters**:
- `zoneId`: Unique identifier of the zone to delete
**Side Effects**: 
- Updates `eventData` state
- Removes dependent subzones
- Resets `selectedZone` if deleted zone was selected

#### `handleAddCheckpoint(zone: ZoneType)`
**Purpose**: Opens checkpoint creation dialog for specified zone
**Parameters**:
- `zone`: Target zone object
**Side Effects**: 
- Sets `selectedZone` state
- Opens checkpoint dialog

#### `handleAddSubzone(zone: ZoneType)`
**Purpose**: Opens subzone creation dialog for specified zone
**Parameters**:
- `zone`: Parent zone object
**Side Effects**: 
- Sets `selectedZone` state
- Opens subzone dialog

### Computed Values (useMemo)

#### `zones`
```tsx
const zones = useMemo(() => 
  Object.values(eventData.data.zones || {}), 
  [eventData.data.zones]
);
```
**Returns**: Array of all zones
**Recomputes when**: `eventData.data.zones` changes

#### `mainZones`
```tsx
const mainZones = useMemo(() => 
  zones.filter(zone => zone.parentZoneId === null), 
  [zones]
);
```
**Returns**: Array of top-level zones (Gates, Zones, Venues)
**Recomputes when**: `zones` array changes

#### `getSubzones(parentZoneId: string)`
```tsx
const getSubzones = useMemo(() => (parentZoneId: string) => 
  zones.filter(zone => zone.parentZoneId === parentZoneId), 
  [zones]
);
```
**Returns**: Function that filters subzones by parent ID
**Recomputes when**: `zones` array changes

#### Statistics Calculations
- `totalCapacity`: Sum of all zone max capacities
- `gateCount`: Number of Gates
- `zoneCount`: Number of Zones  
- `venueCount`: Number of Venues
- `subzoneCount`: Number of Subzones

## Type Definitions

### Core Interfaces

#### `AccessTypes`
```tsx
interface AccessTypes {
  GENERAL: boolean;
  BACKSTAGE: boolean;
  STAGE: boolean;
  VIP: boolean;
}
```

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
- Action buttons
- Checkpoints list
- Subzones list (if applicable)

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

## Performance Considerations

### Current Optimizations

1. **useMemo for filtering**: Prevents recalculation on every render
2. **Component keys**: Proper keys for list items to optimize reconciliation
3. **Conditional rendering**: Only render necessary components

### Potential Improvements

1. **React.memo**: Wrap child components to prevent unnecessary re-renders
2. **Virtualization**: For large lists of zones (>100 items)
3. **Code splitting**: Lazy load dialogs component
4. **State normalization**: Flatten nested structures for better performance

### Memory Management

- Clean up event listeners in useEffect cleanup
- Avoid creating new objects in render methods
- Use refs for DOM manipulation instead of state

## Debugging Guide

### Common Issues

#### State Not Updating
```tsx
// Wrong - mutating state directly
eventData.data.zones[zoneId] = newZone;
setEventData(eventData);

// Correct - immutable update
setEventData({
  ...eventData,
  data: {
    ...eventData.data,
    zones: {
      ...eventData.data.zones,
      [zoneId]: newZone
    }
  }
});
```

#### Subzones Not Showing
Check if `parentZoneId` matches exactly:
```tsx
// Debug subzone filtering
console.log('Looking for subzones with parentZoneId:', parentZoneId);
console.log('Available zones:', zones.map(z => ({ id: z.zoneId, parent: z.parentZoneId })));
```

### Debug Tools

1. **React DevTools**: Monitor state changes and component re-renders
2. **Console logging**: Strategic logging of state updates
3. **Browser DevTools**: Inspect rendered HTML structure

### Logging Helpers

```tsx
const debugZoneOperations = (operation: string, zoneData: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Zone Operation: ${operation}`);
    console.log('Zone data:', zoneData);
    console.log('Current state:', eventData);
    console.groupEnd();
  }
};
```

## Extension Points

### Adding New Zone Types

1. **Extend the type union**:
```tsx
type ZoneType = Gate | Zone | Subzone | CustomZoneType;
```

2. **Update type guards**:
```tsx
const isCustomZone = (zone: ZoneType): zone is CustomZoneType => 
  zone.type === 'CUSTOM';
```

3. **Add to rendering logic**:
```tsx
{zone.type === 'CUSTOM' && <CustomZoneRenderer zone={zone} />}
```

### Custom Actions

Add new action buttons by extending the actions array:

```tsx
const getZoneActions = (zone: ZoneType) => {
  const baseActions = [
    { label: 'Add Checkpoint', handler: () => handleAddCheckpoint(zone) },
    { label: 'Delete', handler: () => handleDeleteZone(zone.zoneId) }
  ];
  
  if (zone.type !== 'SUBZONE') {
    baseActions.push({ 
      label: 'Add Subzone', 
      handler: () => handleAddSubzone(zone) 
    });
  }
  
  return baseActions;
};
```

### Validation Hooks

Implement custom validation for zone data:

```tsx
const useZoneValidation = (zones: ZoneType[]) => {
  return useMemo(() => {
    const errors = [];
    zones.forEach(zone => {
      if (zone.maxCapacity <= 0) {
        errors.push(`Zone ${zone.name} has invalid capacity`);
      }
    });
    return errors;
  }, [zones]);
};
```

### Integration Points


---

This developer guide provides comprehensive documentation for the ZonesManagement component. For user-facing documentation, see `README_ZonesManagement.md`.
WORK IN PROGRESS