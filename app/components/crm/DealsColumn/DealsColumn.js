import React, { useEffect, useMemo, useReducer, useRef } from "react";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import DoneIcon from '@material-ui/icons/Done';
import { useColor } from "react-color-palette";

import { createNewDealState, deleteDealState, updateDealState } from "../../../../middleware/api/crm";
import ActionsSheet from "../../../../components/common/ActionsSheet";
import EASColorPicker from "../../common/EASColorPicker";
import reducer, {
  sheetActions,
  initialState,
  setShowActions,
  setIsEditingName,
  setColumnName,
  setShowColorPicker,
  setColumnData,
  setColumnColor,
  setShowCreateColumn,
} from './DealsColumn.reducer';
import styles from './DealsColumn.module.scss';
import AddColumnModal from "../AddColumnModal";
import { toast } from "react-toastify";

const DealsColumn = ({ dealState, isFirst, isLast, onMove, onUpdate }) => {
  const actionsBtnRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [color, setColor] = useColor('hex', dealState.color);
  const [{
    showActions,
    isEditingName,
    columnName,
    columnColor,
    showColorPicker,
    showCreateColumn
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (dealState == null) {
      return;
    }
    localDispatch(setColumnData(dealState));
  }, [dealState]);

  const filteredActions = useMemo(() => {
    return sheetActions.filter(action => {
      return (
        (dealState.deleteable || action.key !== 'deleteColumn') &&
        (!isFirst || action.key !== 'moveToLeft') &&
        (!isLast || action.key !== 'moveToRight')
      )
    })
  }, [dealState, isFirst, isLast]);

  const handleNameChange = (event) => {
    const newName = event.target.value;
    localDispatch(setColumnName(newName));
  };

  const handleCreateColumn = async (columnName) => {
    try {
      await createNewDealState({ name: columnName, orderId: dealState.orderId + 1 });
      await onUpdate();
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setShowCreateColumn(false));
    }
  }

  const handleCloseCreateColumn = () => {
    localDispatch(setShowCreateColumn(false));
  }

  const handleSaveColumnName = async () => {
    try {
      await updateDealState({ name: columnName }, dealState.id);
    } catch (error) {
      localDispatch(setColumnName(dealState.name));
    } finally {
      localDispatch(setIsEditingName(false));
    }
  };

  const handleEditColumn = () => {
    localDispatch(setShowActions(true))
  };

  const handleCloseActions = () => {
    localDispatch(setShowActions(false));
  };

  const handleCloseColorPicker = () => {
    localDispatch(setShowColorPicker(false));
  };

  const handleSaveColor = async () => {
    try {
      await updateDealState({ color: color.hex }, dealState.id);
      localDispatch(setColumnColor(color.hex));
    } catch (error) {
      localDispatch(setColumnColor(dealState.color));
    } finally {
      handleCloseColorPicker()
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await deleteDealState(dealState.id);
      await onUpdate();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleActionsSelected = (action) => {
    switch (action.key) {
      case 'renameColumn':
        localDispatch(setIsEditingName(true));
        break;
      case 'moveToRight':
        onMove?.('right', dealState);
        break;
      case 'moveToLeft':
        onMove?.('left', dealState);
        break;
      case 'changeColor':
        localDispatch(setShowColorPicker(true));
        break;
      case 'addColumn':
        localDispatch(setShowCreateColumn(true));
        break;
      case 'deleteColumn':
        handleDeleteColumn();
        break
    }
    handleCloseActions();
  };

  return (
    <div className={styles.dealsColumn}>
      <AddColumnModal
        open={showCreateColumn}
        onSave={handleCreateColumn}
        onClose={handleCloseCreateColumn}
      />
      <ActionsSheet
        open={showActions}
        anchorEl={actionsBtnRef.current}
        actions={filteredActions}
        onSelect={handleActionsSelected}
        onClose={handleCloseActions}
      />
      <EASColorPicker
        open={showColorPicker}
        anchorEl={colorPickerRef.current}
        placement="bottom"
        color={color}
        setColor={setColor}
        onSave={handleSaveColor}
        onClose={handleCloseColorPicker}
      />
      <div className={styles.titleContainer}>
        {isEditingName ? (
          <Box display="flex">
            <TextField
              value={columnName}
              InputProps={{
                className: styles.titleLabel
              }}
              onChange={handleNameChange}
            />
            <IconButton
              className={styles.saveButton}
              onPointerUp={handleSaveColumnName}
            >
              <DoneIcon />
            </IconButton>
          </Box>
        ) : (
          <Box display="flex">
            <Typography className={styles.titleLabel}>
              {columnName}
            </Typography>
            <Typography className={styles.countLabel}>
              30
            </Typography>
          </Box>
        )}
        <div
          ref={colorPickerRef}
          className={styles.colorIndicator}
          style={{ backgroundColor: columnColor }}
        />
        <div className={styles.editBtnContainer} ref={actionsBtnRef}>
          <IconButton onPointerUp={handleEditColumn}>
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
};

export default DealsColumn;

DealsColumn.propTypes = {
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  dealState: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    orderId: PropTypes.number,
    deleteable: PropTypes.bool,
  }),
  onMove: PropTypes.func,
};
