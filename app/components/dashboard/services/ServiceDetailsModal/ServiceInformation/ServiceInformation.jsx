import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Typography from '@material-ui/core/Typography';
import { useColor } from "react-color-palette";

import IconMinus from '../../../../icons/iconMinus';
import IconPlusBig from '../../../../icons/iconPlusBig';
import { availableCurrenciesSelector } from '../../../../../../redux/selectors/clinicSelector';
import { textForKey } from '../../../../../../utils/localization';
import IconPalette from "../../../../icons/iconPalette";
import styles from './ServiceInformation.module.scss';
import EASColorPicker from "../../../../common/EASColorPicker/EASColorPicker";
import EASTextField from "../../../../common/EASTextField";
import EASSelect from "../../../../common/EASSelect";
import EASTextarea from "../../../../common/EASTextarea";

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

const serviceTypes = [
  {
    id: 'All',
    name: textForKey('Applicable on all teeth'),
  },
  {
    id: 'Single',
    name: textForKey('Applicable on single tooth'),
  },
  {
    id: 'Braces',
    name: textForKey('Braces service'),
  },
];

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

  useEffect(() => {
    if (data == null) {
      return;
    }
    if (!colors.includes(data.color) && data.color.length > 0) {
      setColors([...colors, data.color]);
    }
  }, [data.color, colors]);

  const mappedCurrencies = useMemo(() => {
    return currencies.map(item => ({
      id: item,
      name: item,
    }));
  }, [currencies]);

  const handleInfoExpand = () => {
    onToggle();
  };

  const handleFormChange = (fieldId, value) => {
    onChange({
      ...data,
      [fieldId]: value,
    });
  };

  const handleSaveColor = (event) => {
    event.stopPropagation();
    setColors([...colors, color.hex]);
    handleHidePicker();
    handleFormChange('color', color.hex);
  }

  const handleShowPicker = (event) => {
    event.stopPropagation();
    setShowPicker(true);
  }

  const handleHidePicker = () => {
    setShowPicker(false);
  }

  const contentClasses = clsx(
    styles.content,
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
    <div className={styles.serviceInformation} onPointerUp={handleHidePicker}>
      <div className={styles.header}>
        <div className={styles.title}>
          {showStep && (
            <div className={styles.step}>
              {textForKey('Step 1.')}
            </div>
          )}
          {textForKey('Service information')}
        </div>
        <div
          tabIndex={0}
          role='button'
          className={styles.button}
          onClick={handleInfoExpand}
        >
          {isExpanded ? <IconMinus/> : <IconPlusBig/>}
        </div>
      </div>

      <div className={contentClasses}>
        <form>
          <EASTextField
            type="text"
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Service name')}
            value={data.name}
            onChange={(value) => handleFormChange('name', value)}
          />

          <EASTextField
            type="number"
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Required time')}
            min='0'
            value={data.duration}
            onChange={(value) => handleFormChange('duration', value)}
            endAdornment={<Typography className={styles.adornment}>min</Typography>}
          />

          <EASTextField
            type="number"
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Service price')}
            value={data.price}
            min='0'
            onChange={(value) => handleFormChange('price', value)}
            endAdornment={
              <EASSelect
                rootClass={styles.currencyField}
                options={mappedCurrencies}
                value={data.currency}
                onChange={(event) => handleFormChange('currency', event.target.value)}
              />
            }
          />
          <EASSelect
            type="text"
            rootClass={styles.simpleField}
            label={textForKey('Service type')}
            labelId="service-type-select"
            onChange={(event) => handleFormChange('serviceType', event.target.value)}
            value={data.serviceType}
            options={serviceTypes}
          />

          <EASTextarea
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Description')}
            rows={4}
            maxRows={4}
            value={data.description || ''}
            onChange={(value) => handleFormChange('description', value)}
          />
        </form>
        <div className={styles.colorsWrapper}>
          <Typography className={styles.formLabel}>
            {textForKey('Select color')}
          </Typography>
          <ToggleButtonGroup
            exclusive
            onChange={(event, value) => handleFormChange('color', value)}
            className={styles.colors}
            type='radio'
            value={data.color}
            name='serviceColors'
          >
            {colors.map(color => (
              <ToggleButton
                key={color}
                value={color}
                style={{ color }}
                classes={{
                  root: styles.toggleButton,
                  selected: styles.selectedButton,
                }}
              >
                <div
                  className={styles.colorContainer}
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
