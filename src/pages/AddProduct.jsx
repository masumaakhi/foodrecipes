import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firestore config

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add a new product to Firestore
      await addDoc(collection(db, "products"), {
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
      });

      // Clear the form
      setProduct({
        title: "",
        price: "",
        image: "",
        description: "",
      });

      // Set success message
      setSuccessMessage("Product added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onSubmit={handleSubmit}
      >
        <p>Title:</p>
        <input
          value={product.title}
          onChange={handleChange}
          name="title"
          style={{
            display: "block",
            width: "80%",
            color: "red",
            border: "1px solid black",
          }}
          required
        />
        <br />
        <p>Price:</p>
        <input
          value={product.price}
          onChange={handleChange}
          name="price"
          style={{
            display: "block",
            width: "80%",
            color: "red",
            border: "1px solid black",
          }}
          type="number"
          required
        />
        <br />
        <p>Description:</p>
        <input
          value={product.description}
          onChange={handleChange}
          name="description"
          style={{
            display: "block",
            width: "80%",
            color: "red",
            border: "1px solid black",
          }}
          type="text"
          required
        />
        <br />
        <p>Image URL:</p>
        <input
          value={product.image}
          onChange={handleChange}
          name="image"
          style={{
            display: "block",
            width: "80%",
            color: "red",
            border: "1px solid black",
          }}
          type="text"
        />
        <br />
        <input
          type="submit"
          value="Add Product"
          style={{ border: "1px solid black", marginTop: "10px", padding: "10px" }}
        />
      </form>

      {/* Success message */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </>
  );
};

export default AddProduct;
