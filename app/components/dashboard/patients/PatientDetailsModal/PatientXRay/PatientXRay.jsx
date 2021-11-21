import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import sortBy from 'lodash/sortBy';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Lightbox from 'react-awesome-lightbox';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import IconPlus from 'app/components/icons/iconPlus';
import { textForKey } from 'app/utils/localization';
import urlToAWS from 'app/utils/urlToAWS';
import {
  deletePatientXRayImage,
  getPatientXRayImages,
} from 'middleware/api/patients';
import { updateXRaySelector } from 'redux/selectors/rootSelector';
import styles from './PatientXRay.module.scss';
import XRayPhase from './XRayPhase';

const ConfirmationModal = dynamic(() =>
  import('app/components/common/modals/ConfirmationModal'),
);

const ExpandedPhase = {
  initial: 'Initial',
  middle: 'Middle',
  final: 'Final',
};

const PatientXRay = ({ patient, onAddXRay }) => {
  const updateXRay = useSelector(updateXRaySelector);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageToView, setImageToView] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, image: null });
  const [isFetching, setIsFetching] = useState(false);
  const [state, setState] = useState({
    images: { initial: [], middle: [], final: [] },
  });

  useEffect(() => {
    fetchImages();
  }, [patient, updateXRay]);

  const getItemsOfType = (items, type) => {
    return sortBy(
      items?.filter((item) => item.imageType === type) || [],
      (item) => item.created,
    ).reverse();
  };

  const fetchImages = async () => {
    setIsFetching(true);
    try {
      const response = await getPatientXRayImages(patient.id);
      const { data } = response;

      const mappedImages = {
        initial: getItemsOfType(data, ExpandedPhase.initial),
        middle: getItemsOfType(data, ExpandedPhase.middle),
        final: getItemsOfType(data, ExpandedPhase.final),
      };
      setState({ images: mappedImages });
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
          title={textForKey(`${imageToView.imageType} phase`)}
          image={urlToAWS(imageToView.imageUrl)}
          onClose={handleCloseImageView}
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
          <XRayPhase
            title={textForKey('Initial phase')}
            isExpanded
            images={state.images.initial}
            phaseId={ExpandedPhase.initial}
            onImageClick={handleImageClick}
            onDeleteImage={handleDeleteXRayImage}
          />
        )}
        {!isFetching && (
          <XRayPhase
            title={textForKey('Middle phase')}
            isExpanded
            images={state.images.middle}
            phaseId={ExpandedPhase.middle}
            onImageClick={handleImageClick}
            onDeleteImage={handleDeleteXRayImage}
          />
        )}
        {!isFetching && (
          <XRayPhase
            title={textForKey('Final phase')}
            isExpanded
            images={state.images.final}
            phaseId={ExpandedPhase.final}
            onImageClick={handleImageClick}
            onDeleteImage={handleDeleteXRayImage}
          />
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
