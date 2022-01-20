import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import EASTextField from 'app/components/common/EASTextField';
import EASModal from 'app/components/common/modals/EASModal';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import {
  requestCreateCategory,
  requestEditCategory,
} from 'middleware/api/categories';
import styles from './CreateCategoryModal.module.scss';

const CreateCategoryModal = (props) => {
  const toast = useContext(NotificationsContext);
  const { show, onClose, onSaved, category, onDelete, destroyBtnText } = props;
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

  const handleCategorySave = async (event) => {
    event?.preventDefault();
    setIsLoading(true);
    if (category != null) {
      await editCategoryName();
    } else {
      await createNewCategory();
    }
  };

  const editCategoryName = async () => {
    try {
      const response = await requestEditCategory(categoryName, category.id);
      setCategoryName('');
      onSaved(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewCategory = async () => {
    if (categoryName.trim().length === 0) {
      return;
    }
    try {
      const response = await requestCreateCategory(categoryName.trim());
      setCategoryName('');
      onSaved(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryNameChange = (newValue) => {
    setCategoryName(newValue);
  };

  const getTitle = () => {
    return category?.name?.length > 0
      ? textForKey('Edit category')
      : textForKey('Add category');
  };

  const handleOnDelete = () => {
    onDelete(category);
    onClose();
  };

  const handleModalClose = () => {
    setCategoryName('');
    onClose();
  };

  return (
    <EASModal
      onClose={handleModalClose}
      open={show}
      title={getTitle()}
      className={styles['create-category-modal']}
      onPrimaryClick={handleCategorySave}
      isPositiveLoading={isLoading}
      destroyBtnText={destroyBtnText}
      isPositiveDisabled={isLoading || categoryName.trim().length === 0}
      onDestroyClick={category === null ? null : handleOnDelete}
    >
      <form style={{ padding: '16px' }} onSubmit={handleCategorySave}>
        <EASTextField
          autoFocus
          fieldLabel={textForKey('Enter category name')}
          value={categoryName}
          onChange={handleCategoryNameChange}
        />
      </form>
    </EASModal>
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
