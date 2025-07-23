import React from 'react'
import logo from '../assets/logo513.svg'
import { Link } from 'react-router-dom'
import './Nav.css'
import User from './User'

const Nav = () => {
  return (
    <div className='nav'>
    <Link to= "/"><img src={logo}  alt="logo" style={{width: "100px", height: "100px"}}/></Link>
    <div className="linkNav">
    <Link to= "/">Home</Link>
    <Link to= "/recipes">Recipes</Link>
    <Link to= "/about">About</Link>
    <Link to= "/blog">Blog</Link>
    <Link to= "/admin/addblog">Add Blog</Link>
    {/* <Link to= "/admin/allproducts">All Products</Link>
    <Link to= "/videolist">Video</Link>
    <Link to= "/addvideo">Add Video</Link> */}
    {/* {<Link to= "/signup">Sign Up</Link>} */}
    <div><User /></div>
    {/* <button><Link to="/signin">Log In</Link></button>
    <button><Link to= "/signup">Sign Up</Link></button> */}
    </div>
    </div>
  )
}

export default Nav;