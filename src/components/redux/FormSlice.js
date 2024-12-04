import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formName: "", 
  formFields: [], 
  isSubmitting: false,
  errors: {},
};

const FormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormName: (state, action) => {
      state.formName = action.payload; 
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
    setFormFields: (state, action) => {
      state.formFields = action.payload;
    },
    
    
    resetForm: (state) => {
      state.formName = ""; 
      state.formFields = []; 
    },
    deleteField: (state, action) => {
      const { id } = action.payload;
      state.formFields = state.formFields.filter((field) => field.id !== id);

      localStorage.setItem(
        "formsData",
        JSON.stringify({
          formName: state.formName,
          formFields: state.formFields,
        })
      );
    },
    saveForm: (state, action) => {
      const { formName, formFields } = action.payload;
      state.formName = formName;
      state.formFields = formFields;

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
  setFormFields
} = FormSlice.actions;

export default FormSlice.reducer;
