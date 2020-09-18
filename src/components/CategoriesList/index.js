import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import './styles.scss';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSelector } from 'react-redux';

import IconEdit from '../../assets/icons/iconEdit';
import IconMoreHorizontal from '../../assets/icons/iconMoreHorizontal';
import IconPlus from '../../assets/icons/iconPlus';
import IconTrash from '../../assets/icons/iconTrash';
import { updateCategoriesSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import ActionsSheet from '../ActionsSheet';
import ConfirmationModal from '../ConfirmationModal';
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
    key: 'delete-category',
    icon: <IconTrash />,
    type: 'destructive',
  },
];

const CategoriesList = props => {
  const { onCategorySelect } = props;
  const updateCategories = useSelector(updateCategoriesSelector);
  const actionsAnchor = useRef(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [props, updateCategories]);

  const fetchCategories = () => {
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
  };

  const renderSkeleton = () => {
    if (!isLoading || categories.length > 0) return null;
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
    onCategorySelect(category);
  };

  const handleMoreClick = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  const handleAddCategory = () => {
    setIsCreatingCategory(true);
  };

  const showDeleteConfirmation = () => {
    setIsDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setIsDeleteConfirmation(false);
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
        break;
      case 'delete-category':
        if (selectedCategory != null) {
          showDeleteConfirmation();
        }
        break;
      default:
        break;
    }
    setIsActionsOpen(false);
  };

  const handleActionsClose = () => setIsActionsOpen(false);

  const handleCloseCreationModal = () => {
    isCreatingCategory && setIsCreatingCategory(false);
    isEditingCategory && setIsEditingCategory(false);
  };

  const handleCategorySave = () => {
    handleCloseCreationModal();
    fetchCategories();
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    dataAPI
      .deleteCategory(selectedCategory.id)
      .then(() => {
        fetchCategories();
        setIsDeleteConfirmation(false);
        setIsDeleting(false);
        setSelectedCategory(null);
        onCategorySelect(null);
      })
      .catch(error => {
        console.error(error);
        setIsDeleting(false);
      });
  };

  return (
    <div className='categories-list'>
      <ConfirmationModal
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={handleCloseDeleteConfirmation}
        show={isDeleteConfirmation}
        title={textForKey('Delete category')}
        message={textForKey('Are you sure you want to delete this category?')}
      />

      <CreateCategoryModal
        category={isEditingCategory ? selectedCategory : null}
        show={isCreatingCategory || isEditingCategory}
        onClose={handleCloseCreationModal}
        onSaved={handleCategorySave}
      />

      <ActionsSheet
        onClose={handleActionsClose}
        onSelect={handleActionSelected}
        open={isActionsOpen}
        actions={actions}
        anchorEl={actionsAnchor.current}
      />

      <div className='categories-list__data'>
        <div className='categories-list__header'>
          {textForKey('List')}
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
          {textForKey('Add category')}
        </div>
      </div>
      <div className='categories-list__spacer' />
    </div>
  );
};

export default CategoriesList;

CategoriesList.propTypes = {
  onCategorySelect: PropTypes.func,
};
