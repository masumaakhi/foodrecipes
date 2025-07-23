import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { app } from "../firebase";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Signup = () => {
  const auth = getAuth();
  const googleAuthProvider = new GoogleAuthProvider();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  
  const navigate = useNavigate(); // Initialize navigate hook
  const [data, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInput = (event) => {
    const newInput = { [event.target.name]: event.target.value };
    setData({ ...data, ...newInput });
  };

  const onSubmit = (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      // Handle signup logic
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    
    // Clear form data after successful signup
    console.log(data);
    alert("Signup successful!");
    reset();
    navigate('/'); // Redirect to home page after successful signup
  };

  // Toggling password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Watching password and confirm password for matching validation
  const password = watch("password");

  // Google Sign-In
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    //   alert("Signup successful!");
    // reset();
    navigate('/');
    // Redirect to home page after successful signup
    // Clear form data after successful signup
  
  };

  return (
    <div className="signup-container" style={styles.container}>
      <h2 style={styles.heading}>Sign Up for Flavors & Feasts</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            style={styles.input}
          />
          {errors.name && <p style={styles.error}>{errors.name.message}</p>}
        </div>

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

        <div style={styles.formGroup}>
          <label>Confirm Password</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              style={styles.input}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              style={styles.toggleButton}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p style={styles.error}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" style={styles.button}>
          Sign Up
        </button>
      </form>

      <p style={styles.signInText}>
        Already have an account? <a href="/signin">Sign in here</a>
      </p>

      <button onClick={handleGoogleSignIn} style={styles.googleButton}>
        Sign Up with Google
      </button>
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
    marginTop: "10px",
  },
  error: {
    color: "red",
    fontSize: "12px",
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
  signInText: {
    textAlign: "center",
    marginTop: "20px",
  },
  googleButton: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#4285F4",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
    display: "block",
    width: "100%",
  },
};

export default Signup;
