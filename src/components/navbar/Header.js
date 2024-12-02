import React from 'react'
import { Link } from 'react-router-dom'
import DndLayout from '../dragndrop/DndLayout'
const Header = () => {
  return (
    <div>

   <ul>
     <li>
      {/* <Link to ="/">
          Customer
      </Link>
     </li>
     <li>
      <Link to ="/formBuilder">
          Form Builder
      </Link> */}
     </li>



   </ul>

        <DndLayout/>
      
    </div>
  )
}

export default Header
