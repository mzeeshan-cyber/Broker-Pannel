import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import patientReducer from "./patientSlice"
import driverReducer from "./driverSlice"
import payeeReducer from "./payeeSlice"
import providerReducer from "./providerSlice"
import providerDocumentReducer from "./provideDocumentSlice"
import providerDriverReducer from "./providerDriversSlice"
import ratelistReducer from "./ratelistSlice"
import reimbursementTripReducer from "./reimbursementTripSlice"
import tripsReducer from "./tripsSlice"
import citiesReduces from "./providerCitiesSlice"
import tripsInvoicesReducers from "./tripsInvoicesSlice"
import complaintsSliceReducers from "./complaintsSlide"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage for web

// Persist config
const persistConfig = {
  key: "auth", // Key for storing data
  storage, // Storage type (localStorage)
};

// Wrap the auth reducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use persisted reducer
    patient: patientReducer,
    driver: driverReducer,
    payee: payeeReducer,
    provider: providerReducer,
    providerDocument: providerDocumentReducer,
    providerDriver: providerDriverReducer,
    rateList: ratelistReducer,
    reimmbursementTrip: reimbursementTripReducer,
    trips: tripsReducer,
    cities: citiesReduces,
    tripsInvoices: tripsInvoicesReducers,
    complaints: complaintsSliceReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoids warnings with non-serializable values
    }),
});

export const persistor = persistStore(store); // Create persistor
export default store;