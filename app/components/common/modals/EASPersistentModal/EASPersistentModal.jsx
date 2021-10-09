import React from "react";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import styles from "./EASPersistentModal.module.scss";

const EASPersistentModal = ({ open, children }) => {
  return (
    <Modal
      open={open}
      className={styles.modalRoot}
    >
      <Paper className={styles.modalPaper}>
        {children}
      </Paper>
    </Modal>
  )
};

export default EASPersistentModal;
