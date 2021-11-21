import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { useColor } from 'react-color-palette';
import { useDrop } from 'react-dnd';
import InfiniteScroll from 'react-infinite-scroller';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ActionsSheet from 'app/components/common/ActionsSheet';
import EASColorPicker from 'app/components/common/EASColorPicker';
import extractCookieByName from 'app/utils/extractCookieByName';
import usePrevious from 'app/utils/hooks/usePrevious';
import onRequestError from 'app/utils/onRequestError';
import {
  createNewDealState,
  deleteDealState,
  requestChangeDealColumn,
  requestFetchDeals,
  updateDealState,
} from 'middleware/api/crm';
import {
  deletedDealSelector,
  newDealSelector,
  updatedDealSelector,
} from 'redux/selectors/crmSelector';
import AddColumnModal from '../AddColumnModal';
import { ItemTypes } from './constants';
import DealItem from './DealItem';
import styles from './DealsColumn.module.scss';
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
  setData,
  setIsFetching,
  setUpdatedDeal,
  addNewDeal,
  removeDeal,
  setPage,
} from './DealsColumn.reducer';

const COOKIES_KEY = 'crm_filter';

const DealsColumn = ({
  dealState,
  width,
  isFirst,
  isLast,
  updatedDeal,
  filterData,
  currentClinic,
  onMove,
  onUpdate,
  onLinkPatient,
  onDeleteDeal,
  onAddSchedule,
  onConfirmFirstContact,
  onDealClick,
}) => {
  const actionsBtnRef = useRef(null);
  const colorPickerRef = useRef(null);
  const createdDeal = useSelector(newDealSelector);
  const updatedDealData = useSelector(updatedDealSelector);
  const deletedDeal = useSelector(deletedDealSelector);
  const [color, setColor] = useColor('hex', dealState.color);
  const previousFilter = usePrevious(filterData);
  const [
    {
      isFetching,
      showActions,
      isEditingName,
      columnName,
      columnColor,
      showColorPicker,
      showCreateColumn,
      totalElements,
      items,
      page,
      itemsPerPage,
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
        dealState.type === 'Unsorted' ||
        dealState.type === 'Rescheduled' ||
        dealState.type === 'Completed'
          ? ItemTypes.NONE
          : dealState.type === 'Custom'
          ? [ItemTypes.ALL, ItemTypes.SCHEDULED, ItemTypes.UNSCHEDULED]
          : dealState.type === 'FirstContact'
          ? [ItemTypes.UNSCHEDULED, ItemTypes.ALL]
          : [ItemTypes.SCHEDULED, ItemTypes.UNSCHEDULED],
      drop: (item) => handleDealDrop(item),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [dealState],
  );

  useEffect(() => {
    if (isEqual(filterData, previousFilter)) {
      return;
    }
    fetchDealsForState();
  }, [filterData, previousFilter]);

  useEffect(() => {
    if (createdDeal == null || createdDeal.state.id !== dealState.id) {
      return;
    }
    localDispatch(addNewDeal(createdDeal));
  }, [createdDeal]);

  useEffect(() => {
    if (deletedDeal == null || deletedDeal.state.id !== dealState.id) {
      return;
    }
    localDispatch(removeDeal(deletedDeal));
  }, [deletedDeal]);

  useEffect(() => {
    if (dealState == null) {
      return;
    }
    localDispatch(setColumnData(dealState));
    return () => {
      localDispatch(setPage(0));
    };
  }, [dealState]);

  useEffect(() => {
    if (updatedDeal == null && updatedDealData == null) {
      return;
    }

    localDispatch(setUpdatedDeal(updatedDeal ?? updatedDealData));
  }, [updatedDeal, updatedDealData]);

  const fetchDealsForState = async () => {
    try {
      if (isFetching) {
        return;
      }
      localDispatch(setIsFetching(true));
      const filterParams = extractCookieByName(COOKIES_KEY);
      const response = await requestFetchDeals(
        dealState.id,
        page,
        itemsPerPage,
        filterParams,
      );
      localDispatch(setData(response.data));
    } catch (error) {
      onRequestError(error);
      localDispatch(setIsFetching(false));
    }
  };

  const handleDealDrop = async (deal) => {
    try {
      if (
        deal.state.id === dealState.id ||
        (dealState.type !== 'Custom' &&
          dealState.orderId < deal.state.orderId) ||
        (deal.state.type === 'Completed' && dealState.type === 'Failed')
      ) {
        // no need to change deal state
        return;
      }
      if (deal.patient == null) {
        onLinkPatient?.();
        return;
      }
      if (
        (dealState.type === 'Scheduled' ||
          dealState.type === 'Completed' ||
          dealState.type === 'Failed') &&
        deal.schedule == null
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

  const handleCreateColumn = async (columnName) => {
    try {
      const response = await createNewDealState({
        name: columnName,
        orderId: dealState.orderId + 1,
      });
      await onUpdate(response.data);
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setShowCreateColumn(false));
    }
  };

  const handleCloseCreateColumn = () => {
    localDispatch(setShowCreateColumn(false));
  };

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
    localDispatch(setShowActions(true));
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
      handleCloseColorPicker();
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
        <InfiniteScroll
          initialLoad
          pageStart={0}
          useWindow={false}
          style={{ width: '100%' }}
          loadMore={fetchDealsForState}
          hasMore={items.length < totalElements}
          loader={
            <div className={styles.progressWrapper}>
              <CircularProgress className='circular-progress-bar' />
            </div>
          }
        >
          <div className={styles.itemsContainer}>
            {items.map((item) => (
              <DealItem
                key={item.id}
                currentClinic={currentClinic}
                onDealClick={onDealClick}
                color={dealState.color}
                dealItem={item}
                onLinkPatient={onLinkPatient}
                onDeleteDeal={onDeleteDeal}
                onConfirmFirstContact={onConfirmFirstContact}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default DealsColumn;

DealsColumn.propTypes = {
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  width: PropTypes.number,
  currentClinic: PropTypes.any,
  dealState: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    orderId: PropTypes.number,
    deleteable: PropTypes.bool,
    type: PropTypes.string,
  }),
  updatedDeal: PropTypes.any,
  onMove: PropTypes.func,
  onUpdate: PropTypes.func,
  onAddSchedule: PropTypes.func,
  onLinkPatient: PropTypes.func,
  onDeleteDeal: PropTypes.func,
  onConfirmFirstContact: PropTypes.func,
  onDealClick: PropTypes.func,
};

DealsColumn.defaultProps = {
  width: 350,
};
