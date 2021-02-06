import React, { useEffect, useReducer } from 'react';

import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import sortedBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import {
  clinicDoctorsSelector,
  clinicServicesSelector,
} from '../../redux/selectors/clinicSelector';
import dataAPI from '../../utils/api/dataAPI';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import './styles.scss';
import LoadingButton from '../LoadingButton';

export const MappingData = {
  none: 'none',
  doctors: 'doctors',
  services: 'services',
};

const initialState = {
  isFetching: false,
  items: [],
  mappedItems: [],
};

const reducerTypes = {
  setIsFetching: 'setIsFetching',
  setItems: 'setItems',
  setMappedItems: 'setMappedItems',
  reset: 'reset',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsFetching:
      return {
        ...state,
        isFetching: action.payload,
        items: action.payload ? [] : state.items,
      };
    case reducerTypes.setItems:
      return { ...state, items: action.payload, mappedItems: [] };
    case reducerTypes.setMappedItems:
      return { ...state, mappedItems: action.payload };
    case reducerTypes.reset:
      return initialState;
    default:
      return state;
  }
};

const MapSchedulesDataModal = ({ mode, data, onSubmit, onClose }) => {
  const clinicDoctors = sortedBy(
    useSelector(clinicDoctorsSelector),
    (item) => item.firstName,
  );
  const clinicServices = sortedBy(
    useSelector(clinicServicesSelector),
    (item) => item.name,
  );
  const [{ isFetching, items, mappedItems }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (mode === MappingData.none) {
      localDispatch(actions.reset());
    }
  }, [mode]);

  useEffect(() => {
    if (data != null) {
      fetchData();
    }
  }, [data]);

  const fetchData = async () => {
    localDispatch(actions.setIsFetching(true));
    const response = await dataAPI.fetchExcelDoctorsAndServices(data, mode);
    if (response.isError) {
      console.error(response.message);
    } else {
      localDispatch(actions.setItems(response.data));
    }
    localDispatch(actions.setIsFetching(false));
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit({ ...data, mappedItems, mode });
  };

  const handleItemMapped = (event) => {
    const eventId = event.target.id;
    const eventValue = event.target.value;
    let newItems = cloneDeep(mappedItems);
    if (eventValue === 'None') {
      remove(newItems, (item) => item.target === eventId);
    } else if (newItems.some((item) => item.target === eventId)) {
      newItems = newItems.map((item) => {
        if (item.target !== eventId) {
          return item;
        }

        return {
          ...item,
          reference: eventValue,
        };
      });
    } else {
      newItems.push({ target: eventId, reference: eventValue });
    }

    localDispatch(actions.setMappedItems(newItems));
  };

  const renderOptions = () => {
    switch (mode) {
      case MappingData.doctors:
        return clinicDoctors.map((item) => (
          <option key={item.id} value={item.id}>
            {`${item.firstName} ${item.lastName}`}
          </option>
        ));
      default:
        return clinicServices.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ));
    }
  };

  return (
    <Modal
      centered
      show={mode !== MappingData.none}
      onHide={onClose}
      className='map-schedules-data-modal easyplan-modal'
    >
      <Modal.Header>
        {mode === MappingData.doctors
          ? textForKey('Map doctors')
          : textForKey('Map services')}
        <div
          role='button'
          tabIndex={0}
          onClick={handleCloseModal}
          className='close-modal-btn'
        >
          <IconClose />
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className='data-wrapper'>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <td>{textForKey('Value in your file')}</td>
                  <td>{textForKey('Value in EasyPlan')}</td>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item}>
                    <td>
                      <Typography
                        classes={{
                          root: clsx('data-label', {
                            placeholder: item.length === 0,
                          }),
                        }}
                      >
                        {item.length > 0
                          ? item
                          : textForKey('No name specified')}
                      </Typography>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control
                          onChange={handleItemMapped}
                          as='select'
                          className='mr-sm-2'
                          id={item}
                          custom
                        >
                          <option value='None'>--</option>
                          {renderOptions()}
                        </Form.Control>
                      </Form.Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Typography classes={{ root: 'note-label' }}>
            {textForKey('Note')}:{' '}
            {textForKey('Unmapped items will not be imported')}
          </Typography>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='cancel-button' onClick={handleCloseModal}>
          {textForKey('Close')}
          <IconClose />
        </Button>
        <LoadingButton
          isLoading={isFetching}
          onClick={handleSubmit}
          className='positive-button'
          disabled={mappedItems.length === 0 || isFetching}
        >
          {textForKey('Save')}
          <IconSuccess fill='#FFF' />
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default MapSchedulesDataModal;

MapSchedulesDataModal.propTypes = {
  title: PropTypes.string,
  data: PropTypes.shape({
    fileName: PropTypes.string,
    fileUrl: PropTypes.string,
    cellTypes: PropTypes.array,
  }),
  mode: PropTypes.oneOf([
    MappingData.none,
    MappingData.doctors,
    MappingData.services,
  ]),
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
};

MapSchedulesDataModal.defaultProps = {
  title: textForKey('Map doctors'),
};
