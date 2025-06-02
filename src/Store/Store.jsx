import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { pickupLocationReducer, locationReducer, branchReducer, bannerReducer, categoriesReducer, checkOutDetailsReducer, newPassReducer, orderReducer, ordersReducer, otpCodeReducer, productsCardReducer, productsDiscountFilterReducer, productsDiscountReducer, productsFilterReducer, productsReducer, signUpTypeReducer, taxTypeReducer, totalPriceReducer, userReducer, languageReducer } from "./CreateSlices";
import { combineReducers } from 'redux';
import { thunk } from "redux-thunk";

const reducers = combineReducers({
       user: userReducer,
       signUpType: signUpTypeReducer,
       otp: otpCodeReducer,
       newPass: newPassReducer,
       checkOutDetails: checkOutDetailsReducer,

       taxType: taxTypeReducer,
       products: productsReducer,
       categories: categoriesReducer,

       productsCard: productsCardReducer,

       order: orderReducer,
       totalPrice: totalPriceReducer,

       banner: bannerReducer,
       branch: branchReducer,
       location: locationReducer,
       language: languageReducer,

       productsFilter: productsFilterReducer,
       productsDiscount: productsDiscountReducer,
       productsDiscountFilter: productsDiscountFilterReducer,

       pickupLocation: pickupLocationReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: JSON.parse(localStorage.getItem('whitelist') || '["user", "email", "otp", "newPass", "productsCard", "order", "totalPrice", "pickupLocation", "language", "location", "checkOutDetails", "branch", "productsFilter", "taxType", "products", "categories"]')
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const StoreApp = configureStore({
       reducer: persistedReducer,
       middleware: (getDefaultMiddleware) =>
              getDefaultMiddleware({
                     serializableCheck: false,
                     immutableCheck: false,
              }).concat(thunk), // Add thunk middleware
});

export const persistor = persistStore(StoreApp);
