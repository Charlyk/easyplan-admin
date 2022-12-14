import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import IconCheckMark from 'app/components/icons/iconCheckMark';
import { Teeth } from 'app/utils/constants';
import EASModal from '../EASModal';
import styles from './TeethModal.module.scss';

const topLeft = Teeth.filter((item) => item.type === 'top-left');
const topRight = Teeth.filter((item) => item.type === 'top-right');
const bottomLeft = Teeth.filter((item) => item.type === 'bottom-left');
const bottomRight = Teeth.filter((item) => item.type === 'bottom-right');

const TeethModal = ({ open, service, onClose, onSave }) => {
  const textForKey = useTranslate();
  const [selectedTeeth, setSelectedTeeth] = useState([]);

  useEffect(() => {
    return () => {
      setSelectedTeeth([]);
    };
  }, [open]);

  const handleSave = () => {
    if (selectedTeeth.length === 0) {
      return;
    }
    onSave(service, selectedTeeth);
    onClose();
  };

  const handleToothClick = (tooth) => {
    if (selectedTeeth.includes(tooth.toothId)) {
      setSelectedTeeth(selectedTeeth.filter((item) => item !== tooth.toothId));
    } else {
      setSelectedTeeth([...selectedTeeth, tooth.toothId]);
    }
  };

  const isSelected = (tooth) => {
    return selectedTeeth.includes(tooth.toothId);
  };

  return (
    <EASModal
      open={open}
      onClose={onClose}
      className={styles.teethModalRoot}
      primaryBtnText={textForKey('save')}
      onPrimaryClick={handleSave}
      onSecondaryClick={onClose}
      title={`${textForKey('select teeth for')}: ${service?.name}`}
    >
      <div className={styles.teethModalBody}>
        <div className={styles.teethRow}>
          {topLeft.map((item) => (
            <div
              key={item.toothId}
              className={styles.toothWrapper}
              onPointerUp={() => handleToothClick(item)}
            >
              {item.icon}
              <Typography className={styles.toothLabel}>
                {item.toothId}
              </Typography>
              {isSelected(item) && (
                <div className={styles.checkMark}>
                  <IconCheckMark />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.teethRow}>
          {topRight.map((item) => (
            <div
              key={item.toothId}
              className={styles.toothWrapper}
              onPointerUp={() => handleToothClick(item)}
            >
              {item.icon}
              <Typography className={styles.toothLabel}>
                {item.toothId}
              </Typography>
              {isSelected(item) && (
                <div className={styles.checkMark}>
                  <IconCheckMark />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.teethRow}>
          {bottomLeft.map((item) => (
            <div
              key={item.toothId}
              className={styles.toothWrapper}
              onPointerUp={() => handleToothClick(item)}
            >
              {item.icon}
              <Typography className={styles.toothLabel}>
                {item.toothId}
              </Typography>
              {isSelected(item) && (
                <div className={styles.checkMark}>
                  <IconCheckMark />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.teethRow}>
          {bottomRight.map((item) => (
            <div
              key={item.toothId}
              className={styles.toothWrapper}
              onPointerUp={() => handleToothClick(item)}
            >
              {item.icon}
              <Typography className={styles.toothLabel}>
                {item.toothId}
              </Typography>
              {isSelected(item) && (
                <div className={styles.checkMark}>
                  <IconCheckMark />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </EASModal>
  );
};

export default TeethModal;

TeethModal.propTypes = {
  open: PropTypes.bool.isRequired,
  service: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

TeethModal.defaultProps = {
  onSave: () => null,
};
