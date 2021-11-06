import React from "react";
import PropTypes from 'prop-types';
import styles from './RightContainer.module.scss';
import DealHistory from "./DealHistory";
import FooterContainer from "./FooterContainer";
import RemindersContainer from "./RemindersContainer";

const RightContainer = ({ deal, currentClinic, showAddReminderHelp, onAddReminder, onPlayAudio }) => {
  return (
    <div className={styles.rightContainer}>
      <div className={styles.center}>
        <DealHistory deal={deal} onPlayAudio={onPlayAudio}/>
        <FooterContainer
          deal={deal}
          currentClinic={currentClinic}
          onAddReminder={onAddReminder}
        />
      </div>
      <RemindersContainer
        deal={deal}
        onAddReminder={onAddReminder}
        showAddReminderHelp={showAddReminderHelp}
      />
    </div>
  )
}

export default RightContainer;

RightContainer.propTypes = {
  showAddReminderHelp: PropTypes.bool,
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string
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
      created: PropTypes.string,
      dateAndTime: PropTypes.string,
      endTime: PropTypes.string,
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  currentUser: PropTypes.any,
  currentClinic: PropTypes.any,
  onAddReminder: PropTypes.func,
  onPlayAudio: PropTypes.func,
}
