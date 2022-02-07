import React, { useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheetDialog from 'app/components/common/BottomSheetDialog';
import { textForKey } from 'app/utils/localization';
import notifications from 'app/utils/notifications/notifications';
import wasNotificationShown from 'app/utils/notifications/wasNotificationShown';
import {
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import {
  dealDetailsSelector,
  isFetchingDetailsSelector,
} from 'redux/selectors/crmBoardSelector';
import { CrmDealListItemType, DealStateView, DealView } from 'types';
import { setDealDetails } from '../../../../redux/slices/crmBoardSlice';
import styles from './DealDetails.module.scss';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';

interface DealDetailsProps {
  open: boolean;
  deal: CrmDealListItemType;
  states: DealStateView[];
  onClose?: () => void;
  onLink?: (deal: DealView) => void;
  onAddSchedule?: (deal: DealView) => void;
  onAddReminder?: (deal: DealView) => void;
  onPlayAudio?: (deal: DealView) => void;
}

const DealDetails: React.FC<DealDetailsProps> = ({
  open,
  deal,
  states,
  onClose,
  onLink,
  onAddSchedule,
  onAddReminder,
  onPlayAudio,
}) => {
  const isOpen = open && deal != null;
  const dispatch = useDispatch();
  const isFetching = useSelector(isFetchingDetailsSelector);
  const details = useSelector(dealDetailsSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const currentUser = useSelector(currentUserSelector);
  const [showAddReminderHelp, setShowAddReminderHelp] = useState(false);
  const dialogTitle = useMemo(() => {
    if (deal == null) return '';
    const mainTitle = `${textForKey('Deal')}: #${deal.id}`;
    if (deal.serviceName == null) {
      return mainTitle;
    }
    return `${mainTitle} - ${deal.serviceName}`;
  }, [deal]);

  useEffect(() => {
    if (!open) {
      dispatch(setDealDetails(null));
    }
  }, [open]);

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
    onLink?.(details.deal);
  };

  const handleAddSchedule = () => {
    onAddSchedule?.(details.deal);
  };

  return (
    <BottomSheetDialog
      canSave={false}
      open={open && deal != null}
      onClose={onClose}
      title={dialogTitle}
    >
      <div className={styles.dealDetails}>
        {details != null && (
          <LeftContainer
            deal={details.deal}
            states={states}
            onLink={handleLinkPatient}
            onAddSchedule={handleAddSchedule}
          />
        )}
        {details != null && (
          <RightContainer
            deal={details.deal}
            showAddReminderHelp={showAddReminderHelp}
            currentUser={currentUser}
            currentClinic={currentClinic}
            onAddReminder={onAddReminder}
            onPlayAudio={onPlayAudio}
          />
        )}
        {isFetching && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
          </div>
        )}
      </div>
    </BottomSheetDialog>
  );
};

export default DealDetails;
