import React, { useEffect, useRef, useState } from 'react';

import './styles.scss';
import Skeleton from '@material-ui/lab/Skeleton';

import IconEdit from '../../assets/icons/iconEdit';
import IconMoreHorizontal from '../../assets/icons/iconMoreHorizontal';
import IconPlus from '../../assets/icons/iconPlus';
import IconTrash from '../../assets/icons/iconTrash';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import ActionsSheet from '../ActionsSheet';
import Category from './Category';
import CreateCategoryModal from './CreateCategoryModal';

const actions = [
  {
    name: textForKey('Add category'),
    key: 'add-category',
    icon: <IconPlus />,
    type: 'default',
  },
  {
    name: textForKey('Edit category'),
    key: 'edit-category',
    icon: <IconEdit />,
    type: 'default',
  },
  {
    name: textForKey('Delete category'),
    key: 'Delete-category',
    icon: <IconTrash />,
    type: 'destructive',
  },
];

const CategoriesList = props => {
  const actionsAnchor = useRef(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    dataAPI
      .fetchCategories()
      .then(response => {
        if (response.isError) {
          console.error(response.message);
        } else {
          setCategories(response.data);
        }
        setIsLoading(false);
      })
      .catch(console.error);
  }, [props]);

  const renderSkeleton = () => {
    if (!isLoading) return null;
    return (
      <div>
        <div className='categories-list__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='categories-list__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='categories-list__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
      </div>
    );
  };

  const handleCategoryClick = category => {
    setSelectedCategory(category);
  };

  const handleMoreClick = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  const handleAddCategory = () => {
    setIsCreatingCategory(true);
  };

  const handleActionSelected = action => {
    switch (action.key) {
      case 'add-category':
        handleAddCategory();
        break;
      case 'edit-category':
        if (selectedCategory != null) {
          setIsEditingCategory(true);
        }
    }
    setIsActionsOpen(false);
  };

  const handleActionsClose = () => setIsActionsOpen(false);

  const handleCloseCreationModal = () => {
    isCreatingCategory && setIsCreatingCategory(false);
    isEditingCategory && setIsEditingCategory(false);
  };

  const handleCategorySave = (category, categoryName) => {
    console.log(categoryName);
    handleCloseCreationModal();
  };

  return (
    <div className='categories-list'>
      <CreateCategoryModal
        category={isEditingCategory ? selectedCategory : null}
        show={isCreatingCategory || isEditingCategory}
        onClose={handleCloseCreationModal}
        onSave={handleCategorySave}
      />

      <ActionsSheet
        onClose={handleActionsClose}
        onSelect={handleActionSelected}
        open={isActionsOpen}
        actions={actions}
        anchorEl={actionsAnchor.current}
      />

      <div className='categories-list__header'>
        List
        <div ref={actionsAnchor} onClick={handleMoreClick}>
          <IconMoreHorizontal />
        </div>
      </div>

      <div className='categories-list__categories'>
        {renderSkeleton()}
        {categories.map(category => (
          <Category
            isSelected={category.id === selectedCategory?.id}
            key={category.id}
            category={category}
            onSelected={handleCategoryClick}
          />
        ))}
      </div>

      <div className='categories-list__add' onClick={handleAddCategory}>
        <IconPlus />
        Add category
      </div>
    </div>
  );
};

export default CategoriesList;
