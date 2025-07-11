# Dialogs - Developer Guide

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Component Structure](#component-structure)
- [Form State Management](#form-state-management)
- [API Reference](#api-reference)
- [Props Interface](#props-interface)
- [Form Handlers](#form-handlers)
- [Validation System](#validation-system)
- [UI Components](#ui-components)
- [Best Practices](#best-practices)
- [Extension Points](#extension-points)

## Architecture Overview

The `Dialogs` component implements a multi-form system for creating and managing venue entities. It follows a modular design where each form type (Gate, Zone, Venue, Checkpoint, Subzone) maintains independent state and lifecycle.

### Core Architectural Patterns

1. **Isolated Form State**: Each form maintains its own state variables independently
2. **Controlled Components**: All form inputs are controlled by React state
3. **Conditional Rendering**: Forms appear based on boolean flags from parent component
4. **Immutable Data Updates**: All data modifications create new objects
5. **Single Responsibility**: Each form handler focuses on one entity type

### Design Principles

- **Separation of Concerns**: UI logic separated from business logic
- **Reusability**: Common patterns abstracted for consistency
- **Type Safety**: Full TypeScript coverage for all data structures
- **User Experience**: Immediate feedback and validation

## Component Structure

### Component Hierarchy

```
Dialogs (Container)
├── Gate Form
│   ├── TextField (Name)
│   ├── TextField (Device IMEI)
│   ├── TextField (Device Role)
│   └── Action Buttons
├── Zone Form
│   ├── TextField (Name)
│   ├── NumberField (Capacity)
│   ├── Access Types Checkboxes
│   └── Action Buttons
├── Venue Form
│   ├── TextField (Name)
│   ├── NumberField (Capacity)
│   ├── Access Types Checkboxes
│   └── Action Buttons
├── Checkpoint Form
│   ├── TextField (Name)
│   ├── ComboBox (Type)
│   ├── TextField (Device IMEI)
│   ├── TextField (Device Role)
│   └── Action Buttons
└── Subzone Form
    ├── TextField (Name)
    ├── NumberField (Capacity)
    ├── Access Types Checkboxes
    └── Action Buttons
```

### Dependencies

```tsx
import { useState } from 'react';
import {
  VerticalLayout,
  HorizontalLayout,
  TextField,
  NumberField,
  ComboBox,
  Checkbox,
  Button,
} from '@vaadin/react-components';
```

## Form State Management

### State Variables by Form Type

#### Gate Form State
```tsx
const [gateName, setGateName] = useState('');
const [gateDeviceId, setGateDeviceId] = useState('');
const [gateDeviceRole, setGateDeviceRole] = useState('');
```

#### Zone/Venue Form State
```tsx
const [zoneName, setZoneName] = useState('');
const [zoneMaxCapacity, setZoneMaxCapacity] = useState(100);
const [zoneGeneralAccess, setZoneGeneralAccess] = useState(false);
const [zoneBackstageAccess, setZoneBackstageAccess] = useState(false);
const [zoneStageAccess, setZoneStageAccess] = useState(false);
```

#### Checkpoint Form State
```tsx
const [checkpointName, setCheckpointName] = useState('');
const [checkpointType, setCheckpointType] = useState('IN');
const [checkpointDeviceId, setCheckpointDeviceId] = useState('');
const [checkpointDeviceRole, setCheckpointDeviceRole] = useState('');
```

#### Subzone Form State
```tsx
const [subzoneName, setSubzoneName] = useState('');
const [subzoneMaxCapacity, setSubzoneMaxCapacity] = useState(100);
const [subzoneGeneralAccess, setSubzoneGeneralAccess] = useState(false);
const [subzoneBackstageAccess, setSubzoneBackstageAccess] = useState(false);
const [subzoneStageAccess, setSubzoneStageAccess] = useState(false);
```

### State Reset Functions

Each form has a dedicated reset function:

```tsx
const resetGateForm = () => {
  setGateName('');
  setGateDeviceId('');
  setGateDeviceRole('');
};

const resetZoneForm = () => {
  setZoneName('');
  setZoneMaxCapacity(100);
  setZoneGeneralAccess(false);
  setZoneBackstageAccess(false);
  setZoneStageAccess(false);
};
```

**Purpose**: Clean state after form submission or cancellation
**Usage**: Called after successful submission or on cancel action

## API Reference

### Props Interface

```tsx
interface DialogsProps {
  // Dialog visibility controls
  gateDialogOpen: boolean;
  setGateDialogOpen: (open: boolean) => void;
  zoneDialogOpen: boolean;
  setZoneDialogOpen: (open: boolean) => void;
  venueDialogOpen?: boolean;
  setVenueDialogOpen?: (open: boolean) => void;
  checkpointDialogOpen: boolean;
  setCheckpointDialogOpen: (open: boolean) => void;
  subzoneDialogOpen: boolean;
  setSubzoneDialogOpen: (open: boolean) => void;
  
  // Data management
  selectedZone: ZoneType | null;
  eventData: EventData;
  setEventData: (data: EventData) => void;
}
```

### Form Handlers

#### `handleAddGate()`
**Purpose**: Creates a new Gate entity with default checkpoint
**Parameters**: None (uses form state)
**Returns**: `void`
**Side Effects**:
- Creates new Gate object with unique ID
- Adds default entry checkpoint
- Updates parent component's event data
- Closes dialog and resets form

**Implementation Details**:
```tsx
const handleAddGate = () => {
  const newGate: Gate = {
    zoneId: `gate#${Date.now()}`,
    name: gateName,
    type: 'GATE',
    parentZoneId: null,
    maxCapacity: 1000,
    currentOccupancy: 0,
    accessTypes: {
      GENERAL: true,
      BACKSTAGE: true, 
      STAGE: true,
      VIP: true,
    },
    checkPoints: {
      [`checkpoint#${gateName}#IN`]: {
        checkpointId: `checkpoint#${gateName}#IN`,
        name: `${gateName} Entry`,
        type: 'IN',
        role: gateDeviceRole || 'STEWARD-CHECKIN',
        shareLink: `https://invite2me.com/gate/${gateName.toLowerCase().replace(/\s+/g, '-')}`,
        qrShareLink: `https://invite2me.com/qr/gate/${gateName.toLowerCase().replace(/\s+/g, '-')}`,
        deviceImei: gateDeviceId,
      }
    }
  };

  const updatedZones = { ...eventData.data.zones };
  updatedZones[newGate.zoneId] = newGate;

  setEventData({
    ...eventData,
    data: { zones: updatedZones },
  });
  setGateDialogOpen(false);
  resetGateForm();
};
```

#### `handleAddZone()`
**Purpose**: Creates a new Zone entity
**Parameters**: None (uses form state)
**Returns**: `void`
**Side Effects**:
- Creates Zone object with user-configured access types
- Updates event data
- Closes dialog and resets form

#### `handleAddVenue()`
**Purpose**: Creates a new Venue entity
**Parameters**: None (uses form state)
**Returns**: `void`
**Notes**: Similar to Zone creation but with type 'VENUE'

#### `handleAddCheckpoint()`
**Purpose**: Adds a checkpoint to the selected zone
**Parameters**: None (uses form state and selectedZone prop)
**Returns**: `void`
**Preconditions**: `selectedZone` must not be null
**Side Effects**:
- Creates checkpoint within selected zone
- Updates zone's checkPoints collection
- Generates share links automatically

**Implementation Details**:
```tsx
const handleAddCheckpoint = () => {
  if (!selectedZone) return;

  const newCheckpoint: Checkpoint = {
    checkpointId: `checkpoint#${Date.now()}`,
    name: checkpointName,
    type: checkpointType as "IN" | "OUT",
    role: checkpointDeviceRole || 'STEWARD-ZONEIN',
    shareLink: `https://invite2me.com/checkpoint/${checkpointName.toLowerCase().replace(/\s+/g, '-')}`,
    qrShareLink: `https://invite2me.com/qr/checkpoint/${checkpointName.toLowerCase().replace(/\s+/g, '-')}`,
    deviceImei: checkpointDeviceId,
  };

  const updatedZones = { ...eventData.data.zones };
  if (updatedZones[selectedZone.zoneId]) {
    if (!updatedZones[selectedZone.zoneId].checkPoints) {
      updatedZones[selectedZone.zoneId].checkPoints = {};
    }
    updatedZones[selectedZone.zoneId].checkPoints![newCheckpoint.checkpointId] = newCheckpoint;
  }

  setEventData({
    ...eventData,
    data: { zones: updatedZones },
  });
  setCheckpointDialogOpen(false);
  resetCheckpointForm();
};
```

#### `handleAddSubzone()`
**Purpose**: Creates a subzone within the selected zone
**Parameters**: None (uses form state and selectedZone prop)
**Returns**: `void`
**Preconditions**: `selectedZone` must not be null
**Side Effects**:
- Creates Subzone with parent reference
- Sets parentZoneName for UI display
- Updates event data

## Validation System

### Built-in Validation

#### Form Submission Prevention
```tsx
<Button 
  theme="primary" 
  onClick={handleAddGate} 
  disabled={!gateName}
>
  Add Gate
</Button>
```

**Rule**: Primary action disabled until required fields are filled

#### Input Validation

1. **Name Fields**: Required, non-empty strings
2. **Capacity Fields**: Positive integers, default to 100
3. **Device Fields**: Optional, string values
4. **Type Fields**: Restricted to predefined options

### Validation Patterns

#### Text Input Validation
```tsx
<TextField
  label="Gate Name"
  value={gateName}
  placeholder="e.g., Main Gate"
  onValueChanged={(e: any) => setGateName(e.detail.value)}
  required
/>
```

#### Numeric Input Validation
```tsx
<NumberField
  label="Max Capacity"
  value={zoneMaxCapacity.toString()}
  onValueChanged={(e: any) => setZoneMaxCapacity(parseInt(e.detail.value) || 100)}
  min={1}
/>
```

### Custom Validation (Future Enhancement)

```tsx
const validateForm = (formType: string, formData: any) => {
  const errors: string[] = [];
  
  switch (formType) {
    case 'gate':
      if (!formData.name.trim()) errors.push('Gate name is required');
      if (formData.name.length > 50) errors.push('Gate name too long');
      break;
    case 'zone':
      if (!formData.name.trim()) errors.push('Zone name is required');
      if (formData.capacity < 1) errors.push('Capacity must be positive');
      break;
  }
  
  return errors;
};
```

## UI Components

### Form Layout Structure

All forms follow a consistent layout pattern:

```tsx
<div style={{ 
  backgroundColor: '#f8f9fa', 
  padding: '16px', 
  borderRadius: '8px', 
  margin: '8px 0',
  border: '1px solid #dee2e6'
}}>
  <h4 style={{ margin: '0 0 16px 0', color: '#495057' }}>Form Title</h4>
  <VerticalLayout theme="spacing">
    {/* Form fields */}
    <HorizontalLayout theme="spacing" style={{ marginTop: '16px' }}>
      <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
      <Button theme="primary" onClick={handleSubmit} disabled={!isValid}>
        Submit
      </Button>
    </HorizontalLayout>
  </VerticalLayout>
</div>
```

### Styling System

#### Design Tokens
```tsx
const formStyles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    margin: '8px 0',
    border: '1px solid #dee2e6'
  },
  title: {
    margin: '0 0 16px 0',
    color: '#495057'
  },
  accessTypes: {
    marginTop: '12px'
  }
};
```

#### Access Types Section
```tsx
<div style={{ marginTop: '12px' }}>
  <span style={{ 
    fontWeight: 'bold', 
    color: '#495057', 
    fontSize: '14px' 
  }}>
    Access Types
  </span>
  <div style={{ marginTop: '8px' }}>
    <Checkbox
      label="GENERAL"
      checked={zoneGeneralAccess}
      onCheckedChanged={(e: any) => setZoneGeneralAccess(e.detail.value)}
    />
    {/* Additional checkboxes */}
  </div>
</div>
```

## Best Practices

### State Management

#### 1. Independent Form State
```tsx
// ✅ Good - Each form has its own state
const [gateName, setGateName] = useState('');
const [zoneName, setZoneName] = useState('');

// ❌ Avoid - Shared state for different forms
const [formData, setFormData] = useState({});
```

#### 2. Immutable Updates
```tsx
// ✅ Good - Immutable state update
const updatedZones = { ...eventData.data.zones };
updatedZones[newZone.zoneId] = newZone;

// ❌ Avoid - Direct mutation
eventData.data.zones[newZone.zoneId] = newZone;
```

### Form Handling

#### 1. Reset After Actions
```tsx
// ✅ Good - Always reset form after submission
const handleAddGate = () => {
  // ... create gate logic
  setGateDialogOpen(false);
  resetGateForm(); // Clean state
};
```

#### 2. Validation Before Submission
```tsx
// ✅ Good - Validate required fields
<Button 
  theme="primary" 
  onClick={handleAddGate} 
  disabled={!gateName.trim()}
>
  Add Gate
</Button>
```

### Error Handling

#### 1. Defensive Programming
```tsx
// ✅ Good - Check preconditions
const handleAddCheckpoint = () => {
  if (!selectedZone) return;
  // ... rest of logic
};
```

#### 2. Graceful Degradation
```tsx
// ✅ Good - Handle optional props
{venueDialogOpen && (
  <div>
    {/* Venue form */}
    <Button onClick={() => setVenueDialogOpen && setVenueDialogOpen(false)}>
      Cancel
    </Button>
  </div>
)}
```

## Performance Considerations

### Current Optimizations

1. **Conditional Rendering**: Forms only render when open
2. **Event Handler Stability**: Functions defined outside render when possible
3. **State Batching**: React automatically batches setState calls


## Extension Points

### Adding New Form Types

#### 1. Define New State Variables
```tsx
const [customFormName, setCustomFormName] = useState('');
const [customFormData, setCustomFormData] = useState({});
```

#### 2. Create Form Handler
```tsx
const handleAddCustomEntity = () => {
  const newEntity = {
    id: `custom#${Date.now()}`,
    name: customFormName,
    data: customFormData,
    // ... other properties
  };
  
  // Update event data
  const updatedZones = { ...eventData.data.zones };
  updatedZones[newEntity.id] = newEntity;
  
  setEventData({
    ...eventData,
    data: { zones: updatedZones },
  });
  
  setCustomDialogOpen(false);
  resetCustomForm();
};
```

#### 3. Add Form UI
```tsx
{customDialogOpen && (
  <div style={formStyles.container}>
    <h4 style={formStyles.title}>Add Custom Entity</h4>
    <VerticalLayout theme="spacing">
      <TextField
        label="Entity Name"
        value={customFormName}
        onValueChanged={(e: any) => setCustomFormName(e.detail.value)}
      />
      {/* Additional fields */}
    </VerticalLayout>
  </div>
)}
```

### Custom Validation

#### Field-Level Validation
```tsx
const useFieldValidation = (value: string, rules: ValidationRule[]) => {
  return useMemo(() => {
    return rules.reduce((errors, rule) => {
      const error = rule.validate(value);
      return error ? [...errors, error] : errors;
    }, [] as string[]);
  }, [value, rules]);
};
```

#### Form-Level Validation
```tsx
const useFormValidation = (formData: any, schema: ValidationSchema) => {
  return useMemo(() => {
    return schema.validate(formData);
  }, [formData, schema]);
};
```

### Dynamic Form Generation

```tsx
interface FormField {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  label: string;
  required?: boolean;
  options?: string[];
}

const DynamicForm = ({ fields, onSubmit }: { 
  fields: FormField[]; 
  onSubmit: (data: any) => void; 
}) => {
  const [formData, setFormData] = useState({});
  
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.name}
            label={field.label}
            value={formData[field.name] || ''}
            onValueChanged={(e: any) => 
              setFormData(prev => ({ ...prev, [field.name]: e.detail.value }))
            }
          />
        );
      // ... other field types
    }
  };
  
  return (
    <VerticalLayout>
      {fields.map(renderField)}
    </VerticalLayout>
  );
};
```

### Integration Hooks

#### API Integration
```tsx
const useAPISubmission = () => {
  const submitForm = async (formType: string, data: any) => {
    try {
      const response = await fetch(`/api/zones/${formType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Submission failed');
      
      return await response.json();
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  };
  
  return { submitForm };
};
```

#### Real-time Validation
```tsx
const useRealTimeValidation = (formData: any) => {
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const validate = async () => {
      try {
        const response = await fetch('/api/validate', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        const validationResult = await response.json();
        setErrors(validationResult.errors || {});
      } catch (error) {
        console.error('Validation error:', error);
      }
    };
    
    const debounceTimer = setTimeout(validate, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData]);
  
  return errors;
};
```

---

This developer guide provides comprehensive technical documentation for the Dialogs component. For user-facing documentation, see `README_Dialogs.md`. WORK IN PROGRESS
