import React from "react";
import { wrapper } from "../store";
import NextApp from "./_app";

function AppEntry() {
  if (typeof window === 'undefined') {
    return null
  }

  return <NextApp />;
}

export default AppEntry
