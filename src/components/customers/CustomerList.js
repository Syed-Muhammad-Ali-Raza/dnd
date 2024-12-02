import React from 'react';
import customerData from '../redux/data/CustomerData.json'

function CustomerList() {
  const { customerArr } = customerData; // Destructure the customer array from JSON

  return (
    <div className="customer-list">
      <h1>Customer List</h1>
      {customerArr.map((customer) => (
        <div className="customer-card" key={customer.id}>
          <h2>{customer.name}</h2>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone}</p>
          <p>Address: {customer.address}</p>
        </div>
      ))}
    </div>
  );
}

export default CustomerList;
