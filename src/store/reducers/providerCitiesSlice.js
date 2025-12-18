import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProviderCities: [],

};

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    allProviderCities: (state, action) => {
      state.allProviderCities = action.payload;
    },
    allProviderCitiesAfterDelete: (state, action) => {
      state.allProviderCities = state.allProviderCities.filter(
        item => item.id !== action.payload
      );
    },
  },
});

export const { allProviderCities, allProviderCitiesAfterDelete } = citiesSlice.actions;

export default citiesSlice.reducer;
