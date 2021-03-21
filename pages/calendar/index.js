import React, { useEffect } from "react";
import { useRouter } from "next/router";

const CalendarRoot = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/calendar/day');
  }, [])

  return (
    <div />
  );
}

export default CalendarRoot;
