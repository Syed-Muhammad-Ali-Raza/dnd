import React from 'react'
import { Link } from 'react-router-dom'
import DndLayout from '../dragndrop/DndLayout'

import './Header.css'
const Header = () => {
  return (
    <div className='header-main'>

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
