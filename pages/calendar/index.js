import React from "react";

export default function Calendar(){
  return (
    <div />
  );
}

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/calendar/day',
      permanent: true,
    },
  };
};
