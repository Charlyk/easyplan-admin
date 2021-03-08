import React, { useEffect, useReducer } from 'react';

import styles from '../../styles/Services.module.scss';
import clsx from "clsx";
import {
  Typography,
  Tabs,
  Tab,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import sortBy from 'lodash/sortBy';
import indexOf from 'lodash/indexOf';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconEdit from '../../components/icons/iconEdit';
import IconPlus from '../../components/icons/iconPlus';
import ConfirmationModal from '../../components/ConfirmationModal';
import CreateCategoryModal from '../../components/CreateCategoryModal';
import LoadingButton from '../../components/LoadingButton';
import { toggleImportModal, triggerServicesUpdate } from '../../redux/actions/actions';
import { setClinicServices } from '../../redux/actions/clinicActions';
import {
  closeServiceDetailsModal,
  setServiceDetailsModal,
  setServiceModalCategory,
  setServiceModalService,
} from '../../redux/actions/serviceDetailsActions';
import { updateServicesSelector } from '../../redux/selectors/rootSelector';
import {
  generateReducerActions, handleRequestError,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import ServiceRow from '../../components/services/ServiceRow';
import { useRouter } from "next/router";
import MainComponent from "../../components/common/MainComponent";
import axios from "axios";
import { baseAppUrl } from "../../eas.config";
import { updatedServiceSelector } from "../../redux/selectors/servicesSelector";
import { setUpdatedService } from "../../redux/actions/servicesActions";

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
  setupExcelModal: { open: false, data: null },
  clinicServices: [],
};

const reducerTypes = {
  setCategories: 'setCategories',
  setIsLoading: 'setIsLoading',
  setCategory: 'setCategory',
  setDeleteServiceModal: 'setDeleteServiceModal',
  setCategoryModal: 'setCategoryModal',
  setShowUploadModal: 'setShowUploadModal',
  setIsUploading: 'setIsUploading',
  setSetupExcelModal: 'setSetupExcelModal',
  setClinicServices: 'setClinicServices',
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
    case reducerTypes.setSetupExcelModal:
      return { ...state, setupExcelModal: action.payload };
    case reducerTypes.setClinicServices:
      return { ...state, clinicServices: action.payload };
    default:
      return state;
  }
};

const Services = ({ currentUser, currentClinic, categories: clinicCategories, services }) => {
  const dispatch = useDispatch();
  const updatedService = useSelector(updatedServiceSelector);
  const [
    {
      isLoading,
      category,
      deleteServiceModal,
      categoryModal,
      isUploading,
      categories,
      clinicServices,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(
      actions.setClinicServices(
        sortBy(services, service => service.name.toLowerCase())
      ),
    );

    localDispatch(
      actions.setCategories(
        sortBy(clinicCategories, category => category.name.toLowerCase())
      )
    )
  }, [])

  useEffect(() => {
    if (updatedService != null) {
      const existentService = clinicServices.find(item => item.id === updatedService.id);
      let newServices;
      if (existentService != null) {
        newServices = clinicServices.map(item => {
          if (item.id !== existentService.id) {
            return item;
          }
          return { ...item, ...updatedService };
        });
      } else {
        newServices = [...clinicServices, updatedService];
      }
      localDispatch(
        actions.setClinicServices(
          sortBy(newServices, item => item.name.toLowerCase()),
        ),
      );
      dispatch(setUpdatedService(null));
    }
  }, [updatedService]);

  useEffect(() => {
    dispatch(setServiceModalCategory(category.data));
  }, [category.data]);

  const handleAddOrEditService = (event, service) => {
    dispatch(
      setServiceDetailsModal({
        open: true,
        service,
        category: category.data,
      }),
    );
  };

  const handleEditService = (service) => {
    dispatch(setServiceModalService(service));
    dispatch(closeServiceDetailsModal(false));
  };

  const handleDeleteService = (service) => {
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

  const restoreService = async (serviceId) => {
    return axios.get(`${baseAppUrl}/api/services/${serviceId}`);
  }

  const deleteService = async (serviceId) => {
    return axios.delete(`${baseAppUrl}/api/services/${serviceId}`);
  }

  const handleServiceDeleteConfirmed = async () => {
    if (deleteServiceModal.service == null) {
      return;
    }
    localDispatch(
      actions.setDeleteServiceModal({ ...deleteServiceModal, isLoading: true }),
    );
    const response = deleteServiceModal.service.deleted
      ? await restoreService(deleteServiceModal.service.id)
      : await deleteService(deleteServiceModal.service.id);
    if (response.isError) {
      console.error(response.message);
      localDispatch(
        actions.setDeleteServiceModal({
          ...deleteServiceModal,
          isLoading: false,
        }),
      );
    } else {
      setTimeout(() => {
        handleCloseDeleteService();
        const updatedServices = clinicServices.map(service => {
          if (service.id !== deleteServiceModal.service.id) {
            return service;
          }
          return {
            ...service,
            deleted: !deleteServiceModal.service.deleted
          }
        });
        localDispatch(actions.setClinicServices(updatedServices));
      }, 300);
    }
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

  const openUploading = () => {
    dispatch(toggleImportModal(true));
  };

  const handleCategorySave = (data) => {
    const existentCategory = categories.find(item => item.id === data.id);
    if (existentCategory != null) {
      const updateCategories = categories.map(category => {
        if (category.id !== data.id) {
          return category;
        }
        return {
          ...category,
          ...data,
        };
      });
      localDispatch(
        actions.setCategories(
          sortBy(updateCategories, category => category.name.toLowerCase())
        )
      );
      localDispatch(
        actions.setCategory({
          ...category,
          data: data,
        }),
      );
    } else {
      const newCategories = sortBy([...categories, data], category => category.name.toLowerCase());
      localDispatch(actions.setCategories(newCategories));
      localDispatch(
        actions.setCategory({
          data: data,
          index: indexOf(newCategories, data),
        }),
      );
    }
    handleCloseCategoryModal();
  };

  const handleTabChange = (event, newValue) => {
    if (category.index !== newValue) {
      const newCategory = categories[newValue];
      localDispatch(
        actions.setCategory({ data: newCategory, index: newValue }),
      );
    }
  };

  const tabLabel = (title, count) => {
    return (
      <div className={styles['tab-data-wrapper']}>
        <Typography noWrap classes={{ root: styles['tab-item-title'] }}>
          {title}
        </Typography>
        <Typography noWrap classes={{ root: styles['tab-items-count'] }}>
          {count}
        </Typography>
      </div>
    );
  };

  const getServicesCount = (category) => {
    if (category.id === 'all-services') {
      return clinicServices.length;
    }
    return clinicServices.filter((item) => item.categoryId === category.id)
      .length;
  };

  const filteredServices = sortBy(
    category.data != null && category.data.id !== 'all-services'
      ? clinicServices.filter((item) => item.categoryId === category.data.id)
      : clinicServices,
    (service) => service.name.toLowerCase(),
  );

  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/services'
    >
      <div className={styles['services-root']}>
        <ConfirmationModal
          onConfirm={handleServiceDeleteConfirmed}
          onClose={handleCloseDeleteService}
          isLoading={deleteServiceModal.isLoading}
          title={
            deleteServiceModal.service?.deleted
              ? textForKey('Restore service')
              : textForKey('Delete service')
          }
          message={
            deleteServiceModal.service?.deleted
              ? textForKey('Are you sure you want to restore this service?')
              : textForKey('Are you sure you want to delete this service?')
          }
          show={deleteServiceModal.open}
        />
        {categoryModal.state !== categoryModalState.closed && (
          <CreateCategoryModal
            category={
              categoryModal.state === categoryModalState.edit ? category.data : null
            }
            show={categoryModal.state !== categoryModalState.closed}
            onClose={handleCloseCategoryModal}
            onSaved={handleCategorySave}
          />
        )}
        <div className={styles['services-root__content-wrapper']}>
          {isLoading && (
            <div className={styles.progressWrapper}>
              <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
            </div>
          )}
          {!isLoading && filteredServices.length === 0 && (
            <div className={styles['services-root__no-data-wrapper']}>
              <Typography classes={{ root: styles['no-data-label'] }}>
                {textForKey('no_services_message')}
                <span
                  className={styles['add-btn']}
                  role='button'
                  tabIndex={0}
                  onClick={handleAddOrEditService}
                >
                {textForKey('Add service')}
                  <IconPlus fill='#3A83DC'/>
              </span>
              </Typography>
            </div>
          )}
          <div className={styles['tabs-container']}>
            <Tooltip title={textForKey('Add category')}>
              <div
                role='button'
                tabIndex={0}
                onClick={handleCreateCategory}
                className={styles['services-root__add-tab']}
                style={{ outline: 'none' }}
              >
                <IconPlus fill='#FFFF'/>
              </div>
            </Tooltip>
            <Tabs
              scrollButtons='auto'
              variant='scrollable'
              classes={{ indicator: styles['services-root__tab-indicator'] }}
              value={category.index}
              indicatorColor='primary'
              textColor='primary'
              onChange={handleTabChange}
            >
              <Tab
                style={{ outline: 'none', maxHeight: 50, maxWidth: 'unset' }}
                value={-1}
                label={tabLabel(
                  textForKey('All services'),
                  getServicesCount({ id: 'all-services' }),
                )}
              />
              {categories.map((item, index) => (
                <Tab
                  style={{ outline: 'none', maxHeight: 50, maxWidth: 'unset' }}
                  key={item.id}
                  value={index}
                  label={tabLabel(
                    textForKey(item.name),
                    getServicesCount(item),
                  )}
                />
              ))}
            </Tabs>
          </div>
          {filteredServices.length > 0 && (
            <table>
              <thead>
              <tr>
                <td>
                  <Typography classes={{ root: clsx(styles['row-label'], styles['title-label']) }}>
                    {textForKey('Service name')}
                  </Typography>
                </td>
                <td align='left'>
                  <Typography classes={{ root: clsx(styles['row-label'], styles['title-label']) }}>
                    {textForKey('Description')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography classes={{ root: clsx(styles['row-label'], styles['title-label']) }}>
                    {textForKey('Duration')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography classes={{ root: clsx(styles['row-label'], styles['title-label']) }}>
                    {textForKey('Price')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography classes={{ root: clsx(styles['row-label'], styles['title-label']) }}>
                    {textForKey('Actions')}
                  </Typography>
                </td>
              </tr>
              </thead>
              <tbody>
              {filteredServices.map((item) => (
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
          <div className={styles['services-root__footer']}>
            <LoadingButton
              disabled={category?.data?.id === 'all-services'}
              variant='outline-primary'
              className={clsx(styles['btn-outline-primary'], styles['import-btn'])}
              isLoading={isUploading}
              onClick={openUploading}
            >
              {textForKey('Import services')}
              <UploadIcon/>
            </LoadingButton>
            <Button
              disabled={category?.data?.id === 'all-services'}
              variant='outline-primary'
              className={styles['edit-category-btn']}
              onClick={handleEditCategory}
            >
              {textForKey('Edit category')}
              <IconEdit/>
            </Button>
            <Button
              disabled={category?.data?.id === 'all-services'}
              variant='outline-primary'
              className={styles['add-service-btn']}
              onClick={handleAddOrEditService}
            >
              {textForKey('Add service')}
              <IconPlus fill='#00E987'/>
            </Button>
          </div>
        )}
      </div>
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res, }) => {
  try {
    const { data } = await axios.get(`${baseAppUrl}/api/services`, { headers: req.headers });
    return {
      props: {
        ...data
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        categories: [],
        services: []
      }
    }
  }
}

export default Services;
