import { configureStore,combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";

const rootReducer= combineReducers({
    auth:authSlice
});

export  const store=configureStore({
    reducer: rootReducer,
});