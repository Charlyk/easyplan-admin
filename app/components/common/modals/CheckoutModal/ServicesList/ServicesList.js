import React, { useMemo, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import PropTypes from 'prop-types';

import { textForKey } from '../../../../../../utils/localization';
import ServiceRow from '../ServiceRow';
import styles from './ServicesList.module.scss'

const getOptionLabel = option => {
  let name = option.name;
  if (option.destination != null) {
    name = `${name} (${textForKey(option.destination)})`;
  }
  return name;
};

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: getOptionLabel,
  ignoreCase: true,
});

const ServicesList = (
  {
    isDebt,
    currencies,
    canAddService,
    services,
    availableServices,
    onServiceChanged,
    onServiceSelected,
    onServiceDeleted,
  }
) => {
  const [autocompleteClearKey, setAutocompleteClearKey] = useState(false);
  const autocompleteInput = params => {
    return (
      <TextField {...params} placeholder={textForKey('Select services')}/>
    );
  };

  const autocompleteOption = option => {
    return (
      <Typography
        id={option.id}
        classes={{ root: 'autocomplete-root-option-label' }}
      >
        {getOptionLabel(option)}
      </Typography>
    );
  };

  const handleServiceSelected = (event, service) => {
    setAutocompleteClearKey(!autocompleteClearKey);
    onServiceSelected(service);
  };

  const sortedServices = useMemo(() => {
    const updatedServices = [];
    for (const service of availableServices) {
      if (service.serviceType === 'Braces') {
        updatedServices.push({
          ...service,
          destination: 'Mandible',
        });
        updatedServices.push({
          ...service,
          destination: 'Maxillary',
        });
      } else {
        updatedServices.push(service);
      }
    }
    return sortBy(updatedServices, item => item.name.toLowerCase())
  }, [availableServices])

  return (
    <Box className={styles['services-list']}>
      <Typography classes={{ root: styles.title }}>
        {textForKey('Services')}
      </Typography>
      <TableContainer classes={{ root: styles['services-table-container'] }}>
        <Table classes={{ root: styles['services-table'] }}>
          <TableBody classes={{ root: styles.body }}>
            {services.map((service, index) => (
              <ServiceRow
                currencies={currencies}
                key={`${service.id}-${index}`}
                canEdit={!isDebt}
                service={service}
                onChange={onServiceChanged}
                canDelete={canAddService}
                onDelete={onServiceDeleted}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {services.length === 0 && (
        <div className={styles.noDataWrapper}>
          <Typography className={styles.noDataLabel}>
            {textForKey('checkout_no_services')}
          </Typography>
          <Typography className={styles.noDataLabel}>
            {textForKey('checkout_select_below')}
          </Typography>
        </div>
      )}
      {canAddService && (
        <Autocomplete
          key={autocompleteClearKey}
          classes={{
            root: styles['autocomplete-root'],
            inputRoot: styles['input-root'],
          }}
          value={null}
          onChange={handleServiceSelected}
          getOptionLabel={getOptionLabel}
          filterOptions={filterOptions}
          renderInput={autocompleteInput}
          options={sortedServices}
          renderOption={autocompleteOption}
        />
      )}
    </Box>
  );
};

export default ServicesList;

ServicesList.propTypes = {
  canAddService: PropTypes.bool,
  isDebt: PropTypes.bool,
  services: PropTypes.arrayOf(PropTypes.object),
  onServiceChanged: PropTypes.func,
  availableServices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  onServiceSelected: PropTypes.func,
  onServiceDeleted: PropTypes.func,
};

ServicesList.defaultProps = {
  availableServices: [],
  onServiceSelected: () => null,
  onServiceDeleted: () => null,
};