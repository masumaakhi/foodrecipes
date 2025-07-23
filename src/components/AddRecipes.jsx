import React from 'react'
import recipespic from '../assets/product/f8.jpg'
import { Link } from 'react-router-dom'

const AddRecipes = () => {
  return (
    <div className='addrecipes'>
      <div className='recipespic'>
        <img src={recipespic} alt="e" />
      </div>
      <div className='recipedetails'>
        <h2>Share Your Recipes</h2>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis, eum. Quia dignissimos, nihil vel consequuntur reprehenderit quo, maxime architecto quod, cumque laboriosam necessitatibus tempore!</p>
        <button><Link to="/addrecipes">Add Recipe</Link></button>
      </div>
    </div>
  )
}

export default AddRecipes
