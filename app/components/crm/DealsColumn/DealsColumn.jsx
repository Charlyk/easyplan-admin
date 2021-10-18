import React, { useEffect, useMemo, useReducer, useRef } from "react";
import PropTypes from 'prop-types';
import { useColor } from "react-color-palette";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import DoneIcon from '@material-ui/icons/Done';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import {
  newDealSelector,
  updatedDealSelector
} from "../../../../redux/selectors/crmSelector";
import {
  createNewDealState,
  deleteDealState,
  requestFetchDeals,
  updateDealState
} from "../../../../middleware/api/crm";
import onRequestError from "../../../utils/onRequestError";
import ActionsSheet from "../../common/ActionsSheet";
import EASColorPicker from "../../common/EASColorPicker";
import AddColumnModal from "../AddColumnModal";
import DealItem from "./DealItem";
import reducer, {
  STATUS_LOADING,
  STATUS_LOADED,
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
  setRowsLoading,
} from './DealsColumn.reducer';
import styles from './DealsColumn.module.scss';
import { Skeleton } from "@material-ui/lab";

const DealsColumn = (
  {
    dealState,
    isFirst,
    isLast,
    updatedDeal,
    onMove,
    onUpdate,
    onLinkPatient,
    onDeleteDeal,
    onConfirmFirstContact,
    onDealClick,
  }
) => {
  const actionsBtnRef = useRef(null);
  const colorPickerRef = useRef(null);
  const createdDeal = useSelector(newDealSelector);
  const updatedDealData = useSelector(updatedDealSelector);
  const [color, setColor] = useColor('hex', dealState.color);
  const [{
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
    loadedRowsMap,
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (createdDeal == null || createdDeal.state.id !== dealState.id) {
      return;
    }
    localDispatch(addNewDeal(createdDeal));
  }, [createdDeal]);

  useEffect(() => {
    if (dealState == null) {
      return;
    }
    localDispatch(setColumnData(dealState));
    fetchDealsForState({ startIndex: 0, stopIndex: itemsPerPage - 1 });
  }, [dealState]);

  useEffect(() => {
    if (updatedDeal == null && updatedDealData == null) {
      return;
    }

    localDispatch(setUpdatedDeal(updatedDeal ?? updatedDealData));
  }, [updatedDeal, updatedDealData]);

  const filteredActions = useMemo(() => {
    return sheetActions.filter(action => {
      return (
        (dealState.deleteable || action.key !== 'deleteColumn') &&
        (!isFirst || action.key !== 'moveToLeft') &&
        (!isLast || action.key !== 'moveToRight')
      )
    })
  }, [dealState, isFirst, isLast]);

  const fetchDealsForState = async ({ startIndex, stopIndex }) => {
    try {
      const rows = [];
      for (let i = startIndex; i <= stopIndex; i++) {
        rows.push(i);
      }
      localDispatch(setRowsLoading({ rows, state: STATUS_LOADING}));
      localDispatch(setIsFetching(true));
      const response = await requestFetchDeals(dealState.id, page, itemsPerPage);
      localDispatch(setData(response.data));
      localDispatch(setRowsLoading({ rows, state: STATUS_LOADED}));
    } catch (error) {
      onRequestError(error)
      localDispatch(setIsFetching(false));
    }
  }

  const isRowLoaded = ({ index }) => {
    return !!loadedRowsMap[index]
  }

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

  const rowRenderer = ({ index, key }) => {
    const isLoaded = isRowLoaded({ index });
    if (!isLoaded) {
      return (
        <Skeleton
          variant="rect"
          width="100%"
          height={dealState.type === "Unsorted" ? '85px' : dealState.type !== 'FirstContact' ? '120px' : '105px'}
          style={{ backgroundColor: `${dealState.color}1A` }}
        />
      )
    }

    return (
      <DealItem
        key={key}
        onDealClick={onDealClick}
        color={dealState.color}
        dealItem={items[index]}
        onLinkPatient={onLinkPatient}
        onDeleteDeal={onDeleteDeal}
        onConfirmFirstContact={onConfirmFirstContact}
      />
    )
  }

  const getRowHeight = ({ index }) => {
    const deal = items[index];
    if (deal?.state.type === 'Unsorted') {
      return 85;
    } else if (deal?.schedule == null) {
      return 105;
    }
    return 120;
  }

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
              <DoneIcon/>
            </IconButton>
          </Box>
        ) : (
          <Box display="flex">
            <Typography className={styles.titleLabel}>
              {columnName}
            </Typography>
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
            <MoreHorizIcon/>
          </IconButton>
        </div>
      </div>
      <div className={styles.dataContainer}>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={fetchDealsForState}
          rowCount={items.length}
          minimumBatchSize={itemsPerPage}
          threshold={itemsPerPage}
        >
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  ref={registerChild}
                  onRowRendered={onRowsRendered}
                  rowCount={items.length}
                  rowHeight={getRowHeight}
                  rowRenderer={rowRenderer}
                  width={width}
                  height={height}
                />
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
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
    type: PropTypes.string,
  }),
  updatedDeal: PropTypes.any,
  onMove: PropTypes.func,
  onUpdate: PropTypes.func,
  onLinkPatient: PropTypes.func,
  onDeleteDeal: PropTypes.func,
  onConfirmFirstContact: PropTypes.func,
  onDealClick: PropTypes.func,
};
