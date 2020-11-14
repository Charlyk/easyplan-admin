import React, { useEffect, useState } from 'react';

import './styles.scss';
import {
  Typography,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconEdit from '../../assets/icons/iconEdit';
import IconPlus from '../../assets/icons/iconPlus';
import CreateCategoryModal from '../../components/CategoriesList/CreateCategoryModal';
import { setServiceDetailsModal } from '../../redux/actions/serviceDetailsActions';
import { clinicServicesSelector } from '../../redux/selectors/clinicSelector';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import ServiceRow from './comps/ServiceRow';

const categoryModalState = {
  closed: 'closed',
  edit: 'edit',
  create: 'create',
};

const Services = () => {
  const dispatch = useDispatch();
  const clinicServices = useSelector(clinicServicesSelector);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModal, setCategoryModal] = useState({
    state: categoryModalState.closed,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchCategories();
    if (response.isError) {
      console.error(response.message);
    } else {
      const { data } = response;
      if (data.length > 0 && selectedCategory == null) {
        setSelectedCategory(data[0]);
      }
      setCategories(data);
    }
    setIsLoading(false);
  };

  const handleAddOrEditService = (event, service) => {
    dispatch(
      setServiceDetailsModal({
        open: true,
        service,
        category: selectedCategory,
      }),
    );
  };

  const handleEditService = service => {
    handleAddOrEditService(null, service);
  };

  const handleDeleteService = service => {};

  const handleCreateCategory = () => {
    setCategoryModal({ state: categoryModalState.create });
  };

  const handleEditCategory = () => {
    setCategoryModal({ state: categoryModalState.edit });
  };

  const handleCloseCategoryModal = () => {
    setCategoryModal({ state: categoryModalState.closed });
  };

  const handleCategorySave = data => {
    if (categoryModal.state === categoryModalState.edit) {
      setSelectedCategory({ ...selectedCategory, name: data.name });
    }
    handleCloseCategoryModal();
    fetchCategories();
  };

  const handleTabChange = (evet, newValue) => {
    if (newValue === 'create') {
      handleCreateCategory();
      return;
    }

    if (selectedCategory.id !== newValue) {
      const newCategory = categories.find(item => item.id === newValue);
      setSelectedCategory(newCategory);
    }
  };

  const filteredServices = selectedCategory
    ? clinicServices.filter(item => item.categoryId === selectedCategory.id)
    : [];

  return (
    <div className='services-root'>
      <CreateCategoryModal
        category={
          categoryModal.state === categoryModalState.edit
            ? selectedCategory
            : null
        }
        show={categoryModal.state !== categoryModalState.closed}
        onClose={handleCloseCategoryModal}
        onSaved={handleCategorySave}
      />
      <div className='services-root__content-wrapper'>
        {isLoading && <CircularProgress />}
        {selectedCategory != null && (
          <Tabs
            classes={{ indicator: 'services-root__tab-indicator' }}
            value={selectedCategory.id}
            indicatorColor='primary'
            textColor='primary'
            onChange={handleTabChange}
          >
            <Tooltip title={textForKey('Add category')}>
              <Tab
                classes={{ root: 'services-root__add-tab' }}
                style={{ outline: 'none' }}
                value='create'
                icon={<IconPlus fill='#FFFF' />}
              />
            </Tooltip>
            {categories.map(item => (
              <Tab
                style={{ outline: 'none' }}
                key={item.id}
                value={item.id}
                label={textForKey(item.name)}
              />
            ))}
          </Tabs>
        )}
        {filteredServices.length > 0 && (
          <table>
            <thead>
              <tr>
                <td>
                  <Typography classes={{ root: 'row-label title-label' }}>
                    {textForKey('Service name')}
                  </Typography>
                </td>
                <td align='left'>
                  <Typography classes={{ root: 'row-label title-label' }}>
                    {textForKey('Description')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography classes={{ root: 'row-label title-label' }}>
                    {textForKey('Duration')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography classes={{ root: 'row-label title-label' }}>
                    {textForKey('Price')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography classes={{ root: 'row-label title-label' }}>
                    {textForKey('Actions')}
                  </Typography>
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(item => (
                <ServiceRow
                  key={item.id}
                  service={item}
                  onEditService={handleEditService}
                  onDeleteService={handleDeleteService}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedCategory != null && (
        <div className='services-root__footer'>
          <Button
            variant='outline-primary add-service-btn'
            onClick={handleAddOrEditService}
          >
            {textForKey('Add service')}
            <IconPlus fill='#00E987' />
          </Button>
          <Button
            variant='outline-primary edit-category-btn'
            onClick={handleEditCategory}
          >
            {textForKey('Edit category')}
            <IconEdit />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Services;
