import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Calendar(){
  const router = useRouter();

  useEffect(() => {
    router.replace('/calendar/day');
  }, [])

  return (
    <div />
  );
}
