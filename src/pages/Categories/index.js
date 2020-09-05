import React from 'react';
import './styles.scss';

import CategoriesList from '../../components/CategoriesList';

const Categories = props => {
  return (
    <div className='categories'>
      <CategoriesList />
    </div>
  );
};

export default Categories;
