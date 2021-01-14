import React, { useEffect, useReducer, useRef } from 'react';

import {
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import IconArrowDown from '../../assets/icons/iconArrowDown';
import { YClientAPIUrl } from '../../utils/constants';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyDatePicker from '../EasyDatePicker';
import LoadingButton from '../LoadingButton';

const initialState = {
  isLoading: false,
  dataTypes: ['schedules', 'patients', 'services', 'company'],
  companies: [],
  showCompanies: false,
  selectedCompany: null,
  isDatePickerOpen: false,
  startDate: moment()
    .subtract(1, 'month')
    .toDate(),
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
      console.log(responseData.data);
      dispatch(actions.setCompanies(responseData.data));
    }
    dispatch(actions.setIsLoading(false));
  };

  const handleImportClick = () => {
    onImport(dataTypes, selectedCompany);
  };

  const handleOpenCompanies = () => {
    dispatch(actions.setShowCompanies(true));
  };

  const handleCloseCompanies = () => {
    dispatch(actions.setShowCompanies(false));
  };

  const handleCompanySelected = event => {
    const companyId = event.target.value;
    const company = companies.find(item => item.id === companyId);
    dispatch(actions.setSelectedCompany(company));
  };

  const handleDataTypeChange = (event, isChecked) => {
    const dataType = event.target.id;
    const newDataTypes = cloneDeep(dataTypes);
    if (isChecked) {
      newDataTypes.push(dataType);
    } else {
      remove(newDataTypes, item => item === dataType);
    }
    dispatch(actions.setDataTypes(newDataTypes));
  };

  const handleOpenDatePicker = () => type => {
    dispatch(actions.setIsDatePickerOpen({ open: true, type }));
  };

  const handleDateChanged = newDate => {};

  const handleCloseDatePicker = () => {
    dispatch(actions.setIsDatePickerOpen({ open: false, type: 'start' }));
  };

  const datePicker = (
    <EasyDatePicker
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
      className='import-selection-step'
    >
      {datePicker}
      <Typography classes={{ root: 'form-title' }}>
        {textForKey('Select type of data to import')}
      </Typography>
      <FormControlLabel
        id='company'
        value={dataTypes.includes('company')}
        onChange={handleDataTypeChange}
        classes={{
          label: 'checkbox-label',
        }}
        control={
          <Checkbox
            id='company'
            classes={{ root: 'checkbox-root' }}
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
          label: 'checkbox-label',
        }}
        control={
          <Checkbox
            id='schedules'
            classes={{ root: 'checkbox-root' }}
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
          label: 'checkbox-label',
        }}
        control={
          <Checkbox
            id='patients'
            classes={{ root: 'checkbox-root' }}
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
          label: 'checkbox-label',
        }}
        control={
          <Checkbox
            id='services'
            classes={{ root: 'checkbox-root' }}
            checked={dataTypes.includes('services')}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        }
        label={textForKey('Services')}
      />
      <div
        onClick={handleOpenCompanies}
        role='button'
        tabIndex={0}
        ref={companiesRef}
        className='company-button'
      >
        {selectedCompany ? selectedCompany.title : textForKey('Select company')}
        <IconArrowDown fill='#3A83DC' />
      </div>
      <Menu
        disablePortal
        classes={{ paper: 'companies-menu-paper' }}
        open={showCompanies}
        anchorEl={companiesRef.current}
        onClose={handleCloseCompanies}
      >
        {companies.map(item => (
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
