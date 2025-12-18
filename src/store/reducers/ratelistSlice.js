import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rateLists: [],
};

const ratelistSlice = createSlice({
  name: "ratelist",
  initialState,
  reducers: {
    rateListData: (state, action) => {
      state.rateLists = action.payload;
    },
    updateRateListStatus: (state, action) => {
      const { id, status, broker_notes } = action.payload;

      state.rateLists = state.rateLists.map((ratelist) => {
        return {
          ...ratelist,
          rates: ratelist.rates.map((rate) =>
            rate.id === id ? { ...rate, status, broker_notes } : rate
          ),
        };
      });
    },
    updateRateListStatusBulk: (state, action) => {
      const { ids } = action.payload;

      state.rateLists = state.rateLists.map((ratelist) => {
        const updatedRates = ratelist.rates.map((rate) => {
          const canUpdate =
            ids.includes(rate.id) && rate.status === "pending";

          return canUpdate
            ? { ...rate, status: "approved" }
            : rate;
        });

        return {
          ...ratelist,
          rates: updatedRates,
        };
      });
    },
  },
});

export const { rateListData, updateRateListStatus, updateRateListStatusBulk } = ratelistSlice.actions;
export default ratelistSlice.reducer;
