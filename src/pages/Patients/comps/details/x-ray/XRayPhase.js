import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconNext from '../../../../../assets/icons/iconNext';

const XRayPhase = ({ title, images, isExpanded, phaseId, onExpand }) => {
  const imagesContainerHeight = Math.ceil(images.length / 3) * 8.2;
  return (
    <div
      className={clsx('patients-root__x-ray__phase', isExpanded && 'expanded')}
    >
      <div className='phase-header'>
        {title}
        <div
          role='button'
          tabIndex={0}
          className='expand-button'
          onClick={() => onExpand(phaseId)}
        >
          <IconNext />
        </div>
      </div>
      <div
        className='phase-images'
        style={{ height: isExpanded ? `${imagesContainerHeight}rem` : 0 }}
      >
        {images.map((item, index) => (
          <img key={`${index}`} />
        ))}
      </div>
    </div>
  );
};

export default XRayPhase;

XRayPhase.propTypes = {
  title: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  isExpanded: PropTypes.bool,
  phaseId: PropTypes.oneOf(['initial', 'middle', 'final']),
  onExpand: PropTypes.func,
};

XRayPhase.defaultProps = {
  onExpand: () => null,
};
