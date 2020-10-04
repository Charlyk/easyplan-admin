import React from 'react';

import { Form } from 'react-bootstrap';

import LoadingButton from '../../../../components/LoadingButton';
import { textForKey } from '../../../../utils/localization';

const Filter = props => {
  return (
    <div className='filter'>
      <Form.Group style={{ flexDirection: 'column' }}>
        <Form.Label>{textForKey('Services')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          custom
        >
          <option value='choose'>{textForKey('All services')}</option>
        </Form.Control>
      </Form.Group>
      <Form.Group style={{ flexDirection: 'column' }}>
        <Form.Label>{textForKey('Doctors')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          custom
        >
          <option value='choose'>{textForKey('All doctors')}</option>
        </Form.Control>
      </Form.Group>
      <LoadingButton className='positive-button'>
        {textForKey('Apply filters')}
      </LoadingButton>
    </div>
  );
};

const DoctorsStatistics = props => {
  return (
    <div className='statistics-doctors'>
      <Filter />
      <div className='data-container'>
        <table className='data-table'>
          <thead>
            <tr>
              <td>{textForKey('Doctor')}</td>
              <td>{textForKey('Total income')}</td>
              <td>{textForKey('Doctor part')}</td>
              <td>{textForKey('Total profit')}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
            <tr>
              <td>Leslie Alexander</td>
              <td>2400MDL</td>
              <td>1210MDL</td>
              <td>1390MDL</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsStatistics;
