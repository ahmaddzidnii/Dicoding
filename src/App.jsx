import React, { useEffect, useState } from 'react'
import {BrowserRouter, Routes ,Route} from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.css'

import data from './data.json'
import CheckId from './Pages/CheckId'
import NavbarComponent from './Components/NavbarComponents'


const App = () => {

  return (
    <div>
      <BrowserRouter>
            <NavbarComponent/>
        <Routes>
          <Route path ='/' element ={<CheckId/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App