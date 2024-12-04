import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import  './index.css'
import Header from './components/navbar/Header';
import CustomerList from './components/customers/CustomerList';
import DndLayout from './components/dragndrop/DndLayout';
function App() {
  return (
<>

        <Header/>
        <BrowserRouter>
      <Routes>
        <Route path="/customer" element={<CustomerList />}/>
        <Route path ="/formBuilder/:formId?" element={<DndLayout />}/>
       
     
      </Routes>
    </BrowserRouter>
</>
  );
}

export default App;
