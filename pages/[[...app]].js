import React from "react";
import NextApp from "./_app";

function AppEntry() {
  if (typeof window === 'undefined') {
    return null
  }

  return <NextApp />;
}

export default AppEntry
