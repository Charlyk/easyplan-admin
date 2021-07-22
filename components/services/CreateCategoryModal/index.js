import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import { textForKey } from '../../../utils/localization';
import EasyPlanModal from '../../../app/components/common/modals/EasyPlanModal';
import styles from '../../../styles/CreateCategoryModal.module.scss';
import axios from "axios";
import { toast } from "react-toastify";

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
  };

  const editCategoryName = async () => {
    try {
      const response = await axios.put(`/api/categories/${category.id}`, { categoryName });
      setCategoryName('');
      onSaved(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewCategory = async () => {
    try {
      const response = await axios.post(`/api/categories`, { categoryName });
      setCategoryName('');
      onSaved(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
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
      className={styles['create-category-modal']}
      onPositiveClick={handleCategorySave}
      isPositiveLoading={isLoading}
      isPositiveDisabled={isLoading}
      size='sm'
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

CreateCategoryModal.defaultProps = {
  category: {
    name: '',
    id: '',
  },
};
