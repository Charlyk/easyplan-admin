import React, { useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import IconPlus from '../../../icons/iconPlus';
import { updateXRaySelector } from '../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../utils/localization';
import XRayPhase from './XRayPhase';
import styles from '../../../../styles/patient/PatientXRay.module.scss'
import { toast } from "react-toastify";
import axios from "axios";

const ExpandedPhase = {
  initial: 'Initial',
  middle: 'Middle',
  final: 'Final',
};

const PatientXRay = ({ patient, onAddXRay }) => {
  const updateXRay = useSelector(updateXRaySelector);
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
      const response = await axios.get(`/api/patients/${patient.id}/x-ray`);
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

  return (
    <div className={styles['patient-x-ray']}>
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
          />
        )}
        {!isFetching && (
          <XRayPhase
            title={textForKey('Middle phase')}
            isExpanded
            images={state.images.middle}
            phaseId={ExpandedPhase.middle}
          />
        )}
        {!isFetching && (
          <XRayPhase
            title={textForKey('Final phase')}
            isExpanded
            images={state.images.final}
            phaseId={ExpandedPhase.final}
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
