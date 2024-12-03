import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   

    name:"",
    gender : "",
    email :"",
    comments : "",
    country:"",
    isSubmitting: false,
    errors: {},
};

const FormSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        updateField: (state, action) => {
            const { name, value } = action.payload;
            state[name] = value;
        },
        setSubmitting: (state, action) => {
            state.isSubmitting = action.payload;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
    },
});

export const { updateField, setSubmitting, setErrors } = FormSlice.action

export default FormSlice.reducer
