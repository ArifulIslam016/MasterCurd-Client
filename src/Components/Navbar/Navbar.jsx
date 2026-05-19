import React from 'react'
import { Link } from 'react-router'

export const Navbar = () => {
  const links=<>
  <Link className='mr-2 btn btn-primary' to="/view-students">View student Info</Link>
  <Link className='mr-2 btn btn-primary' to="/add-student">Add student Info</Link>
  </>
  return (
<div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">Samart Campus</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      {links}
    </ul>
  </div>
</div>  )
}
export default Navbar