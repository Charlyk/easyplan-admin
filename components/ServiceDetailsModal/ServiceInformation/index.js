import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Form,
  ToggleButtonGroup,
  ToggleButton,
  InputGroup,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

import IconMinus from '../../icons/iconMinus';
import IconPlusBig from '../../icons/iconPlusBig';
import { availableCurrenciesSelector } from '../../../redux/selectors/clinicSelector';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/ServiceInformation.module.scss';

const ServiceInformation = ({
  isExpanded,
  showStep,
  onToggle,
  data,
  onChange,
}) => {
  const currencies = useSelector(availableCurrenciesSelector);
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

  const contentClasses = clsx(
    styles['service-information__content'],
    isExpanded ? styles.expanded : styles.collapsed,
  );

  return (
    <div className={styles['service-information']}>
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
          {isExpanded ? <IconMinus /> : <IconPlusBig />}
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
                {currencies.map((item) => (
                  <option key={item} value={item}>
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
        <ToggleButtonGroup
          onChange={handleFormChange}
          className={styles['service-information__content__colors']}
          type='radio'
          value={data.color}
          name='serviceColors'
        >
          <ToggleButton value='#FF453A'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#FF453A' }}
            />
          </ToggleButton>
          <ToggleButton value='#FF9F0A'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#FF9F0A' }}
            />
          </ToggleButton>
          <ToggleButton value='#FDC434'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#FDC434' }}
            />
          </ToggleButton>
          <ToggleButton value='#00E987'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#00E987' }}
            />
          </ToggleButton>
          <ToggleButton value='#7DD7C8'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#7DD7C8' }}
            />
          </ToggleButton>
          <ToggleButton value='#64D2FF'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#64D2FF' }}
            />
          </ToggleButton>
          <ToggleButton value='#0A84FF'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#0A84FF' }}
            />
          </ToggleButton>
          <ToggleButton value='#3A83DC'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#3A83DC' }}
            />
          </ToggleButton>
          <ToggleButton value='#BF5AF2'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#BF5AF2' }}
            />
          </ToggleButton>
          <ToggleButton value='#F44081'>
            <div
              className={styles['service-information__content__colors__color-container']}
              style={{ backgroundColor: '#F44081' }}
            />
          </ToggleButton>
        </ToggleButtonGroup>
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
