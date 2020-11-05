import React from 'react';

function IconLogoPlaceholder() {
  return (
    <svg viewBox='0 0 200 200'>
      <g
        id='iPhone_6_7_8_1'
        data-name='iPhone 6/7/8 – 1'
        style={{ clipPath: 'url(#clip-iPhone_6_7_8_1)' }}
      >
        <circle
          style={{ fill: '#969696' }}
          id='Ellipse_1'
          data-name='Ellipse 1'
          cx='100'
          cy='100'
          r='100'
        />
        <text
          style={{
            fontSize: 50,
            fill: '#fff',
            fontFamily: 'Inter, sans-serif',
          }}
          id='LOGO'
          transform='translate(30 123)'
        >
          <tspan x='0' y='0'>
            LOGO
          </tspan>
        </text>
      </g>
    </svg>
  );
}

export default React.memo(IconLogoPlaceholder);
