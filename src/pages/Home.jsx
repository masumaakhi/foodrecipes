import React from 'react'
import Header from '../components/header/HeaderView'
import AddRecipes from '../components/AddRecipes'
import TrendingRecipes from '../components/TrendingRecipes'
import ExploreBlog from '../components/ExploreBlog'
import LatestRecipes from '../components/LatestRecipes'
import CategoryList from '../components/CategoryList'
import SubscribeFrom from '../components/SubscribeForm'

const Home = () => {
  return (
    <div>
        <Header />
        <AddRecipes />
        <CategoryList />
        <TrendingRecipes />
        <ExploreBlog />
        <LatestRecipes/>
        <SubscribeFrom />
        
    </div>
  )
}

export default Home