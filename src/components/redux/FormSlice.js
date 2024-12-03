import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formFields: [], // Holds the forms data
  isSubmitting: false,
  errors: {},
};

const FormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addField: (state, action) => {
      const field = action.payload;
      if (!state.formFields.some((f) => f.id === field.id)) {
        state.formFields.push({
          ...field,
          value: field.initialValue || "",
          placeholder: field.placeholder || "Enter text...",
          options: field.options || [],
        });
      }
    },
    updateField: (state, action) => {
      const { id, name, value } = action.payload;
      const fieldIndex = state.formFields.findIndex((f) => f.id === id);
      if (fieldIndex !== -1) {
        state.formFields[fieldIndex][name] = value;
      }
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    resetForm: (state) => {
      state.formFields = [];
    },
    deleteField: (state, action) => {
      const { id } = action.payload;
      state.formFields = state.formFields.filter((field) => field.id !== id);

      // Sync with localStorage after deleting
      localStorage.setItem('formsData', JSON.stringify(state.formFields));
    },
  },
});

export const { addField, updateField, setSubmitting, setErrors, resetForm, deleteField } = FormSlice.actions;

export default FormSlice.reducer;
