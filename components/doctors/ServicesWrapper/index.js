import React, { useRef } from "react";

import PropTypes from 'prop-types';
import { Form } from "react-bootstrap";
import { Menu, MenuItem, Typeahead } from "react-bootstrap-typeahead";
import { textForKey } from "../../../utils/localization";
import { getServiceName } from "../../../utils/helperFuncs";
import FinalServiceItem from "../FinalServiceItem";
import LoadingButton from "../../common/LoadingButton";
import styles from '../../../styles/ServicesWrapper.module.scss';
import { Paper } from "@material-ui/core";
import clsx from "clsx";

const ServicesWrapper = (
  {
    readOnly,
    allServices,
    selectedServices,
    isLoading,
    isButtonDisabled,
    buttonText,
    paperClasses,
    onItemSelected,
    onItemRemove,
    onFinalize
  }
) => {
  const servicesRef = useRef(null);

  /**
   * Get unique html key for a service item
   * @param {Object} service
   * @return {string}
   */
  const keyForService = (service) => {
    return `${service.id}-${service.toothId}-${service.name}-${service.destination}-${service.completed}-${service.completedAt}`;
  };

  return (
    <Paper className={styles.servicesWrapper} elevation={0}>
      {!readOnly && (
        <div className={styles.inputWrapper}>
          <Form.Group>
            <Typeahead
              ref={servicesRef}
              placeholder={textForKey('Enter service name')}
              id='services'
              options={allServices}
              filterBy={['name']}
              labelKey='name'
              selected={[]}
              onChange={onItemSelected}
              renderMenu={(results, menuProps) => {
                return (
                  <Menu {...menuProps}>
                    {results.map((result, index) => (
                      <MenuItem
                        key={`${result.id}-${result.destination}`}
                        option={result}
                        position={index}
                      >
                        {getServiceName(result)}
                      </MenuItem>
                    ))}
                  </Menu>
                );
              }}
            />
          </Form.Group>
        </div>
      )}

      <div className={clsx(styles.selectedServicesWrapper, paperClasses)}>
        <table style={{ width: '100%' }}>
          <tbody>
          {selectedServices.map((service, index) => (
            <FinalServiceItem
              canRemove={service.canRemove}
              onRemove={onItemRemove}
              key={`${keyForService(service)}#${index}`}
              service={service}
            />
          ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className={styles.selectedServicesFooter}>
          <LoadingButton
            isLoading={isLoading}
            onClick={onFinalize}
            disabled={isButtonDisabled}
            className='positive-button'
          >
            {buttonText}
          </LoadingButton>
        </div>
      )}
    </Paper>
  )
}

export default ServicesWrapper;

ServicesWrapper.propTypes = {
  readOnly: PropTypes.bool,
  allServices: PropTypes.arrayOf(PropTypes.object),
  selectedServices: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  isButtonDisabled: PropTypes.bool,
  buttonText: PropTypes.string,
  onItemSelected: PropTypes.func,
  onItemRemove: PropTypes.func,
  onFinalize: PropTypes.func,
  paperClasses: PropTypes.any,
}
