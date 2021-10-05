import React, { useEffect, useReducer } from 'react';
import clsx from 'clsx';
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup'
import { toast } from 'react-toastify';

import IconSuccess from '../../../../icons/iconSuccess';
import {
  clinicBracesServicesSelector,
  clinicEnabledBracesSelector,
} from '../../../../../../redux/selectors/clinicSelector';
import { Role } from '../../../../../utils/constants';
import { textForKey } from '../../../../../../utils/localization';
import EasyTab from '../../../../common/EasyTab';
import LoadingButton from '../../../../common/LoadingButton';
import {
  reducer,
  initialState,
  actions,
  diagnosisOcclusion,
  diagnosisClass,
  PlanType,
  radiographic,
  fallenBracketsList
} from './OrthodonticPlan.reducer';
import styles from './OrthodonticPlan.module.scss';
import EASTextarea from "../../../../common/EASTextarea";

const OrthodonticPlan = (
  {
    currentUser,
    currentClinic: clinic,
    patient,
    scheduleId,
    onSave
  }
) => {
  const services = clinicBracesServicesSelector(clinic);
  const braces = clinicEnabledBracesSelector(clinic);
  const currentClinic = currentUser.clinics.find(
    it => it.clinicId === clinic.id,
  );
  const isDoctor = currentClinic.roleInClinic === Role.doctor;
  const [
    { planType, bracketsPlan, isLoading, isSaving },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (patient != null) {
      fetchOrthodonticPlan();
    }
  }, [patient, planType]);

  const fetchOrthodonticPlan = async () => {
    localDispatch(actions.setIsLoading(true));
    try {
      const query = {
        patientId: patient.id,
        planType,
      }
      const queryString = new URLSearchParams(query).toString()
      const response = await axios.get(`/api/treatment-plans/orthodontic?${queryString}`);
      updatePlan(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  };

  const updatePlan = (newData, type = planType) => {
    localDispatch(
      actions.setBracketsPlan({
        planTypeName: type,
        data: newData,
      }),
    );
  };

  const updateArray = (array, item) => {
    if (array.includes(item)) {
      remove(array, it => it === item);
    } else {
      array.push(item);
    }
    return array;
  };

  const updateServicesArray = (array, item) => {
    if (array.some(it => it.id === item.id)) {
      remove(array, it => it.id === item.id);
    } else {
      array.push(item);
    }
    return array;
  };

  const handleClassChange = newClass => {
    if (!isDoctor) return;
    const newClasses = updateArray(
      cloneDeep(bracketsPlan[planType].classes),
      newClass,
    );
    updatePlan({ classes: newClasses });
  };

  const handleOcclusionChange = newOcclusion => {
    if (!isDoctor) return;
    const newOcclusions = updateArray(
      cloneDeep(bracketsPlan[planType].occlusions),
      newOcclusion,
    );
    updatePlan({ occlusions: newOcclusions });
  };

  const handleRadiographChange = newRadioGraph => {
    if (!isDoctor) return;
    const newRadiographs = updateArray(
      cloneDeep(bracketsPlan[planType].radiographs),
      newRadioGraph,
    );
    updatePlan({ radiographs: newRadiographs });
  };

  const handleFallenBracketsChange = newBracket => {
    if (!isDoctor) return;
    const newFallenBrackets = updateArray(
      cloneDeep(bracketsPlan[planType].fallenBraces),
      newBracket,
    );
    updatePlan({ fallenBraces: newFallenBrackets });
  };

  const handleBracesChange = newBracket => {
    if (!isDoctor) return;
    let newBraces = updateServicesArray(
      cloneDeep(bracketsPlan[planType].braces),
      newBracket,
    );
    updatePlan({ braces: newBraces });
  };

  const handleTreatmentTypesChange = newTreatment => {
    if (!isDoctor) return;
    let newTypes = updateServicesArray(
      cloneDeep(bracketsPlan[planType].services),
      newTreatment,
    );
    updatePlan({ services: newTypes });
  };

  const handleMolarCaninMolarChange = event => {
    if (!isDoctor) return;
    let newValue = event.target.value;
    if (newValue === 'select') newValue = '0';
    localDispatch(
      actions.setMolarCaninMolar({
        planTypeName: planType,
        value: parseInt(newValue),
      }),
    );
  };

  const handleMolarCaninCaninChange = event => {
    if (!isDoctor) return;
    let newValue = event.target.value;
    if (newValue === 'select') newValue = '0';
    localDispatch(
      actions.setMolarCaninCanin({
        planTypeName: planType,
        value: parseInt(newValue),
      }),
    );
  };

  const handleCaninMolarMolarChange = event => {
    if (!isDoctor) return;
    let newValue = event.target.value;
    if (newValue === 'select') newValue = '0';
    localDispatch(
      actions.setCaninMolarMolar({
        planTypeName: planType,
        value: parseInt(newValue),
      }),
    );
  };

  const handleCaninMolarCaninChange = event => {
    if (!isDoctor) return;
    let newValue = event.target.value;
    if (newValue === 'select') newValue = '0';
    localDispatch(
      actions.setCaninMolarCanin({
        planTypeName: planType,
        value: parseInt(newValue),
      }),
    );
  };

  const handleNoteChange = (newValue) => {
    updatePlan({ note: newValue });
  };

  const saveTreatmentPlan = async (patientId, requestBody) => {
    return axios.post(`/api/treatment-plans/orthodontic`, {
      ...requestBody,
      patientId,
    });
  }

  const handleSaveTreatmentPlan = async () => {
    localDispatch(actions.setIsSaving(true));
    try {
      const requestPlan = bracketsPlan[planType];
      const updatedBraces = {
        ...requestPlan,
        planType,
        scheduleId,
        braces: requestPlan.braces.map(it => it.id),
        services: requestPlan.services.map(it => it.id),
      };
      await saveTreatmentPlan(patient.id, updatedBraces);
      await fetchOrthodonticPlan();
      onSave(bracketsPlan);
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsSaving(false));
    }
  };

  const handlePlanTypeChange = newType => {
    localDispatch(actions.setPlanType(newType));
  };

  const classes = bracketsPlan[planType].classes;
  const occlusions = bracketsPlan[planType].occlusions;
  const radiographs = bracketsPlan[planType].radiographs;
  const fallenBraces = bracketsPlan[planType].fallenBraces;
  const selectedBraces = bracketsPlan[planType].braces;
  const selectedServices = bracketsPlan[planType].services;

  const classRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '10rem' }}>
        <span className={styles.groupSubtitle}>{textForKey('Class')}</span>
      </td>
      <td valign='top'>
        <div className={styles.optionsContainer}>
          {diagnosisClass.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleClassChange(item)}
              className={clsx(
                styles.optionButton,
                classes.includes(item) && styles.selected,
              )}
              key={item}
            >
              <span className={styles.optionText}>{item}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const occlusionRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '10rem' }}>
        <span className={styles.groupSubtitle}>{textForKey('Occlusion')}</span>
      </td>
      <td valign='top'>
        <div className={styles.optionsContainer}>
          {diagnosisOcclusion.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleOcclusionChange(item)}
              className={clsx(
                styles.optionButton,
                occlusions.includes(item) && styles.selected,
              )}
              key={item}
            >
              <span className={styles.optionText}>{textForKey(item)}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const fallenBracketsRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '10rem' }}>
        <span className={styles.groupSubtitle}>{textForKey('Fallen brackets')}</span>
      </td>
      <td valign='top'>
        <div className={styles.optionsContainer}>
          {fallenBracketsList.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleFallenBracketsChange(item)}
              className={clsx(
                styles.optionButton,
                fallenBraces.includes(item) && styles.selected,
              )}
              key={item}
            >
              <span className={styles.optionText}>{item}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const radiographRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '10rem' }}>
        <span className={styles.groupSubtitle}>{textForKey('Radiografie')}</span>
      </td>
      <td valign='top'>
        <div className={styles.optionsContainer}>
          {radiographic.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleRadiographChange(item)}
              className={clsx(
                styles.optionButton,
                radiographs.includes(item) && styles.selected,
              )}
              key={item}
            >
              <span className={styles.optionText}>{textForKey(item)}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const bracesRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '10rem' }}>
        <span className={styles.groupSubtitle}>{textForKey('Braces')}</span>
      </td>
      <td valign='top'>
        <div className={styles.optionsContainer}>
          {braces.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleBracesChange(item)}
              className={clsx(
                styles.optionButton,
                selectedBraces.some(it => it.id === item.id) && styles.selected,
              )}
              key={item.id}
            >
              <span className={styles.optionText}>{textForKey(item.name)}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const treatmentTypeRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '10rem' }}>
        <span className={styles.groupSubtitle}>{textForKey('Service type')}</span>
      </td>
      <td valign='top'>
        <div className={styles.optionsContainer}>
          {services.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleTreatmentTypesChange(item)}
              className={clsx(
                styles.optionButton,
                selectedServices.some(it => it.id === item.id) && styles.selected,
              )}
              key={item.id}
            >
              <span className={styles.optionText}>{item.name}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const molarCaninRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '10rem' }}>
        <span className={styles.groupSubtitle}>{textForKey('Angle Class')}</span>
      </td>
      <td valign='top'>
        <div className={styles.optionsContainer}>
          <Form.Control
            disabled={!isDoctor}
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleMolarCaninMolarChange}
            value={bracketsPlan[planType].angleClasses.molarCaninMolar}
            custom
          >
            <option value='0'>{textForKey('Molar')}...</option>
            <option value='1'>{textForKey('Molar')} 1</option>
            <option value='2'>{textForKey('Molar')} 2</option>
            <option value='3'>{textForKey('Molar')} 3</option>
          </Form.Control>
          <Form.Control
            disabled={!isDoctor}
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleMolarCaninCaninChange}
            value={bracketsPlan[planType].angleClasses.molarCaninCanin}
            custom
          >
            <option value='0'>{textForKey('Canin')}...</option>
            <option value='1'>{textForKey('Canin')} 1</option>
            <option value='2'>{textForKey('Canin')} 2</option>
            <option value='3'>{textForKey('Canin')} 3</option>
          </Form.Control>
          <div className='separator'/>
          <Form.Control
            disabled={!isDoctor}
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleCaninMolarCaninChange}
            value={bracketsPlan[planType].angleClasses.caninMolarCanin}
            custom
          >
            <option value='0'>{textForKey('Canin')}...</option>
            <option value='1'>{textForKey('Canin')} 1</option>
            <option value='2'>{textForKey('Canin')} 2</option>
            <option value='3'>{textForKey('Canin')} 3</option>
          </Form.Control>
          <Form.Control
            disabled={!isDoctor}
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleCaninMolarMolarChange}
            value={bracketsPlan[planType].angleClasses.caninMolarMolar}
            custom
          >
            <option value='0'>{textForKey('Molar')}...</option>
            <option value='1'>{textForKey('Molar')} 1</option>
            <option value='2'>{textForKey('Molar')} 2</option>
            <option value='3'>{textForKey('Molar')} 3</option>
          </Form.Control>
        </div>
      </td>
    </tr>
  );

  return (
    <div className={styles.patientTreatmentPlans}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Orthodontic plan')}
      </Typography>
      {isLoading && (
        <div className='progress-bar-wrapper'>
          <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
        </div>
      )}
      {!isLoading && (
        <React.Fragment>
          <div className={styles.treatmentPlanModalContent}>
            <div className={styles.tabsContainer}>
              <EasyTab
                onClick={() => handlePlanTypeChange(PlanType.mandible)}
                title={textForKey('Mandible')}
                selected={planType === PlanType.mandible}
              />
              <EasyTab
                onClick={() => handlePlanTypeChange(PlanType.maxillary)}
                title={textForKey('Maxillary')}
                selected={planType === PlanType.maxillary}
              />
            </div>
            <table>
              <tbody>
              <tr>
                <td>
                    <span className={styles.groupTitle}>
                      {textForKey('Diagnosis')}
                    </span>
                </td>
              </tr>
              {classRow}
              {occlusionRow}
              {molarCaninRow}
              {radiographRow}
              {bracesRow}
              {treatmentTypeRow}
              {fallenBracketsRow}
              </tbody>
            </table>
            <EASTextarea
              disabled={!isDoctor}
              value={bracketsPlan[planType].note}
              fieldLabel={textForKey('Notes')}
              rows={4}
              maxRows={5}
              onChange={handleNoteChange}
            />
          </div>
        </React.Fragment>
      )}
      {isDoctor && !isLoading && (
        <div className={styles.actions}>
          <LoadingButton
            isLoading={isSaving}
            className='positive-button'
            onClick={handleSaveTreatmentPlan}
          >
            {textForKey('Save')}
            <IconSuccess/>
          </LoadingButton>
        </div>
      )}
    </div>
  );
};

export default OrthodonticPlan;

OrthodonticPlan.propTypes = {
  currentUser: PropTypes.object.isRequired,
  scheduleId: PropTypes.number,
  patient: PropTypes.object,
  onSave: PropTypes.func,
};

OrthodonticPlan.defaultProps = {
  onSave: () => null,
};
