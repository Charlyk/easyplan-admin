import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import orderBy from 'lodash/orderBy';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Lightbox from 'react-awesome-lightbox';
import { useSelector } from 'react-redux';
import IconPlus from 'app/components/icons/iconPlus';
import NotificationsContext from 'app/context/notificationsContext';
import { textForKey } from 'app/utils/localization';
import urlToAWS from 'app/utils/urlToAWS';
import {
  deletePatientXRayImage,
  getPatientXRayImages,
} from 'middleware/api/patients';
import { updateXRaySelector } from 'redux/selectors/rootSelector';
import styles from './PatientXRay.module.scss';
import XRayImage from './XRayImage';
import 'react-awesome-lightbox/build/style.css';

const ConfirmationModal = dynamic(() =>
  import('../../../../common/modals/ConfirmationModal'),
);

const PatientXRay = ({ patient, onAddXRay }) => {
  const toast = useContext(NotificationsContext);
  const updateXRay = useSelector(updateXRaySelector);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageToView, setImageToView] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, image: null });
  const [isFetching, setIsFetching] = useState(false);
  const [disableOnClose, setDisableOnClose] = useState(false);
  const [state, setState] = useState({
    images: [],
  });

  useEffect(() => {
    fetchImages();
  }, [patient, updateXRay]);

  useEffect(() => {
    if (disableOnClose) {
      setTimeout(() => {
        setDisableOnClose(false);
      }, 300);
    }
  }, [disableOnClose]);

  const fetchImages = async () => {
    setIsFetching(true);
    try {
      const response = await getPatientXRayImages(patient.id);
      const { data } = response;
      setState({ images: orderBy(data, 'created', 'desc') });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeleteXRayImage = (image) => {
    setDeleteModal({ show: true, image });
  };

  const closeConfirmation = () => {
    setDeleteModal({ show: false, image: null });
  };

  const handleImageClick = (image) => {
    setDisableOnClose(true);
    setImageToView(image);
  };

  const handleCloseImageView = () => {
    setImageToView(null);
  };

  const deleteXRayImage = async () => {
    if (deleteModal.image == null) {
      return;
    }
    try {
      setIsDeleting(true);
      await deletePatientXRayImage(patient.id, deleteModal.image.id);
      await fetchImages();
      setIsDeleting(false);
      closeConfirmation();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data?.message ?? error.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.patientXRay}>
      {imageToView && (
        <Lightbox
          title={textForKey(
            imageToView.imageType
              ? `${imageToView.imageType} phase`
              : 'x_ray_image',
          )}
          image={urlToAWS(imageToView.imageUrl)}
          onClose={disableOnClose ? undefined : handleCloseImageView}
        />
      )}
      <ConfirmationModal
        show={deleteModal.show}
        isLoading={isDeleting}
        title={textForKey('Delete image')}
        message={textForKey('deleteImageConfirmation')}
        onConfirm={deleteXRayImage}
        onClose={closeConfirmation}
      />
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('X-Ray')}
      </Typography>
      <div className={styles.imagesContainer}>
        {!isFetching && (
          <Grid container spacing={2}>
            {state.images.map((image) => (
              <XRayImage
                key={image.id}
                image={image}
                onImageClick={handleImageClick}
                onImageDelete={handleDeleteXRayImage}
              />
            ))}
          </Grid>
        )}
        {isFetching && (
          <div className='progress-bar-wrapper'>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <Button
          variant='outlined'
          disabled={state.isFetching}
          classes={{
            root: styles.addButton,
            label: styles.addButtonLabel,
            outlined: styles.outlinedButton,
          }}
          onClick={onAddXRay}
        >
          {textForKey('Add image')}
          <IconPlus fill={null} />
        </Button>
      </div>
    </div>
  );
};

export default PatientXRay;

PatientXRay.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  onAddXRay: PropTypes.func,
};

PatientXRay.defaultProps = {
  onAddXRay: () => null,
};
