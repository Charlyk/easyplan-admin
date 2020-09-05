import React from 'react';

function MenuEllipse() {
  return (
    <svg
      width='44'
      height='44'
      viewBox='0 0 44 44'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_d)'>
        <circle cx='22' cy='22' r='14' />
      </g>
      <defs>
        <filter
          id='filter0_d'
          x='0'
          y='0'
          width='44'
          height='44'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='10' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0.913725 0 0 0 0 0.894118 0 0 0 0.4 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  );
}

export default React.memo(MenuEllipse);
