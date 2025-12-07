# Client Meeting ForEdit Endpoint Implementation

## 📋 Original Requirements

Update the existing Client Meeting Edit / View module used in both Tile View and Calendar View, using the following API endpoints while preserving existing functionality and UI behavior.

## 🔗 API Endpoints

### GET (Load/Edit/View Data)
```
GET https://app-fieldtrix-api-dev.azurewebsites.net/api/v1/ClientMeeting/{meetingId}/ForEdit?clientId={clientId}
```

### PUT (Save/Update)
```
PUT https://app-fieldtrix-api-dev.azurewebsites.net/api/v1/ClientMeeting/{meetingId}/ForEdit?clientId={clientId}
Content-Type: application/json
```

## 📌 Requirements

1. **Use the GET response schema to populate Edit and View modules.**
2. **Use the PUT request format to update meeting data.**
3. **Apply changes to module logic only — no UI structure or design changes.**
4. **Tile + Calendar views must reflect updated data.**
5. **Existing shared components, props, and store keys remain unchanged.**
6. **No routing level, layout, or component separation modifications.**

## 🧹 Cleanup & Maintenance Scope

- Remove dead / unused imports
- Remove unused or obsolete variables
- Eliminate dead code blocks
- Ensure no duplicate utility or helper calls
- Apply lint fixes across modified files
- Ensure code passes existing project lint rules
- Do not modify code outside this module unless required for lint violations

## 🛑 Explicitly Do Not

- Do NOT change Redux shape or store slice
- Do NOT rename keys or API field names
- Do NOT alter shared/common components
- Do NOT cause UI distractions or structure shifts
- Do NOT modify Calendar internal logic outside mapping

## 🎯 Expected Outcome

- Module consumes and updates meeting data correctly.
- Tile & Calendar views stay functional with refreshed mapping.
- No regressions to other modules.
- No UI impact.
- No TypeScript/lint warnings remain in modified files.

---

## 📝 Implementation Details

### Files Modified

1. **`src/services/clientMeetingService.ts`**
   - Updated `getClientMeetingForEdit()` to use GET endpoint with `clientId` query parameter
   - Updated `updateClientMeetingForEdit()` to use PUT endpoint with `clientId` query parameter

2. **`src/pages/Clients/Meeting/MeetingEdit.tsx`**
   - Changed from `fetchClientMeetingById` to `fetchClientMeetingForEdit`
   - Changed from `updateClientMeeting` to `updateClientMeetingForEdit`
   - Added logic to get `clientId` from meeting object (checks detail store, then list store)
   - Added `selectClientMeetingsList` selector import

3. **`src/pages/Clients/Meeting/MeetingView.tsx`**
   - Changed from `fetchClientMeetingById` to `fetchClientMeetingForEdit`
   - Added logic to get `clientId` from meeting object (checks detail store, then list store)
   - Added `selectClientMeetingsList` selector import

### Key Implementation Notes

- `clientId` is obtained from the meeting object stored in Redux (either from detail store or list store)
- The ForEdit endpoints require `clientId` as a query parameter
- Old functions (`fetchClientMeetingById`, `updateClientMeeting`) are kept for backward compatibility (used by MeetingReschedule and MeetingCalendar)
- No UI changes were made - only API endpoint logic was updated

---

## 🔄 How to Revert Changes

### Step 1: Revert Service File
```bash
git checkout HEAD -- src/services/clientMeetingService.ts
```

Or manually revert:
- Restore `getClientMeetingForEdit()` to use old endpoint pattern
- Restore `updateClientMeetingForEdit()` to use old endpoint pattern

### Step 2: Revert MeetingEdit Component
```bash
git checkout HEAD -- src/pages/Clients/Meeting/MeetingEdit.tsx
```

Or manually revert:
- Change `fetchClientMeetingForEdit` back to `fetchClientMeetingById`
- Change `updateClientMeetingForEdit` back to `updateClientMeeting`
- Remove `selectClientMeetingsList` import if not needed
- Remove clientId lookup logic

### Step 3: Revert MeetingView Component
```bash
git checkout HEAD -- src/pages/Clients/Meeting/MeetingView.tsx
```

Or manually revert:
- Change `fetchClientMeetingForEdit` back to `fetchClientMeetingById`
- Remove `selectClientMeetingsList` import if not needed
- Remove clientId lookup logic

---

## 🔄 How to Re-Apply Changes

### Step 1: Update Service File (`src/services/clientMeetingService.ts`)

**Update `getClientMeetingForEdit` function:**
```typescript
export const getClientMeetingForEdit = (
  meetingId: string,
  clientId: string
): Promise<ClientMeeting> => {
  if (isFakeBackend) {
    return getClientMeetings(1, 20).then((response: any) => {
      const meeting = response.items.find((m: ClientMeeting) => m.id === meetingId);
      if (!meeting) {
        throw new Error("Meeting not found");
      }
      return meeting;
    }) as unknown as Promise<ClientMeeting>;
  }
  // GET /ClientMeeting/{meetingId}/ForEdit?clientId={clientId}
  return api.get(
    `${url.GET_CLIENT_MEETING_FOR_EDIT}/${meetingId}/ForEdit`,
    { clientId }
  ) as unknown as Promise<ClientMeeting>;
};
```

**Update `updateClientMeetingForEdit` function:**
```typescript
export const updateClientMeetingForEdit = (
  meetingId: string,
  clientId: string,
  data: Partial<ClientMeeting>
): Promise<ClientMeeting> => {
  if (isFakeBackend) {
    return updateClientMeetingFake(meetingId, data) as unknown as Promise<ClientMeeting>;
  }
  // PUT payload - only editable fields (no tenant/client IDs)
  const payload = {
    meetingTitle: data.meetingTitle,
    meetingDescription: data.meetingDescription,
    meetingDate: data.meetingDate,
    meetingStartTime: data.meetingStartTime,
    meetingEndTime: data.meetingEndTime,
    meetingLocation: data.meetingLocation,
    meetingType: data.meetingType,
  };
  // PUT /ClientMeeting/{meetingId}/ForEdit?clientId={clientId}
  // Append clientId as query parameter to URL
  const urlWithQuery = `${url.UPDATE_CLIENT_MEETING_FOR_EDIT}/${meetingId}/ForEdit?clientId=${encodeURIComponent(clientId)}`;
  return api
    .put(urlWithQuery, payload)
    .then((response: any) => {
      // Handle API response wrapper
      if (response.result?.ClientMeeting) {
        return response.result.ClientMeeting;
      }
      return response as unknown as ClientMeeting;
    }) as unknown as Promise<ClientMeeting>;
};
```

### Step 2: Update MeetingEdit Component (`src/pages/Clients/Meeting/MeetingEdit.tsx`)

**Update imports:**
```typescript
import {
  fetchClientMeetingForEdit,
  updateClientMeetingForEdit,
  selectClientMeetingById,
  selectClientMeetingDetailLoading,
  selectClientMeetingSaving,
  selectClientMeetingError,
  selectClientMeetingsList,
} from "../../../slices/clientMeetings/clientMeeting.slice";
```

**Update useEffect to fetch with clientId:**
```typescript
const meetingsList = useSelector(selectClientMeetingsList);

useEffect(() => {
  if (id) {
    // Use ForEdit endpoint - need clientId
    // Try to get clientId from meeting in detail store, or from list store
    let clientId = meeting?.clientId;
    if (!clientId) {
      // Check list store for the meeting
      const meetingFromList = meetingsList.find((m: any) => m.id === id);
      clientId = meetingFromList?.clientId;
    }
    
    if (clientId) {
      dispatch(fetchClientMeetingForEdit({ meetingId: id, clientId }));
    } else if (!meeting) {
      // If meeting not found anywhere, still try to fetch (API might handle missing clientId)
      dispatch(fetchClientMeetingForEdit({ meetingId: id, clientId: "" }));
    }
  }
}, [dispatch, id, meeting, meetingsList]);
```

**Update onSubmit to use ForEdit endpoint:**
```typescript
// Use ForEdit endpoint - need clientId from meeting
// Try to get clientId from meeting, or from list store
let clientId = meeting?.clientId;
if (!clientId) {
  const meetingFromList = meetingsList.find((m: any) => m.id === id);
  clientId = meetingFromList?.clientId;
}

if (!clientId) {
  showError("Client ID is required to update meeting");
  return;
}

const result = await dispatch(
  updateClientMeetingForEdit({
    meetingId: id,
    clientId,
    data: payload,
  })
);
```

### Step 3: Update MeetingView Component (`src/pages/Clients/Meeting/MeetingView.tsx`)

**Update imports:**
```typescript
import {
  fetchClientMeetingForEdit,
  deleteClientMeeting,
  selectClientMeetingById,
  selectClientMeetingDetailLoading,
  selectClientMeetingError,
  selectClientMeetingsList,
} from "../../../slices/clientMeetings/clientMeeting.slice";
```

**Update useEffect to fetch with clientId:**
```typescript
const meetingsList = useSelector(selectClientMeetingsList);

useEffect(() => {
  if (id) {
    // Use ForEdit endpoint - need clientId
    // Try to get clientId from meeting in detail store, or from list store
    let clientId = meeting?.clientId;
    if (!clientId) {
      // Check list store for the meeting
      const meetingFromList = meetingsList.find((m: any) => m.id === id);
      clientId = meetingFromList?.clientId;
    }
    
    // Only fetch if not already in store
    if (!meeting) {
      if (clientId) {
        dispatch(fetchClientMeetingForEdit({ meetingId: id, clientId }));
      } else {
        // If meeting not found anywhere, still try to fetch (API might handle missing clientId)
        dispatch(fetchClientMeetingForEdit({ meetingId: id, clientId: "" }));
      }
    }
  }
}, [dispatch, id, meeting, meetingsList]);
```

---

## ✅ Verification Checklist

After applying changes, verify:

- [ ] MeetingEdit page loads meeting data correctly
- [ ] MeetingEdit page saves changes successfully
- [ ] MeetingView page displays meeting data correctly
- [ ] No console errors
- [ ] No lint errors
- [ ] Tile view still works
- [ ] Calendar view still works
- [ ] Other meeting-related pages (Reschedule, Calendar) still work

---

## 📅 Date Created
Created: 2025-01-07

## 📝 Notes
- Old functions (`fetchClientMeetingById`, `updateClientMeeting`) are preserved for backward compatibility
- `clientId` is obtained from Redux store (detail or list) to avoid requiring route parameter changes
- Implementation maintains all existing UI/UX behavior

