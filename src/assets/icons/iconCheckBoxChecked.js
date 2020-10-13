import React from 'react';

function IconCheckBoxChecked() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='16' height='16' rx='4' fill='#74A8E5' />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.00025 12.0006C6.73625 12.0006 6.48125 11.8966 6.29325 11.7076L4.29325 9.70757C3.90225 9.31657 3.90225 8.68457 4.29325 8.29357C4.68425 7.90257 5.31625 7.90257 5.70725 8.29357L6.84525 9.43157L10.1683 4.44557C10.4742 3.98557 11.0943 3.86157 11.5553 4.16857C12.0142 4.47557 12.1383 5.09557 11.8323 5.55557L7.83225 11.5556C7.66625 11.8046 7.39625 11.9666 7.09925 11.9956C7.06525 11.9986 7.03325 12.0006 7.00025 12.0006Z'
        fill='white'
      />
    </svg>
  );
}

export default React.memo(IconCheckBoxChecked);
