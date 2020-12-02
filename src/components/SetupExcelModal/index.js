import React, { useEffect, useReducer } from 'react';

import { CircularProgress } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import PropTypes from 'prop-types';
import { usePubNub } from 'pubnub-react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import {
  togglePatientsListUpdate,
  triggerServicesUpdate,
} from '../../redux/actions/actions';
import { userSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { env } from '../../utils/constants';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import CircularProgressWithLabel from '../CircularProgressWithLabel';
import LoadingButton from '../LoadingButton';
import './styles.scss';

export const UploadMode = {
  patients: 'Patients',
  services: 'Services',
  schedules: 'Schedules',
};

const initialState = {
  excelData: { cellTypes: [], table: { rows: [] } },
  isFetching: false,
  isParsing: false,
  parsedValue: 0,
  cellTypes: [],
};

const reducerTypes = {
  setExcelData: 'setExcelData',
  setIsFetching: 'setIsFetching',
  setCellTypes: 'setCellTypes',
  setIsParsing: 'setIsParsing',
  setParsedValue: 'setParsedValue',
  reset: 'reset',
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
    case reducerTypes.setIsParsing:
      return {
        ...state,
        isParsing: action.payload,
        isFetching: action.payload ? false : state.isFetching,
      };
    case reducerTypes.setParsedValue:
      return { ...state, parsedValue: action.payload };
    case reducerTypes.reset:
      return initialState;
    default:
      return state;
  }
};

const SetupExcelModal = ({
  title,
  open,
  mode,
  data,
  onClose,
  onCellsReady,
}) => {
  const pubnub = usePubNub();
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);
  const [
    { excelData, isFetching, cellTypes, isParsing, parsedValue },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (open) {
      pubnub.subscribe({
        channels: [
          `${currentUser.id}-import_patients_channel`,
          `${currentUser.id}-import_services_channel`,
        ],
      });

      pubnub.addListener({ message: handlePubnubMessageReceived });
    }
    return () => {
      localDispatch(actions.reset());
      pubnub.unsubscribe({
        channels: [
          `${currentUser.id}-import_patients_channel`,
          `${currentUser.id}-import_services_channel`,
        ],
      });
    };
  }, [open]);

  useEffect(() => {
    fetchExcelData();
  }, [data]);

  const handlePubnubMessageReceived = remoteMessage => {
    const { channel, message } = remoteMessage;
    const { count, total, done } = message;

    if (
      !channel.includes('import_patients_channel') &&
      !channel.includes('import_services_channel')
    ) {
      return;
    }

    if (done) {
      localDispatch(actions.setParsedValue(100));
      setTimeout(() => {
        if (channel.includes('import_patients_channel')) {
          dispatch(togglePatientsListUpdate());
        } else if (channel.includes('import_services_channel')) {
          dispatch(triggerServicesUpdate());
        }
        onClose();
      }, 3500);
    } else {
      const percentage = (count / total) * 100;
      localDispatch(actions.setParsedValue(percentage));
    }
  };

  const handleCloseModal = () => {
    if (isFetching || isParsing) return;
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
        response = await dataAPI.importServices(data, data.categoryId);
        break;
      case UploadMode.schedules:
        response = await dataAPI.readExcelColumns(data);
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
    if (!isFormValid() || isFetching || isParsing) return;
    const requestBody = {
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      cellTypes,
    };

    const environment = env === '' ? 'prod' : env;

    switch (mode) {
      case UploadMode.patients: {
        pubnub.publish({
          channel: `${environment}_import_patients_channel`,
          message: { ...requestBody, sender: currentUser.id },
        });
        localDispatch(actions.setIsParsing(true));
        break;
      }
      case UploadMode.services: {
        pubnub.publish({
          channel: `${environment}_import_services_channel`,
          message: {
            ...requestBody,
            sender: currentUser.id,
            categoryId: data.categoryId,
          },
        });
        localDispatch(actions.setIsParsing(true));
        break;
      }
      case UploadMode.schedules:
        localDispatch(actions.setIsFetching(true));
        onCellsReady(requestBody);
        onClose();
        return;
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
        {isParsing && <CircularProgressWithLabel value={parsedValue} />}
        {isFetching && !isParsing && (
          <CircularProgress classes={{ root: 'progress-bar-root' }} />
        )}
        {!isFetching && !isParsing && rows.length > 0 && (
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
                        {cell.cellValue || ''}
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
          isLoading={isFetching || isParsing}
          onClick={handleSubmit}
          className='positive-button'
          disabled={!isFormValid() || isFetching || isParsing}
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
  mode: PropTypes.oneOf([
    UploadMode.patients,
    UploadMode.services,
    UploadMode.schedules,
  ]),
  data: PropTypes.shape({
    categoryId: PropTypes.string,
    fileUrl: PropTypes.string,
    fileName: PropTypes.string,
  }),
  onClose: PropTypes.func,
  onCellsReady: PropTypes.func,
};

SetupExcelModal.defaultProps = {
  timeout: 5000,
  onCellsReady: () => null,
};
