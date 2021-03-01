import React from "react";
import { wrapper } from "../store";
import Main from "../src/pages/Main";
import Calendar from '../src/pages/Calendar';

const MainPage = () => {

  return (
    <Main>
      <Calendar />
    </Main>
  )
}

export default wrapper.withRedux(MainPage);
