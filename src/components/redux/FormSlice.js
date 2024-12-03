import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formName: "", // Holds the name of the form
  formFields: [], // Holds the form's data
  isSubmitting: false,
  errors: {},
};

const FormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormName: (state, action) => {
      state.formName = action.payload; // Set the form name
    },
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
      state.formName = ""; // Reset form name
      state.formFields = []; // Reset fields
    },
    deleteField: (state, action) => {
      const { id } = action.payload;
      state.formFields = state.formFields.filter((field) => field.id !== id);

      // Sync with localStorage after deleting
      localStorage.setItem(
        "formsData",
        JSON.stringify({
          formName: state.formName,
          formFields: state.formFields,
        })
      );
    },
    saveForm: (state, action) => {
      // This reducer can handle form saving with a name
      const { formName, formFields } = action.payload;
      state.formName = formName;
      state.formFields = formFields;

      // Save the entire form (including name) to localStorage
      localStorage.setItem(
        "formsData",
        JSON.stringify({
          formName: state.formName,
          formFields: state.formFields,
        })
      );
    },
  },
});

export const {
  setFormName,
  addField,
  updateField,
  setSubmitting,
  setErrors,
  resetForm,
  deleteField,
  saveForm,
} = FormSlice.actions;

export default FormSlice.reducer;
