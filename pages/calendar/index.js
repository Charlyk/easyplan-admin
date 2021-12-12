import React from 'react';

const Calendar = () => {
  return (
    <div>
      <div />
    </div>
  );
};

export default Calendar;

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/calendar/day',
      permanent: true,
    },
  };
};
