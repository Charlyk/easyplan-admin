import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconNext from '../../../../../assets/icons/iconNext';
import { urlToLambda } from '../../../../../utils/helperFuncs';

const XRayPhase = ({ title, images, isExpanded, phaseId, onExpand }) => {
  const imagesContainerHeight = Math.ceil(images.length / 3) * 9;
  return (
    <div className={clsx('phase', isExpanded && 'expanded')}>
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
        {images.map(item => (
          <img
            key={item.id}
            src={urlToLambda(item.imageUrl, 150)}
            alt='X-Ray'
          />
        ))}
      </div>
    </div>
  );
};

export default XRayPhase;

XRayPhase.propTypes = {
  title: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      imageUrl: PropTypes.string,
      type: PropTypes.string,
      created: PropTypes.string,
      createdById: PropTypes.string,
      createdByName: PropTypes.string,
    }),
  ),
  isExpanded: PropTypes.bool,
  phaseId: PropTypes.oneOf(['Initial', 'Middle', 'Final']),
  onExpand: PropTypes.func,
};

XRayPhase.defaultProps = {
  onExpand: () => null,
  images: [],
};
