import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';

import IconPlus from '../../../../icons/iconPlus';
import { updateXRaySelector } from '../../../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../../../utils/localization';
import { deletePatientXRayImage, getPatientXRayImages } from "../../../../../../middleware/api/patients";
import XRayPhase from './XRayPhase';
import styles from './PatientXRay.module.scss'

const ConfirmationModal = dynamic(() => import("../../../../common/modals/ConfirmationModal"));

const ExpandedPhase = {
  initial: 'Initial',
  middle: 'Middle',
  final: 'Final',
};

const PatientXRay = ({ patient, onAddXRay }) => {
  const updateXRay = useSelector(updateXRaySelector);
  const [isDeleting, setIsDeleting] = useState(false);
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
      items?.filter(item => item.imageType === type) || [],
      item => item.created,
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
  }

  const closeConfirmation = () => {
    setDeleteModal({ show: false, image: null });
  }

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
  }

  return (
    <div className={styles['patient-x-ray']}>
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
      <div className={styles['images-container']}>
        {!isFetching && (
          <XRayPhase
            title={textForKey('Initial phase')}
            isExpanded
            images={state.images.initial}
            phaseId={ExpandedPhase.initial}
            onDeleteImage={handleDeleteXRayImage}
          />
        )}
        {!isFetching && (
          <XRayPhase
            title={textForKey('Middle phase')}
            isExpanded
            images={state.images.middle}
            phaseId={ExpandedPhase.middle}
            onDeleteImage={handleDeleteXRayImage}
          />
        )}
        {!isFetching && (
          <XRayPhase
            title={textForKey('Final phase')}
            isExpanded
            images={state.images.final}
            phaseId={ExpandedPhase.final}
            onDeleteImage={handleDeleteXRayImage}
          />
        )}
        {isFetching && (
          <div className='progress-bar-wrapper'>
            <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
          </div>
        )}
      </div>
      <div className={styles['patient-x-ray__actions']}>
        <Button
          className='btn-outline-primary'
          variant='outline-primary'
          onClick={onAddXRay}
          disabled={state.isFetching}
        >
          {textForKey('Add image')}
          <IconPlus fill={null}/>
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
