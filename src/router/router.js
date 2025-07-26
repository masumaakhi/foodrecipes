import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Recipes from "../pages/Recipes";
import About from "../pages/About";
import Blog from "../pages/Blog";
import Signup from "../components/Registion";
import SignIn from "../components/SignIn";
import UserProfile from "../components/UserProfile";
import MyAccount from "../components/MyAccount";
// import AddProduct from "../pages/AddProduct";
import AllProducts from "../pages/AllProducts";
import EditProduct from "../pages/EditProduct";
import AddRecipe from "../pages/AddRecipe";
import RecipeDetails from "../components/RecipeDetails";
import AddBlog from "../pages/AddBlog";
import BlogDetails from "../components/BlogDetails";
import VideoList from "../pages/VideoList";
import VideoDetails from "../components/VideoDetails";
import AddVideo from "../pages/AddVideo";
// import CategoryDetail from "../components/CategoryDetails";
import AllCategories from "../components/AllCategory";
import CategoryRecipes from "../components/CategoryRecipes";
import ForgotPassword from "../components/ForgotPassword";



                

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                index: true,
                element: <Home />
            },
            {path: "/recipes", element: <Recipes />},
            {path: "/about", element: <About />},
            {path: "/blog", element: <Blog />},
            {path: "/signup", element: <Signup />},
            {path: "/signin", element: <SignIn />},
            {path: "/userprofile", element: <UserProfile />},
            {path: "/myaccount", element: <MyAccount />},
            {path: "/admin/addblog", element: <AddBlog />},
            {path: "/admin/allproducts", element: <AllProducts />},
            {path: "/admin/product-edit-form/:id", element: <EditProduct />},
            {path: "/addrecipes", element: <AddRecipe />},
            {path: "/recipe/:id", element: <RecipeDetails />},
            {path: "/blog/:id", element: <BlogDetails />},
            {path: "/videolist", element: <VideoList />},
            {path: "/video/:videoId", element: <VideoDetails />},
            {path: "/addvideo", element: <AddVideo />},
            {path: "allcategory", element: <AllCategories />},
            {path: "/category/:categoryName", element: <CategoryRecipes />},
            { path: "/forgotpassword", element: <ForgotPassword />}
           


        ]
    }
])