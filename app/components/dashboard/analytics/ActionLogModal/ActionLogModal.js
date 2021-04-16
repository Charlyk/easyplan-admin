import React from 'react';

import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';

import { textForKey } from '../../../../../utils/localization';
import EasyPlanModal from '../../../../../components/common/EasyPlanModal';

const ActionLogModal = ({ open, activityLog, onClose }) => {
  return (
    <EasyPlanModal
      hidePositiveBtn
      open={open}
      onClose={onClose}
      title={`${textForKey(activityLog?.userName)} ${textForKey(
        activityLog?.action,
      )?.toLowerCase()}`}
    >
      {activityLog && <ReactJson src={JSON.parse(activityLog.details)} />}
    </EasyPlanModal>
  );
};

export default ActionLogModal;

ActionLogModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  activityLog: PropTypes.shape({
    details: PropTypes.string,
    id: PropTypes.string,
    userName: PropTypes.string,
    action: PropTypes.string,
  }),
};
