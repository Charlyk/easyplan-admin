import React, { useState } from 'react';
import './styles.scss';

import CategoriesList from '../../components/CategoriesList';
import LeftSideModal from '../../components/LeftSideModal';
import Services from '../../components/Services';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <div className='categories'>
      <LeftSideModal />
      <CategoriesList onCategorySelect={setSelectedCategory} />
      <Services category={selectedCategory} />
    </div>
  );
};

export default Categories;
