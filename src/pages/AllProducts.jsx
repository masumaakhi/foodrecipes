import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {db}  from "../firebase"; // Import Firestore config
import ProductRow from "../components/ProductRow";

const AllProducts = () => {
  const [data, setData] = useState([]);

  

  useEffect(() => {
    // Fetch products from Firestore
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(productsArray);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="product-section">
        <div className="product-section__heading">
          <h4>Product list in your app</h4>
        </div>

        <div className="product-table-container">
          <table>
            <tbody>
              {data.length !== 0 &&
                data.map((item) => <ProductRow key={item.id} item={item} />)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
