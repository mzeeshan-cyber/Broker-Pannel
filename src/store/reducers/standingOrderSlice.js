import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filterValue: {},
    standingOrderData: [],
    deletedData: [],
    paginationData: {},
    loading: false,

};

const standingOrderSlice = createSlice({
    name: "standing-order",
    initialState,
    reducers: {
        paginationData: (state, action) => {
            state.paginationData = action.payload;
        },
        standingOrderData: (state, action) => {
            state.standingOrderData = action.payload;
        },
        updateStandingOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            state.standingOrderData = state.standingOrderData.map(sa =>
                sa.id === id ? { ...sa, status } : sa
            );
        },
        deleteStandingOrder: (state, action) => {
            const { id } = action.payload;
            state.standingOrderData = state.standingOrderData.filter(
                sa => sa.id !== id
            );
        },
        filterValue: (state, action) => {
            state.filterValue = action.payload;
        },
        loading: (state, action) => {
            state.loading = action.payload;
        },
        deletedData: (state, action) => {
            state.deletedData = action.payload;
        },
        restoreData: (state, action) => {
            state.deletedData = state.deletedData.filter(
                item => item.id !== action.payload
            );
        },
        restoreMultipleData: (state, action) => {
            state.deletedData = state.deletedData.filter(
                item => !action.payload.includes(String(item.id))
            );
        },
    },
});

export const { standingOrderData, paginationData, updateStandingOrderStatus, loading, filterValue, deleteStandingOrder, deletedData, restoreData, restoreMultipleData } = standingOrderSlice.actions;

export default standingOrderSlice.reducer;
