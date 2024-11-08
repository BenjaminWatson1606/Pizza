// StoreProvider.tsx
import React from "react";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { cartReducer, pizzaReducer } from "./reducer"; 

// Combine the reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  pizzas: pizzaReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof rootReducer>;

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
