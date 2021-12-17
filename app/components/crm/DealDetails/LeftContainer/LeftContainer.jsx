import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import IconPlus from 'app/components/icons/iconPlus';
import { textForKey } from 'app/utils/localization';
import Header from './Header';
import styles from './LeftContainer.module.scss';
import PatientInfo from './PatientInfo';
import ScheduleInfo from './ScheduleInfo';

const LeftContainer = ({ deal, states, onLink, onAddSchedule }) => {
  return (
    <div className={styles.leftContainer}>
      <Header deal={deal} states={states} />
      <PatientInfo deal={deal} onLink={onLink} />
      {deal?.schedule != null ? (
        <ScheduleInfo deal={deal} />
      ) : deal?.patient != null ? (
        <Button className={styles.addScheduleBtn} onPointerUp={onAddSchedule}>
          <IconPlus fill='#3A83DC' />
          {textForKey('Add appointment')}
        </Button>
      ) : null}
    </div>
  );
};

export default LeftContainer;

LeftContainer.propTypes = {
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string,
    }),
    patient: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneWithCode: PropTypes.string,
    }),
    state: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
      orderId: PropTypes.number,
      deleteable: PropTypes.bool,
      type: PropTypes.string,
    }),
    assignedTo: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    service: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      currency: PropTypes.string,
    }),
    schedule: PropTypes.shape({
      id: PropTypes.number,
      created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dateAndTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  states: PropTypes.any,
  onAddSchedule: PropTypes.func,
  onLink: PropTypes.func,
};
