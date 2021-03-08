import React from "react";
import { wrapper } from "../store";
import MainComponent from "../components/common/MainComponent";

const MainPage = () => {

  return (
    <MainComponent>

    </MainComponent>
  )
}

export default wrapper.withRedux(MainPage);
