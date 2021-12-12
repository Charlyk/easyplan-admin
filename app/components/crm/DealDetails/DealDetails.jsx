import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import BottomSheetDialog from 'app/components/common/BottomSheetDialog';
import { textForKey } from 'app/utils/localization';
import notifications from 'app/utils/notifications/notifications';
import wasNotificationShown from 'app/utils/notifications/wasNotificationShown';
import styles from './DealDetails.module.scss';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';

const DealDetails = ({
  open,
  deal,
  states,
  currentClinic,
  currentUser,
  onClose,
  onLink,
  onAddSchedule,
  onAddReminder,
  onPlayAudio,
}) => {
  const isOpen = open && deal != null;
  const [showAddReminderHelp, setShowAddReminderHelp] = useState(false);
  const dialogTitle = useMemo(() => {
    if (deal == null) return '';
    const mainTitle = `${textForKey('Deal')}: #${deal.id}`;
    if (deal.service == null) {
      return mainTitle;
    }
    return `${mainTitle} - ${deal.service.name} (${deal.service.price} ${deal.service.currency})`;
  }, [deal]);

  useEffect(() => {
    setTimeout(() => {
      if (isOpen) {
        setShowAddReminderHelp(
          !wasNotificationShown(notifications.crmAddReminder.id),
        );
      } else {
        setShowAddReminderHelp(false);
      }
    }, 1000);
  }, [isOpen]);

  const handleLinkPatient = () => {
    onLink?.(deal);
  };

  const handleAddSchedule = () => {
    onAddSchedule?.(deal);
  };

  return (
    <BottomSheetDialog
      canSave={false}
      open={open && deal != null}
      onClose={onClose}
      title={dialogTitle}
    >
      <div className={styles.dealDetails}>
        <LeftContainer
          deal={deal}
          states={states}
          onLink={handleLinkPatient}
          onAddSchedule={handleAddSchedule}
        />
        <RightContainer
          deal={deal}
          showAddReminderHelp={showAddReminderHelp}
          currentUser={currentUser}
          currentClinic={currentClinic}
          onAddReminder={onAddReminder}
          onPlayAudio={onPlayAudio}
        />
      </div>
    </BottomSheetDialog>
  );
};

export default DealDetails;

DealDetails.propTypes = {
  open: PropTypes.bool,
  currentUser: PropTypes.any,
  currentClinic: PropTypes.any,
  dealItem: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    movedToClinic: PropTypes.shape({
      id: PropTypes.number,
      clinicName: PropTypes.string,
    }),
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
  onAddSchedule: PropTypes.func,
  onLink: PropTypes.func,
  onClose: PropTypes.func,
  onAddReminder: PropTypes.func,
  onPlayAudio: PropTypes.func,
};
