import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import HeaderView from './HeaderView';

const HeaderContainer = () => {
  const [topRecipe, setTopRecipe] = useState(null);

  useEffect(() => {
    const fetchTopRecipe = async () => {
      try {
        const q = query(collection(db, 'recipes'), orderBy('views', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setTopRecipe({ id: doc.id, ...doc.data() });
        }
      } catch (err) {
        console.error('Error fetching most visited recipe:', err);
      }
    };

    fetchTopRecipe();
  }, []);

  return <HeaderView recipe={topRecipe} />;
};

export default HeaderContainer;
