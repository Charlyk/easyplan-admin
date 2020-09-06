import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Form,
  ToggleButtonGroup,
  ToggleButton,
  InputGroup,
} from 'react-bootstrap';

import IconMinus from '../../assets/icons/iconMinus';
import IconPlusBig from '../../assets/icons/iconPlusBig';
import { textForKey } from '../../utils/localization';

const ServiceInformation = props => {
  const { isExpanded, showStep, onToggle } = props;

  const handleInfoExpand = () => {
    onToggle();
  };

  const contentClasses = clsx(
    'service-information__content',
    isExpanded ? 'expanded' : 'collapsed',
  );

  return (
    <div className='service-information'>
      <div className='service-information__header'>
        <div className='service-information__header__title'>
          {showStep && (
            <div className='service-information__header__step'>
              {textForKey('Step 1.')}
            </div>
          )}
          {textForKey('Service information')}
        </div>
        <div
          tabIndex={0}
          role='button'
          className='service-information__header__button'
          onClick={handleInfoExpand}
        >
          {isExpanded ? <IconMinus /> : <IconPlusBig />}
        </div>
      </div>

      <div className={contentClasses}>
        <Form>
          <Form.Group controlId='serviceName'>
            <Form.Label>{textForKey('Service name')}</Form.Label>
            <InputGroup>
              <Form.Control type='text' />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId='serviceTime'>
            <Form.Label>{textForKey('Required time')}</Form.Label>
            <InputGroup>
              <Form.Control type='number' />
              <InputGroup.Append>
                <InputGroup.Text id='basic-addon1'>min</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId='servicePrice'>
            <Form.Label>{textForKey('Service price')}</Form.Label>
            <InputGroup>
              <Form.Control type='number' />
              <InputGroup.Append>
                <InputGroup.Text id='basic-addon1'>MDL</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId='serviceDescription'>
            <Form.Label>{textForKey('Description')}</Form.Label>
            <InputGroup>
              <Form.Control as='textarea' aria-label='With textarea' />
            </InputGroup>
          </Form.Group>
        </Form>

        <Form.Label>{textForKey('Select color')}</Form.Label>
        <ToggleButtonGroup
          className='service-information__content__colors'
          type='radio'
          name='serviceColors'
          defaultValue='#FF453A'
        >
          <ToggleButton value='#FF453A'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#FF453A' }}
            />
          </ToggleButton>
          <ToggleButton value='#FF9F0A'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#FF9F0A' }}
            />
          </ToggleButton>
          <ToggleButton value='#FDC434'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#FDC434' }}
            />
          </ToggleButton>
          <ToggleButton value='#00E987'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#00E987' }}
            />
          </ToggleButton>
          <ToggleButton value='#7DD7C8'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#7DD7C8' }}
            />
          </ToggleButton>
          <ToggleButton value='#64D2FF'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#64D2FF' }}
            />
          </ToggleButton>
          <ToggleButton value='#0A84FF'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#0A84FF' }}
            />
          </ToggleButton>
          <ToggleButton value='#3A83DC'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#3A83DC' }}
            />
          </ToggleButton>
          <ToggleButton value='#BF5AF2'>
            <div
              className='service-information__content__colors__color-container'
              style={{ backgroundColor: '#BF5AF2' }}
            />
          </ToggleButton>
          <ToggleButton value='#F44081'>
            <div
              className='service-information__content__colors__color-container'
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
  onToggle: PropTypes.func.isRequired,
};
