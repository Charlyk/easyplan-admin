import React from 'react';

import { Grid } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { setImageModal } from '../../../../redux/actions/imageModalActions';
import { urlToLambda } from '../../../../utils/helperFuncs';

const XRayPhase = ({ title, images, isExpanded }) => {
  const dispatch = useDispatch();

  const handleImageClick = image => {
    dispatch(setImageModal({ open: true, imageUrl: image.imageUrl }));
  };

  return (
    <div className={clsx('phase', isExpanded && 'expanded')}>
      <div className='phase-header'>{title}</div>
      <div className='phase-images'>
        <Grid container>
          {images.map(image => (
            <Grid
              key={image.id}
              item
              xs={4}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '.2rem',
              }}
            >
              <div
                style={{ outline: 'none' }}
                role='button'
                tabIndex={0}
                onClick={() => handleImageClick(image)}
              >
                <img
                  key={image.id}
                  src={urlToLambda(image.imageUrl, 150)}
                  alt='X-Ray'
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default XRayPhase;

XRayPhase.propTypes = {
  title: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      imageUrl: PropTypes.string,
      imageType: PropTypes.string,
      created: PropTypes.string,
      createdBy: PropTypes.string,
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
