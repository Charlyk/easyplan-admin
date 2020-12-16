import React, { useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import IconPlus from '../../../../assets/icons/iconPlus';
import { updateXRaySelector } from '../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { textForKey } from '../../../../utils/localization';
import XRayPhase from './XRayPhase';

const ExpandedPhase = {
  initial: 'Initial',
  middle: 'Middle',
  final: 'Final',
};

const PatientXRay = ({ patient, onAddXRay }) => {
  const updateXRay = useSelector(updateXRaySelector);
  const [state, setState] = useState({
    isFetching: false,
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
    setState({
      isFetching: true,
      images: { initial: [], middle: [], final: [] },
    });
    const response = await dataAPI.fetchPatientXRayImages(patient.id);
    if (response.isError) {
      console.error(response.message);
    }

    const { data } = response;

    const mappedImages = {
      initial: getItemsOfType(data, ExpandedPhase.initial),
      middle: getItemsOfType(data, ExpandedPhase.middle),
      final: getItemsOfType(data, ExpandedPhase.final),
    };

    setState({ isFetching: false, images: mappedImages });
  };

  return (
    <div className='patient-x-ray'>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('X-Ray')}
      </Typography>
      <div className='images-container'>
        {!state.isFetching && (
          <XRayPhase
            title={textForKey('Initial phase')}
            isExpanded
            images={state.images.initial}
            phaseId={ExpandedPhase.initial}
          />
        )}
        {!state.isFetching && (
          <XRayPhase
            title={textForKey('Middle phase')}
            isExpanded
            images={state.images.middle}
            phaseId={ExpandedPhase.middle}
          />
        )}
        {!state.isFetching && (
          <XRayPhase
            title={textForKey('Final phase')}
            isExpanded
            images={state.images.final}
            phaseId={ExpandedPhase.final}
          />
        )}
        {state.isFetching && (
          <CircularProgress className='patient-details-spinner' />
        )}
      </div>
      <div className='patient-x-ray__actions'>
        <Button
          className='btn-outline-primary'
          variant='outline-primary'
          onClick={onAddXRay}
          disabled={state.isFetching}
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
