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
        category,
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
    <div className="max-w-2xl mx-auto bg-orange-50  p-6 rounded-lg shadow-lg my-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border px-4 py-2 rounded-md" />
        </div>

        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength="500" required className="w-full border px-4 py-2 rounded-md" />
        </div>

        <div>
          <label className="block font-medium mb-2">Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full border px-4 py-2 rounded-md" />
        </div>

        <div>
          <label className="block font-medium mb-2">Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <input key={index} type="text" value={ingredient.name} onChange={(e) => handleIngredientChange(e, index)} required className="w-full border px-4 py-2 mb-2 rounded-md" placeholder={`Ingredient ${index + 1}`} />
          ))}
          <button type="button" onClick={addIngredient} className="text-sm text-blue-600">+ Add Ingredient</button>
        </div>

        <div>
          <label className="block font-medium mb-2">Instructions</label>
          {instructions.map((instruction, index) => (
            <textarea key={index} value={instruction.step} onChange={(e) => handleInstructionChange(e, index)} required className="w-full border px-4 py-2 mb-2 rounded-md" placeholder={`Step ${index + 1}`} />
          ))}
          <button type="button" onClick={addInstruction} className="text-sm text-blue-600">+ Add Step</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Prep Time (min)</label>
            <input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} required className="w-full border px-4 py-2 rounded-md" />
          </div>
          <div>
            <label className="block font-medium mb-2">Cook Time (min)</label>
            <input type="number" value={cookTime} onChange={(e) => setCookTime(e.target.value)} required className="w-full border px-4 py-2 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Servings</label>
          <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} required className="w-full border px-4 py-2 rounded-md" />
        </div>

        <div>
          <label className="block font-medium mb-2">Nutrition</label>
          {Object.keys(nutrition).map((key) => (
            <input key={key} type="text" name={key} value={nutrition[key]} onChange={handleNutritionChange} placeholder={key.charAt(0).toUpperCase() + key.slice(1)} className="w-full border px-4 py-2 mb-2 rounded-md" />
          ))}
        </div>

        <div>
          <label className="block font-medium mb-2">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
        </div>

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-semibold">Submit Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
