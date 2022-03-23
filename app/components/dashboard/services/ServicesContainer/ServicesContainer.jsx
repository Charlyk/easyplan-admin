import React, { useContext, useEffect, useMemo, useReducer } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import clsx from 'clsx';
import indexOf from 'lodash/indexOf';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import IconEdit from 'app/components/icons/iconEdit';
import IconPlus from 'app/components/icons/iconPlus';
import NotificationsContext from 'app/context/notificationsContext';
import { HeaderKeys } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import {
  deleteService,
  importServicesFromFile,
  restoreService,
} from 'middleware/api/services';
import { setServiceModalCategory } from 'redux/actions/serviceDetailsActions';
import {
  authTokenSelector,
  currentClinicSelector,
} from 'redux/selectors/appDataSelector';
import {
  categoriesSelector,
  isFetchingServicesSelector,
  servicesErrorSelector,
  servicesSelector,
} from 'redux/selectors/servicesSelector';
import {
  openDetailsModal,
  setCategories as globalSetCategories,
  requestDeleteCategory,
  toggleServiceDeletion,
} from 'redux/slices/servicesListSlice';
import ServiceRow from '../ServiceRow';
import styles from './ServicesContainer.module.scss';
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

const ConfirmationModal = dynamic(() =>
  import('../../../common/modals/ConfirmationModal'),
);
const CSVImportModal = dynamic(() =>
  import('app/components/common/CSVImportModal'),
);
const CreateCategoryModal = dynamic(() => import('../CreateCategoryModal'));
const ServiceDetailsModal = dynamic(() => import('../ServiceDetailsModal'));

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
];

const ServicesContainer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const currentClinic = useSelector(currentClinicSelector);
  const authToken = useSelector(authTokenSelector);
  const clinicServices = useSelector(servicesSelector);
  const categories = useSelector(categoriesSelector);
  const isLoading = useSelector(isFetchingServicesSelector);
  const error = useSelector(servicesErrorSelector);
  const [
    { category, deleteServiceModal, categoryModal, showImportModal },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (error == null) {
      return;
    }
    toast.error(error);
  }, [error]);

  useEffect(() => {
    dispatch(setServiceModalCategory(category.data));
  }, [category.data]);

  const handleAddOrEditService = (event, service) => {
    dispatch(
      openDetailsModal({
        open: true,
        service,
        category: service?.category ?? category.data,
      }),
    );
  };

  const handleEditService = (service) => {
    dispatch(
      openDetailsModal({ open: true, service, category: service.category }),
    );
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
        const updatedServices = clinicServices.map((service) => {
          if (service.id !== deleteServiceModal.service.id) {
            return service;
          }
          return {
            ...service,
            deleted: !deleteServiceModal.service.deleted,
          };
        });
        localDispatch(setClinicServices(updatedServices));
        dispatch(toggleServiceDeletion(deleteServiceModal.service.id));
      }, 300);
    }
  };

  const handleDeleteCategory = (category) => {
    dispatch(requestDeleteCategory(category.id));
    localDispatch(setCategory({ data: null, index: -1 }));
  };

  const handleCreateCategory = () => {
    localDispatch(setCategoryModal({ state: categoryModalState.create }));
  };

  const handleEditCategory = () => {
    localDispatch(setCategoryModal({ state: categoryModalState.edit }));
  };

  const handleCloseCategoryModal = () => {
    localDispatch(setCategoryModal({ state: categoryModalState.closed }));
  };

  const openUploading = () => {
    localDispatch(setShowImportModal(true));
  };

  const handleCloseUpload = () => {
    localDispatch(setShowImportModal(false));
  };

  const handleImportServices = async (file, fields) => {
    try {
      const mappedFields = fields.map((item) => ({
        fieldId: item.id,
        index: item.index,
      }));
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
    const existentCategory = categories.find((item) => item.id === data.id);
    if (existentCategory != null) {
      const updateCategories = categories.map((category) => {
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
          sortBy(updateCategories, (category) => category.name.toLowerCase()),
        ),
      );
      localDispatch(
        setCategory({
          ...category,
          data: data,
        }),
      );
    } else {
      const newCategories = sortBy([...categories, data], (category) =>
        category.name.toLowerCase(),
      );
      localDispatch(setCategories(newCategories));
      dispatch(globalSetCategories(newCategories));
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
      localDispatch(setCategory({ data: newCategory, index: newValue }));
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
    return (
      clinicServices?.filter((item) => item?.category?.id === category?.id)
        .length ?? 0
    );
  };

  const filteredServices = useMemo(() => {
    const services =
      category.data != null && category.data.id !== 'all-services'
        ? clinicServices.filter(
            (item) => item?.category?.id === category?.data?.id,
          )
        : clinicServices;
    return orderBy(services, ['deleted', 'name'], ['asc', 'asc']);
  }, [category, clinicServices]);

  return (
    <div className={styles['services-root']}>
      <ServiceDetailsModal />
      <CSVImportModal
        open={showImportModal}
        title={textForKey('Import services')}
        importBtnTitle={textForKey('import_n_services')}
        note={textForKey('import_services_note')}
        iconTitle={textForKey('upload csv file')}
        iconSubtitle={textForKey('n_services_only')}
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
            categoryModal.state === categoryModalState.edit
              ? category.data
              : null
          }
          show={categoryModal.state !== categoryModalState.closed}
          onClose={handleCloseCategoryModal}
          onSaved={handleCategorySave}
          destroyBtnText={textForKey('delete category')}
          onDelete={handleDeleteCategory}
        />
      )}
      <div className={styles['services-root__content-wrapper']}>
        {isLoading && (
          <div className={styles.progressWrapper}>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
        {categories.length > 0 && !isLoading && filteredServices.length === 0 && (
          <div className={styles['services-root__no-data-wrapper']}>
            <Typography classes={{ root: styles['no-data-label'] }}>
              {textForKey('no_services_message')}
              <span
                role='button'
                tabIndex={0}
                className={styles['add-btn']}
                onClick={handleAddOrEditService}
              >
                {textForKey('Add service')}
                <IconPlus fill='#3A83DC' />
              </span>
            </Typography>
          </div>
        )}
        {categories.length === 0 && !isLoading && (
          <div className={styles['services-root__no-data-wrapper']}>
            <Typography classes={{ root: styles['no-data-label'] }}>
              {textForKey('no_categories_message')}
              <span
                role='button'
                tabIndex={0}
                className={styles['add-btn']}
                onClick={handleCreateCategory}
              >
                {textForKey('Add category')}
                <IconPlus fill='#3A83DC' />
              </span>
            </Typography>
          </div>
        )}
        <div className={styles['tabs-container']}>
          <Tooltip title={textForKey('Add category')}>
            <Box
              onClick={handleCreateCategory}
              className={styles['services-root__add-tab']}
              style={{ outline: 'none' }}
            >
              <IconPlus fill='#FFFF' />
            </Box>
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
                label={tabLabel(textForKey(item.name), getServicesCount(item))}
              />
            ))}
          </Tabs>
        </div>
        {filteredServices.length > 0 && (
          <table>
            <thead>
              <tr>
                <td>
                  <Typography
                    classes={{
                      root: clsx(styles['row-label'], styles['title-label']),
                    }}
                  >
                    {textForKey('Service name')}
                  </Typography>
                </td>
                <td align='left'>
                  <Typography
                    classes={{
                      root: clsx(styles['row-label'], styles['title-label']),
                    }}
                  >
                    {textForKey('Description')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography
                    classes={{
                      root: clsx(styles['row-label'], styles['title-label']),
                    }}
                  >
                    {textForKey('Duration')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography
                    classes={{
                      root: clsx(styles['row-label'], styles['title-label']),
                    }}
                  >
                    {textForKey('Price')}
                  </Typography>
                </td>
                <td align='right'>
                  <Typography
                    classes={{
                      root: clsx(styles['row-label'], styles['title-label']),
                    }}
                  >
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
          <Button
            disabled={category?.data?.id === 'all-services'}
            variant='outlined'
            classes={{
              root: styles.importBtn,
              outlined: styles.outlinedBtnBlue,
              label: styles.buttonLabel,
            }}
            onPointerUp={openUploading}
          >
            {textForKey('Import services')}
            <UploadIcon />
          </Button>
          <Button
            disabled={category?.data?.id === 'all-services'}
            variant='outlined'
            classes={{
              root: styles.importBtn,
              outlined: styles.outlinedBtnBlue,
              label: styles.buttonLabel,
            }}
            onPointerUp={handleEditCategory}
          >
            {textForKey('Edit category')}
            <IconEdit />
          </Button>
          <Button
            disabled={category?.data?.id === 'all-services'}
            variant='outlined'
            classes={{
              root: styles.createBtn,
              outlined: styles.outlinedBtnGreen,
              label: styles.buttonLabel,
            }}
            onPointerUp={handleAddOrEditService}
          >
            {textForKey('Add service')}
            <IconPlus fill='#00E987' />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServicesContainer;
