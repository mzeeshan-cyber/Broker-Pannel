import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filterValue: {},
    complaintsData: [],
    paginationData: {},
    loading: false,

};

const complaintsSlice = createSlice({
    name: "complaints",
    initialState,
    reducers: {
        paginationData: (state, action) => {
            state.paginationData = action.payload;
        },
        complaintsData: (state, action) => {
            state.complaintsData = action.payload;
        },
        updateComplaintStatus: (state, action) => {
            const { id, status } = action.payload;
            state.complaintsData = state.complaintsData.map(complaint =>
                complaint.id === id ? { ...complaint, status } : complaint
            );
        },
        deleteComplaint: (state, action) => {
            const { id } = action.payload;
            state.complaintsData = state.complaintsData.filter(
                complaint => complaint.id !== id
            );
        },
        filterValue: (state, action) => {
            state.filterValue = action.payload;
        },
        loading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { providerById, complaintsData, paginationData, updateComplaintStatus, loading, filterValue, deleteComplaint } = complaintsSlice.actions;

export default complaintsSlice.reducer;
