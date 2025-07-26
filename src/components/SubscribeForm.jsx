import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      await addDoc(collection(db, "subscribers"), {
        email: email,
        subscribedAt: new Date()
      });

      setMessage("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#f7f4f3] text-center py-20 px-4">
      <h2 className="text-4xl font-semibold text-gray-800 mb-4">Let's Stay In Touch!</h2>
      <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6">
        Join our newsletter, so that we reach out to you with our news and offers.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row justify-center items-center gap-4"
      >
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full md:w-[400px] px-4 py-2 border border-black rounded-md focus:outline-none"
        />
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-md  hover:text-black border  transition duration-300"
        >
          Subscribe
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default SubscribeForm;
