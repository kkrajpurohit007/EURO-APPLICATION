# Theme Consistency Guide

## 🎨 Overview

All reusable components (Card, Button, Badge, etc.) are now centralized in `src/shared/components/` to ensure theme consistency across all modules.

## 📦 Shared Components

### Card Components

#### `Card`
- **Location**: `src/shared/components/Card.tsx`
- **Usage**: Base card component with consistent styling
- **Props**:
  - `hover?: boolean` - Enable hover effect
  - `padding?: "sm" | "md" | "lg"` - Card padding
  - All standard CardProps from reactstrap

```tsx
import { Card, CardBodyShared, CardHeaderShared } from "../../../shared/components";

<Card hover={true} padding="md">
  <CardHeaderShared>Title</CardHeaderShared>
  <CardBodyShared padding="lg">Content</CardBodyShared>
</Card>
```

#### `CardComponent`
- **Location**: `src/shared/components/CardComponent.tsx`
- **Usage**: Generic card for displaying entities (Client, Lead, Contact, etc.)
- **Features**: Avatar, metadata, status badge, action buttons

```tsx
import { CardComponent } from "../../../shared/components";

<CardComponent
  title="Client Name"
  initials="CN"
  status="priority"
  metadata={[
    { icon: <i className="ri-mail-line"></i>, label: "Email", value: "email@example.com" }
  ]}
  actions={[
    { type: "view", onClick: handleView },
    { type: "edit", onClick: handleEdit },
    { type: "delete", onClick: handleDelete }
  ]}
  hover={true}
  onClick={handleClick}
/>
```

### Button Components

#### `Button`
- **Location**: `src/shared/components/Button.tsx`
- **Usage**: Consistent button styling
- **Props**:
  - `size?: "sm" | "md" | "lg"`
  - `variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"`
  - `icon?: React.ReactNode`
  - `iconPosition?: "left" | "right"`
  - `fullWidth?: boolean`

```tsx
import { Button } from "../../../shared/components";

<Button
  variant="primary"
  size="md"
  icon={<i className="ri-add-line"></i>}
  iconPosition="left"
>
  Add New
</Button>
```

#### `ActionButton`
- **Location**: `src/shared/components/Button.tsx`
- **Usage**: Pre-configured action buttons (view, edit, delete, etc.)

```tsx
import { ActionButton } from "../../../shared/components";

<ActionButton
  action="view"
  onClick={handleView}
  title="View Details"
/>
```

### Badge Components

#### `Badge`
- **Location**: `src/shared/components/Badge.tsx`
- **Usage**: Consistent badge styling

```tsx
import { Badge } from "../../../shared/components";

<Badge variant="success" size="sm">Active</Badge>
```

#### `StatusBadge`
- **Location**: `src/shared/components/Badge.tsx`
- **Usage**: Pre-configured status badges

```tsx
import { StatusBadge } from "../../../shared/components";

<StatusBadge status="active" />
<StatusBadge status="priority" />
<StatusBadge status="cancelled" />
```

## 🎯 Theme Configuration

### Design Tokens
- **Location**: `src/shared/theme/index.ts`
- **Contains**: Colors, spacing, shadows, transitions, typography

```tsx
import { theme } from "../../../shared/theme";

// Access theme values
const primaryColor = theme.colors.primary;
const spacing = theme.spacing.md;
const shadow = theme.shadows.md;
```

## ✅ Migration Checklist

When creating or updating components:

- [ ] Use `Card` from `shared/components` instead of reactstrap `Card`
- [ ] Use `CardComponent` for entity cards (Client, Lead, Contact, etc.)
- [ ] Use `Button` or `ActionButton` from `shared/components`
- [ ] Use `Badge` or `StatusBadge` from `shared/components`
- [ ] Use `CardBodyShared` and `CardHeaderShared` for consistent padding
- [ ] Import from `shared/components` index file
- [ ] Follow theme spacing and color guidelines

## 📝 Examples

### Before (Inconsistent)
```tsx
import { Card, CardBody, Button, Badge } from "reactstrap";

<Card className="h-100 border shadow-sm" style={{ transition: "all 0.3s ease" }}>
  <CardBody className="p-3">
    <Badge color="warning">Priority</Badge>
    <Button color="soft-primary" size="sm">View</Button>
  </CardBody>
</Card>
```

### After (Consistent)
```tsx
import { CardComponent, ActionButton } from "../../../shared/components";

<CardComponent
  title="Client Name"
  status="priority"
  actions={[
    { type: "view", onClick: handleView }
  ]}
/>
```

## 🚀 Benefits

1. **Consistency**: All cards/buttons look the same across modules
2. **Maintainability**: Update styling in one place
3. **Theme Support**: Easy to switch themes
4. **Type Safety**: TypeScript types for all props
5. **Reusability**: Components work across all modules

## 📋 Component Status

- ✅ Card - Created and ready
- ✅ CardComponent - Created and ready
- ✅ Button - Created and ready
- ✅ ActionButton - Created and ready
- ✅ Badge - Created and ready
- ✅ StatusBadge - Created and ready
- ✅ Theme Configuration - Created and ready
- ⚠️ ClientCard - Migrated to use CardComponent
- ⚠️ Other cards - Need migration (LeadCard, ContactCard, etc.)

