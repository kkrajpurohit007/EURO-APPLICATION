# Shared Components Library

## 🎨 Theme-Consistent Reusable Components

This directory contains all reusable UI components that ensure visual consistency across all modules.

## 📦 Available Components

### Card Components

#### `Card`
Base card component with consistent styling and hover effects.

```tsx
import { Card, CardBodyShared, CardHeaderShared } from "../../../shared/components";

<Card hover={true}>
  <CardHeaderShared>Title</CardHeaderShared>
  <CardBodyShared padding="lg">Content</CardBodyShared>
</Card>
```

**Props:**
- `hover?: boolean` - Enable hover effect
- `padding?: "sm" | "md" | "lg"` - Card padding
- All standard CardProps from reactstrap

#### `CardComponent`
Generic card component for displaying entities (Client, Lead, Contact, etc.).

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
/>
```

### Button Components

#### `Button`
Consistent button styling with icon support.

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
Pre-configured action buttons for common actions.

```tsx
import { ActionButton } from "../../../shared/components";

<ActionButton action="view" onClick={handleView} />
<ActionButton action="edit" onClick={handleEdit} />
<ActionButton action="delete" onClick={handleDelete} />
```

**Available actions:** `view`, `edit`, `delete`, `reschedule`, `download`, `preview`

### Badge Components

#### `Badge`
Consistent badge styling.

```tsx
import { Badge } from "../../../shared/components";

<Badge variant="success" size="sm">Active</Badge>
```

#### `StatusBadge`
Pre-configured status badges.

```tsx
import { StatusBadge } from "../../../shared/components";

<StatusBadge status="active" />
<StatusBadge status="priority" />
<StatusBadge status="cancelled" />
```

**Available statuses:** `active`, `inactive`, `pending`, `completed`, `cancelled`, `priority`, `standard`

## 🎯 Theme Configuration

Access theme tokens:

```tsx
import { theme } from "../../../shared/theme";

const primaryColor = theme.colors.primary;
const spacing = theme.spacing.md;
const shadow = theme.shadows.md;
```

## ✅ Migration Checklist

When creating/updating components:

- [ ] Use `Card` or `CardComponent` instead of reactstrap `Card`
- [ ] Use `Button` or `ActionButton` instead of reactstrap `Button`
- [ ] Use `Badge` or `StatusBadge` instead of reactstrap `Badge`
- [ ] Import from `shared/components` index
- [ ] Follow theme spacing guidelines
- [ ] Use theme colors

## 📝 Examples

### Entity Card (Recommended)
```tsx
import { CardComponent } from "../../../shared/components";

<CardComponent
  title={item.name}
  status={item.isPriority ? "priority" : "standard"}
  metadata={[
    { icon: <i className="ri-mail-line"></i>, label: "Email", value: item.email }
  ]}
  actions={[
    { type: "view", onClick: () => handleView(item.id) },
    { type: "edit", onClick: () => handleEdit(item.id) },
    { type: "delete", onClick: () => handleDelete(item.id) }
  ]}
/>
```

### Custom Card
```tsx
import { Card, CardBodyShared, CardHeaderShared } from "../../../shared/components";

<Card hover={true}>
  <CardHeaderShared>
    <h5>Custom Card</h5>
  </CardHeaderShared>
  <CardBodyShared padding="lg">
    Custom content here
  </CardBodyShared>
</Card>
```

### Action Buttons
```tsx
import { ActionButton } from "../../../shared/components";

<div className="d-flex gap-1">
  <ActionButton action="view" onClick={handleView} />
  <ActionButton action="edit" onClick={handleEdit} />
  <ActionButton action="delete" onClick={handleDelete} />
</div>
```

## 🚀 Benefits

1. **Consistency** - All components look identical
2. **Maintainability** - Update styling in one place
3. **Type Safety** - Full TypeScript support
4. **Reusability** - Works across all modules
5. **Theme Support** - Easy theme switching

