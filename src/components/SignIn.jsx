
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // React Icons for show/hide

const SignIn = () => {
  const auth = getAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const googleAuthProvider = new GoogleAuthProvider();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  

  const onSubmit = (data) => {
    setAuthError("");
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        console.log("User signed in!");
        alert("Login successful!");
        reset();
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/user-not-found") {
          setAuthError("No account found with this email. Please sign up first.");
        } else if (error.code === "auth/wrong-password") {
          setAuthError("Incorrect password. Please try again.");
        } else {
          setAuthError("An error occurred. Please try again.");
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


    const handleGoogleSignIn = async () => {
      try {
        const result = await signInWithPopup(auth, googleAuthProvider);
        const user = result.user;
  
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
          role: "customer",
        });
        
        toast.success("Google signin successful!");

        navigate("/");
      } catch (error) {
        console.error("Google Sign-In error:", error);
        toast.warning("Google signin failed: " + error.message);
      }
    };
  
const inputStyle = "w-full px-4 py-2 bg-slate-300 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400";
  return (
    <div className="max-w-md mx-auto my-[5rem] p-6  bg-opacity-70 backdrop-blur rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Sign In to Flavors & Feasts
      </h2>

      {authError && (
        <p className="text-red-600 text-center text-sm mb-4">{authError}</p>
      )}
        <button
        onClick={handleGoogleSignIn}
        className="mt-6 w-full bg-blue-400 hover:bg-blue-300 text-white text-center py-2 mb-2 rounded-md  text-xl font-medium"
      >
        Sign In with Google
      </button>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-50">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={inputStyle}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-50">Password</label>
          <div className="flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={inputStyle}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-900"
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs">{errors.password.message}</p>
          )}
        </div>

        <p className="text-center text-sm">
          <Link to="/forgotpassword" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </p>

        <button
          type="submit"
          className="bg-blue-300 hover:bg-blue-200  text-gray-50 py-2 rounded text-md font-medium"
        >
          Sign In
        </button>
      </form>
            <p className="text-center mt-4 text-sm text-gray-50">
        Don't have an account?{" "}
        <a href="/signup" className="text-orange-500 hover:underline">
          Sign up here
        </a>
      </p>
    </div>
  );
};

export default SignIn;