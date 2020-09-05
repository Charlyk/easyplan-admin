import React, { useState } from 'react';
import './styles.scss';

import CategoriesList from '../../components/CategoriesList';
import Services from '../../components/Services';

const Categories = props => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <div className='categories'>
      <CategoriesList onCategorySelect={setSelectedCategory} />
      <Services category={selectedCategory} />
    </div>
  );
};

export default Categories;
