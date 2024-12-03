import { configureStore } from "@reduxjs/toolkit";
import FormSlice from "./FormSlice";
export const store = configureStore({
    reducer: {
      form: FormSlice,
    },
  })