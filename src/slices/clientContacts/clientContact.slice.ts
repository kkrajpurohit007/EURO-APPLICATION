import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    ClientContactItem,
    ClientContactsResponse,
} from "./clientContact.fakeData";
import * as clientContactService from "../../services/clientContactService";

interface ClientContactState {
    items: ClientContactItem[];
    selectedContact: ClientContactItem | null;
    loading: boolean;
    error: string | null;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

const initialState: ClientContactState = {
    items: [],
    selectedContact: null,
    loading: false,
    error: null,
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0,
    totalPages: 0,
};

// Async thunk to fetch client contacts from API
export const fetchClientContacts = createAsyncThunk(
    "clientContacts/fetchClientContacts",
    async ({
        pageNumber = 1,
        pageSize = 50,
    }: {
        pageNumber?: number;
        pageSize?: number;
    } = {}) => {
        const response: ClientContactsResponse = await clientContactService.getAllClientContacts(
            pageNumber,
            pageSize
        );
        return response;
    }
);

// Async thunk to create a new client contact
export const createClientContact = createAsyncThunk(
    "clientContacts/createClientContact",
    async (data: Partial<ClientContactItem>) => {
        const response = await clientContactService.createClientContact(data);
        return response;
    }
);

// Async thunk to update an existing client contact
export const updateClientContact = createAsyncThunk(
    "clientContacts/updateClientContact",
    async ({ id, data }: { id: string; data: Partial<ClientContactItem> }) => {
        const response = await clientContactService.updateClientContact(id, data);
        return response;
    }
);

// Async thunk to delete a client contact
export const deleteClientContact = createAsyncThunk(
    "clientContacts/deleteClientContact",
    async (id: string) => {
        await clientContactService.deleteClientContact(id);
        return id;
    }
);

const clientContactSlice = createSlice({
    name: "ClientContacts",
    initialState,
    reducers: {
        selectClientContact(state, action: PayloadAction<string>) {
            state.selectedContact =
                state.items.find((c) => c.id === action.payload) || null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch client contacts
            .addCase(fetchClientContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.pageNumber = action.payload.pageNumber;
                state.pageSize = action.payload.pageSize;
                state.totalCount = action.payload.totalCount;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchClientContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch client contacts";
            })
            // Create client contact
            .addCase(createClientContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClientContact.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.totalCount += 1;
            })
            .addCase(createClientContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create client contact";
            })
            // Update client contact
            .addCase(updateClientContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClientContact.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateClientContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update client contact";
            })
            // Delete client contact
            .addCase(deleteClientContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClientContact.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((c) => c.id !== action.payload);
                state.totalCount -= 1;
            })
            .addCase(deleteClientContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete client contact";
            });
    },
});

export const { selectClientContact, clearError } = clientContactSlice.actions;
export default clientContactSlice.reducer;

// Selectors
export const selectClientContactList = (state: any) => state.ClientContacts.items;
export const selectSelectedClientContact = (state: any) => state.ClientContacts.selectedContact;
export const selectClientContactById = (state: any, id: string) =>
    state.ClientContacts.items.find((c: ClientContactItem) => c.id === id);
export const selectClientContactLoading = (state: any) => state.ClientContacts.loading;
export const selectClientContactError = (state: any) => state.ClientContacts.error;
export const selectClientContactTotalCount = (state: any) => state.ClientContacts.totalCount;
