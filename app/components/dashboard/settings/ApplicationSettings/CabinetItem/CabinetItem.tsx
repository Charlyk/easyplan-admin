import React, { KeyboardEvent, useState, useRef, memo } from 'react';
import { IconButton } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { useTranslate } from 'react-polyglot';
import { useDispatch } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import IconCheckMark from 'app/components/icons/iconCheckMark';
import IconDelete from 'app/components/icons/iconDelete';
import IconEdit from 'app/components/icons/iconEdit';
import IconPlus from 'app/components/icons/iconPlus';
import onRequestError from 'app/utils/onRequestError';
import { updateCabinet as middlewareUpdateCabinet } from 'middleware/api/cabinets';
import { updateCabinet } from 'redux/slices/cabinetsData';
import { ClinicCabinet } from 'types';
import styles from './CabinetItem.module.scss';

interface Props {
  cabinet: ClinicCabinet;
  handleDeleteCabinet?: (cabinet: number) => void;
  handleAddDoctor?: (id: number) => void;
  handleDeleteDoctor?: (cabinetId: number, doctorId: number) => void;
}

const CabinetItem: React.FC<Props> = ({
  cabinet,
  handleDeleteCabinet,
  handleAddDoctor,
  handleDeleteDoctor,
}) => {
  const textForKey = useTranslate();
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [inputValue, setInputValue] = useState(cabinet.name);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const handleKeyDown = (evt: KeyboardEvent): void => {
    if (evt.key === 'Enter') {
      handleEditCompleted();
    }
  };

  const handleIsBeingEditedClick = (): void => {
    setIsBeingEdited((prevState) => !prevState);
    setTimeout(() => {
      inputRef.current?.querySelector('input').focus();
    }, 0);
  };

  const handleEditCompleted = async (): Promise<void> => {
    try {
      const body = { id: cabinet.id, name: inputValue };

      const { data } = await middlewareUpdateCabinet(body);
      dispatch(updateCabinet(data));
      handleIsBeingEditedClick();
    } catch (err) {
      onRequestError(err);
    }
  };

  return (
    <div className={styles.cabinet}>
      <div className={styles.cabinetTitleWrapper}>
        {!isBeingEdited ? (
          <IconButton
            className={styles.editBtn}
            onClick={handleIsBeingEditedClick}
          >
            <IconEdit fill='#3A83DC' />
          </IconButton>
        ) : (
          <IconButton className={styles.editBtn} onClick={handleEditCompleted}>
            <IconCheckMark fill='#ec3276' />
          </IconButton>
        )}
        {!isBeingEdited && (
          <IconButton onClick={() => handleDeleteCabinet(cabinet.id)}>
            <IconDelete fill='#ec3276' />
          </IconButton>
        )}
        <div className={styles.divContainer}>
          {isBeingEdited ? (
            <EASTextField
              ref={inputRef}
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={(data: string) => setInputValue(data)}
            />
          ) : (
            <h4 className={styles.cabinetTitle}>{cabinet.name}</h4>
          )}
        </div>
      </div>
      <div className={styles.cabinetDoctorsContainer}>
        <Chip
          variant='default'
          onClick={() => handleAddDoctor(cabinet.id)}
          label={textForKey('add doctor')}
          icon={<IconPlus />}
          classes={{
            root: styles.iconPlus,
            outlined: styles.outlined,
            label: styles.label,
          }}
        />
        {cabinet.users?.map((user) => {
          return (
            <Chip
              key={user.id}
              label={`${user.user.firstName} ${user.user.lastName}`}
              classes={{
                root: styles.doctor,
                outlined: styles.outlined,
                label: styles.label,
                deleteIcon: styles.deleteIcon,
              }}
              variant='outlined'
              onDelete={() => handleDeleteDoctor(cabinet.id, user.user.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(CabinetItem);
