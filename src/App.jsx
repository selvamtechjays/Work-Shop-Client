import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/pages/langingPage/landingPage'
import SignupPage from './components/pages/langingPage/signupPage'
import NavbarLinks from './components/pages/langingPage/navLinks'
import Dashboard from './components/Dashboard/Dashboard'
import { ToastContainer } from 'react-toastify'
import Scoreboard from './components/Dashboard/scoreBoard'


export default function App() {
  return (
    <div className='app'>
       <ToastContainer/>
     
      <nav>
        <NavbarLinks />
      </nav>
      
     <Routes>
       {/* Landing page route */}
     <Route path='/' element={<LandingPage/>}/>
       
 {/* signup route path */}
       <Route path='/signup' element={<SignupPage/>}/>

       <Route path='/dashboard' element={<Dashboard/>}/>

{/* score board route */}
        <Route path='/scoreboard' element={<Scoreboard/>}/>
       
     </Routes>
    </div>
  )
}
