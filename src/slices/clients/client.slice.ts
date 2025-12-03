import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    initialClients,
    ClientItem,
    ClientsResponse,
} from "./client.fakeData";
import * as clientService from "../../services/clientService";

interface ClientState {
    items: ClientItem[];
    selectedClient: ClientItem | null;
    loading: boolean;
    error: string | null;
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

const initialState: ClientState = {
    items: initialClients,
    selectedClient: null,
    loading: false,
    error: null,
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0,
    totalPages: 0,
};

// Async thunk to fetch clients from API
export const fetchClients = createAsyncThunk(
    "clients/fetchClients",
    async ({
        pageNumber = 1,
        pageSize = 50,
    }: {
        pageNumber?: number;
        pageSize?: number;
    } = {}) => {
        const response: ClientsResponse = await clientService.getAllClients(
            pageNumber,
            pageSize
        );
        return response;
    }
);

// Async thunk to create a new client
export const createClient = createAsyncThunk(
    "clients/createClient",
    async (data: Partial<ClientItem>) => {
        const response = await clientService.createClient(data);
        return response;
    }
);

// Async thunk to update an existing client
export const updateClient = createAsyncThunk(
    "clients/updateClient",
    async ({ id, data }: { id: string; data: Partial<ClientItem> }) => {
        const response = await clientService.updateClient(id, data);
        return response;
    }
);

// Async thunk to delete a client
export const deleteClient = createAsyncThunk(
    "clients/deleteClient",
    async (id: string) => {
        await clientService.deleteClient(id);
        return id;
    }
);

const clientSlice = createSlice({
    name: "Clients",
    initialState,
    reducers: {
        selectClient(state, action: PayloadAction<string>) {
            state.selectedClient =
                state.items.find((c) => c.id === action.payload) || null;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch clients
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.pageNumber = action.payload.pageNumber;
                state.pageSize = action.payload.pageSize;
                state.totalCount = action.payload.totalCount;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch clients";
            })
            // Create client
            .addCase(createClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.totalCount += 1;
            })
            .addCase(createClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to create client";
            })
            // Update client
            .addCase(updateClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to update client";
            })
            // Delete client
            .addCase(deleteClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((c) => c.id !== action.payload);
                state.totalCount -= 1;
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to delete client";
            });
    },
});

export const { selectClient, clearError } = clientSlice.actions;
export default clientSlice.reducer;

// Selectors
export const selectClientList = (state: any) => state.Clients.items;
export const selectSelectedClient = (state: any) => state.Clients.selectedClient;
export const selectClientById = (state: any, id: string) =>
    state.Clients.items.find((c: ClientItem) => c.id === id);
export const selectClientLoading = (state: any) => state.Clients.loading;
export const selectClientError = (state: any) => state.Clients.error;
export const selectClientTotalCount = (state: any) => state.Clients.totalCount;
