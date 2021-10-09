import React, { useEffect, useReducer, useRef } from 'react';
import dynamic from 'next/dynamic';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import IconArrowDown from '../../../../icons/iconArrowDown';
import { YClientAPIUrl } from '../../../../../utils/constants';
import generateReducerActions from '../../../../../utils/generateReducerActions';
import { textForKey } from '../../../../../utils/localization';
import LoadingButton from '../../../LoadingButton';
import EASTextField from "../../../EASTextField";
import styles from './ImportSelectionStep.module.scss';

const EasyDatePicker = dynamic(() => import('../../../EasyDatePicker'));

const initialState = {
  isLoading: false,
  dataTypes: ['schedules', 'patients', 'services', 'company'],
  companies: [],
  showCompanies: false,
  selectedCompany: null,
  isDatePickerOpen: false,
  startDate: moment().subtract(1, 'month').toDate(),
  endDate: moment().toDate(),
  dateType: 'start',
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setDataTypes: 'setDataTypes',
  setCompanies: 'setCompanies',
  setShowCompanies: 'setShowCompanies',
  setSelectedCompany: 'setSelectedCompany',
  setIsDatePickerOpen: 'setIsDatePickerOpen',
  setStartDate: 'setStartDate',
  setEndDate: 'setEndDate',
  setDateType: 'setDateType',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setDateType:
      return { ...state, dateType: action.payload };
    case reducerTypes.setIsDatePickerOpen:
      return {
        ...state,
        isDatePickerOpen: action.payload.open,
        dateType: action.payload.type,
      };
    case reducerTypes.setStartDate:
      return { ...state, startDate: action.payload, isDatePickerOpen: false };
    case reducerTypes.setEndDate:
      return { ...state, endDate: action.payload, isDatePickerOpen: false };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setDataTypes:
      return { ...state, dataTypes: action.payload };
    case reducerTypes.setCompanies:
      return { ...state, companies: action.payload };
    case reducerTypes.setShowCompanies:
      return { ...state, showCompanies: action.payload };
    case reducerTypes.setSelectedCompany:
      return {
        ...state,
        selectedCompany: action.payload,
        showCompanies: false,
      };
    default:
      return state;
  }
};

const ImportSelectionStep = ({ userData, onImport }) => {
  const companiesRef = useRef(null);
  const datePickerRef = useRef(null);
  const [
    {
      isLoading,
      dataTypes,
      companies,
      showCompanies,
      selectedCompany,
      isDatePickerOpen,
      startDate,
      endDate,
      dateType,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchUserCompanies();
  }, []);

  const fetchUserCompanies = async () => {
    dispatch(actions.setIsLoading(true));
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userData.partnerToken},User ${userData.user_token}`,
        Accept: 'application/vnd.yclients.v2+json',
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(
      `${YClientAPIUrl}/v1/companies?my=1&active=1`,
      requestOptions,
    );
    const responseData = await response.json();
    if (!responseData.success) {
      toast.error(responseData);
    } else {
      dispatch(actions.setCompanies(responseData.data));
    }
    dispatch(actions.setIsLoading(false));
  };

  const handleImportClick = () => {
    onImport(dataTypes, selectedCompany, startDate, endDate);
  };

  const handleOpenCompanies = () => {
    dispatch(actions.setShowCompanies(true));
  };

  const handleCloseCompanies = () => {
    dispatch(actions.setShowCompanies(false));
  };

  const handleCompanySelected = (event) => {
    const companyId = event.target.value;
    const company = companies.find((item) => item.id === companyId);
    dispatch(actions.setSelectedCompany(company));
  };

  const handleDataTypeChange = (event, isChecked) => {
    const dataType = event.target.id;
    const newDataTypes = cloneDeep(dataTypes);
    if (isChecked) {
      newDataTypes.push(dataType);
    } else {
      remove(newDataTypes, (item) => item === dataType);
    }
    dispatch(actions.setDataTypes(newDataTypes));
  };

  const handleCloseDatePicker = () => {
    dispatch(actions.setIsDatePickerOpen({ open: false, type: 'start' }));
  };

  const handleOpenDatePicker = (type) => {
    dispatch(actions.setIsDatePickerOpen({ open: true, type }));
  };

  const handleDateFieldClick = (targetId) => (event) => {
    datePickerRef.current = event.target;
    handleOpenDatePicker(targetId);
  };

  const handleDateChanged = (newDate) => {
    switch (dateType) {
      case 'start':
        dispatch(actions.setStartDate(newDate));
        break;
      case 'end':
        dispatch(actions.setEndDate(newDate));
        break;
    }
  };

  const datePicker = (
    <EasyDatePicker
      pickerAnchor={datePickerRef.current}
      open={isDatePickerOpen}
      onChange={handleDateChanged}
      onClose={handleCloseDatePicker}
      placement='bottom'
    />
  );

  return (
    <Box
      display='flex'
      flexDirection='column'
      className={styles['import-selection-step']}
    >
      {datePicker}
      <Typography classes={{ root: styles['form-title'] }}>
        {textForKey('Select type of data to import')}
      </Typography>
      <FormControlLabel
        id='company'
        value={dataTypes.includes('company')}
        onChange={handleDataTypeChange}
        classes={{
          label: styles['checkbox-label'],
        }}
        control={
          <Checkbox
            id='company'
            classes={{ root: styles['checkbox-root'] }}
            checked={dataTypes.includes('company')}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        }
        label={textForKey('Company details')}
      />
      <FormControlLabel
        id='schedules'
        value={dataTypes.includes('schedules')}
        onChange={handleDataTypeChange}
        classes={{
          label: styles['checkbox-label'],
        }}
        control={
          <Checkbox
            id='schedules'
            classes={{ root: styles['checkbox-root'] }}
            checked={dataTypes.includes('schedules')}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        }
        label={textForKey('Appointments')}
      />
      <FormControlLabel
        id='patients'
        value={dataTypes.includes('patients')}
        onChange={handleDataTypeChange}
        classes={{
          label: styles['checkbox-label'],
        }}
        control={
          <Checkbox
            id='patients'
            classes={{ root: styles['checkbox-root'] }}
            checked={dataTypes.includes('patients')}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        }
        label={textForKey('Patients')}
      />
      <FormControlLabel
        id='services'
        value={dataTypes.includes('services')}
        onChange={handleDataTypeChange}
        classes={{
          label: styles['checkbox-label'],
        }}
        control={
          <Checkbox
            id='services'
            classes={{ root: styles['checkbox-root'] }}
            checked={dataTypes.includes('services')}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        }
        label={textForKey('Services')}
      />
      <Box display='flex'>
        <EASTextField
          readOnly
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Start date')}
          value={moment(startDate).format('DD MMMM YYYY')}
          onPointerUp={handleDateFieldClick('start')}
        />
        <EASTextField
          readOnly
          containerClass={styles.simpleField}
          fieldLabel={textForKey('End date')}
          value={moment(endDate).format('DD MMMM YYYY')}
          onPointerUp={handleDateFieldClick('end')}
        />
      </Box>
      <div
        onClick={handleOpenCompanies}
        role='button'
        tabIndex={0}
        ref={companiesRef}
        className={styles['company-button']}
      >
        {selectedCompany ? selectedCompany.title : textForKey('Select company')}
        <IconArrowDown fill='#3A83DC' />
      </div>
      <Menu
        disablePortal
        classes={{ paper: styles['companies-menu-paper'] }}
        open={showCompanies}
        anchorEl={companiesRef.current}
        onClose={handleCloseCompanies}
      >
        {companies.map((item) => (
          <MenuItem
            selected={selectedCompany?.id === item.id}
            onClick={handleCompanySelected}
            value={item.id}
            key={item.id}
          >
            {item.title}
          </MenuItem>
        ))}
      </Menu>
      <Box width='100%' display='flex' alignItems='center' mt='1rem'>
        <LoadingButton
          onClick={handleImportClick}
          className='positive-button'
          disabled={isLoading || selectedCompany == null}
          isLoading={isLoading}
        >
          {textForKey('Import')}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default ImportSelectionStep;

ImportSelectionStep.propTypes = {
  onImport: PropTypes.func,
  userData: PropTypes.shape({
    user_token: PropTypes.string,
    partnerToken: PropTypes.string,
  }).isRequired,
};

ImportSelectionStep.defaultProps = {
  onImport: () => null,
};
