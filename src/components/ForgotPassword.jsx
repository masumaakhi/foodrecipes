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
      url: "http://localhost:3001/signin", // ✅ change this to your production domain
      handleCodeInApp: false, // Firebase default page will handle the reset
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
    <div className="reset-container" style={styles.container}>
      <h2 style={styles.heading}>Reset Your Password</h2>
      {serverMessage && <p style={styles.message}>{serverMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            style={styles.input}
          />
          {errors.email && <p style={styles.error}>{errors.email.message}</p>}
        </div>

        <button type="submit" style={styles.button}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#ff5722",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "12px",
  },
  message: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#555",
    fontSize: "14px",
  },
};

export default ForgotPassword;
