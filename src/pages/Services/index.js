import React, { useEffect, useReducer, useState } from 'react';

import './styles.scss';
import {
  Typography,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import sortBy from 'lodash/sortBy';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconEdit from '../../assets/icons/iconEdit';
import IconPlus from '../../assets/icons/iconPlus';
import ConfirmationModal from '../../components/ConfirmationModal';
import CreateCategoryModal from '../../components/CreateCategoryModal';
import LoadingButton from '../../components/LoadingButton';
import ImportDataModal from '../../components/UploadPatientsModal';
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
import {
  generateReducerActions,
  uploadFileToAWS,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import ServiceRow from './comps/ServiceRow';

const categoryModalState = {
  closed: 'closed',
  edit: 'edit',
  create: 'create',
};

const initialState = {
  categories: [],
  isLoading: false,
  category: { data: null, index: -1 },
  deleteServiceModal: { open: false, service: null, isLoading: false },
  categoryModal: { state: categoryModalState.closed },
  showUploadModal: false,
  isUploading: false,
};

const reducerTypes = {
  setCategories: 'setCategories',
  setIsLoading: 'setIsLoading',
  setCategory: 'setCategory',
  setDeleteServiceModal: 'setDeleteServiceModal',
  setCategoryModal: 'setCategoryModal',
  setShowUploadModal: 'setShowUploadModal',
  setIsUploading: 'setIsUploading',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setCategories:
      return { ...state, categories: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setCategory:
      return { ...state, category: action.payload };
    case reducerTypes.setDeleteServiceModal:
      return { ...state, deleteServiceModal: action.payload };
    case reducerTypes.setCategoryModal:
      return { ...state, categoryModal: action.payload };
    case reducerTypes.setShowUploadModal:
      return { ...state, showUploadModal: action.payload };
    case reducerTypes.setIsUploading:
      return { ...state, isUploading: action.payload };
    default:
      return state;
  }
};

const Services = () => {
  const dispatch = useDispatch();
  const clinicServices = useSelector(clinicServicesSelector);
  const updateServices = useSelector(updateServicesSelector);
  const [
    {
      categories,
      isLoading,
      category,
      deleteServiceModal,
      categoryModal,
      showUploadModal,
      isUploading,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

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
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.fetchServices(null);
    if (response.isError) {
      console.error(response.message);
    } else {
      dispatch(setClinicServices(response.data));
    }
    localDispatch(actions.setIsLoading(false));
  };

  const fetchCategories = async () => {
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.fetchCategories();
    if (response.isError) {
      console.error(response.message);
    } else {
      const { data } = response;
      const sortedData = sortBy(data, item => item.created);
      if (sortedData.length > 0 && category.data == null) {
        localDispatch(actions.setCategory({ data: sortedData[0], index: 0 }));
      }
      localDispatch(actions.setCategories(sortedData));
    }
    localDispatch(actions.setIsLoading(false));
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
    localDispatch(
      actions.setDeleteServiceModal({ open: true, service, isLoading: false }),
    );
  };

  const handleCloseDeleteService = () => {
    localDispatch(
      actions.setDeleteServiceModal({
        open: false,
        service: null,
        isLoading: false,
      }),
    );
  };

  const handleServiceDeleteConfirmed = async () => {
    if (deleteServiceModal.service == null) {
      return;
    }
    localDispatch(
      actions.setDeleteServiceModal({ ...deleteServiceModal, isLoading: true }),
    );
    await dataAPI.deleteService(deleteServiceModal.service.id);
    await fetchServices();
    handleCloseDeleteService();
  };

  const handleCreateCategory = () => {
    localDispatch(
      actions.setCategoryModal({ state: categoryModalState.create }),
    );
  };

  const handleEditCategory = () => {
    localDispatch(actions.setCategoryModal({ state: categoryModalState.edit }));
  };

  const handleCloseCategoryModal = () => {
    localDispatch(
      actions.setCategoryModal({ state: categoryModalState.closed }),
    );
  };

  const closeUploading = () => {
    localDispatch(actions.setShowUploadModal(false));
  };

  const openUploading = () => {
    localDispatch(actions.setShowUploadModal(true));
  };

  const handleUploadPatients = async data => {
    if (category.data == null) return;
    localDispatch(actions.setIsUploading(true));
    const fileName = data.file.name;
    const { location: fileUrl } = await uploadFileToAWS(
      'clients-uploads',
      data.file,
    );
    const response = await dataAPI.importServices(
      {
        fileName,
        fileUrl,
        provider: data.provider,
      },
      category.data.id,
    );
    if (response.isError) {
      console.error(response.message);
    }
    await fetchServices();
    localDispatch(actions.setIsUploading(false));
  };

  const handleCategorySave = data => {
    if (categoryModal.state === categoryModalState.edit) {
      localDispatch(
        actions.setCategory({
          ...category,
          data: { ...category.data, name: data.name },
        }),
      );
    }
    handleCloseCategoryModal();
    fetchCategories();
  };

  const handleTabChange = (event, newValue) => {
    if (category.index !== newValue) {
      const newCategory = categories[newValue];
      localDispatch(
        actions.setCategory({ data: newCategory, index: newValue }),
      );
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
      <ImportDataModal
        title={textForKey('Import services')}
        open={showUploadModal}
        onClose={closeUploading}
        onUpload={handleUploadPatients}
      />
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
          <LoadingButton
            variant='outline-primary'
            className='btn-outline-primary import-btn'
            isLoading={isUploading}
            onClick={openUploading}
          >
            {textForKey('Import services')}
            <UploadIcon />
          </LoadingButton>
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