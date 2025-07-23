import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firestore config
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const EditProduct = () => {
  const { id } = useParams(); // Get product id from the URL
  const navigate = useNavigate(); // For navigating to other pages
  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data()); // Set product data in form
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update product in Firestore
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
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
      setSuccessMessage("Product updated successfully!");

      // Clear success message after 3 seconds and navigate to AllProduct page
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin/allproducts"); // Navigate to the AllProduct page
      }, 3000); // Delay of 3 seconds to show the message
    } catch (error) {
      console.error("Error updating product: ", error);
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
          value="Update Product"
          style={{ border: "1px solid black", marginTop: "10px", padding: "10px" }}
        />
      </form>

      {/* Success message */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </>
  );
};

export default EditProduct;
