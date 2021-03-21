import React, { useReducer } from 'react';

import clsx from 'clsx';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import PropTypes from 'prop-types';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { clinicServicesSelector } from '../../../redux/selectors/clinicSelector';
import { generateReducerActions } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import EasyPlanModal from '../../../components/common/EasyPlanModal';
import './styles.scss';
import EasyTab from '../EasyTab';

const diagnosisClass = ['1', '2', '3'];
const diagnosisOcclusion = [
  'Inverse',
  'Anterior',
  'Posterior',
  'Deep',
  'Open',
  'Normal',
  'General',
  'Space',
  'Crowding',
  'Supernumerary',
  'Transposition',
];
const radiographic = ['Orthopantomogram', 'Cephalometric'];
const fallenBracketsList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const PlanType = {
  mandible: 'mandible',
  maxillary: 'maxillary',
};

const initialState = {
  planType: PlanType.mandible,
  bracketsPlan: {
    mandible: {
      classes: [],
      occlusions: [],
      radiographs: [],
      braces: [],
      treatmentTypes: [],
      fallenBraces: [],
      note: '',
      malocclusion: {
        molarCanin: {
          molar: '',
          canin: '',
        },
        caninMolar: {
          molar: '',
          canin: '',
        },
      },
    },
    maxillary: {
      classes: [],
      occlusions: [],
      radiographs: [],
      braces: [],
      treatmentTypes: [],
      fallenBraces: [],
      note: '',
      malocclusion: {
        molarCanin: {
          molar: '',
          canin: '',
        },
        caninMolar: {
          molar: '',
          canin: '',
        },
      },
    },
  },
};

const reducerTypes = {
  setPlanType: 'setPlanType',
  setBracketsPlan: 'setBracketsPlan',
  setMalocclusion: 'setMalocclusion',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setPlanType:
      return { ...state, planType: action.payload };
    case reducerTypes.setBracketsPlan: {
      const plan = cloneDeep(state.bracketsPlan);
      const { planTypeName, data } = action.payload;
      const planType = plan[planTypeName];
      return {
        ...state,
        bracketsPlan: {
          ...plan,
          [planTypeName]: {
            ...planType,
            ...data,
          },
        },
      };
    }
    case reducerTypes.setMalocclusion: {
      const currentType = state.planType;
      const plan = cloneDeep(state.bracketsPlan);
      const { type, data } = action.payload;
      plan[currentType].malocclusion[type] = {
        ...plan[currentType].malocclusion[type],
        ...data,
      };
      return {
        ...state,
        bracketsPlan: {
          ...plan,
          [currentType]: {
            ...plan[currentType],
          },
        },
      };
    }
    default:
      return state;
  }
};

const TreatmentPlanModal = ({ open, onClose, onSave }) => {
  const services = useSelector(clinicServicesSelector);
  const bracesServices = services.filter(item => item.bracesService);
  const [{ planType, bracketsPlan }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  const updatePlan = newData => {
    localDispatch(
      actions.setBracketsPlan({
        planTypeName: planType,
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
    const newClasses = updateArray(
      cloneDeep(bracketsPlan[planType].classes),
      newClass,
    );
    updatePlan({ classes: newClasses });
  };

  const handleOcclusionChange = newOcclusion => {
    const newOcclusions = updateArray(
      cloneDeep(bracketsPlan[planType].occlusions),
      newOcclusion,
    );
    updatePlan({ occlusions: newOcclusions });
  };

  const handleRadiographChange = newRadioGraph => {
    const newRadiographs = updateArray(
      cloneDeep(bracketsPlan[planType].radiographs),
      newRadioGraph,
    );
    updatePlan({ radiographs: newRadiographs });
  };

  const handleFallenBracketsChange = newBracket => {
    const newFallenBrackets = updateArray(
      cloneDeep(bracketsPlan[planType].fallenBraces),
      newBracket,
    );
    updatePlan({ fallenBraces: newFallenBrackets });
  };

  const handleBracesChange = newBracket => {
    let newBraces = updateServicesArray(
      cloneDeep(bracketsPlan[planType].braces),
      newBracket,
    );
    updatePlan({ braces: newBraces });
  };

  const handleTreatmentTypesChange = newTreatment => {
    let newTypes = updateServicesArray(
      cloneDeep(bracketsPlan[planType].treatmentTypes),
      newTreatment,
    );
    updatePlan({ treatmentTypes: newTypes });
  };

  const handleMolarCaninMolarChange = event => {
    let newValue = event.target.value;
    if (newValue === 'select') newValue = '';
    localDispatch(
      actions.setMalocclusion({
        type: 'molarCanin',
        data: { molar: newValue },
      }),
    );
  };

  const handleMolarCaninCaninChange = event => {
    let newValue = event.target.value;
    if (newValue === 'select') newValue = '';
    localDispatch(
      actions.setMalocclusion({
        type: 'molarCanin',
        data: { canin: newValue },
      }),
    );
  };

  const handleCaninMolarMolarChange = event => {
    let newValue = event.target.value;
    if (newValue === 'select') newValue = '';
    localDispatch(
      actions.setMalocclusion({
        type: 'caninMolar',
        data: { molar: newValue },
      }),
    );
  };

  const handleCaninMolarCaninChange = event => {
    let newValue = event.target.value;
    if (newValue === 'select') newValue = '';
    localDispatch(
      actions.setMalocclusion({
        type: 'caninMolar',
        data: { canin: newValue },
      }),
    );
  };

  const handleNoteChange = event => {
    const newNote = event.target.value;
    updatePlan({ note: newNote });
  };

  const handleSaveTreatmentPlan = () => {
    onSave(bracketsPlan);
    onClose();
  };

  const handlePlanTypeChange = newType => {
    localDispatch(actions.setPlanType(newType));
  };

  const classes = bracketsPlan[planType].classes;
  const occlusions = bracketsPlan[planType].occlusions;
  const radiographs = bracketsPlan[planType].radiographs;
  const fallenBraces = bracketsPlan[planType].fallenBraces;
  const braces = bracketsPlan[planType].braces;
  const treatmentTypes = bracketsPlan[planType].treatmentTypes;

  const classRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Class')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {diagnosisClass.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleClassChange(item)}
              className={clsx(
                'option-button',
                classes.includes(item) && 'selected',
              )}
              key={item}
            >
              <span className='option-text'>{item}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const occlusionRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Occlusion')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {diagnosisOcclusion.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleOcclusionChange(item)}
              className={clsx(
                'option-button',
                occlusions.includes(item) && 'selected',
              )}
              key={item}
            >
              <span className='option-text'>{textForKey(item)}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const fallenBracketsRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Fallen brackets')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {fallenBracketsList.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleFallenBracketsChange(item)}
              className={clsx(
                'option-button',
                fallenBraces.includes(item) && 'selected',
              )}
              key={item}
            >
              <span className='option-text'>{item}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const radiographRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Radiografie')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {radiographic.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleRadiographChange(item)}
              className={clsx(
                'option-button',
                radiographs.includes(item) && 'selected',
              )}
              key={item}
            >
              <span className='option-text'>{textForKey(item)}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const bracesRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Braces')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {services
            .filter(item => item.bracket)
            .map(item => (
              <div
                role='button'
                tabIndex={0}
                onClick={() => handleBracesChange(item)}
                className={clsx(
                  'option-button',
                  braces.some(it => it.id === item.id) && 'selected',
                )}
                key={item.id}
              >
                <span className='option-text'>{textForKey(item.name)}</span>
              </div>
            ))}
        </div>
      </td>
    </tr>
  );

  const treatmentTypeRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Treatment type')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {bracesServices.map(item => (
            <div
              role='button'
              tabIndex={0}
              onClick={() => handleTreatmentTypesChange(item)}
              className={clsx(
                'option-button',
                treatmentTypes.some(it => it.id === item.id) && 'selected',
              )}
              key={item.id}
            >
              <span className='option-text'>{item.name}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const molarCaninRow = (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Angle Class')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleMolarCaninMolarChange}
            value={bracketsPlan[planType].malocclusion.molarCanin.molar}
            custom
          >
            <option value='select'>{textForKey('Molar')}...</option>
            <option value='1'>{textForKey('Molar')} 1</option>
            <option value='2'>{textForKey('Molar')} 2</option>
            <option value='3'>{textForKey('Molar')} 3</option>
          </Form.Control>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleMolarCaninCaninChange}
            value={bracketsPlan[planType].malocclusion.molarCanin.canin}
            custom
          >
            <option value='select'>{textForKey('Canin')}...</option>
            <option value='1'>{textForKey('Canin')} 1</option>
            <option value='2'>{textForKey('Canin')} 2</option>
            <option value='3'>{textForKey('Canin')} 3</option>
          </Form.Control>
          <div className='separator' />
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleCaninMolarCaninChange}
            value={bracketsPlan[planType].malocclusion.caninMolar.canin}
            custom
          >
            <option value='select'>{textForKey('Canin')}...</option>
            <option value='1'>{textForKey('Canin')} 1</option>
            <option value='2'>{textForKey('Canin')} 2</option>
            <option value='3'>{textForKey('Canin')} 3</option>
          </Form.Control>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            onChange={handleCaninMolarMolarChange}
            value={bracketsPlan[planType].malocclusion.caninMolar.molar}
            custom
          >
            <option value='select'>{textForKey('Molar')}...</option>
            <option value='1'>{textForKey('Molar')} 1</option>
            <option value='2'>{textForKey('Molar')} 2</option>
            <option value='3'>{textForKey('Molar')} 3</option>
          </Form.Control>
        </div>
      </td>
    </tr>
  );

  return (
    <EasyPlanModal
      className='treatment-plan-modal-root'
      open={open}
      onClose={onClose}
      onPositiveClick={handleSaveTreatmentPlan}
      title={textForKey('Treatment plan')}
    >
      <div className='treatment-plan-modal-content'>
        <div className='tabs-container'>
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
                <span className='group-title'>{textForKey('Diagnosis')}</span>
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
        <Form.Group controlId='note'>
          <Form.Label>{textForKey('Enter note')}</Form.Label>
          <InputGroup>
            <FormControl
              onChange={handleNoteChange}
              value={bracketsPlan[planType].note}
              as='textarea'
              aria-label={textForKey('Enter note')}
            />
          </InputGroup>
        </Form.Group>
      </div>
    </EasyPlanModal>
  );
};

export default TreatmentPlanModal;

TreatmentPlanModal.propTypes = {
  open: PropTypes.bool,
  treatmentPlan: PropTypes.shape({
    planClass: PropTypes.string,
    occlusion: PropTypes.string,
    included: PropTypes.string,
    radiograph: PropTypes.string,
    service: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
      bracket: PropTypes.bool,
    }),
    fallenBrackets: PropTypes.arrayOf(PropTypes.string),
  }),
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
      bracket: PropTypes.bool,
      bracesService: PropTypes.bool,
    }),
  ),
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

TreatmentPlanModal.defaultProps = {
  onClose: () => null,
  onSave: () => null,
};
