import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AddRecipe = () => {
  const [ingredients, setIngredients] = useState([{ name: '' }]);
  const [instructions, setInstructions] = useState([{ step: '' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [image, setImage] = useState(null);
  const [nutrition, setNutrition] = useState({
    calories: '',
    fat: '',
    protein: '',
    carbs: '',
    sugar: '',
  });
  const [category, setCategory] = useState('');
  const [latestRecipes, setLatestRecipes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLatestRecipes(recipes);
    });
    return () => unsubscribe();
  }, []);

  const addIngredient = () => setIngredients([...ingredients, { name: '' }]);
  const handleIngredientChange = (e, index) => {
    const updatedIngredients = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, name: e.target.value } : ingredient
    );
    setIngredients(updatedIngredients);
  };

  const addInstruction = () => setInstructions([...instructions, { step: '' }]);
  const handleInstructionChange = (e, index) => {
    const updatedInstructions = instructions.map((instruction, i) =>
      i === index ? { ...instruction, step: e.target.value } : instruction
    );
    setInstructions(updatedInstructions);
  };

  const handleNutritionChange = (e) => {
    setNutrition({ ...nutrition, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadImageUrl = '';

    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Error uploading image:', error);
          alert('Failed to upload image');
        },
        async () => {
          uploadImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await saveRecipe(uploadImageUrl);
        }
      );
    } else {
      await saveRecipe('');
    }
  };

  const saveRecipe = async (imageUrl) => {
    try {
      const newRecipe = {
        title,
        description,
        prepTime,
        cookTime,
        servings,
        ingredients,
        instructions,
        imageUrl,
        nutrition,
        category, // Save the input category
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'recipes'), newRecipe);
      resetForm();
      alert('Recipe added successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add the recipe');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrepTime('');
    setCookTime('');
    setServings('');
    setIngredients([{ name: '' }]);
    setInstructions([{ step: '' }]);
    setImage(null);
    setCategory('');
    setNutrition({
      calories: '',
      fat: '',
      protein: '',
      carbs: '',
      sugar: '',
    });
    document.querySelector('input[type="file"]').value = '';
  };

  return (
    <div className="recipe-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipe Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter recipe title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your recipe"
            maxLength="500"
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            required
          />
        </div>

        <div className="form-group">
          <label>Ingredients:</label>
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Enter ingredient"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(e, index)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addIngredient}>Add Ingredient</button>
        </div>

        <div className="form-group">
          <label>Instructions:</label>
          {instructions.map((instruction, index) => (
            <div key={index}>
              <textarea
                placeholder={`Step ${index + 1}`}
                value={instruction.step}
                onChange={(e) => handleInstructionChange(e, index)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addInstruction}>Add Instruction</button>
        </div>

        <div className="form-group">
          <label>Prep Time (Minutes):</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="Enter prep time"
            required
          />
        </div>

        <div className="form-group">
          <label>Cook Time (Minutes):</label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="Enter cook time"
            required
          />
        </div>

        <div className="form-group">
          <label>Servings:</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="Number of servings"
            required
          />
        </div>

        <div className="form-group">
          <label>Nutrition Information:</label>
          <input
            type="text"
            name="calories"
            value={nutrition.calories}
            onChange={handleNutritionChange}
            placeholder="Calories"
          />
          <input
            type="text"
            name="fat"
            value={nutrition.fat}
            onChange={handleNutritionChange}
            placeholder="Total Fat"
          />
          <input
            type="text"
            name="protein"
            value={nutrition.protein}
            onChange={handleNutritionChange}
            placeholder="Protein"
          />
          <input
            type="text"
            name="carbs"
            value={nutrition.carbs}
            onChange={handleNutritionChange}
            placeholder="Carbohydrates"
          />
          <input
            type="text"
            name="sugar"
            value={nutrition.sugar}
            onChange={handleNutritionChange}
            placeholder="Sugar"
          />
        </div>

        <div className="form-group">
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
