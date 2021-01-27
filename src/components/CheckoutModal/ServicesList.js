import React, { useState } from 'react';

import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import PropTypes from 'prop-types';

import { textForKey } from '../../utils/localization';
import ServiceRow from './ServiceRow';

const filterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: option => option.name,
  ignoreCase: true,
});

const ServicesList = ({
  isDebt,
  canAddService,
  services,
  availableServices,
  onServiceChanged,
  onServiceSelected,
  onServiceDeleted,
}) => {
  const [autocompleteClearKey, setAutocompleteClearKey] = useState(false);
  const autocompleteInput = params => {
    return (
      <TextField {...params} placeholder={textForKey('Select services')} />
    );
  };

  const autocompleteOption = option => {
    return (
      <Typography
        id={option.id}
        classes={{ root: 'autocomplete-root-option-label' }}
      >
        {option.name}
      </Typography>
    );
  };

  const handleServiceSelected = (event, service) => {
    setAutocompleteClearKey(!autocompleteClearKey);
    onServiceSelected(service);
  };

  const getOptionLabel = option => option.name;

  return (
    <Box className='services-container'>
      <Typography classes={{ root: 'services-container__title' }}>
        {textForKey('Services')}
      </Typography>
      <TableContainer classes={{ root: 'services-table-container' }}>
        <Table classes={{ root: 'services-table' }}>
          <TableBody classes={{ root: 'services-table__body' }}>
            {services.map((service, index) => (
              <ServiceRow
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
      {canAddService && (
        <Autocomplete
          key={autocompleteClearKey}
          classes={{
            root: 'autocomplete-root',
            inputRoot: 'autocomplete-root__input-root',
          }}
          value={null}
          onChange={handleServiceSelected}
          getOptionLabel={getOptionLabel}
          filterOptions={filterOptions}
          renderInput={autocompleteInput}
          options={availableServices}
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
