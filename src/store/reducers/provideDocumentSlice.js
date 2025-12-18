import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  providerDocumentData:[],
  providerDocumentPaginationData:{},
  loading: false,

};

const providerDocumentSlice = createSlice({
  name: "provider_document",
  initialState,
  reducers: {
    providerDocumentPaginationData: (state, action) => {
      state.providerDocumentPaginationData = action.payload;
    },
    providerDocumentData: (state, action) => {
      state.providerDocumentData = action.payload;
    },
    updateDocumentProviderStatus: (state, action) => {
      const { id, status } = action.payload;
      state.providerDocumentData = state.providerDocumentData.map(provider =>
        provider.id === id ? { ...provider, status } : provider
      );
    },
    loading: (state, action) => {
        state.loading = action.payload;
      },  
  },
});

export const {providerDocumentData, providerDocumentPaginationData, updateDocumentProviderStatus, loading } = providerDocumentSlice.actions;

export default providerDocumentSlice.reducer;
