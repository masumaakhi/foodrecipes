import React, { useState } from "react";
import { db } from "../firebase"; // Assuming firebase.js is in the src folder
import { collection, addDoc } from "firebase/firestore";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      // Add the email to Firestore
      await addDoc(collection(db, "subscribers"), {
        email: email,
        subscribedAt: new Date()
      });

      // Show success message
      setMessage("Thank you for subscribing!");
      
      // Clear the form
      setEmail("");
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="subscribe-container">
      <h2>Let's Stay In Touch!</h2>
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Join our newsletter, so that we reach out to you with our news and offers.</p>
      <form onSubmit={handleSubmit} className="subscribe-form">
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="subscribe-input"
        />
        <button
          type="submit"
          className="subscribe-button"
          style={{ cursor: "pointer", padding: "9px" }}
        >
          Subscribe
        </button>
      </form>
      {message && <p className="subscribe-message">{message}</p>}
    </div>
  );
};

export default SubscribeForm;
