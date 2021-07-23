import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import ModalHeader from './ModalHeader';
import styles from './LeftSideModal.module.scss';
import { Drawer, Paper } from "@material-ui/core";

const LeftSideModal = (props) => {
  const { show, onClose, children, title, steps } = props;

  return (
    <Drawer anchor="right" open={show} onClose={onClose} className={styles.drawerRoot}>
      <Paper className={styles.drawerPaper}>
        <div className={styles.drawerContent}>
          <ModalHeader title={title} steps={steps} onClose={onClose} />
          {children}
        </div>
      </Paper>
    </Drawer>
  );
};

export default LeftSideModal;

LeftSideModal.propTypes = {
  title: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.any,
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

LeftSideModal.defaultProps = {
  onClose: () => null,
};
