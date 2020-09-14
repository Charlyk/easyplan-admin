import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import SwitchButton from '../SwitchButton';

const Service = props => {
  return (
    <div className='doctor-services__service'>
      <SwitchButton isChecked={true} />
      <div className='service-title'>Service title</div>
      <div className='doctor-services__service__fields'>
        <InputGroup>
          <Form.Control
            className='doctor-services__service__field'
            min='0'
            placeholder='%'
            type='number'
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>%</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup>
          <Form.Control
            className='doctor-services__service__field'
            min='0'
            type='number'
            placeholder='$'
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>mdl</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

const DoctorServices = props => {
  const { show } = props;

  const classes = clsx('doctor-services', show ? 'expanded' : 'collapsed');
  return (
    <div className={classes} style={{ height: show ? 48 * 8 : 0 }}>
      <Service />
      <Service />
      <Service />
      <Service />
      <Service />
      <Service />
      <Service />
      <Service />
    </div>
  );
};

export default DoctorServices;

DoctorServices.propTypes = {
  show: PropTypes.bool.isRequired,
};
