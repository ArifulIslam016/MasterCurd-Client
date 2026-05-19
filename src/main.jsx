import {  StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Layout from './layout'
import addStudent from './Pages/addStudent'
import ViewStudentsPage from './Pages/ViewStudent'
const router=createBrowserRouter([
  { path:'/',
   Component:Layout,
  children:[
    { path:'/',element:<h1>Home</h1> },
    { path:'/add-student',Component:addStudent},
    {path:'/view-students',Component:ViewStudentsPage}
  ]
}]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
