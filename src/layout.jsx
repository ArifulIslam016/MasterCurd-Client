
import './App.css'
import { Outlet } from 'react-router'
import Footer from './Components/Footer/Footer'
import Navbar from './Components/Navbar/Navbar'

function Layout() {

  return (
    <div className='flex flex-col min-h-screen '>
      <Navbar></Navbar>
      <main className='flex-grow max-w-7xl mx-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
