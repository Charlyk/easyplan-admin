import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import './styles.scss';

const EasyTab = ({ title, selected, highlighted, onClick }) => {
  const tabClass = clsx(
    'easy-tab',
    selected ? 'selected' : 'default',
    highlighted && 'highlighted',
  );
  return (
    <div role='button' tabIndex={0} onClick={onClick} className={tabClass}>
      {title}
      <div className='tab-indicator' />
    </div>
  );
};

export default EasyTab;

EasyTab.propTypes = {
  title: PropTypes.string,
  selected: PropTypes.bool,
  highlighted: PropTypes.bool,
  onClick: PropTypes.func,
};

EasyTab.defaultProps = {
  onClick: () => null,
};
