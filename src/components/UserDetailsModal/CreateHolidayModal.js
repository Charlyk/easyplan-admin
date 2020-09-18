import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Form, InputGroup, Modal, Button } from 'react-bootstrap';
import { DateRange } from 'react-date-range';

import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { textForKey } from '../../utils/localization';

const CreateHolidayModal = ({ show, onClose, onCreate }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  return (
    <Modal
      centered={true}
      show={show}
      onHide={onClose}
      className='holiday-modal'
    >
      <Modal.Header>
        {textForKey('Add holiday')}
        <div role='button' tabIndex={0} className='modal-header__close-btn'>
          <IconClose />
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className='holiday-modal__body'>
          <div className='holiday-modal__body__picker'>
            <DateRange
              showDateDisplay={false}
              onChange={item => setState([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={state}
              direction='vertical'
              scroll={{ enabled: true }}
            />
          </div>
          <Form.Group controlId='fromDate'>
            <Form.Label>{textForKey('From')}</Form.Label>
            <InputGroup>
              <Form.Control type='text' />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId='toDate'>
            <Form.Label>{textForKey('Until')}</Form.Label>
            <InputGroup>
              <Form.Control type='text' />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>{textForKey('Description')}</Form.Label>
            <InputGroup>
              <Form.Control as='textarea' aria-label='With textarea' />
            </InputGroup>
          </Form.Group>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className='holiday-modal__footer'>
          <Button className='cancel-button'>
            {textForKey('Close')}
            <IconClose />
          </Button>
          <Button className='positive-button'>
            {textForKey('Save')}
            <IconSuccess />
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateHolidayModal;

CreateHolidayModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
