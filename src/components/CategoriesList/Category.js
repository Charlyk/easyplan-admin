import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconNext from '../../assets/icons/iconNext';

const Category = props => {
  const { isSelected, category, onSelected } = props;
  const classes = clsx('category', isSelected && 'selected');

  const handleCategoryClick = () => {
    onSelected(category);
  };

  return (
    <div className={classes} onClick={handleCategoryClick}>
      <div className='category__name'>
        {category.name} ({category.servicesCount})
      </div>
      {isSelected && <IconNext />}
    </div>
  );
};

export default Category;

Category.propTypes = {
  isSelected: PropTypes.bool,
  onSelected: PropTypes.func,
  category: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    servicesCount: PropTypes.number,
  }).isRequired,
};
