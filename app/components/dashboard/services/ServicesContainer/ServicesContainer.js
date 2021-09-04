import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import clsx from "clsx";
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import UploadIcon from '@material-ui/icons/CloudUpload';
import sortBy from 'lodash/sortBy';
import indexOf from 'lodash/indexOf';
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';

import IconEdit from '../../../icons/iconEdit';
import IconPlus from '../../../icons/iconPlus';
import LoadingButton from '../../../../../components/common/LoadingButton';
import {
  closeServiceDetailsModal,
  setServiceDetailsModal,
  setServiceModalCategory,
  setServiceModalService,
} from '../../../../../redux/actions/serviceDetailsActions';
import { textForKey } from '../../../../../utils/localization';
import { HeaderKeys } from "../../../../utils/constants";
import { updatedServiceSelector } from "../../../../../redux/selectors/servicesSelector";
import { setUpdatedService } from "../../../../../redux/actions/servicesActions";
import {
  deleteService,
  importServicesFromFile,
  restoreService
} from "../../../../../middleware/api/services";
import ServiceRow from '../ServiceRow';
import reducer, {
  initialState,
  categoryModalState,
  setCategories,
  setCategoryModal,
  setDeleteServiceModal,
  setCategory,
  setClinicServices,
  setShowImportModal,
} from './servicesContainerSlice';
import styles from './ServicesContainer.module.scss';

const ConfirmationModal = dynamic(() => import('../../../common/modals/ConfirmationModal'));
const CSVImportModal = dynamic(() => import("../../../common/CSVImportModal"));
const CreateCategoryModal = dynamic(() => import('../CreateCategoryModal'));

const importServicesFields = [
  {
    id: 'serviceName',
    name: textForKey('Service name'),
    required: true,
  },
  {
    id: 'duration',
    name: textForKey('Duration'),
    required: false,
  },
  {
    id: 'price',
    name: textForKey('Price'),
    required: false,
  },
  {
    id: 'currency',
    name: textForKey('Currency'),
    required: false,
  },
]

const ServicesContainer = ({ categories: clinicCategories, services, currentClinic, authToken }) => {
  const dispatch = useDispatch();
  const router = useRouter();
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
      showImportModal,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(
      setClinicServices(
        sortBy(services, service => service.name.toLowerCase())
      ),
    );

    localDispatch(
      setCategories(
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
        setClinicServices(
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
      setDeleteServiceModal({ open: true, service, isLoading: false }),
    );
  };

  const handleCloseDeleteService = () => {
    localDispatch(
      setDeleteServiceModal({
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
      setDeleteServiceModal({ ...deleteServiceModal, isLoading: true }),
    );
    const response = deleteServiceModal.service.deleted
      ? await restoreService(deleteServiceModal.service.id)
      : await deleteService(deleteServiceModal.service.id);
    if (response.isError) {
      localDispatch(
        setDeleteServiceModal({
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
        localDispatch(setClinicServices(updatedServices));
      }, 300);
    }
  };

  const handleCreateCategory = () => {
    localDispatch(
      setCategoryModal({ state: categoryModalState.create }),
    );
  };

  const handleEditCategory = () => {
    localDispatch(setCategoryModal({ state: categoryModalState.edit }));
  };

  const handleCloseCategoryModal = () => {
    localDispatch(
      setCategoryModal({ state: categoryModalState.closed }),
    );
  };

  const openUploading = () => {
    localDispatch(setShowImportModal(true));
  };

  const handleCloseUpload = () => {
    localDispatch(setShowImportModal(false));
  };

  const handleImportServices = async (file, fields) => {
    try {
      const mappedFields = fields.map(item => ({ fieldId: item.id, index: item.index }));
      await importServicesFromFile(file, mappedFields, category.data.id, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      handleCloseUpload();
      await router.reload();
    } catch (error) {
      toast.error(error.message);
    }
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
        setCategories(
          sortBy(updateCategories, category => category.name.toLowerCase())
        )
      );
      localDispatch(
        setCategory({
          ...category,
          data: data,
        }),
      );
    } else {
      const newCategories = sortBy([...categories, data], category => category.name.toLowerCase());
      localDispatch(setCategories(newCategories));
      localDispatch(
        setCategory({
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
        setCategory({ data: newCategory, index: newValue }),
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
    <div className={styles['services-root']}>
      <CSVImportModal
        open={showImportModal}
        title={textForKey('Import services')}
        importBtnTitle={textForKey('import_n_services')}
        note={textForKey('import_services_note')}
        fields={importServicesFields}
        onImport={handleImportServices}
        onClose={handleCloseUpload}
      />
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
  );
};

export default ServicesContainer;
