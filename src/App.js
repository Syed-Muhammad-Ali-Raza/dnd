import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import  './index.css'
import Header from './components/navbar/Header';
import CustomerList from './components/customers/CustomerList';
import DndLayout from './components/dragndrop/DndLayout';
import EditCustomer from './components/customers/EditCustomer';
function App() {
  return (
<>

        <Header/>
        <BrowserRouter>
      <Routes>
        <Route path="/customer" element={<CustomerList />}/>
        <Route path ="/formBuilder/:formId?" element={<DndLayout />}/>
        <Route path="/edit/:formId" element={<EditCustomer />} />
       
     
      </Routes>
    </BrowserRouter>
</>
  );
}

export default App;
