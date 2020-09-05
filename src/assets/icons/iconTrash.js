import React from 'react';

function IconTrash() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11.3332 5.33398C11.7014 5.33398 11.9998 5.63246 11.9998 6.00065V12.6673C11.9998 13.7719 11.1044 14.6673 9.99984 14.6673H5.99984C4.89527 14.6673 3.99984 13.7719 3.99984 12.6673V6.00065C3.99984 5.63246 4.29831 5.33398 4.6665 5.33398H11.3332ZM10.6665 6.66732H5.33317V12.6673C5.33317 13.0355 5.63165 13.334 5.99984 13.334H9.99984C10.368 13.334 10.6665 13.0355 10.6665 12.6673V6.66732ZM5.99984 2.00065C5.99984 1.63246 6.29831 1.33398 6.6665 1.33398H9.33317C9.70136 1.33398 9.99984 1.63246 9.99984 2.00065V2.66732H12.6665C13.0347 2.66732 13.3332 2.96579 13.3332 3.33398C13.3332 3.70217 13.0347 4.00065 12.6665 4.00065H3.33317C2.96498 4.00065 2.6665 3.70217 2.6665 3.33398C2.6665 2.96579 2.96498 2.66732 3.33317 2.66732H5.99984V2.00065Z'
      />
    </svg>
  );
}

export default React.memo(IconTrash);
