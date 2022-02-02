import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import clsx from 'clsx';
import { useColor } from 'react-color-palette';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import ActionsSheet from 'app/components/common/ActionsSheet';
import EASColorPicker from 'app/components/common/EASColorPicker';
import ConfirmationModal from 'app/components/common/modals/ConfirmationModal';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import { requestChangeDealColumn } from 'middleware/api/crm';
import { dealsForStateSelector } from 'redux/selectors/crmBoardSelector';
import {
  dispatchCreateDealState,
  dispatchDeleteDealState,
  dispatchUpdateDealState,
} from 'redux/slices/crmBoardSlice';
import { CrmDealListItemType, DealStateType, DealStateView } from 'types';
import { ColumnMoveDirection } from 'types/api';
import AddColumnModal from '../AddColumnModal';
import { ItemTypes } from './constants';
import DealItem from './DealItem';
import styles from './DealsColumn.module.scss';
import reducer, {
  initialState,
  setColumnData,
  setColumnName,
  setIsEditingName,
  setPage,
  setShowActions,
  setShowColorPicker,
  setShowCreateColumn,
  setShowDeleteColumn,
  sheetActions,
} from './DealsColumn.reducer';

interface DealsColumnProps {
  dealState: DealStateView;
  width?: number;
  isFirst?: boolean;
  isLast?: boolean;
  onMove?: (direction: ColumnMoveDirection, state: DealStateView) => void;
  onLinkPatient?: (deal: CrmDealListItemType) => void;
  onDeleteDeal?: (deal: CrmDealListItemType) => void;
  onConfirmFirstContact?: (deal: CrmDealListItemType) => void;
  onDealClick?: (deal: CrmDealListItemType) => void;
  onAddSchedule?: (deal: CrmDealListItemType) => void;
}

const DealsColumn: React.FC<DealsColumnProps> = ({
  dealState,
  width,
  isFirst,
  isLast,
  onMove,
  onLinkPatient,
  onDeleteDeal,
  onAddSchedule,
  onConfirmFirstContact,
  onDealClick,
}) => {
  const dispatch = useDispatch();
  const actionsBtnRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [color, setColor] = useColor('hex', dealState.color);
  const { total: totalElements, data: items } = useSelector((state) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dealsForStateSelector(state, dealState),
  );

  const [
    {
      showActions,
      isEditingName,
      columnName,
      columnColor,
      showColorPicker,
      showCreateColumn,
      showDeleteColumn,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const filteredActions = useMemo(() => {
    return sheetActions.filter((action) => {
      return (
        (dealState.deleteable || action.key !== 'deleteColumn') &&
        (!isFirst || action.key !== 'moveToLeft') &&
        (!isLast || action.key !== 'moveToRight')
      );
    });
  }, [dealState, isFirst, isLast]);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept:
        dealState.type === DealStateType.Unsorted ||
        dealState.type === DealStateType.Rescheduled ||
        dealState.type === DealStateType.Completed
          ? ItemTypes.NONE
          : dealState.type === DealStateType.Custom
          ? [ItemTypes.ALL, ItemTypes.SCHEDULED, ItemTypes.UNSCHEDULED]
          : dealState.type === DealStateType.FirstContact
          ? [ItemTypes.UNSCHEDULED, ItemTypes.ALL]
          : [ItemTypes.SCHEDULED, ItemTypes.UNSCHEDULED],
      drop: (item) => handleDealDrop(item as CrmDealListItemType),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [dealState],
  );

  useEffect(() => {
    if (dealState == null) {
      return;
    }
    localDispatch(setColumnData(dealState));
    return () => {
      localDispatch(setPage(0));
    };
  }, [dealState]);

  const handleDealDrop = async (deal: CrmDealListItemType) => {
    try {
      if (
        deal.stateId === dealState.id ||
        (dealState.type !== 'Custom' &&
          dealState.orderId < deal.stateOrderId) ||
        (deal.stateType === DealStateType.Completed &&
          dealState.type === DealStateType.Failed)
      ) {
        // no need to change deal state
        return;
      }
      if (deal.patientId == null) {
        onLinkPatient?.(deal);
        return;
      }
      if (
        (dealState.type === 'Scheduled' ||
          dealState.type === 'Completed' ||
          dealState.type === 'Failed') &&
        deal.scheduleId == null
      ) {
        onAddSchedule?.(deal);
        return;
      }
      await requestChangeDealColumn(dealState.id, deal.id);
    } catch (error) {
      onRequestError(error);
    }
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    localDispatch(setColumnName(newName));
  };

  const handleCreateColumn = (columnName) => {
    dispatch(
      dispatchCreateDealState({
        name: columnName,
        orderId: dealState.orderId + 1,
      }),
    );
    localDispatch(setShowCreateColumn(false));
  };

  const handleCloseCreateColumn = () => {
    localDispatch(setShowCreateColumn(false));
  };

  const handleSaveColumnName = () => {
    dispatch(
      dispatchUpdateDealState({
        stateId: dealState.id,
        body: { name: columnName },
      }),
    );
  };

  const handleEditColumn = () => {
    localDispatch(setShowActions(true));
  };

  const handleCloseActions = () => {
    localDispatch(setShowActions(false));
  };

  const handleCloseColorPicker = () => {
    localDispatch(setShowColorPicker(false));
  };

  const handleSaveColor = () => {
    dispatch(
      dispatchUpdateDealState({
        stateId: dealState.id,
        body: { color: color.hex },
      }),
    );
  };

  const showConfirmDelete = () => {
    localDispatch(setShowDeleteColumn(true));
  };

  const closeConfirmDelete = () => {
    localDispatch(setShowDeleteColumn(false));
  };

  const handleDeleteColumn = () => {
    dispatch(dispatchDeleteDealState(dealState.id));
  };

  const handleActionsSelected = (action) => {
    switch (action.key) {
      case 'renameColumn':
        localDispatch(setIsEditingName(true));
        break;
      case 'moveToRight':
        onMove?.(ColumnMoveDirection.Right, dealState);
        break;
      case 'moveToLeft':
        onMove?.(ColumnMoveDirection.Left, dealState);
        break;
      case 'changeColor':
        localDispatch(setShowColorPicker(true));
        break;
      case 'addColumn':
        localDispatch(setShowCreateColumn(true));
        break;
      case 'deleteColumn':
        showConfirmDelete();
        break;
    }
    handleCloseActions();
  };

  return (
    <div
      ref={drop}
      style={{ width }}
      className={clsx(styles.dealsColumn, { [styles.dropOver]: isOver })}
    >
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
      <ConfirmationModal
        show={showDeleteColumn}
        title={textForKey('delete_crm_column', dealState.name)}
        message={textForKey('delete_crm_column_message')}
        onClose={closeConfirmDelete}
        onConfirm={handleDeleteColumn}
      />
      <EASColorPicker
        open={showColorPicker}
        anchorEl={colorPickerRef.current}
        placement='bottom'
        color={color}
        setColor={setColor}
        onSave={handleSaveColor}
        onClose={handleCloseColorPicker}
      />
      <div className={styles.titleContainer} style={{ width }}>
        {isEditingName ? (
          <Box display='flex'>
            <TextField
              value={columnName}
              InputProps={{
                className: styles.titleLabel,
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
          <Box display='flex'>
            <Typography className={styles.titleLabel}>{columnName}</Typography>
            <Typography className={styles.countLabel}>
              {totalElements}
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
      <div id='scrollableDiv' className={styles.dataContainer}>
        <div className={styles.itemsContainer} key='deal-items'>
          {items?.map((item) => (
            <DealItem
              key={item.id}
              onDealClick={onDealClick}
              dealItem={item}
              onLinkPatient={onLinkPatient}
              onDeleteDeal={onDeleteDeal}
              onConfirmFirstContact={onConfirmFirstContact}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealsColumn;
