import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import { useColor } from "react-color-palette";

import IconMinus from '../../../../icons/iconMinus';
import IconPlusBig from '../../../../icons/iconPlusBig';
import { availableCurrenciesSelector } from '../../../../../../redux/selectors/clinicSelector';
import { textForKey } from '../../../../../../utils/localization';
import IconPalette from "../../../../icons/iconPalette";
import styles from './ServiceInformation.module.scss';
import EASColorPicker from "../../../../common/EASColorPicker/EASColorPicker";

const availableColors = [
  '#FF453A',
  '#FF9F0A',
  '#FDC434',
  '#00E987',
  '#7DD7C8',
  '#64D2FF',
  '#0A84FF',
  '#3A83DC',
  '#BF5AF2',
  '#F44081'
]

const ServiceInformation = (
  {
    currentClinic,
    isExpanded,
    showStep,
    onToggle,
    data,
    onChange,
  }
) => {
  const currencies = availableCurrenciesSelector(currentClinic);
  const paletteRef = useRef(null);
  const [colors, setColors] = useState(availableColors);
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useColor('hex', '#3A83DC');

  const handleInfoExpand = () => {
    onToggle();
  };

  const handleFormChange = (event) => {
    if (typeof event === 'string') {
      onChange({
        ...data,
        color: event,
      });
    } else {
      const fieldName = event.target.id;
      onChange({
        ...data,
        [fieldName]: event.target.value,
      });
    }
  };

  const handleSaveColor = (event) => {
    event.stopPropagation();
    setColors([...colors, color.hex]);
    handleHidePicker();
    handleFormChange(color.hex);
  }

  const handleShowPicker = (event) => {
    event.stopPropagation();
    setShowPicker(true);
  }

  const handleHidePicker = () => {
    setShowPicker(false);
  }

  const contentClasses = clsx(
    styles['service-information__content'],
    isExpanded ? styles.expanded : styles.collapsed,
  );

  const colorPickerPopper = (
    <EASColorPicker
      open={showPicker}
      color={color}
      anchorEl={paletteRef.current}
      setColor={setColor}
      onClose={handleHidePicker}
      onSave={handleSaveColor}
    />
  )

  return (
    <div className={styles['service-information']} onPointerUp={handleHidePicker}>
      <div className={styles['service-information__header']}>
        <div className={styles['service-information__header__title']}>
          {showStep && (
            <div className={styles['service-information__header__step']}>
              {textForKey('Step 1.')}
            </div>
          )}
          {textForKey('Service information')}
        </div>
        <div
          tabIndex={0}
          role='button'
          className={styles['service-information__header__button']}
          onClick={handleInfoExpand}
        >
          {isExpanded ? <IconMinus/> : <IconPlusBig/>}
        </div>
      </div>

      <div className={contentClasses}>
        <Form>
          <Form.Group controlId='name'>
            <Form.Label>{textForKey('Service name')}</Form.Label>
            <InputGroup>
              <Form.Control
                type='text'
                value={data.name}
                onChange={handleFormChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId='duration'>
            <Form.Label>{textForKey('Required time')}</Form.Label>
            <InputGroup>
              <Form.Control
                type='number'
                min='0'
                value={data.duration}
                onChange={handleFormChange}
              />
              <InputGroup.Append>
                <InputGroup.Text>min</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>

          <Form.Label>{textForKey('Service price')}</Form.Label>
          <InputGroup className={styles['price-group']}>
            <Form.Control
              id='price'
              type='number'
              value={data.price}
              min='0'
              onChange={handleFormChange}
            />
            <InputGroup.Append>
              <Form.Control
                id='currency'
                as='select'
                className='mr-sm-2'
                custom
                onChange={handleFormChange}
                value={data.currency}
              >
                {currencies.map((item, index) => (
                  <option key={`${item}-${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Control>
            </InputGroup.Append>
          </InputGroup>

          <Form.Group
            controlId='serviceType'
            style={{ flexDirection: 'column' }}
          >
            <Form.Label>{textForKey('Service type')}</Form.Label>
            <Form.Control
              as='select'
              className='mr-sm-2'
              custom
              onChange={handleFormChange}
              value={data.serviceType}
            >
              <option value='All'>
                {textForKey('Applicable on all teeth')}
              </option>
              <option value='Single'>
                {textForKey('Applicable on single tooth')}
              </option>
              <option value='Braces'>{textForKey('Braces service')}</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>{textForKey('Description')}</Form.Label>
            <InputGroup>
              <Form.Control
                as='textarea'
                value={data.description || ''}
                onChange={handleFormChange}
                aria-label='With textarea'
              />
            </InputGroup>
          </Form.Group>
        </Form>

        <Form.Label>{textForKey('Select color')}</Form.Label>
        <div className={styles.colorsWrapper}>
          <ToggleButtonGroup
            onChange={handleFormChange}
            className={styles['service-information__content__colors']}
            type='radio'
            value={data.color}
            name='serviceColors'
          >
            {colors.map(color => (
              <ToggleButton key={color} value={color}>
                <div
                  className={styles['service-information__content__colors__color-container']}
                  style={{ backgroundColor: color }}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <div className={styles.paletteWrapper} ref={paletteRef} onPointerUp={handleShowPicker}>
            {colorPickerPopper}
            <IconPalette fill="#3A83DC"/>
            <Typography className={styles.paletteLabel}>
              {textForKey('Add new color')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInformation;

ServiceInformation.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  showStep: PropTypes.bool,
  clinicCurrency: PropTypes.string,
  data: PropTypes.shape({
    name: PropTypes.string,
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    serviceType: PropTypes.string,
    color: PropTypes.string,
    currency: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onToggle: PropTypes.func.isRequired,
};
