import React, { useState, useCallback } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import IconCheckMark from 'app/components/icons/iconCheckMark';
import EASModal from '../EASModal';
import styles from './DoctorsSelectionModal.module.scss';

interface IdentifiableListableObject {
  id: number;
  name: string;
  disabled?: boolean;
}

interface Props {
  iterable: IdentifiableListableObject[];
  show: boolean;
  primaryBtnText?: string;
  title: string;
  message?: string;
  destroyBtnText: string;
  onClose: () => void;
  onConfirm: (val: any) => void;
}

const OptionsSelectionModal: React.FC<Props> = ({
  iterable,
  show,
  primaryBtnText,
  destroyBtnText,
  title,
  message,
  onClose,
  onConfirm,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const isItemSelected = useCallback(
    (iterableItem) => selectedItems.some((item) => item.id === iterableItem.id),
    [selectedItems],
  );

  const handleItemSelected = (iterableItem) => {
    if (
      selectedItems.some((selectedItem) => selectedItem.id === iterableItem.id)
    ) {
      setSelectedItems((prevState) =>
        prevState.filter((selectedItem) => selectedItem.id !== iterableItem.id),
      );
    } else {
      setSelectedItems((prevState) => [...prevState, iterableItem]);
    }
  };

  const onSubmit = () => {
    onConfirm(selectedItems);
  };

  return (
    <EASModal
      className={styles.modalRoot}
      open={show}
      primaryBtnText={primaryBtnText}
      title={title}
      onPrimaryClick={onSubmit}
      onClose={onClose}
      onDestroyClick={onClose}
      onSecondaryClick={onClose}
      onBackdropClick={onClose}
      destroyBtnText={destroyBtnText}
      size='large'
    >
      <Typography className={styles.subHeading}>{message}</Typography>
      <MenuList>
        {iterable.map((item) => (
          <MenuItem
            disabled={item.disabled || false}
            key={item.id}
            selected={isItemSelected(item)}
            classes={{
              root: styles.menuItem,
              selected: styles.selected,
            }}
            onClick={() => handleItemSelected(item)}
          >
            {item.name}
            {isItemSelected(item) && <IconCheckMark fill='#ec3276' />}
          </MenuItem>
        ))}
      </MenuList>
    </EASModal>
  );
};

export default OptionsSelectionModal;
