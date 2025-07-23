import { doc, deleteDoc } from "firebase/firestore";
import {db} from "../firebase";
import { useNavigate } from "react-router-dom";

function ProductRow({ item }) {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
	e.preventDefault();
    try {
      // Delete product from Firestore
      await deleteDoc(doc(db, "products", item.id));
      console.log("Product deleted successfully");
      window.location.reload(); // Reload to fetch updated data
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <tr className="product-row d-flex justify-content-around align-items-center">
      <td>
        <img src={item.image} className="product-img" alt="" />
      </td>

      <td>
        <h2>{item.title}</h2>
      </td>
      <td>
        <h2>{item.price}</h2>
      </td>
      <td>
        <img
          className="product-icon"
          alt="edit"
          onClick={() => navigate(`/admin/product-edit-form/${item.id}`)}
        />
      </td>
      <td>
        <img
          className="product-icon"
          alt="delete"
          onClick={handleDelete}
        />
      </td>
    </tr>
  );
}

export default ProductRow;
