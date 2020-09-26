import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

const CreateCategoryModal = props => {
  const { show, onClose, onSaved, category } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(
    category ? category.name : '',
  );

  useEffect(() => {
    setCategoryName(category ? category.name : '');
  }, [category]);

  const handleCategorySave = () => {
    setIsLoading(true);
    if (category != null) {
      editCategoryName();
    } else {
      createNewCategory();
    }
  };

  const editCategoryName = () => {
    dataAPI
      .changeCategoryName({ categoryId: category.id, categoryName })
      .then(response => {
        setIsLoading(false);
        if (!response.isError) {
          setCategoryName('');
          onSaved(response.data);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const createNewCategory = () => {
    dataAPI
      .createCategory({ categoryName })
      .then(response => {
        setIsLoading(false);
        if (!response.isError) {
          setCategoryName('');
          onSaved(response.data);
        }
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleCategoryNameChange = event => {
    setCategoryName(event.target.value);
  };

  const getTitle = () => {
    return category?.name?.length > 0
      ? textForKey('Edit category')
      : textForKey('Add category');
  };

  const handleModalClose = () => {
    setCategoryName('');
    onClose();
  };

  return (
    <EasyPlanModal
      onClose={handleModalClose}
      open={show}
      title={getTitle()}
      className='create-category-modal'
      onPositiveClick={handleCategorySave}
    >
      <label htmlFor='basic-url'>{textForKey('Enter category name')}</label>
      <FormControl
        value={categoryName}
        onChange={handleCategoryNameChange}
        aria-label={textForKey('Enter category name')}
      />
    </EasyPlanModal>
  );
};

export default CreateCategoryModal;

CreateCategoryModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
  category: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
};

CreateCategoryModal.defaultProps = {
  category: {
    name: '',
    id: '',
  },
};
