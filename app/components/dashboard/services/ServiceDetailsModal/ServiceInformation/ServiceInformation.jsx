import React, { useEffect, useMemo, useRef, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useColor } from 'react-color-palette';
import { useSelector } from 'react-redux';
import EASColorPicker from 'app/components/common/EASColorPicker/EASColorPicker';
import EASSelect from 'app/components/common/EASSelect';
import EASTextarea from 'app/components/common/EASTextarea';
import EASTextField from 'app/components/common/EASTextField';
import IconPalette from 'app/components/icons/iconPalette';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import { availableCurrenciesSelector } from 'redux/selectors/appDataSelector';
import { categoriesSelector } from 'redux/selectors/servicesSelector';
import styles from './ServiceInformation.module.scss';

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
  '#F44081',
];

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

const ServiceInformation = ({ isExpanded, showStep, data, onChange }) => {
  const currencies = useSelector(availableCurrenciesSelector);
  const categories = useSelector(categoriesSelector);
  const paletteRef = useRef(null);
  const [colors, setColors] = useState(availableColors);
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useColor('hex', '#3A83DC');
  const [service, setService] = useState(data);

  useEffect(() => {
    if (data?.color == null) {
      return;
    }
    if (!colors.includes(data.color) && data.color.length > 0) {
      setColors([...colors, data.color]);
    }
  }, [data?.color, colors]);

  useEffect(() => {
    if (data == null) {
      return;
    }
    setService(data);
  }, [data]);

  useEffect(() => {
    onChange?.(service);
  }, [service]);

  const mappedCurrencies = useMemo(() => {
    return currencies.map((item) => ({
      id: item,
      name: item,
    }));
  }, [currencies]);

  const handleFormChange = (fieldId, value) => {
    setService({
      ...service,
      [fieldId]: value,
    });
  };

  const handleChangeCategory = (id) => {
    const selectedCategory = categories.find((cat) => cat.id === id);
    setService((prevState) => ({
      ...prevState,
      category: { ...selectedCategory },
    }));
  };

  const handleSaveColor = (event) => {
    event.stopPropagation();
    setColors([...colors, color.hex]);
    handleHidePicker();
    handleFormChange('color', color.hex);
  };

  const handleShowPicker = (event) => {
    event.stopPropagation();
    setShowPicker(true);
  };

  const handleHidePicker = () => {
    setShowPicker(false);
  };

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
  );

  return (
    <div className={styles.serviceInformation} onPointerUp={handleHidePicker}>
      <div className={styles.header}>
        <div className={styles.title}>
          {showStep && (
            <div className={styles.step}>{textForKey('Step 1.')}</div>
          )}
          {textForKey('Service information')}
        </div>
      </div>

      <div className={contentClasses}>
        <form>
          <EASTextField
            type='text'
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Service name')}
            value={service.name}
            onChange={(value) => handleFormChange('name', value)}
          />

          <EASTextField
            type='number'
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Required time')}
            min='0'
            value={service.duration}
            onChange={(value) => handleFormChange('duration', value)}
            endAdornment={
              <Typography className={styles.adornment}>min</Typography>
            }
          />

          <EASTextField
            type='number'
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Service price')}
            value={service.price}
            min='0'
            onChange={(value) => handleFormChange('price', value)}
            endAdornment={
              <EASSelect
                rootClass={styles.currencyField}
                options={mappedCurrencies}
                value={service.currency}
                onChange={(event) =>
                  handleFormChange('currency', event.target.value)
                }
              />
            }
          />

          <EASSelect
            type='text'
            rootClass={styles.simpleField}
            label={textForKey('select category')}
            labelId='category-select'
            onChange={(event) => {
              handleChangeCategory(event.target.value);
            }}
            value={service?.category?.id}
            options={categories}
          />

          <EASSelect
            type='text'
            rootClass={styles.simpleField}
            label={textForKey('Service type')}
            labelId='service-type-select'
            onChange={(event) =>
              handleFormChange('serviceType', event.target.value)
            }
            value={service.serviceType}
            options={serviceTypes}
          />

          <EASTextarea
            containerClass={styles.simpleField}
            fieldLabel={textForKey('Description')}
            rows={4}
            maxRows={4}
            value={service.description || ''}
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
            value={service.color}
            name='serviceColors'
          >
            {colors.map((color) => (
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
          <div
            className={styles.paletteWrapper}
            ref={paletteRef}
            onPointerUp={handleShowPicker}
          >
            {colorPickerPopper}
            <IconPalette fill='#3A83DC' />
            <Typography className={styles.paletteLabel}>
              {textForKey('Add new color')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ServiceInformation, areComponentPropsEqual);

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
