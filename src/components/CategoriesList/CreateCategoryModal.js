import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Modal, Button, FormControl } from 'react-bootstrap';

import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import LoadingButton from '../LoadingButton';

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

  return (
    <Modal
      className='create-category-modal'
      centered
      show={show}
      onHide={onClose}
    >
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          {getTitle()}
        </Modal.Title>
        <div className='close-btn' onClick={onClose}>
          <IconClose />
        </div>
      </Modal.Header>

      <Modal.Body>
        <label htmlFor='basic-url'>{textForKey('Enter category name')}</label>
        <FormControl
          value={categoryName}
          onChange={handleCategoryNameChange}
          aria-label={textForKey('Enter category name')}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button className='cancel' onClick={onClose}>
          Close
          <IconClose />
        </Button>
        <LoadingButton
          isLoading={isLoading}
          className='save'
          disabled={categoryName.length === 0}
          onClick={handleCategorySave}
        >
          Save
          {!isLoading && <IconSuccess />}
        </LoadingButton>
      </Modal.Footer>
    </Modal>
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
