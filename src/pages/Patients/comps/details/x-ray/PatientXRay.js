import React, { useEffect, useState } from 'react';

import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import IconPlus from '../../../../../assets/icons/iconPlus';
import { updateXRaySelector } from '../../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../../utils/api/dataAPI';
import { textForKey } from '../../../../../utils/localization';
import XRayPhase from './XRayPhase';

const ExpandedPhase = {
  initial: 'Initial',
  middle: 'Middle',
  final: 'Final',
};

const PatientXRay = ({ patient, onAddXRay }) => {
  const updateXRay = useSelector(updateXRaySelector);
  const [expandedPhase, setExpandedPhase] = useState(ExpandedPhase.initial);
  const [state, setState] = useState({
    isFetching: false,
    images: { initial: [], middle: [], final: [] },
  });

  useEffect(() => {
    fetchImages();
  }, [patient, updateXRay]);

  const handlePhaseToggle = newPhase => {
    setExpandedPhase(newPhase);
  };

  const getItemsOfType = (items, type) => {
    return sortBy(
      items?.filter(item => item.type === type) || [],
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
      <div className='images-container'>
        {!state.isFetching && (
          <XRayPhase
            title='Initial phase'
            isExpanded={expandedPhase === ExpandedPhase.initial}
            images={state.images.initial}
            phaseId={ExpandedPhase.initial}
            onExpand={handlePhaseToggle}
          />
        )}
        {!state.isFetching && (
          <XRayPhase
            title='Middle phase'
            isExpanded={expandedPhase === ExpandedPhase.middle}
            images={state.images.middle}
            phaseId={ExpandedPhase.middle}
            onExpand={handlePhaseToggle}
          />
        )}
        {!state.isFetching && (
          <XRayPhase
            title='Final phase'
            isExpanded={expandedPhase === ExpandedPhase.final}
            images={state.images.final}
            phaseId={ExpandedPhase.final}
            onExpand={handlePhaseToggle}
          />
        )}
        {state.isFetching && (
          <Spinner
            animation='border'
            variant='primary'
            role='status'
            className='loading-spinner'
          />
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
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
  onAddXRay: PropTypes.func,
};

PatientXRay.defaultProps = {
  onAddXRay: () => null,
};
