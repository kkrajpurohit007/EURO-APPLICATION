# Modular Architecture Migration Plan

## 📋 Executive Summary

This document outlines the migration from the current monolithic structure to a fully modular, self-contained architecture with RBAC, lazy loading, and enterprise-grade code organization.

## 🎯 Migration Goals

1. **Modular Isolation**: Each module is completely self-contained and can be moved/deleted safely
2. **RBAC Enforcement**: Route and component-level permission checking
3. **Lazy API Loading**: No global prefetching, data loads when modules are accessed
4. **UI Consistency**: Centralized reusable component library
5. **Zero Cross-Coupling**: Modules don't depend on each other
6. **Dead Code Removal**: Clean, lint-free codebase

## 📁 Target Folder Structure

```
src/
├── modules/                    # Self-contained feature modules
│   ├── client/
│   │   ├── components/        # Module-specific UI components
│   │   ├── constants/         # Module constants
│   │   ├── middleware/        # Module guards/interceptors
│   │   ├── slice/             # Redux slice (RTK)
│   │   ├── service/           # API calls
│   │   └── index.ts           # Module exports
│   ├── leads/
│   ├── account/
│   ├── meeting/
│   └── rental/
├── shared/                    # Shared resources
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Shared React hooks
│   ├── utils/                 # Utility functions
│   ├── constants/             # Shared constants
│   ├── middleware/            # RBAC guards
│   └── theme/                 # Design tokens
├── router/                    # Route configuration
├── store/                     # Root Redux store
├── services/                  # App-level services
└── app/                       # App-level components
```

## 🔄 Migration Phases

### Phase 1: Foundation ✅ (COMPLETED)
- [x] Create shared folder structure
- [x] Create RBAC middleware
- [x] Create shared component exports
- [x] Refactor AppInitService (remove global prefetching)

### Phase 2: Module Migration (IN PROGRESS)
- [ ] Migrate Clients module
- [ ] Migrate Leads module
- [ ] Migrate Account module
- [ ] Migrate Meeting module
- [ ] Migrate Rental module

### Phase 3: Cleanup
- [ ] Remove dead code
- [ ] Update routing
- [ ] Fix all lint errors
- [ ] Update imports across codebase

## 🛡️ RBAC Strategy

### Permission Structure
```typescript
enum Permission {
  CLIENT_VIEW = "client:view",
  CLIENT_CREATE = "client:create",
  CLIENT_EDIT = "client:edit",
  CLIENT_DELETE = "client:delete",
  // ... other permissions
}
```

### Usage
```typescript
// Route protection
<RouteGuard config={{ requiredPermissions: [Permission.CLIENT_VIEW] }}>
  <ClientList />
</RouteGuard>

// Component protection
const ProtectedComponent = withRBAC(ClientList, {
  requiredPermissions: [Permission.CLIENT_VIEW]
});
```

## 🔌 Lazy Loading Strategy

### Before (Global Prefetching - REMOVED)
```typescript
// AppInitService prefetched all data on app start
await dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
await dispatch(fetchLeads({ pageNumber: 1, pageSize: 500 }));
// ... etc
```

### After (Lazy Loading)
```typescript
// Modules fetch data when component mounts
useEffect(() => {
  dispatch(fetchClients({ pageNumber: 1, pageSize: 50 }));
}, []);
```

### Cache Invalidation
- Use RTK Query for automatic cache management
- Invalidate cache after mutations
- No stale data in global store

## 📦 Module Template

Each module follows this structure:

```
module-name/
├── components/          # Module-specific UI
│   └── ComponentName.tsx
├── constants/           # Module constants
│   └── index.ts
├── middleware/          # Module guards
│   └── guards.ts
├── slice/               # Redux slice
│   ├── module.slice.ts
│   └── module.types.ts
├── service/             # API service
│   └── moduleService.ts
└── index.ts             # Public API
```

## ✅ Migration Checklist

### For Each Module:
- [ ] Create module folder structure
- [ ] Move components to module/components/
- [ ] Move slice to module/slice/
- [ ] Move service to module/service/
- [ ] Create module constants
- [ ] Create module middleware (if needed)
- [ ] Create module index.ts exports
- [ ] Update imports in pages
- [ ] Add RBAC guards
- [ ] Remove global store dependencies
- [ ] Test module isolation

## 🚫 Rules to Follow

1. **No Cross-Module Imports**: Modules cannot import from other modules
2. **Shared Only**: Use `shared/` for cross-module resources
3. **Lazy Loading**: No global data prefetching
4. **RBAC Everywhere**: Protect routes and actions
5. **Self-Contained**: Each module has its own slice, service, components

## 📝 Notes

- StaffPosition module removed (dead code)
- AppInitService refactored to remove global prefetching
- RBAC middleware created and ready for use
- Shared component library structure created

## 🎯 Next Steps

1. Complete module migrations one by one
2. Update routing to use new structure
3. Add RBAC guards to routes
4. Remove all dead code
5. Fix lint errors
6. Test each module independently

