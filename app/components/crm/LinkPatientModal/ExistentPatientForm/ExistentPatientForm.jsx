import React, { useCallback, useEffect, useReducer } from "react";
import debounce from 'lodash/debounce';
import { toast } from "react-toastify";
import CircularProgress from '@material-ui/core/CircularProgress';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import Divider from "@material-ui/core/Divider";
import { textForKey } from '../../../../utils/localization';
import { requestSearchPatients } from "../../../../../middleware/api/patients";
import reducer, {
  initialState,
  setIsSearching,
  setPatients,
  setSearchQuery,
  setSelectedPatient,
} from './ExistentPatientForm.reducer';
import styles from './ExistentPatientForm.module.scss';
import EASTextField from "../../../common/EASTextField";

const ExistentPatientForm = ({ onChange }) => {
  const [{
    isSearching,
    patients,
    searchQuery,
    selectedPatient,
  }, localDispatch] = useReducer(reducer, initialState);

  const searchPatients = useCallback(debounce(async (query) => {
    try {
      localDispatch(setIsSearching(true));
      const response = await requestSearchPatients(query);
      localDispatch(setPatients(response.data));
    } catch (error) {
      if (error.response != null) {
        const { data } = error.response;
        toast.error(data.message);
      } else {
        toast.error(error.message);
      }
      localDispatch(setIsSearching(false));
    }
  }, 500), []);

  useEffect(() => {
    if (searchQuery.length < 3) {
      return;
    }
    searchPatients(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedPatient == null) {
      return;
    }
    onChange?.({ patientId: selectedPatient.id });
  }, [selectedPatient]);

  const handleQueryChange = (newQuery) => {
    localDispatch(setSearchQuery(newQuery));
  }

  const handlePatientClick = (patient) => {
    localDispatch(setSelectedPatient(patient));
  }

  return (
    <div className={styles.existentPatientForm}>
      <EASTextField
        value={searchQuery}
        placeholder={`${textForKey('Type to search')} ...`}
        onChange={handleQueryChange}
        endAdornment={
          isSearching && (
            <div className={styles.progressContainer}>
              <CircularProgress className={styles.progressBar}/>
            </div>
          )
        }
      />
      <div className={styles.dataContainer}>
        <List style={{ width: '100%' }}>
          {patients.map((patient) => (
            <React.Fragment key={patient.id}>
              <ListItem
                dense
                key={patient.id}
                selected={selectedPatient?.id === patient.id}
                alignItems="flex-start"
                className={styles.listItem}
                onClick={() => handlePatientClick(patient)}
              >
                <ListItemAvatar>
                  <Avatar alt={patient.fullName}/>
                </ListItemAvatar>
                <ListItemText
                  primary={patient.fullName}
                  secondary={`+${patient.countryCode}${patient.phoneNumber}`}
                />
              </ListItem>
              <Divider variant="inset" component="li"/>
            </React.Fragment>
          ))}
        </List>
        {patients.length === 0 && (
          <div className={styles.noDataContainer}>
            <SearchIcon/>
          </div>
        )}
      </div>
    </div>
  )
};

export default ExistentPatientForm;
