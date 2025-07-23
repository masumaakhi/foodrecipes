import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Import useNavigate

const SignIn = () => {
  const auth = getAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(""); // State to hold authentication error message

  // Submit function
  const onSubmit = (data) => {
    setAuthError(""); // Clear any previous error messages

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        console.log("User signed in!");
        alert("Login successful!");
        reset(); // Clear form after successful login
        navigate('/'); // Redirect to the home page
      })
      .catch((error) => {
        console.log(error);
        // Handle errors
        if (error.code === "auth/user-not-found") {
          setAuthError("No account found with this email. Please sign up first.");
        } else if (error.code === "auth/wrong-password") {
          setAuthError("Incorrect password. Please try again.");
        } else {
          setAuthError("An error occurred. Please try again.");
        }
      });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin-container" style={styles.container}>
      <h2 style={styles.heading}>Sign In to Flavors & Feasts</h2>
      {authError && <p style={styles.errorMessage}>{authError}</p>} {/* Show error message */}
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

        <div style={styles.formGroup}>
          <label>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              style={styles.input}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={styles.toggleButton}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p style={styles.error}>{errors.password.message}</p>
          )}
        </div>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
  <Link to="/forgotpassword" style={{ color: "#007bff", textDecoration: "none" }}>
    Forgot Password?
  </Link>
</p>

        <button type="submit" style={styles.button}>
          Sign In
        </button>
      </form>
    </div>
  );
};

// Inline styles for the form
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
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
    textAlign: "center",
  },
  passwordWrapper: {
    display: "flex",
    alignItems: "center",
  },
  toggleButton: {
    marginLeft: "10px",
    padding: "5px",
    backgroundColor: "#ccc",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default SignIn;
