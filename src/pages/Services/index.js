import React, { useEffect, useState } from 'react';

import './styles.scss';
import {
  Typography,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconEdit from '../../assets/icons/iconEdit';
import IconPlus from '../../assets/icons/iconPlus';
import CreateCategoryModal from '../../components/CategoriesList/CreateCategoryModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { setClinicServices } from '../../redux/actions/clinicActions';
import {
  closeServiceDetailsModal,
  setServiceDetailsModal,
  setServiceModalCategory,
  setServiceModalService,
} from '../../redux/actions/serviceDetailsActions';
import { clinicServicesSelector } from '../../redux/selectors/clinicSelector';
import { updateServicesSelector } from '../../redux/selectors/rootSelector';
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
  const updateServices = useSelector(updateServicesSelector);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState({ data: null, index: -1 });
  const [deleteServiceModal, setDeleteServiceModal] = useState({
    open: false,
    service: null,
    isLoading: false,
  });
  const [categoryModal, setCategoryModal] = useState({
    state: categoryModalState.closed,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [updateServices]);

  useEffect(() => {
    dispatch(setServiceModalCategory(category.data));
  }, [category.data]);

  const fetchServices = async () => {
    if (category.data == null) {
      return;
    }
    setIsLoading(true);
    const response = await dataAPI.fetchServices(null);
    if (response.isError) {
      console.error(response.message);
    } else {
      dispatch(setClinicServices(response.data));
    }
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchCategories();
    if (response.isError) {
      console.error(response.message);
    } else {
      const { data } = response;
      const sortedData = sortBy(data, item => item.created);
      if (sortedData.length > 0 && category.data == null) {
        setCategory({ data: sortedData[0], index: 0 });
      }
      setCategories(sortedData);
    }
    setIsLoading(false);
  };

  const handleAddOrEditService = (event, service) => {
    dispatch(
      setServiceDetailsModal({
        open: true,
        service,
        category: category.data,
      }),
    );
  };

  const handleEditService = service => {
    dispatch(setServiceModalService(service));
    dispatch(closeServiceDetailsModal(false));
  };

  const handleDeleteService = service => {
    setDeleteServiceModal({ open: true, service, isLoading: false });
  };

  const handleCloseDeleteService = () => {
    setDeleteServiceModal({ open: false, service: null, isLoading: false });
  };

  const handleServiceDeleteConfirmed = async () => {
    if (deleteServiceModal.service == null) {
      return;
    }
    setDeleteServiceModal({ ...deleteServiceModal, isLoading: true });
    await dataAPI.deleteService(deleteServiceModal.service.id);
    await fetchServices();
    handleCloseDeleteService();
  };

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
      setCategory({ ...category, data: { ...category.data, name: data.name } });
    }
    handleCloseCategoryModal();
    fetchCategories();
  };

  const handleTabChange = (event, newValue) => {
    if (category.index !== newValue) {
      const newCategory = categories[newValue];
      setCategory({ data: newCategory, index: newValue });
    }
  };

  const getServicesCount = category => {
    return clinicServices.filter(item => item.categoryId === category.id)
      .length;
  };

  const filteredServices =
    category.data != null
      ? clinicServices.filter(item => item.categoryId === category.data.id)
      : [];

  return (
    <div className='services-root'>
      <ConfirmationModal
        onConfirm={handleServiceDeleteConfirmed}
        onClose={handleCloseDeleteService}
        isLoading={deleteServiceModal.isLoading}
        title={textForKey('Delete service')}
        message={textForKey('Are you sure you want to delete this service?')}
        show={deleteServiceModal.open}
      />
      <CreateCategoryModal
        category={
          categoryModal.state === categoryModalState.edit ? category.data : null
        }
        show={categoryModal.state !== categoryModalState.closed}
        onClose={handleCloseCategoryModal}
        onSaved={handleCategorySave}
      />
      <div className='services-root__content-wrapper'>
        {isLoading && <CircularProgress />}
        {!isLoading && filteredServices.length === 0 && (
          <div className='services-root__no-data-wrapper'>
            <Typography classes={{ root: 'no-data-label' }}>
              {textForKey('no_services_message')}
              <span
                className='add-btn'
                role='button'
                tabIndex={0}
                onClick={handleAddOrEditService}
              >
                {textForKey('Add service')}
                <IconPlus fill='#3A83DC' />
              </span>
            </Typography>
          </div>
        )}
        <div className='tabs-container'>
          <Tooltip title={textForKey('Add category')}>
            <div
              role='button'
              tabIndex={0}
              onClick={handleCreateCategory}
              className='services-root__add-tab'
              style={{ outline: 'none' }}
            >
              <IconPlus fill='#FFFF' />
            </div>
          </Tooltip>
          {category.data != null && (
            <Tabs
              classes={{ indicator: 'services-root__tab-indicator' }}
              value={category.index}
              indicatorColor='primary'
              textColor='primary'
              onChange={handleTabChange}
            >
              {categories.map((item, index) => (
                <Tab
                  style={{ outline: 'none' }}
                  key={item.id}
                  value={index}
                  label={`${textForKey(item.name)} (${getServicesCount(item)})`}
                />
              ))}
            </Tabs>
          )}
        </div>
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

      {category.data != null && (
        <div className='services-root__footer'>
          <Button
            variant='outline-primary edit-category-btn'
            onClick={handleEditCategory}
          >
            {textForKey('Edit category')}
            <IconEdit />
          </Button>
          <Button
            variant='outline-primary add-service-btn'
            onClick={handleAddOrEditService}
          >
            {textForKey('Add service')}
            <IconPlus fill='#00E987' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Services;
