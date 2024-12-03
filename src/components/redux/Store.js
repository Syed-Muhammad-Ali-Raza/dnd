import { configureStore } from "@reduxjs/toolkit";
import FormSlice from "./FormSlice";
export const Store = configureStore({
    reducer: {
      form: FormSlice,
    },
  })