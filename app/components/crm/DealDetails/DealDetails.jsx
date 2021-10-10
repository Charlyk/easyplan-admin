import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import { textForKey } from "../../../utils/localization";
import BottomSheetDialog from "../../common/BottomSheetDialog";
import LeftContainer from "./LeftContainer";
import styles from './DealDetails.module.scss';

const DealDetails = ({ open, deal, states, onClose }) => {
  const dialogTitle = useMemo(() => {
    if (deal == null) return '';
    const mainTitle = `${textForKey('Deal')}: #${deal.id}`;
    if (deal.service == null) {
      return mainTitle;
    }
    return `${mainTitle} - ${deal.service.name}`;
  }, [deal]);

  return (
    <BottomSheetDialog
      canSave={false}
      open={open && deal != null}
      onClose={onClose}
      title={dialogTitle}
    >
      <div className={styles.dealDetails}>
        <LeftContainer deal={deal} states={states} />
      </div>
    </BottomSheetDialog>
  )
};

export default DealDetails;

DealDetails.propTypes = {
  open: PropTypes.bool,
  dealItem: PropTypes.shape({
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
  onClose: PropTypes.func,
}