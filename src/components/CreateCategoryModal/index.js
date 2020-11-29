import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import { logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

const CreateCategoryModal = props => {
  const { show, onClose, onSaved, category } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(
    category ? category.name : '',
  );

  useEffect(() => {
    if (!show) {
      setCategoryName('');
    }
  }, [show]);

  useEffect(() => {
    setCategoryName(category ? category.name : '');
  }, [category]);

  const handleCategorySave = async () => {
    setIsLoading(true);
    if (category != null) {
      await editCategoryName();
    } else {
      await createNewCategory();
    }
    setIsLoading(false);
  };

  const editCategoryName = async () => {
    const response = await dataAPI.changeCategoryName({
      categoryId: category.id,
      categoryName,
    });
    if (!response.isError) {
      logUserAction(
        Action.EditCategory,
        JSON.stringify({
          before: category,
          after: { ...category, name: categoryName },
        }),
      );
      setCategoryName('');
      onSaved(response.data);
    } else {
      console.error(response.message);
    }
  };

  const createNewCategory = async () => {
    const response = await dataAPI.createCategory({ categoryName });
    if (!response.isError) {
      logUserAction(Action.CreateCategory, JSON.stringify({ categoryName }));
      setCategoryName('');
      onSaved(response.data);
    } else {
      console.error(response.message);
    }

    setIsLoading(false);
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
      isPositiveLoading={isLoading}
      isPositiveDisabled={isLoading}
    >
      <Form.Group>
        <Form.Label htmlFor='basic-url'>
          {textForKey('Enter category name')}
        </Form.Label>
        <Form.Control
          value={categoryName}
          onChange={handleCategoryNameChange}
          aria-label={textForKey('Enter category name')}
        />
      </Form.Group>
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
