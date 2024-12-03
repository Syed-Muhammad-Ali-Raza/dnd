import React from 'react'
import { Link } from 'react-router-dom'
import DndLayout from '../dragndrop/DndLayout'
const Header = () => {
  return (
    <div>

   <ul>
     <li>
     <a href="/customer" >
     Customer
     </a>
     </li>

     <li>
      <a href="/formBuilder">
     Form Builder
      </a>

     </li>
     <li>
      {/* <Link to ="/formBuilder">
          Form Builder
      </Link> */}
     </li>



   </ul>

    
      
    </div>
  )
}

export default Header
