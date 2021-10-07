import React from 'react';
import Drawer from "@material-ui/core/Drawer";
import clsx from 'clsx';
import PropTypes from 'prop-types';

import areComponentPropsEqual from "../../../utils/areComponentPropsEqual";
import ModalHeader from './ModalHeader';
import styles from './LeftSideModal.module.scss';

const LeftSideModal = (props) => {
  const { show, onClose, children, title, steps, className } = props;

  return (
    <Drawer
      anchor="right"
      open={show}
      onClose={onClose}
      classes={{
        root: styles.drawerRoot,
        paper: clsx(styles.drawerPaperRoot, className),
      }}
    >
      <div className={styles.drawerContent}>
        <ModalHeader title={title} steps={steps} onClose={onClose}/>
        {children}
      </div>
    </Drawer>
  );
};

export default React.memo(LeftSideModal, areComponentPropsEqual);

LeftSideModal.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.any,
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

LeftSideModal.defaultProps = {
  onClose: () => null,
};
