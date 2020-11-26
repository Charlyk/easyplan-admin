import React, { useEffect, useReducer } from 'react';

import { CircularProgress } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import {
  togglePatientsListUpdate,
  triggerServicesUpdate,
} from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import LoadingButton from '../LoadingButton';
import './styles.scss';

export const UploadMode = {
  patients: 'Patients',
  services: 'Services',
};

const initialState = {
  excelData: { cellTypes: [], table: { rows: [] } },
  isFetching: false,
  cellTypes: [],
};

const reducerTypes = {
  setExcelData: 'setExcelData',
  setIsFetching: 'setIsFetching',
  setCellTypes: 'setCellTypes',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setExcelData:
      return { ...state, excelData: action.payload };
    case reducerTypes.setIsFetching:
      return { ...state, isFetching: action.payload };
    case reducerTypes.setCellTypes:
      return { ...state, cellTypes: action.payload };
    default:
      return state;
  }
};

const SetupExcelModal = ({ title, open, timeout, mode, data, onClose }) => {
  const dispatch = useDispatch();
  const [{ excelData, isFetching, cellTypes }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    if (!open) {
      localDispatch(actions.setCellTypes([]));
    }
  }, [open]);

  useEffect(() => {
    fetchExcelData();
  }, [data]);

  const handleCloseModal = () => {
    if (isFetching) return;
    onClose();
  };

  const fetchExcelData = async () => {
    if (data == null) return;
    localDispatch(actions.setIsFetching(true));
    let response = null;
    switch (mode) {
      case UploadMode.patients:
        response = await dataAPI.uploadPatientsList(data);
        break;
      case UploadMode.services:
        console.log(data);
        response = await dataAPI.importServices(data, data.categoryId);
        break;
    }
    if (response?.isError) {
      console.error(response?.message);
    } else if (response != null) {
      localDispatch(actions.setExcelData(response?.data));
    }
    localDispatch(actions.setIsFetching(false));
  };

  const handleCellTypeSelected = event => {
    const cellIndex = parseInt(event.target.id);
    const newValue = event.target.value;
    let newCells = cloneDeep(cellTypes);
    if (newValue === 'None') {
      remove(newCells, item => item.cellIndex === cellIndex);
    } else if (newCells.some(item => item.cellIndex === cellIndex)) {
      newCells = newCells.map(item => {
        if (item.cellIndex !== cellIndex) {
          return item;
        }
        return {
          ...item,
          cellType: newValue,
        };
      });
    } else {
      newCells.push({ cellIndex, cellType: newValue });
    }
    localDispatch(actions.setCellTypes(newCells));
  };

  const { rows } = excelData.table;

  const isFormValid = () => {
    const requiredCells = excelData.cellTypes
      .filter(item => item.isRequired)
      .map(item => item.name);
    const assignedCells = cellTypes.map(item => item.cellType);
    let checker = (arr, target) => target.every(v => arr.includes(v));
    return checker(assignedCells, requiredCells);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    localDispatch(actions.setIsFetching(true));
    const requestBody = {
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      cellTypes,
    };
    let isError = false;
    let errorMessage = '';

    switch (mode) {
      case UploadMode.patients: {
        const response = await dataAPI.submitPatientCells(requestBody);
        isError = response.isError;
        errorMessage = response.message;
        break;
      }
      case UploadMode.services: {
        const response = await dataAPI.parseServices(
          requestBody,
          data.categoryId,
        );
        isError = response.isError;
        errorMessage = response.message;
        break;
      }
    }

    if (isError) {
      console.error(errorMessage);
      localDispatch(actions.setIsFetching(false));
    } else {
      setTimeout(() => {
        localDispatch(actions.setIsFetching(false));
        switch (mode) {
          case UploadMode.patients:
            dispatch(togglePatientsListUpdate());
            break;
          case UploadMode.services:
            dispatch(triggerServicesUpdate());
            break;
        }
        onClose();
      }, timeout);
    }
  };

  return (
    <Modal
      centered
      show={open}
      size='xl'
      onHide={handleCloseModal}
      className='setup-excel-modal easyplan-modal'
    >
      <Modal.Header>
        {title || textForKey('Setup columns')}
        <div
          role='button'
          tabIndex={0}
          onClick={handleCloseModal}
          className='close-modal-btn'
        >
          <IconClose />
        </div>
      </Modal.Header>
      <Modal.Body>
        {isFetching && <CircularProgress className='patient-details-spinner' />}
        {!isFetching && rows.length > 0 && (
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  {rows[0].cells.map(cell => (
                    <td
                      align='center'
                      valign='center'
                      key={`${cell.columnIndex}-head-cell`}
                    >
                      <Form.Group>
                        <Form.Control
                          onChange={handleCellTypeSelected}
                          as='select'
                          className='mr-sm-2'
                          id={`${cell.columnIndex}`}
                          value={
                            cellTypes.find(
                              it => it.cellIndex === cell.columnIndex,
                            )?.cellType
                          }
                          custom
                        >
                          <option value='None'>--</option>
                          {excelData.cellTypes.map(item => (
                            <option key={item.name} value={item.name}>
                              {textForKey(item.name)}
                              {item.isRequired
                                ? ` (${textForKey('Required')})`
                                : ` (${textForKey('Optional')})`}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={`${row.rowNumber}-body-row`}>
                    {row.cells.map(cell => (
                      <td key={`${cell.columnIndex}-${row.rowNumber}-cell`}>
                        {cell.cellValue}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className='cancel-button' onClick={handleCloseModal}>
          {textForKey('Close')}
          <IconClose />
        </Button>
        <LoadingButton
          isLoading={isFetching}
          onClick={handleSubmit}
          className='positive-button'
          disabled={!isFormValid() || isFetching}
        >
          {textForKey('Save')}
          <IconSuccess fill='#FFF' />
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default SetupExcelModal;

SetupExcelModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  timeout: PropTypes.number,
  mode: PropTypes.oneOf([UploadMode.patients, UploadMode.services]),
  data: PropTypes.shape({
    categoryId: PropTypes.string,
    fileUrl: PropTypes.string,
    fileName: PropTypes.string,
  }),
  onClose: PropTypes.func,
};

SetupExcelModal.defaultProps = {
  timeout: 5000,
};
