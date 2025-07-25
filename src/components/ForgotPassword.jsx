import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setServerMessage("");

    const actionCodeSettings = {
      url: "https://foodrecipeesa.netlify.app/signin", // Update this to production if needed
      handleCodeInApp: false,
    };

    try {
      await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
      setServerMessage("✅ Reset link sent! Please check your email.");
      reset();
      setTimeout(() => navigate("/signin"), 3000);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        setServerMessage("❌ No user found with this email.");
      } else if (error.code === "auth/invalid-email") {
        setServerMessage("❌ Invalid email address.");
      } else {
        setServerMessage("❌ Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-[5rem] p-6  bg-opacity-70 backdrop-blur rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Reset Your Password
      </h2>

      {serverMessage && (
        <p className="text-center text-sm mb-4 text-gray-700">{serverMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-2 bg-slate-300 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-800 text-white py-2 rounded font-semibold transition-colors"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
