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
      <Form.Group style={{ flexDirection: 'column' }}>
        <Form.Label>{textForKey('Period')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          custom
        >
          <option value='choose'>{textForKey('All components')}</option>
        </Form.Control>
      </Form.Group>
      <Form.Group style={{ flexDirection: 'column' }}>
        <Form.Label>{textForKey('Status')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          custom
        >
          <option value='choose'>{textForKey('All statuses')}</option>
        </Form.Control>
      </Form.Group>
      <LoadingButton className='positive-button'>
        {textForKey('Apply filters')}
      </LoadingButton>
    </div>
  );
};

const ServicesStatistics = props => {
  return (
    <div className='statistics-services'>
      <Filter />
      <div className='data-container'>
        <table className='data-table'>
          <thead>
            <tr>
              <td>{textForKey('Date')}</td>
              <td>{textForKey('Doctor')}</td>
              <td>{textForKey('Service')}</td>
              <td>{textForKey('Patient')}</td>
              <td>{textForKey('Status')}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12/05/19 14:30</td>
              <td>Dianne Russell</td>
              <td>Extraction</td>
              <td>Leslie Alexander</td>
              <td>
                <span className='status-label waiting'>
                  {textForKey('Waiting')}
                </span>
              </td>
            </tr>
            <tr>
              <td>12/05/19 14:30</td>
              <td>Dianne Russell</td>
              <td>Implant</td>
              <td>Leslie Alexander</td>
              <td>
                <span className='status-label not-come'>
                  {textForKey('Did not come')}
                </span>
              </td>
            </tr>
            <tr>
              <td>12/05/19 14:30</td>
              <td>Dianne Russell</td>
              <td>Extraction</td>
              <td>Leslie Alexander</td>
              <td>
                <span className='status-label finished'>
                  {textForKey('Finished')}
                </span>
              </td>
            </tr>
            <tr>
              <td>12/05/19 14:30</td>
              <td>Dianne Russell</td>
              <td>Whitening</td>
              <td>Leslie Alexander</td>
              <td>
                <span className='status-label confirmed'>
                  {textForKey('Confirmed')}
                </span>
              </td>
            </tr>
            <tr>
              <td>12/05/19 14:30</td>
              <td>Dianne Russell</td>
              <td>Extraction</td>
              <td>Leslie Alexander</td>
              <td>
                <span className='status-label paid'>{textForKey('Paid')}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesStatistics;
