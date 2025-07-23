import React from 'react'
import disimg from '../assets/product/f4.jpg'
// import bcimg from '../assets/banner/b1.png'

const Header = () => {
  return (
    <div className='header'>
      <div className="left">
            <h2>Your Daily Dish <br /> A Food Jounery</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, modi ex. Quis voluptatem, est doloremque praesentium nulla perspiciatis neque ad molestiae natus. Inventore maiores expedita dolor accusantium ipsam voluptatum! Enim.</p>
      </div>
      <div className="right">
            <div className="bcimg">
                {/* <img src={bcimg} alt="d" /> */}
                <div className="img1">
                    {/* <img src={disimg} alt="di"  /> */}
                </div>
            </div>
      </div>
    </div>
  )
}

export default Header
